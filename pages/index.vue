<template>
  <div class="w-full h-full mt-4">
    <!-- google ads mobile-->
    <div class="w-full h-[50px] bg-gray-100 block md:hidden">
      <AdUnit
        type="gpt"
        gptAdId="HK_CN_mobile_game92_vip_banner_1"
        gptSlot="/29746187,23103910451/HK_CN_mobile.game92.vip_banner_1"
        :gptSlotSizes="[[300,50]]"
        :gptSizeMappings="[
          { viewport: [728, 300], sizes: [] },
          { viewport: [0, 0], sizes: [[300,50]] }
        ]"
        gptStyle="text-align:center;"
      />
    </div>

    <!-- google ads pc-->
    <div class="w-full h-[100px] bg-gray-100 hidden md:block">
      <AdUnit
        type="gpt"
        gptAdId="HK_CN_mobile_game92_vip_banner_7"
        gptSlot="/29746187,23103910451/HK_CN_mobile.game92.vip_banner_7"
        :gptSlotSizes="[[728, 90]]"
        :gptSizeMappings="[
          { viewport: [728, 300], sizes: [728, 90] },
          { viewport: [0, 0], sizes: [] }
        ]"
        gptStyle="text-align:center;"
      />
    </div>

    <AdUnit
      type="anchor"
      anchorPosition="bottom"
      gptAdId="HK_CN_mobile_game92_vip_anchor_2"
      gptSlot="/29746187,23103910451/HK_CN_mobile.game92.vip_anchor_2"
      :gptSlotSizes="[[300,100],[300,50],[320,100],[320,50]]"
      :gptSizeMappings="[
        { viewport: [728, 300], sizes: [] },
        { viewport: [0, 0], sizes: [[300,100],[300,50],[320,100],[320,50]] }
      ]"
    />
  </div>

    <!-- Banner -->
    <div class="relative w-full h-[140px] overflow-hidden mb-8" @click="router.push('/categories/all')">
      <img
        src="/images/common/default.webp"
        alt="Banner"
        class="absolute inset-0 w-full  object-cover"
        @error="onBannerImgError"
      />
      <div class="absolute inset-0 bg-blue-900/30"></div>
      <div class="absolute inset-0 flex items-center justify-center">
        <h1 class="text-4xl md:text-5xl text-white font-bold text-center px-4" style="text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
          {{ config.head?.title || 'Welcome to Our Blog' }}
        </h1>
      </div>
    </div>

   <!-- google ads mobile-->
    <div class="w-full h-[250px] bg-gray-100 block md:hidden">
      <AdUnit
        type="gpt"
        gptAdId="HK_CN_mobile_game92_vip_banner_2"
        gptSlot="/29746187,23103910451/HK_CN_mobile.game92.vip_banner_2"
        :gptSlotSizes="[[300,250]]"
        :gptSizeMappings="[
          { viewport: [728, 300], sizes: [] },
          { viewport: [0, 0], sizes: [[300,250]] }
        ]"
        gptStyle="text-align:center;"
      />
    </div>

    <!-- google ads pc-->
    <div class="w-full h-[100px] bg-gray-100 hidden md:block">
      <AdUnit
        type="gpt"
        gptAdId="HK_CN_mobile_game92_vip_banner_8"
        gptSlot="/29746187,23103910451/HK_CN_mobile.game92.vip_banner_8"
        :gptSlotSizes="[[970, 90]]"
        :gptSizeMappings="[
          { viewport: [728, 300], sizes: [970, 90] },
          { viewport: [0, 0], sizes: [] }
        ]"
        gptStyle="text-align:center;"
      />
    </div>

    <!-- google ads interstitial -->
    <AdUnit
      type="gpt"
      :isInterstitial="true"
      :gptAdId="interstitialAdId"
      :gptSlot="interstitialSlot"
    />


    <!-- Categories -->
    <section class="mb-12">
      <h2 class="text-2xl font-bold mb-6" style="color:#2563eb;">Categories</h2>
      <div class="flex flex-wrap -mx-3">
        <div v-for="(category, idx) in categories.slice(0, 4)" :key="category.slug" 
             class="w-full sm:w-1/2 lg:w-1/4 px-3 mb-6">
          <NuxtLink 
            :to="`/categories/${category.slug}`"
            class="block h-full"
          >
            <div class="bg-white rounded-xl shadow-sm h-full hover:shadow-md transition-shadow duration-300">
              <img
                :src="`/images/categories/${category.slug}.webp`"
                :alt="category.title"
                class="w-full h-48 object-cover rounded-t-xl"
                @error="handleImageError"
              />
              <div class="p-4">
                <h3 class="font-bold text-lg mb-2" style="color:#2563eb;">{{ category.title }}</h3>
                <p class="text-gray-600 text-sm line-clamp-2">{{ category.description }}</p>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Latest Articles -->
    <section class="mb-8">
      <h2 class="text-2xl font-bold mb-6" style="color:#2563eb;">Latest Articles</h2>
      <div v-if="latestArticles.length > 0" class="flex flex-col gap-6">
        <NuxtLink
          v-for="article in latestArticles.slice(0, 5)"
          :key="article._path"
          :to="article._path"
          class="flex items-center gap-4 bg-white rounded-xl shadow-sm px-4 py-4 hover:shadow-md transition-shadow duration-300"
        >
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-2">
              <span class="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                {{ article.category }}
              </span>
            </div>
            <div class="font-bold text-lg leading-snug mb-2 line-clamp-2" style="color:#2563eb;">
              {{ article.title }}
            </div>
            <div class="text-gray-600 text-sm leading-relaxed line-clamp-2">
              {{ getSeoDescription(article) }}
            </div>
          </div>
          <img
            :src="article.image || '/images/articles/article_default.webp'"
            :alt="article.title"
            class="w-20 h-20 object-cover rounded-lg flex-shrink-0 border border-gray-100"
            @error="$event.target && ($event.target.src = '/images/articles/article_default.webp')"
          />
        </NuxtLink>
      </div>
      <div v-else class="text-center py-8 bg-blue-50 rounded-lg">
        <p class="text-blue-400">No articles yet.</p>
      </div>
    </section>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import {useRouter} from 'vue-router';

