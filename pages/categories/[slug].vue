<template>
  <div>
    <div>
      <h2 @click="toFirstArticle" class="text-2xl font-extrabold mb-6 flex items-center" style="color:#2563eb;">
        <svg class="w-6 h-6 mr-2" fill="none" stroke="#2563eb" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
        {{ category?.title || "Category" }} Articles
      </h2>
    </div>

    <div v-if="articles && articles.length > 0">
      <div class="flex flex-col gap-4">
        <template v-for="(article, index) in articles" :key="article._path">
          <NuxtLink :to="article._path" class="flex flex-col items-center bg-[#f6f8f6] hover:bg-[#eaf3ea] border border-[#e0e7e0] rounded-2xl shadow-sm px-4 py-4 transition group">
            <div class="flex flex-row">
            <div class="flex-1 min-w-0">
              <h2 class="text-xl font-bold mb-2" style="color:#2563eb">{{ article.title }}</h2>
              <p class="text-base mb-2">{{ article.description }}</p>
              <div class="flex items-center text-xs text-gray-400">
                <span>{{ new Date(article.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) }}</span>
              </div>
            </div>
            <div class="ml-4 flex-shrink-0 flex items-center justify-center">
              <img
                :key="article.slug || 'default'"
                :src="article.slug ? getArticleImageSrc(article.slug) : '/images/articles/article_default.webp'"
                :alt="article.title"
                class="w-24 h-24 object-cover rounded-2xl border border-gray-200 bg-white"
                @error="onArticleImgError"
              />
            </div>
            </div>
          </NuxtLink>
        </template>
      </div>

      <div @click="toAllCategories" class="mt-5 flex justify-center">
        <nav class="flex items-center space-x-2">
          <button
            v-for="page in totalPages"
            :key="page"
            @click="currentPage = page"
            :class="['px-4 py-2 rounded-md', currentPage === page ? 'bg-[#2563eb] text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border border-[#e0e7ff]']"
          >
            {{ page }}
          </button>
        </nav>
      </div>
    </div>
    <div @click="toAllCategories" v-else class="text-center text-gray-600 py-8">No articles in this category</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const router = useRouter();
const route = useRoute();
const slug = route.params.slug;

const toAllCategories = () => {
  router.push('/categories/all')
}

const toFirstArticle = () => {
  let firstArticle = articles.value[0];
  if (firstArticle) {
    router.push(firstArticle._path)
  }
}

// load adsbygoogle script
// const loadAdScript = () => {
//   // check if adsbygoogle script is loaded
//   if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
//     const script = document.createElement('script');
//     script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9575912975746525';
//     script.async = true;
//     script.crossOrigin = 'anonymous';
//     document.head.appendChild(script);
//   }
// };

// init adsbygoogle
// const initAd = () => {
//   // check if adsbygoogle is initialized
//   if (!window.adsbygoogle || window.adsbygoogle.length === 0) {
//     window.adsbygoogle = window.adsbygoogle || [];
//     window.adsbygoogle.push({});
//   }
// };

// onMounted(() => {
//   loadAdScript();
//   initAd();
// })

// Pagination
const currentPage = ref(1);
const pageSize = 10;

// Fetch category info
const { data: categoryData } = await useFetch(`/api/categories/${slug}`);
const category = computed(() => categoryData.value);

// category image path and fallback
const categoryImageSrc = computed(() => `/images/categories/${category.value?.slug}.webp`);
function onImgError(e) {
  if (e.target.src !== "/images/common/default.webp") {
    e.target.src = "/images/common/default.webp";
  }
}

// Fetch articles in this category
const { data: articlesData } = await useFetch(`/api/articles?categorySlug=${slug}`);

// Calculate pagination
const totalPages = computed(() => {
  if (!articlesData.value) return 1;
  return Math.ceil(articlesData.value.length / pageSize);
});

const articles = computed(() => {
  if (!articlesData.value) return [];
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return articlesData.value.slice(start, end);
});

// Set page title/description/keywords
useHead({
  title: category.value?.title || "Category",
  meta: [
    {
      name: "description",
      content: category.value?.description || "Category description",
    },
  ],
});

// article image path and fallback
function getArticleImageSrc(slug) {
  return `/images/articles/${slug}.webp`;
}
function onArticleImgError(e) {
  if (e.target.src !== "/images/articles/article_default.webp") {
    e.target.src = "/images/articles/article_default.webp";
  }
}
</script>

<style scoped>

</style>