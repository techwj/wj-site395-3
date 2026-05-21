<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
// 避免 SSR hydration 问题
if (import.meta.client) {
  // 延迟加载 AdSense
  setTimeout(() => {
    const script = document.createElement('script')
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2554404510173364'
    script.async = true
    script.crossOrigin = 'anonymous'
    document.head.appendChild(script)
  }, 100)
}
</script>
