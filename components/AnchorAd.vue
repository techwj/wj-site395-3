<template>
  <div :class="anchorClass" :style="anchorStyle" ref="anchorRef">
    <a :id="btnId" class="anchor-btn" @click="toggleAnchor"><i :class="arrowClass"></i></a>
    <div class="anchor-ad" :style="adContainerStyle" ref="adContainerRef">
      <div :id="gptAdId" class="anchor-gpt-ad"></div>
    </div>
  </div>
</template>

<script setup>

// usage:
/**
<AdUnit
  type="anchor"
  anchorPosition="bottom"  <!-- 可选: 'bottom'（默认）或 'top' -->
  gptAdId="HK_CN_mobile_game92_vip_anchor_1"
  gptSlot="/29746187,23103910451/HK_CN_mobile.game92.vip_anchor_1"
  :gptSlotSizes="[[300,100],[300,50],[320,100],[320,50]]"  <!-- 可选，默认已覆盖主流移动尺寸 -->
  :gptSizeMappings="[
    { viewport: [728, 300], sizes: [] },
    { viewport: [0, 0], sizes: [[300,100],[300,50],[320,100],[320,50]] }
  ]"  <!-- 可选，默认已覆盖主流移动尺寸 -->
  anchorStyle="z-index:9999;"  <!-- 可选，锚定容器自定义样式 -->
  adContainerStyle="min-width:300px;"  <!-- 可选，广告内容区自定义样式 -->
/>
*/


import { ref, onMounted, onBeforeUnmount, computed, nextTick } from 'vue'
import { useAds } from '~/composables/useAds'

const props = defineProps({
  position: { type: String, default: 'bottom' }, // 'top' | 'bottom'
  gptAdId: { type: String, required: true },
  gptSlot: { type: String, required: true },
  gptSlotSizes: { type: Array, default: () => [[300, 100], [300, 50], [320, 100], [320, 50]] },
  gptSizeMappings: {
    type: Array,
    default: () => [
      { viewport: [728, 300], sizes: [] },
      { viewport: [0, 0], sizes: [[300, 100], [300, 50], [320, 100], [320, 50]] }
    ]
  },
  anchorStyle: { type: String, default: '' },
  adContainerStyle: { type: String, default: '' }
})

const anchorRef = ref(null)
const adContainerRef = ref(null)
const isCollapsed = ref(false)
const btnId = `AdAAnchorBtn_${props.gptAdId}`

const anchorClass = computed(() => {
  return [
    props.position === 'top' ? 'AdAAnchor_Top' : 'AdAAnchor_Bot',
    'anchor-root'
  ]
})

const arrowClass = computed(() => {
  if (props.position === 'top') {
    return isCollapsed.value ? 'AdA_topUp' : 'AdA_topDown'
  } else {
    return isCollapsed.value ? 'AdA_bottomUp' : 'AdA_bottomDown'
  }
})

function toggleAnchor() {
  isCollapsed.value = !isCollapsed.value
  if (adContainerRef.value) {
    adContainerRef.value.style.height = isCollapsed.value ? '0px' : 'auto'
  }
}

let destroyAnchorAd = null
const { initAnchorAd } = useAds()

onMounted(async () => {
  await nextTick()
  destroyAnchorAd = await initAnchorAd({
    position: props.position,
    adId: props.gptAdId,
    slot: props.gptSlot,
    sizeMappings: props.gptSizeMappings,
    slotSizes: props.gptSlotSizes,
    anchorRef,
    adContainerRef
  })
})

onBeforeUnmount(() => {
  if (typeof destroyAnchorAd === 'function') destroyAnchorAd()
})
</script>

<style scoped>
.anchor-root {
  width: 100%;
  position: fixed;
  left: 0;
  z-index: 999;
  padding: 2px 0;
}
.ADAAnchor_Bot {
  bottom: 0;
}
.ADAAnchor_Top {
  top: 0;
}
.anchor-btn {
  position: absolute;
  left: 0;
  z-index: 1000;
  background: #eee;
  border-radius: 3px 3px 0 0;
  font-size: 12px;
  padding: 1px 12px;
  cursor: pointer;
}
.ADAAnchor_Top .anchor-btn {
  bottom: -16px;
  border-radius: 0 0 3px 3px;
}
.ADAAnchor_Bot .anchor-btn {
  top: -16px;
  border-radius: 3px 3px 0 0;
}
.anchor-ad {
  width: max-content;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  transition: height 0.2s;
}
.anchor-gpt-ad {
  min-width: 300px;
  min-height: 50px;
}
/* 箭头样式 */
.ADA_bottomUp, .ADA_topDown {
  border: solid #666;
  border-width: 0 2.5px 2.5px 0;
  display: inline-block;
  padding: 4px;
  transform: rotate(-135deg);
  vertical-align: super;
}
.ADA_bottomDown, .ADA_topUp {
  border: solid #666;
  border-width: 0 2.5px 2.5px 0;
  display: inline-block;
  padding: 4px;
  transform: rotate(45deg);
  vertical-align: super;
}
</style> 