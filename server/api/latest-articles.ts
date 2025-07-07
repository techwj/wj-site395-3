import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import matter from "gray-matter";

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const articlesDir = join(config.contentDir || process.cwd(), "content/articles");
    const files = readdirSync(articlesDir);
    const articles = files
      .filter((file) => file.endsWith(".md"))
      .map((file) => {
        try {
          const filePath = join(articlesDir, file);
          const fileContent = readFileSync(filePath, "utf-8");
          const { data: frontmatter } = matter(fileContent);

          // check if frontmatter and title exists
          if (!frontmatter || !frontmatter.title) {
            console.warn(`Warning: Missing title in article ${file}`);
            return null;
          }

          const titleSlug = frontmatter.titleSlug
            // .toLowerCase()
            // .replace(/[^a-z0-9]+/g, "-")
            // .replace(/^-+|-+$/g, "");

          
          return {
            _path: `/articles/${titleSlug}`,
            title: frontmatter.title,
            date: frontmatter.date,
          };
        } catch (err) {
          console.warn(`Warning: Error processing article ${file}:`, err);
          return null;
        }
      })
      .filter((article) => article !== null && article.title && article.date)
      .sort((a, b) => {
        if (!a || !b) return 0;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      })
      .slice(0, 5);
    return articles;
  } catch (error) {
    console.error("Error reading latest articles:", error);
    return [];
  }
});
