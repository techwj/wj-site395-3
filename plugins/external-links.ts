export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:mounted', () => {
    const handleExternalLinks = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const link = target.closest('a')
      
      if (link && link.hostname !== window.location.hostname) {
        event.preventDefault()
        const targetUrl = link.href
        const currentUrl = new URL(window.location.href)
        currentUrl.searchParams.set('target', targetUrl)
        history.pushState({}, '', currentUrl.toString())
        
        window.location.href = targetUrl
      }
    }

    document.addEventListener('click', handleExternalLinks)
  })
}) 