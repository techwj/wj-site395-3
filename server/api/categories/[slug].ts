import { readFileSync } from 'fs'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const slug = event.context.params?.slug
  
  const filePath = join(process.cwd(), 'content/categories/index.json')
  const fileContent = readFileSync(filePath, 'utf-8')
  const data = JSON.parse(fileContent)
  const category = data.categories.find((cat: any) => cat.slug === slug)
  if (!category) {
    return createError({ statusCode: 404, statusMessage: 'Category not found' })
  }
  return category
})