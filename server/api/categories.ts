import { readFileSync } from 'fs'
import { join } from 'path'

export default defineEventHandler(async (event) => { 
  try {
    const config = useRuntimeConfig()
    const filePath = join(config.contentDir || process.cwd(), 'content/categories/index.json')
    const fileContent = readFileSync(filePath, 'utf-8')
    const data = JSON.parse(fileContent)
    
    // Set cache control headers
    setResponseHeaders(event, {
      'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      'Content-Type': 'application/json'
    })
    
    return data.categories
  } catch (error) {
    console.error('Error reading categories:', error)
    return []
  }
}) 