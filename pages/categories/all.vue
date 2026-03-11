<template>
  <div style="background:#f8fafc; min-height:100vh;">
    <h1 @click="toFirstCategory" class="text-3xl font-extrabold mb-6 flex items-center" style="color:#2563eb; cursor:pointer;">
      <svg class="w-7 h-7 mr-2" fill="none" stroke="#2563eb" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
      All Categories
    </h1>
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