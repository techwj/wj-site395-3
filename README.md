# 文章自动更新系统

这是一个基于Nuxt.js开发的自动化文章更新系统，通过AI生成和更新网站内容，并通过GitHub Actions实现定时触发，自动更新网站的长尾词标题和文章内容。

## 1. 网站结构

### 1.1 技术架构

#### 前端实现
- 核心框架：Nuxt.js 3
  - 基于Vue 3的SSR框架
  - 文件系统路由
  - 自动组件导入
  - 静态站点生成(SSG)

- 内容管理：@nuxt/content
  - Markdown文件解析
  - 内容查询API
  - 内容导航生成
  - 代码高亮

- 样式框架：Tailwind CSS
  - 响应式设计
  - 组件样式

- 图片处理：@nuxt/image
  - 图片优化
  - 响应式图片
  - WebP格式转换

#### 后端实现
- AI服务集成
  - Google API
    - 文章内容生成
    - 长尾词生成
    - 图片生成
  - Cloudflare Worker
    - API请求代理
    - 错误处理
    - 日志记录

- 部署服务
  - Cloudflare Pages
    - 静态资源托管
    - 自动构建部署
    - 全球CDN
  - GitHub Actions
    - 自动化部署
    - 定时任务触发
    - 内容更新工作流

#### 数据流程
1. 内容生成流程

#### 内容生成流程

本地内容生成和更新遵循如下标准化流程，确保每一步都高效、合规：

##### 步骤1：关键词选择与index.json更新
- 根据实际需求或内容方向，选中需要的关键词（如“面试准备指南”）。
- 更新`content/categories/index.json`，只保留选中关键词相关的分类及长尾词，确保结构和内容聚焦于当前方向。

##### 步骤2：文章自动批量生成与检查
- 按照`index.json`中`categories`数组的顺序，依次读取每个分类下的`longTailTitleArr`。
- 针对每个长尾词标题，自动生成一篇约1200字的SEO优化Markdown文章，存放于`content/articles/`目录下。
- 每篇文章生成后，立即进行如下检查：
  1. 检查文件是否存在且包含内容
  2. 检查Frontmatter格式是否正确
  3. 检查内容结构是否完整
  4. 检查关键词使用是否自然
  5. 检查内部链接是否正确
  6. 检查FAQ部分是否完整
- 只有当前文章完全符合要求后，才继续生成下一篇文章。
- 持续生成，直到`index.json`中所有分类下的长尾词标题都生成完成。

##### 步骤3：内容维护与扩展
- 定期根据新的关键词方向，重复上述流程，持续优化和扩充网站内容。
- 保证每次内容更新都符合SEO最佳实践和结构规范。

> 本地内容生成流程强调自动化、批量化和高质量检查，确保每一篇文章都能高效、合规地上线。

2. 内容更新流程
   ```
   定时更新：
   GitHub Actions(每天UTC 15:00) -> Cloudflare Worker -> Google API -> 生成新内容 -> 提交到GitHub -> Cloudflare Pages自动部署
   ```

3. 数据存储结构
   ```
   content/
   ├── categories/
   │   └── index.json    # 分类配置和长尾词
   ├── articles/         # 文章内容(Markdown)
   └── prompt/           # AI生成指令模板
   ```

4. 请求处理流程
   ```
   用户访问 -> Nuxt SSR渲染 -> @nuxt/content读取Markdown -> 页面渲染 -> 静态资源加载
   ```

#### 自动化流程
1. 定时更新
   - 触发：GitHub Actions定时任务
   - 执行：更新脚本
   - 提交：自动提交更新
   - 部署：Cloudflare Pages自动部署

2. 错误处理
   - 重试机制：失败自动重试（最多3次）
   - 日志记录：更新过程日志
   - 通知机制：更新失败通知

3. 部署流程
   - 构建：Nuxt静态生成
   - 部署：Cloudflare Pages
   - 缓存：CDN缓存策略
   - 回滚：版本回滚机制

### 1.2 目录结构
```
.
├── .nuxt/                 # Nuxt.js 构建文件
├── .output/              # 构建输出目录
├── components/           # Vue组件
├── content/             # 内容文件
│   ├── articles/        # 文章存储（Markdown格式）
│   ├── categories/      # 分类数据（JSON格式）
│   │   └── index.json   # 分类配置和长尾词
│   └── prompt/          # 提示词模板
├── layouts/             # 页面布局
├── middleware/          # 中间件
├── pages/              # 页面文件
├── plugins/            # 插件
├── public/             # 静态资源
│   └── categories/     # 分类图片
├── server/             # 服务端代码
└── scripts/            # 自动化脚本
```

## 2. 网站内容生成

### 2.1 分类数据生成
1. 数据位置：`content/categories/index.json`
2. 生成流程：
   - 使用`content/prompt/category.txt`生成分类数据
   - 生成分类标题、描述、关键词
   - 生成长尾词列表
3. 数据结构：
   ```json
   {
     "categories": [
       {
         "title": "分类标题",
         "description": "分类描述",
         "keywords": ["关键词1", "关键词2"],
         "longTailTitles": [
           {
             "title": "长尾词标题",
             "description": "长尾词描述",
             "keywords": ["关键词1", "关键词2"]
           }
         ]
       }
     ]
   }
   ```

