<template>
  <div class="w-full h-full mt-4">
    <!-- google ads mobile-->
    <div class="w-full h-[50px] bg-gray-100 block md:hidden">
      <AdUnit
        type="gpt"
        gptAdId="HK_CN_mobile_game92_vip_banner_6"
        gptSlot="/29746187,23103910451/HK_CN_mobile.game92.vip_banner_6"
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
  <div @click.capture="toParentCategory" class="container mx-auto px-2 py-2">
    <div v-if="pending" class="text-center">
      <p>Loading...</p>
    </div>
    <div v-else-if="error" class="text-center text-red-500">
      <p>Article not found or failed to load</p>
    </div>
    <article v-else class="max-w-4xl mx-auto">
      <h2 class="text-3xl font-bold mb-4">{{ article.title }}</h2>
      <div class="flex items-center text-gray-600 mb-2">
        <span class="mr-4">{{ formatDate(article.date) }}</span>
        <NuxtLink :to="`/categories/${article.categorySlug}`" class="text-blue-600 hover:underline">
          {{ article.category }}
        </NuxtLink>
      </div>
      <!-- <img
        :key="articleImgSrc"
        :src="articleImgSrc"
        :alt="article.imageAlt || article.title"
        class="w-full h-64 object-cover rounded-lg mb-2"
        @error="onImgError"
        loading="lazy"
      /> -->
    <!-- google ads mobile-->
    <div class="w-full h-[250px] bg-gray-100 block md:hidden">
      <AdUnit
        type="gpt"
        gptAdId="HK_CN_mobile_game92_vip_banner_3"
        gptSlot="/29746187,23103910451/HK_CN_mobile.game92.vip_banner_3"
        :gptSlotSizes="[[300,50]]"
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
        gptAdId="HK_CN_mobile_game92_vip_banner_10"
        gptSlot="/29746187,23103910451/HK_CN_mobile.game92.vip_banner_10"
        :gptSlotSizes="[[970, 90]]"
        :gptSizeMappings="[
          { viewport: [728, 300], sizes: [970, 90] },
          { viewport: [0, 0], sizes: [] }
        ]"
        gptStyle="text-align:center;"
      />
    </div>
      <div class="prose max-w-none">
        <div v-if="renderedContentFirstHalf" v-html="renderedContentFirstHalf"></div>


        <div v-if="renderedContentSecondHalf" v-html="renderedContentSecondHalf"></div>
      </div>
    </article>
  </div>
</template>

<script setup>
import { marked } from "marked";
import { ref, computed, onMounted } from "vue";

const router = useRouter();
const route = useRoute();
const slug = computed(() => route.params.slug);

const toParentCategory = (e) => {
  let el = e.target;
  while (el && el.currentTarget) {
    if (el.tagName === 'A') {
      return;
    }
    el = el.parentElement;
  }
  router.push(`/categories/${article.value.categorySlug}`)
}

// store article image path
const articleImagePath = ref("/images/articles/article_default.webp");

// check image exists
const checkImageExists = async (imagePath) => {
  try {
    const response = await fetch(imagePath, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
};

// Get article content
const { data: article, pending, error } = await useFetch(`/api/articles/${slug.value}`);

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

// // init adsbygoogle
// const initAd = () => {
//   // check if adsbygoogle is initialized
//   if (!window.adsbygoogle || window.adsbygoogle.length === 0) {
//     window.adsbygoogle = window.adsbygoogle || [];
//     window.adsbygoogle.push({});
//   }
// };

// check image exists when component mounted
onMounted(async () => {
  if (article.value?.image) {
    const customImagePath = `/images/articles/${article.value.image}.webp`;
    const exists = await checkImageExists(customImagePath);
    articleImagePath.value = exists ? customImagePath : "/images/articles/article_default.webp";
  }
  
  // load adsbygoogle script
  // loadAdScript();
  // initAd();
});

// calculate image path
const articleImgSrc = computed(() => articleImagePath.value);

function onImgError(e) {
  articleImagePath.value = "/images/articles/article_default.webp";
}

// Convert markdown content to HTML
const renderedContent = computed(() => {
  if (!article.value?.content) return "";
  return marked(article.value.content);
});

// Split content and render separately
const renderedContentFirstHalf = computed(() => {
  if (!article.value?.content) return "";
  const content = article.value.content;
  const totalLength = content.length;
  const midPoint = Math.floor(totalLength / 2);
  
  // find the nearest paragraph break point
  let splitPoint = midPoint;
  while (splitPoint > 0 && content[splitPoint] !== '\n') {
    splitPoint--;
  }
  
  const firstHalf = content.substring(0, splitPoint);
  // del H1-title and [TOC] words
  const firstHalfWithoutH1 = firstHalf
    .replace(/^# .*\n?/m, '')
    .replace(/\[TOC\]/, '');

  return marked(firstHalfWithoutH1);
});

const renderedContentSecondHalf = computed(() => {
  if (!article.value?.content) return "";
  const content = article.value.content;
  const totalLength = content.length;
  const midPoint = Math.floor(totalLength / 2);
  
  // find the nearest paragraph break point
  let splitPoint = midPoint;
  while (splitPoint > 0 && content[splitPoint] !== '\n') {
    splitPoint--;
  }
  
  const secondHalf = content.substring(splitPoint + 1);
  return marked(secondHalf);
});

// Format date
const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// set the title description and keywords
useHead({
  title: article.value?.title,
  meta: [
    { name: 'description', content: article.value?.description },
  ],
});
</script>

<style>
.prose {
  @apply text-gray-800;
}

.prose h1 {
  @apply text-3xl font-bold mb-4;
}

.prose h2 {
  @apply text-2xl font-bold mb-3 mt-6;
}

.prose p {
  @apply mb-4 leading-relaxed;
}

.prose ul {
  @apply list-disc list-inside mb-4;
}

.prose ol {
  @apply list-decimal list-inside mb-4;
}

.prose li {
  @apply mb-2;
}

.prose strong {
  @apply font-bold;
}

.prose em {
  @apply italic;
}

.prose a {
  @apply text-blue-600 hover:underline;
}

.prose blockquote {
  @apply border-l-4 border-gray-300 pl-4 italic my-4;
}

.prose code {
  @apply bg-gray-100 px-1 py-0.5 rounded;
}

.prose pre {
  @apply bg-gray-100 p-4 rounded-lg overflow-x-auto my-4;
}

.prose img {
  @apply max-w-full h-auto rounded-lg my-4;
}
</style>

<style scoped>
</style>
