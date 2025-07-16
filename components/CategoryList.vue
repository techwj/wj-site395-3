<template>
  <div>
    <div v-if="categories && categories.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <template v-for="(category,idx) in categories" :key="category.slug">
      <NuxtLink
        :to="`/categories/${category.slug}`"
        class="flex flex-col items-center bg-white rounded-2xl shadow-md px-6 py-6 gap-6 hover:bg-[#f6f8f6] transition min-h-[120px]"
      >
      <div class="flex flex-col">
        <img
          :alt="category.title"
          :src="imagePaths[category.slug] || '/images/common/default.webp'"
          @error="handleImageError"
          class="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl border border-gray-200 bg-white"
          loading="lazy"
        />
        <div class="flex-1 min-w-0">
          <div class="flex items-center mb-1">
            <h2 class="text-lg font-bold" :style="{color: '#2563eb'}">{{ category.title }}</h2>
            <span v-if="category.articleCount" class="ml-2 text-xs px-2 py-0.5 rounded-full bg-[#eaf3ea] text-[#639154]">{{ category.articleCount }} articles</span>
          </div>
          <p class="text-gray-700 text-sm leading-relaxed line-clamp-3">{{ category.description }}</p>
        </div>
      </div>
      </NuxtLink>
      <div v-if="idx===0" class="w-full h-[280px] bg-gray-100 mb-4">
        <!-- google ads mobile-->
        <div class="w-full h-[280px] bg-gray-100 block md:hidden">
          <AdUnit
            type="gpt"
            gptAdId="HK_CN_game92_vip_banner_1"
            gptSlot="/29746187,23103910451/HK_CN_game92.vip_banner_1"
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
            gptAdId="HK_CN_game92_vip_banner_7"
            gptSlot="/29746187,23103910451/HK_CN_game92.vip_banner_7"
            :gptSlotSizes="[[728, 90]]"
            :gptSizeMappings="[
              { viewport: [728, 300], sizes: [728, 90] },
              { viewport: [0, 0], sizes: [] }
            ]"
            gptStyle="text-align:center;"
          />
        </div>
      </div>

      </template>

    </div>
    <div v-else class="text-center text-gray-600">
      No category data available
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  }
});

// img path
const getCategoryImage = (slug) => {
  const imagePath = `/images/categories/${slug}.webp`;
  // check the image is exists
  return fetch(imagePath, { method: 'HEAD' })
    .then(response => {
      if (response.ok) {
        return imagePath;
      }
      return '/images/common/default.webp';
    })
    .catch(() => '/images/common/default.webp');
};

// handle image error
const handleImageError = (event) => {
  if (event.target.src !== '/images/common/default.webp') {
    event.target.src = '/images/common/default.webp';
  }
};

// image paths
const imagePaths = ref({});

// preload images
onMounted(async () => {
  if (props.categories) {
    for (const category of props.categories) {
      imagePaths.value[category.slug] = await getCategoryImage(category.slug);
    }
  }
});
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 