### 2.2 文章内容生成
1. 数据位置：`content/articles/`
2. 生成流程：
   - 使用`content/prompt/article.txt`生成文章
   - 根据长尾词生成文章内容
   - 生成文章元数据
3. 文件结构：
   ```markdown
   ---
   title: 文章标题
   description: 文章描述
   keywords: [关键词1, 关键词2]
   category: 所属分类
   date: 发布日期
   ---

   文章内容
   ```

### 2.3 图片资源生成
1. 存储位置：`public/categories/`
2. 生成流程：
   - 使用`content/prompt/image.txt`生成图片提示词
   - 调用AI生成图片
   - 优化和压缩图片
3. 图片规范：
   - 命名：`category-{id}.webp`
   - 尺寸：1200x630px
   - 格式：WebP
   - 压缩率：80%

## 3. 网站内容发布

### 3.1 自动化更新流程
1. 定时触发
   - GitHub Actions定时任务
   - 每天UTC 15:00执行
   - 支持手动触发

2. 内容更新
   - 调用Cloudflare Worker
   - 使用Google API生成新内容
   - 更新长尾词标题
   - 生成新文章

3. 自动部署
   - 提交更新到GitHub
   - 触发Cloudflare Pages部署
   - 自动更新网站内容

### 3.2 部署配置
1. 环境要求
   - Node.js >= 20.12.2
   - npm >= 10.2.4
   - Git
   - Cloudflare账号
   - Google API密钥

2. 环境变量
   ```env
   # 网站配置
   SITE_URL=https://your-domain.com
   SITE_DESCRIPTION=网站描述

   # API配置
   GOOGLE_API_KEY=your_google_api_key
   WORKER_API_URL=https://your-worker.workers.dev

   # 环境配置
   NODE_ENV=production
   ```

3. Cloudflare配置
   - Pages：自动构建部署
   - Worker：API处理
   - 域名：自定义配置
   - 缓存：策略配置

## 4. 开发规范

### 4.1 代码规范
- 使用TypeScript
- 遵循ESLint规则
- 使用Prettier格式化
- 遵循Vue 3最佳实践

### 4.2 命名规范
- 变量：驼峰命名
- 常量：大写+下划线
- 组件：PascalCase
- 路由：kebab-case
- 类型：PascalCase
- 接口：PascalCase

### 4.3 注释规范
- 类注释：说明用途
- 方法注释：参数说明
- 复杂逻辑：步骤说明
- 关键配置：说明用途

## 5. 维护指南

### 5.1 性能监控
- 页面加载时间
- 资源加载情况
- API响应时间
- 错误率统计

### 5.2 内容维护
- 定期检查内容时效性
- 更新过时信息
- 优化低效内容
- 补充新知识点

### 5.3 安全维护
- 定期更新依赖
- 检查安全漏洞
- 监控异常访问
- 备份重要数据

## 功能模块

### 1. 文章管理
- 文章自动更新
- 长尾词优化
- 内容生成
- 分类管理

### 2. 定时任务
- GitHub Actions配置
- 定时触发机制
- 任务执行日志
- 错误处理机制

### 3. 系统配置
- 环境变量管理
- API密钥配置
- 系统参数设置
- 日志配置

## 开发流程

