<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <script setup>
    useHead({
      script: [
        {
          children: `(function() {
        var script = document.createElement('script');
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2554404510173364';
        script.async = true;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      })()`,
          type: 'text/javascript'
        }
      ]
    })
  </script>
</template>
