<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <!-- 广告位 -->
    <ClientOnly>
      <ins class="adsbygoogle"
           style="display:block"
           data-ad-client="ca-pub-2554404510173364"
           data-ad-slot="你的真实广告单元ID"
           data-ad-format="auto"
           data-full-width-responsive="true">
      </ins>
    </ClientOnly>
  </div>
</template>

<script setup>
// 直接使用你提供的脚本链接
useHead({
  script: [
    {
      src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2554404510173364',
      async: true,
      crossorigin: 'anonymous'
    }
  ]
})

// 触发广告渲染
onMounted(() => {
  setTimeout(() => {
    if (window.adsbygoogle) {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
      console.log('✅ AdSense 广告已触发')
    }
  }, 100)
})
</script>
