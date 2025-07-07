<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 mb-8">{{ category }} Articles</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="article in articles" :key="article._path" class="bg-white rounded-lg shadow-md overflow-hidden">
        <NuxtLink :to="article._path">
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-2 bg-gray-400">{{ article.title }}</h2>
            <p class="text-gray-600 mb-4">{{ article.description }}</p>
            <div class="flex items-center text-sm text-gray-500">
              <span>{{ new Date(article.date).toLocaleDateString() }}</span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const category = route.params.category

// Get articles by category
const { data: articles } = await useAsyncData(`articles-${category}`, () => queryContent('/articles')
  .where({ category })
  .sort({ date: -1 })
  .find()
)
</script> 