### 1. 分支管理
- main：主分支，用于生产环境
- develop：开发分支，用于集成功能
- feature/*：功能分支，用于开发新功能
- hotfix/*：紧急修复分支，用于修复生产环境问题
- release/*：发布分支，用于版本发布

### 2. 提交规范
提交信息格式：`<type>(<scope>): <subject>`

类型（type）：
- feat：新功能
- fix：修复bug
- docs：文档更新
- style：代码格式（不影响代码运行的变动）
- refactor：重构（既不是新增功能，也不是修改bug的代码变动）
- test：增加测试
- chore：构建过程或辅助工具的变动
- perf：性能优化
- ci：CI配置相关

范围（scope）：
- content：内容相关
- api：API相关
- ui：界面相关
- build：构建相关
- deps：依赖相关

### 3. 自动化工作流
1. 文章更新流程
   - 定时触发（UTC 15:00）
   - 自动更新长尾词
   - 生成新文章
   - 自动提交变更

2. 错误处理机制
   - 失败自动重试（最多3次）
   - 错误日志记录
   - 失败通知（GitHub Issues）

3. 代码审查流程
   - 提交前自测
   - 代码审查
   - 测试用例
   - 文档更新

### 4. 版本发布流程
1. 创建release分支
2. 更新版本号
3. 更新CHANGELOG
4. 合并到main分支
5. 创建版本标签

### 5. 文档维护
1. 及时更新README
2. 维护API文档
3. 更新使用说明
4. 记录重要决策

## 联系方式

- 项目负责人：[姓名]
- 技术支持：[邮箱]
- 问题反馈：[GitHub Issues]

## 版权信息

© 2024 [公司名称]. All rights reserved.

## 功能特点

- 自动更新长尾词标题
- 自动生成新文章内容
- 定时执行（通过 GitHub Actions）
- 自动保存到指定目录

## 系统架构

### 主要组件

1. **定时触发器**
   - 使用 GitHub Actions 实现定时触发
   - 默认每天执行一次

2. **更新脚本** (`scripts/update-title-and-article.js`)
   - 负责与 Worker 服务通信
   - 处理数据更新和文件保存

3. **Worker 服务**
   - 提供 API 接口
   - 生成长尾词标题
   - 生成文章内容

### 数据流向

1. GitHub Actions 触发脚本
2. 脚本读取现有分类数据
3. 调用 Worker API 获取新内容
4. 更新分类文件中的长尾词
5. 生成新文章并保存

## API 接口说明

### 1. 更新长尾词标题

**请求地址**: `/update-long-tail-titles-arr`

**请求方法**: POST

**请求参数**:
```json
{
  "prompt": "SEO专家生成长尾关键词的提示词",
  "jsonData": [
    {
      "id": "1",
      "title": "分类标题",
      "longTailTitleArr": ["现有长尾词1", "现有长尾词2"]
    }
  ]
}
```

**返回数据**:
```json
{
  "success": true,
  "result": "[{\"id\":\"1\",\"newTitles\":[\"新长尾词1\",\"新长尾词2\"]}]"
}
```

### 2. 生成文章内容

**请求地址**: `/generate-articles-by-new-tail-titles`

**请求方法**: POST

**请求参数**:
```json
{
  "jsonData": {
    "title": "文章标题",
    "titleSlug": "文章-slug",
    "category": "分类名称",
    "categorySlug": "分类-slug"
  }
}
```

**返回数据**:
```json
{
  "success": true,
  "result": "文章内容（Markdown格式）"
}
```

## 文件结构

```
.
├── content/
│   ├── articles/          # 文章存储目录
│   └── categories/
│       └── index.json     # 分类和长尾词数据
├── scripts/
│   ├── update-title-and-article.js  # 更新脚本
│   └── paramtersExample.js          # 参数示例
└── README.md
```

## 内容生成标准

### 1. 分类数据生成标准
1. 分类结构（categories/index.json）
   ```json
   {
     "categories": [
       {
         "title": "分类标题",
         "description": "分类描述",
         "keywords": ["关键词1", "关键词2"],
         "longTailTitles": [
           {
             "title": "长尾词标题",
             "description": "长尾词描述",
             "keywords": ["关键词1", "关键词2"]
           }
         ]
       }
     ]
   }
   ```

2. 生成指令（content/prompt/category.txt）
   - 分类标题生成规则
     - 长度：10-20个字符
     - 格式：主关键词+修饰词
     - 要求：SEO友好，用户易理解
   
   - 分类描述生成规则
     - 长度：100-150字
     - 结构：问题引入+解决方案+价值说明
     - 要求：包含关键词，突出价值点
   
   - 关键词生成规则
     - 数量：5-8个
     - 类型：主关键词+长尾词+相关词
     - 要求：搜索量适中，竞争度合理

   - 长尾词生成规则
     - 数量：每个分类10-15个
     - 结构：主关键词+修饰词+场景词
     - 要求：搜索意图明确，转化率高

### 2. 文章生成标准
1. 文章结构（content/articles/）
   ```markdown
   ---
   title: 文章标题
   description: 文章描述
   keywords: [关键词1, 关键词2]
   category: 所属分类
   date: 发布日期
   ---

   文章内容
   ```

2. 生成指令（content/prompt/article.txt）
   - 文章标题生成规则
     - 长度：20-30个字符
     - 结构：主标题+副标题
     - 要求：吸引点击，包含关键词
   
   - 文章描述生成规则
     - 长度：150-200字
     - 结构：问题+解决方案+价值
     - 要求：突出核心价值，引导阅读
   
   - 文章内容生成规则
     - 字数：2000-3000字
     - 结构：
       - 开篇：问题引入
       - 主体：3-5个核心部分
       - 结尾：总结+行动建议
     - 要求：
       - 段落清晰，层次分明
       - 包含实际案例
       - 提供可操作建议
       - 适当使用小标题
       - 关键词自然分布

### 3. 图片生成标准
1. 图片存储（public/categories/）
   - 命名规则：`category-{id}.webp`
   - 尺寸要求：1200x630px
   - 格式要求：WebP格式
   - 质量要求：压缩率80%

2. 生成指令（content/prompt/image.txt）
   - 图片主题：与分类内容相关
   - 风格要求：
     - 专业性强
     - 视觉清晰
     - 主题突出
   - 元素要求：
     - 主视觉元素
     - 辅助图形
     - 文字说明（可选）

### 4. 内容质量控制
1. 内容审核
   - 标题：符合SEO规范
   - 描述：信息完整准确
   - 关键词：相关性高
   - 正文：结构合理，内容充实

2. 更新频率
   - 分类更新：每月1次
   - 文章更新：每周2-3篇
   - 图片更新：随分类更新

3. 内容维护
   - 定期检查内容时效性
   - 更新过时信息
   - 优化低效内容
   - 补充新知识点 