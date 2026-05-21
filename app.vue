<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <ClientOnly>
      <ins class="adsbygoogle"
           style="display:block"
           data-ad-client="ca-pub-2554404510173364"
           data-ad-slot="你的真实广告单元ID"
           data-ad-format="auto">
      </ins>
    </ClientOnly>
  </div>
</template>

<script setup>
// 添加标志，防止重复 push
let adPushed = false

useHead({
  script: [
    {
      src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
      async: true,
      crossorigin: 'anonymous',
    }
  ]
})

onMounted(() => {
  nextTick(() => {
    setTimeout(() => {
      // 检查是否还有未处理的广告位
      const unprocessedAds = document.querySelectorAll('ins.adsbygoogle:not([data-adsbygoogle-status="done"])')
      
      if (unprocessedAds.length > 0 && !adPushed && window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({})
        adPushed = true
        console.log('✅ 广告已触发，待填充')
      } else {
        console.log('所有广告位已处理')
      }
    }, 100)
  })
})
</script>
