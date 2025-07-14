import { ref } from 'vue'

const isScriptLoaded = ref(false)
const isScriptLoading = ref(false)
const initializedSlots = new Set()
const isServiceEnabled = ref(false)

// AdSense script loaded flag
const isAdsenseScriptLoaded = ref(false)
const isAdsenseScriptLoading = ref(false)

export const useAds = () => {
  // load GPT script
  const loadGPTScript = () => {
    if (isScriptLoaded.value || isScriptLoading.value) return
    isScriptLoading.value = true
    return new Promise((resolve) => {
      const existingScript = document.querySelector('script[src*="gpt.js"]')
      if (existingScript) {
        // Script tag exists, but we need to ensure proper initialization
        console.log('gpt script exists, checking initialization status');
        
        const initializeGoogleTag = () => {
          window.googletag = window.googletag || {cmd: []}
          window.gptAdSlots = window.gptAdSlots || []
          
          window.googletag.cmd.push(() => {
            // Configure privacy settings
            window.googletag.pubads().setPrivacySettings({
              restrictDataProcessing: true,
              childDirectedTreatment: false,
              underAgeOfConsent: false,
              nonPersonalizedAds: true
            })
            // Set page URL and background color
            window.googletag.pubads().set('page_url', window.location.href)
            window.googletag.pubads().set('adsense_background_color', 'ffffff')
            // Enable services (only once)
            if (!isServiceEnabled.value) {
              window.googletag.pubads().enableSingleRequest()
              window.googletag.enableServices()
              isServiceEnabled.value = true
            }
            
            isScriptLoaded.value = true
            isScriptLoading.value = false
            console.log('gpt script configured and services enabled');
            resolve()
          })
        }
        
        if (window.googletag && window.googletag.cmd) {
          // Script loaded, initialize immediately
          initializeGoogleTag()
        } else {
          // Script still loading, wait for it
          existingScript.onload = initializeGoogleTag
          // Also try with a small delay in case onload already fired
          setTimeout(() => {
            if (window.googletag && window.googletag.cmd && !isScriptLoaded.value) {
              initializeGoogleTag()
            }
          }, 100)
        }
        return
      }
      const script = document.createElement('script')
      script.src = 'https://securepubads.g.doubleclick.net/tag/js/gpt.js'
      script.async = true
      script.onload = () => {
        isScriptLoaded.value = true
        isScriptLoading.value = false
        // ensure googletag is initialized after script loaded
        window.googletag = window.googletag || {cmd: []}
        window.gptAdSlots = []
        // configure googletag
        window.googletag.cmd.push(() => {
          // use new privacy settings API
          window.googletag.pubads().setPrivacySettings({
            restrictDataProcessing: true,
            childDirectedTreatment: false,
            underAgeOfConsent: false,
            nonPersonalizedAds: true
          })
          // set page URL and background color
          window.googletag.pubads().set('page_url', window.location.href)
          window.googletag.pubads().set('adsense_background_color', 'ffffff')
          // enable service (only once)
          if (!isServiceEnabled.value) {
            window.googletag.pubads().enableSingleRequest()
            window.googletag.enableServices()
            isServiceEnabled.value = true
          }
        })
        resolve()
        console.log('gpt script loaded');
      }
      document.head.appendChild(script)
      console.log('gpt script appended');
    })
  }

  // destroy ad
  const destroyGPTAd = (adId) => {
    if (!window.googletag) return
    return new Promise((resolve) => {
      window.googletag.cmd.push(() => {
        try {
          // find and destroy ad slot
          const slot = window.gptAdSlots.find(s => s.getSlotElementId() === adId)
          if (slot) {
            // remove ad content first
            const adElement = document.getElementById(adId)
            if (adElement) {
              adElement.innerHTML = ''
            }
            // destroy ad slot
            window.googletag.destroySlots([slot])
            // remove from array
            window.gptAdSlots = window.gptAdSlots.filter(s => s !== slot)
            // remove from initialized set
            initializedSlots.delete(adId)
            // refresh ad service
            window.googletag.pubads().refresh()
          }
        } catch (error) {
          console.error('Error destroying ad:', error)
        } finally {
          resolve()
        }
      })
    })
  }

    // 插屏广告初始化
  const initGPTInterstitialAd = (adId, adSlot) => {
    return new Promise((resolve) => {
      if (!window.googletag) {
        window.googletag = {cmd: []}
      }
      if (!window.gptAdSlots) {
        window.gptAdSlots = []
      }
      window.googletag.cmd.push(() => {
        try {
          const slot = window.googletag.defineOutOfPageSlot(adSlot, window.googletag.enums.OutOfPageFormat.INTERSTITIAL)
            .addService(window.googletag.pubads());
          window.gptAdSlots.push(slot);
          window.googletag.display(slot);
        } catch (error) {
          console.error('Error initializing interstitial ad:', error);
        } finally {
          resolve();
        }
      });
    });
  };

  // init ad
  const initGPTAd = (adId, adSlot, slotSizes = [[300, 150]], sizeMappings = [
    { viewport: [728, 300], sizes: [] },
    { viewport: [0, 0], sizes: [[300, 150]] }
  ]) => {
    return new Promise((resolve) => {
      if (!window.googletag) {
        window.googletag = {cmd: []}
      }
      if (!window.gptAdSlots) {
        window.gptAdSlots = []
      }
      // if ad slot is initialized, destroy it first
      const doInit = () => {
        // ensure DOM element exists
        const adElement = document.getElementById(adId)
        if (!adElement) {
          console.error(`Ad element ${adId} not found`)
          resolve()
          return
        }
        window.googletag.cmd.push(() => {
          try {
            let mappingBuilder = window.googletag.sizeMapping();
            sizeMappings.forEach(m => {
              mappingBuilder = mappingBuilder.addSize(m.viewport, m.sizes);
            });
            const mapping = mappingBuilder.build();
            const slot = window.googletag.defineSlot(adSlot, slotSizes, adId)
              .setCollapseEmptyDiv(true)
              .defineSizeMapping(mapping)
              .addService(window.googletag.pubads());
            slot.setTargeting('page_type', 'article');
            slot.setTargeting('pos', 'top');
            window.gptAdSlots.push(slot);
            window.googletag.display(adId);
            initializedSlots.add(adId);
            resolve();
            console.log('gpt ad initialized');
            
          } catch (error) {
            console.error('Error initializing ad:', error);
            resolve();
          }
        });
      };
      if (initializedSlots.has(adId)) {
        destroyGPTAd(adId).then(doInit);
      } else {
        doInit();
      }
    });
  }

  // AdSense script loader
  const loadAdScript = (client = '') => {
    if (isAdsenseScriptLoaded.value || isAdsenseScriptLoading.value) return
    isAdsenseScriptLoading.value = true
    return new Promise((resolve) => {
      if (document.querySelector('script[src*="adsbygoogle.js"]')) {
        isAdsenseScriptLoaded.value = true
        isAdsenseScriptLoading.value = false
        resolve()
        return
      }
      const script = document.createElement('script')
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`
      script.async = true
      script.crossOrigin = 'anonymous'
      script.onload = () => {
        isAdsenseScriptLoaded.value = true
        isAdsenseScriptLoading.value = false
        resolve()
      }
      document.head.appendChild(script)
    })
  }

  // AdSense ad initializer
  const initAdScript = () => {
    if (!window.adsbygoogle || window.adsbygoogle.length === 0) {
      window.adsbygoogle = window.adsbygoogle || []
      window.adsbygoogle.push({})
    }
  }

  return {
    loadGPTScript,    // load GPT script
    initGPTAd,        // init GPT ad
    destroyGPTAd,     // destroy GPT ad
    loadAdScript,     // load AdSense script
    initAdScript,      // init AdSense ad
    initGPTInterstitialAd // init GPT interstitial ad
  }
} 