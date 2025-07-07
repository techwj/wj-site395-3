import { defineEventHandler } from 'h3'
import { createError } from 'h3'
import fs from 'fs'
import path from 'path'

interface ContentDocument {
  _path: string
  updatedAt?: string
  createdAt?: string
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl
  
  try {
    const contentDir = path.join(process.cwd(), 'content')
    const articlesDir = path.join(contentDir, 'articles')
    const categoriesDir = path.join(contentDir, 'categories')
    
    const articles = fs.readdirSync(articlesDir)
      .filter(file => file.endsWith('.md'))
      .map(file => ({
        _path: `/articles/${file.replace('.md', '')}`,
        updatedAt: new Date().toISOString()
      }))
    
    const categories = fs.readdirSync(categoriesDir)
      .filter(file => file.endsWith('.md'))
      .map(file => ({
        _path: `/categories/${file.replace('.md', '')}`,
        updatedAt: new Date().toISOString()
      }))
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${siteUrl}/articles</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${siteUrl}/categories</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  ${articles.map(article => `
  <url>
    <loc>${siteUrl}${article._path}</loc>
    <lastmod>${article.updatedAt}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}
  ${categories.map(category => `
  <url>
    <loc>${siteUrl}${category._path}</loc>
    <lastmod>${category.updatedAt}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}
</urlset>`

    event.node.res.setHeader('content-type', 'text/xml')
    return sitemap
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Failed to generate sitemap'
    })
  }
}) 