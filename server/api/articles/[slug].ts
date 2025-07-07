import { Title } from './../../../.nuxt/components.d';
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import matter from 'gray-matter'

interface Article {
  _path: string
  title: string
  titleSlug: string
  description: string
  date: string
  category: string
  categorySlug: string
  image: string
  imageAlt?: string
  content: string
}

export default defineEventHandler(async (event) => {
  try {
    const slug = event.context.params?.slug
    // get content directory path from Nuxt runtime config
    const config = useRuntimeConfig()
    const articlesDir = join(config.contentDir || process.cwd(), 'content/articles')
    const files = readdirSync(articlesDir)

    // Find the matching article
    for (const file of files) {
      if (!file.endsWith('.md')) continue

      const filePath = join(articlesDir, file)
      const fileContent = readFileSync(filePath, 'utf-8')
      const { data: frontmatter, content } = matter(fileContent)

      // get article slug
      const titleSlug = frontmatter.titleSlug

      if (titleSlug === slug) {
        return {
          ...frontmatter,
          content,
          _path: `/articles/${titleSlug}`
        } as Article
      }
    }

    // If no article is found, return 404
    throw createError({
      statusCode: 404,
      message: 'Article not found'
    })
  } catch (error) {
    console.error('Error reading article:', error)
    throw error
  }
}) 