const router = useRouter();

// category list
const { data: categoriesData } = await useFetch("/api/categories");
const categories = computed(() => categoriesData.value || []);

// latest articles
const latestArticles = ref([])
const fetchLatestArticles = async () => {
  try {
    const { data } = await useFetch("/api/latest-articles")
    if (data.value && Array.isArray(data.value)) {
      latestArticles.value = data.value
    } else {
      latestArticles.value = []
    }
  } catch (error) {
    console.error("Error fetching latest articles:", error)
    latestArticles.value = []
  }
}
fetchLatestArticles()

// handle image error
const handleImageError = (event) => {
  if (event.target && event.target.src !== '/images/categories/default.webp') {
    event.target.src = '/images/categories/default.webp';
  }
};

// Banner image error handling
function onBannerImgError(e) {
  if (e.target && e.target.src !== '/images/common/default.webp') {
    e.target.src = '/images/common/default.webp';
  }
}

const config = useAppConfig()
let title = config.head?.title || ''

useHead({
  title,
  meta: [
    { 
      name: 'description', 
      content: config.head?.meta?.find(m => m.name === 'description')?.content || ''
    },
    { 
      name: 'keywords', 
      content: config.head?.meta?.find(m => m.name === 'keywords')?.content || ''
    }
  ]
});

// SEO friendly description
function getSeoDescription(article) {
  if (article.description) return article.description
  return `Read expert tips about ${article.title} in the ${article.category} category.`
}

// is mobile
const isMobile = ref(false)
onMounted(() => {
  isMobile.value = window.innerWidth < 768
})
// interstitial ad parameters
const interstitialAdId = computed(() => isMobile.value ? 'HK_CN_mobile_game92_vip_interstitial_1' : 'HK_CN_mobile_game92_vip_interstitial_2')
const interstitialSlot = computed(() => isMobile.value ? '/29746187,23103910451/HK_CN_mobile.game92.vip_interstitial_1' : '/29746187,23103910451/HK_CN_mobile.game92.vip_interstitial_2')
</script>

<style scoped>
body {
  background: #f8fafc;
  color: #1e293b;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Smooth transitions */
.transition-shadow {
  transition-property: box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Ensure images maintain aspect ratio */
img {
  max-width: 100%;
  height: auto;
}

/* category list horizontal scroll optimization */
nav ul {
  scrollbar-width: thin;
  scrollbar-color: #2563eb #e0e7ff;
}
nav ul::-webkit-scrollbar {
  height: 6px;
}
nav ul::-webkit-scrollbar-thumb {
  background: #2563eb;
  border-radius: 3px;
}
nav ul::-webkit-scrollbar-track {
  background: #e0e7ff;
}
</style>
