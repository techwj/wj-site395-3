// @ts-ignore
const { siteSEOInfo, siteDomain } = require('./data/index.cjs')

export default defineNuxtConfig({
  compatibilityDate: '2025-05-09',
  devtools: { enabled: true },
  modules: [
    '@nuxt/content',
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    'nuxt-gtag'
  ],
  gtag: {
    id: 'G-V5C8M96VB5'
  },
  content: {},
  image: {
    // image quality
    quality: 80,
    // image format
    format: ['webp'],
    // responsive breakpoints
    screens: {
      'xs': 320,    // mobile vertical
      'sm': 640,    // mobile horizontal/small tablet
      'md': 768,    // tablet vertical
      'lg': 1024,   // tablet horizontal/small laptop
      'xl': 1280,   // desktop monitor
      '2xl': 1536,  // large monitor
    },
    presets: {
      // article thumbnail
      articleThumbnail: {
        modifiers: {
          format: 'webp',
          width: 400,
          height: 300,
          fit: 'cover'
        }
      },
      // article main image
      articleMain: {
        modifiers: {
          format: 'webp',
          width: 800,
          height: 600,
          fit: 'cover'
        }
      },
      // article content image
      articleContent: {
        modifiers: {
          format: 'webp',
          width: 1200,
          height: 900,
          fit: 'contain'
        }
      },
      // category image
      category: {
        modifiers: {
          format: 'webp',
          width: 600,
          height: 450,
          fit: 'cover'
        }
      }
    }
  },
  runtimeConfig: {
    contentDir: process.cwd(),
    public: {
      image: {
        domains: ['placehold.co', 'picsum.photos']
      },
      siteUrl: process.env.SITE_URL || (process.env.NODE_ENV === 'development' 
        ? 'http://localhost:3000'
        : siteDomain)
    }
  },
  appConfig: {
      head: {
      title: siteSEOInfo.title,
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: siteSEOInfo.description },
        { name: 'keywords', content: siteSEOInfo.keywords }
      ]
    }
  },
  app: {
    head: {
      script: [
        // 广告代码: highperformanceformat.com banner (320x50)
        // bodyClose: 脚本在 body 末尾，invoke.js 就地插入 iframe 才可见
        // tagPriority: atOptions(0) 严格先于 invoke.js(1)
        /*{
          innerHTML: `atOptions = { 'key': '3d42be0706682e2b744f7fe15ecfe20c', 'format': 'iframe', 'height': 50, 'width': 320, 'params': {} };`,
          tagPosition: 'bodyClose',
          tagPriority: 0,
        },*/
        {
          src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2554404510173364',
          async: true,
          crossorigin: 'anonymous'
        }
      ]
    }
  },
  nitro: {
    prerender: {
      routes: [
        '/',
        '/articles',
        '/categories',
        '/ads.txt'
      ],
      crawlLinks: true,
      ignore: [
        '/api/**'
      ]
    },
    cloudflare: {
      pages: {
        routes: {
          include: ['/*'],
          exclude: [
            '/_nuxt/*',
            '/',
            '/ads.txt',
            '/agreement',
            '/articles/*',
            '/categories/*',
            '/dump.content.sql',
            '/favicon.ico',
            '/robots.txt',
            '/sitemap.xml',
            '/__nuxt_content/content/sql_dump',
            '/images/**'
          ]
        }
      }
    },
    routeRules: {
      '/sitemap.xml': { prerender: true },
      '/robots.txt': { prerender: true },
      '/ads.txt': { prerender: true },
      '/images/**': {
        cache: {
          maxAge: 31536000,
          staleMaxAge: 31536000,
          headersOnly: false
        },
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable'
        }
      }
    }
  }
})
