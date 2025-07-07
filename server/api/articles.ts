import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import matter from 'gray-matter'

interface Article {
  _path: string
  title: string
  description: string
  date: string
  category: string
  categorySlug: string
  image: string
  imageAlt?: string
}

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const categorySlug = query.categorySlug as string

    // get content directory path from Nuxt runtime config
    const config = useRuntimeConfig()
    const articlesDir = join(config.contentDir || process.cwd(), 'content/articles')
    const files = readdirSync(articlesDir)

    // Parse all articles
    const articles = files
      .filter(file => file.endsWith('.md'))
      .map(file => {
        const filePath = join(articlesDir, file)
        const fileContent = readFileSync(filePath, 'utf-8')
        const { data: frontmatter } = matter(fileContent)
        
        return {
          ...frontmatter,
          _path: `/articles/${frontmatter.titleSlug}`
        } as Article
      })
      .filter(article => article.categorySlug === categorySlug)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return articles
  } catch (error) {
    console.error('Error reading articles:', error)
    return []
  }
}) 