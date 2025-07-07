require('dotenv').config();

const fs = require('fs');
const path = require('path');
const axios = require('axios');
// const nodemailer = require('nodemailer');
const winston = require('winston');
const { siteSEOInfo } = require('../data/index.cjs');

// config file path
const CATEGORIES_FILE = path.join(process.cwd(), 'content/categories/index.json');
const ARTICLES_DIR = path.join(process.cwd(), 'content/articles');
const NUXT_CONFIG_FILE = path.join(process.cwd(), 'nuxt.config.ts');

// API config
const API_BASE_URL = process.env.API_BASE_URL;
const API_KEY = process.env.API_KEY;

// log config
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console()
  ]
});

// read site description from nuxt.config.ts
let siteDescription = '';
try {
  const nuxtConfig = fs.readFileSync(NUXT_CONFIG_FILE, 'utf8');
  const descriptionMatch = nuxtConfig.match(/description', content: "([^"]+)"/);
  if (descriptionMatch && descriptionMatch[1]) {
    siteDescription = descriptionMatch[1];
  } else {
    siteDescription = siteSEOInfo.description || '';
  }
} catch (error) {
  logger.warn('Failed to read site description from nuxt.config.ts, falling back to env variable');
  siteDescription = siteSEOInfo.description || '';
}


// create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 1000 * 60, // 60 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY
  }
});

// delay function
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// API request with retry
async function retryRequest(fn, maxRetries = 3, delayMs = 1000*60*3) {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      logger.error(`Attempt ${i + 1} failed: ${error.message}`);
      if (error.response) {
        logger.error(`Response data: ${JSON.stringify(error.response.data)}`);
        logger.error(`Response status: ${error.response.status}`);
      } else if (error.request) {
        logger.error(`No response received: ${error.request}`);
      } else {
        logger.error(`Error: ${error}`);
      }
      if (i < maxRetries - 1) {
        logger.info(`Waiting ${delayMs/1000} seconds before retry...`);
        await delay(delayMs);
      }
    }
  }
  
  throw lastError;
}

async function updateCategoriesLongTailTitle() {
  try {
    // read existing categories file
    const categoriesData = JSON.parse(fs.readFileSync(CATEGORIES_FILE, 'utf8'));
    logger.info(`Found ${categoriesData.categories.length} categories to update`);

    // prepare request data
    const filteredCategoriesData = categoriesData.categories.map(cat => ({
      id: cat.id,
      title: cat.title,
      description: cat.description,
      longTailTitleArr: cat.longTailTitleArr
    }));

    // call API to update long tail titles
    logger.info('Requesting new long tail titles...');
    const response = await retryRequest(async () => {
      const result = await api.post('/update-long-tail-titles', {
        jsonData: filteredCategoriesData,
        siteDescription
      });
      
      if (!result.data.success) {
        throw new Error('update long tail titles API request failed: ' + JSON.stringify(result.data));
      }
      
      return result.data;
    });


    // parse new titles
    let newTitles = JSON.parse(response.result);
    // print number
    logger.info(`Received ${newTitles.length} new title sets`);
    logger.info('newTitles: ' + JSON.stringify(newTitles, null, 2));

    // check if newTitles is empty
    let someNewTitlesIsEmpty = newTitles.some(t => t.newTitles.length === 0);
    if (someNewTitlesIsEmpty) {
      logger.error('Some new titles is empty, exit with error for CI');
      process.exit(99);
    }

    // handle id format error, the id format is not matched, directly process to sequential numeric string
    newTitles = newTitles.map((t, index) => ({
      ...t,
      id: String(index + 1)
    }));
    
    // update categories file
    const updatedCategories = categoriesData.categories.map(category => {
      const newTitleData = newTitles.find(t => String(t.id) === String(category.id));
      if (newTitleData) {
        return {
          ...category,
          longTailTitleArr: [...category.longTailTitleArr, ...newTitleData.newTitles]
        };
      }
      return category;
    });

    // write updated categories file
    let siteSEOInfo = categoriesData.siteSEOInfo;
    fs.writeFileSync(
      CATEGORIES_FILE,
      JSON.stringify({ siteSEOInfo, categories: updatedCategories }, null, 2)
    );

    logger.info('Categories updated successfully');
    // return new titles and updated categories
    return { updatedCategories, newTitles };
  } catch (error) {
    logger.error(`Error updating categories: ${error.message}`);
    throw error;
  }
}

