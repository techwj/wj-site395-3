<template>
  <div class="w-full h-full mt-4">
    <!-- google ads mobile-->
    <div class="w-full h-[50px] bg-gray-100 block md:hidden">
      <AdUnit
        type="gpt"
        gptAdId="HK_CN_mobile_game92_vip_banner_4"
        gptSlot="/29746187,23103910451/HK_CN_mobile.game92.vip_banner_4"
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
  </div>
  <div style="background:#f8fafc; min-height:100vh;">
    <h1 @click="toFirstCategory" class="text-3xl font-extrabold mb-6 flex items-center" style="color:#2563eb; cursor:pointer;">
      <svg class="w-7 h-7 mr-2" fill="none" stroke="#2563eb" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
      All Categories
    </h1>
    <!-- google ads mobile-->
    <div class="w-full h-[250px] bg-gray-100 block md:hidden my-12">
      <AdUnit
        type="gpt"
        gptAdId="HK_CN_mobile_game92_vip_banner_3"
        gptSlot="/29746187,23103910451/HK_CN_mobile.game92.vip_banner_3"
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
        gptAdId="HK_CN_mobile_game92_vip_banner_9"
        gptSlot="/29746187,23103910451/HK_CN_mobile.game92.vip_banner_9"
        :gptSlotSizes="[[970, 90]]"
        :gptSizeMappings="[
          { viewport: [728, 300], sizes: [970, 90] },
          { viewport: [0, 0], sizes: [] }
        ]"
        gptStyle="text-align:center;"
      />
    </div>
    <CategoryList :categories="categories" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();


const router = useRouter();

const toFirstCategory = () => {
  const firstCategory = categories.value[0]
  if (firstCategory) {
    router.push(`/categories/${firstCategory.slug}`)
  }
}

// Fetch all categories
const { data: categories } = await useFetch('/api/categories')


// Set page title
let config = useAppConfig();
let title = config?.title;
useHead({
  title: `All Categories about ${title}`,
  meta: [
    {
      name: 'description',
      content: "All Categories about " + title
    }
  ]
})
</script> 

<style scoped>
body {
  background: #f8fafc;
  color: #1e293b;
}

h1 {
  color: #2563eb;
}
</style>