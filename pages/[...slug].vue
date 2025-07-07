<template>
  <div v-if="pending">Loading...</div>
  <div v-else-if="error">Page Not Found</div>
  <article v-else-if="page" class="prose prose-lg max-w-none">
    <h1>{{ page.title }}</h1>
    <div class="flex items-center text-gray-600 mb-8">
      <span>{{ new Date(page.date).toLocaleDateString() }}</span>
      <span class="mx-2">•</span>
      <NuxtLink :to="`/categories/${page.category}`" class="text-blue-600 hover:text-blue-800">
        {{ page.category }}
      </NuxtLink>
    </div>
    <!-- <ContentDoc v-slot="{ doc }">
      <ContentRenderer :value="doc" />
    </ContentDoc> -->
  </article>
</template>

<script setup>
const { path } = useRoute()
const { data: page, pending, error } = await useAsyncData(`content-${path}`, () => queryContent(path).findOne())
</script>

<style>
.prose {
  @apply text-gray-800;
}
.prose h1 {
  @apply text-4xl font-bold mb-8;
}
.prose h2 {
  @apply text-3xl font-bold mt-12 mb-6;
}
.prose h3 {
  @apply text-2xl font-bold mt-8 mb-4;
}
.prose p {
  @apply mb-6 leading-relaxed;
}
.prose img {
  @apply rounded-lg shadow-md my-8;
  width: 100%;
  height: auto;
  object-fit: cover;
}
.prose a {
  @apply text-blue-600 hover:text-blue-800;
}
.prose blockquote {
  @apply border-l-4 border-gray-300 pl-4 italic my-6;
}
.prose code {
  @apply bg-gray-100 rounded px-2 py-1;
}
.prose pre {
  @apply bg-gray-100 rounded-lg p-4 my-6 overflow-x-auto;
}
</style> 