async function generateArticle(title, category) {
  try {
    const titleSlug = title
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    const categorySlug = category.slug;

    logger.info(`Generating article for title: ${title}`);
    
    // call API to generate article content
    const response = await retryRequest(async () => {
      const result = await api.post('/generate-articles-by-new-tail-titles', {
        jsonData: {
          title,
          titleSlug,
          category: category.title,
          categorySlug
        },
        siteDescription
      });

      // if it is a string, just write it
      if (typeof result.data === 'string') {
        return { success: true, result: result.data };
      } else {
        // if it is not a string, it means there is an exception on the worker side
        return { success: false, result: JSON.stringify(result.data) };
      }
    });

    // generate file name
    const fileName = `${titleSlug}.md`;
    
    // write file
    if (response.success && response.result) {
      fs.writeFileSync(path.join(ARTICLES_DIR, fileName), response.result);
    } else {
      // record error content to .error.md
      logger.error(`Worker error: ${response.result}`);
      fs.writeFileSync(path.join(ARTICLES_DIR, fileName + '.error.md'), response.result);
    }
    
    // add request interval
    await delay(2000); // 2 seconds interval
    
    return fileName;
  } catch (error) {
    logger.error(`Error generating article for ${title}: ${error.message}`);
    throw error;
  }
}

async function updateArticlesByNewTitles(updatedCategories, newTitles) {
  try {
    // print input
    logger.info('updatedCategories: ' + JSON.stringify(updatedCategories, null, 2));
    logger.info('newTitles: ' + JSON.stringify(newTitles, null, 2));
    // only use new titles to generate articles
    let articlesToGenerate = [];
    for (const category of updatedCategories) {
      const newTitleData = newTitles.find(t => String(t.id) === String(category.id));
      if (newTitleData && newTitleData.newTitles) {
        for (const title of newTitleData.newTitles) {
          articlesToGenerate.push({ title, category });
        }
      }
    }

    logger.info(`Starting to generate ${articlesToGenerate.length} articles (batch size: 2)`);
    const batchSize = 2;
    let failedArticles = [];
    for (let i = 0; i < articlesToGenerate.length; i += batchSize) {
      const batch = articlesToGenerate.slice(i, i + batchSize);
      for (const { title, category } of batch) {
        try {
          await generateArticle(title, category);
        } catch (error) {
          logger.error(`Failed to generate article: ${title} - ${error.message}`);
          failedArticles.push({ title, category });
          continue;
        }
      }
      if (i + batchSize < articlesToGenerate.length) {
        logger.info('Batch finished, waiting 2 minutes before next batch...');
        await delay(2 * 60 * 1000); // 2 minutes
      }
    }
    // after all batches, retry failed articles
    if (failedArticles.length > 0) {
      logger.info(`Retrying ${failedArticles.length} failed articles...`);
      let stillFailed = [];
      for (const { title, category } of failedArticles) {
        try {
          await generateArticle(title, category);
        } catch (error) {
          logger.error(`Still failed: ${title} - ${error.message}`);
          stillFailed.push({ title, category });
        }
      }
      if (stillFailed.length > 0) {
        logger.error(`There are still ${stillFailed.length} articles failed after retry.`);
      } else {
        logger.info('All previously failed articles generated successfully on retry.');
      }
    }
    logger.info('Articles update process completed');
  } catch (error) {
    logger.error(`Error updating articles: ${error.message}`);
    throw error;
  }
}

async function main() {
  try {
    logger.info('Starting article update process...');
    // update categories and get new titles
    const { updatedCategories, newTitles } = await updateCategoriesLongTailTitle();
    // only use new titles to generate articles, batch process
    await updateArticlesByNewTitles(updatedCategories, newTitles);
    logger.info('Article update process completed successfully');
  } catch (error) {
    logger.error(`Article update process failed: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  updateCategoriesLongTailTitle,
  generateArticle,
  updateArticlesByNewTitles,
  main
}; 