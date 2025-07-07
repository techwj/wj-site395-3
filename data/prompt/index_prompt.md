0. 更新概述:
  - 从[data/content_direction.json]中[id]为[number用户提供]的数据中获取第一个为false的关键词,当作本指令的关键词.然后更新其值为'true'
  - 根据当前指令来重写文件[data/index.cjs]
  - 重写完成以后,在data文件夹下执行: [node update-json-and-rename-img.cjs]文件
1. 关键词来源规则：
   - 采用步骤0中获取的关键词作为基础参考和灵感来源
   - 关键词扩展原则：
     1. 主要关键词：可以基于原始关键词进行同义词、近义词扩展
     2. 长尾关键词：可以围绕主题进行相关场景、问题、解决方案的扩展
     3. 相关关键词：可以基于用户意图和搜索习惯进行自然扩展
   - 关键词选择优先级：
     1. 主要关键词及其变体
     2. 长尾关键词及其相关场景
     3. 相关关键词及其扩展词

2. 网站SEO信息生成规则（基于Google SEO最佳实践）：
   - siteSEOInfo对象包含以下字段：
     - title: 
       * 一句话描述
       * 长度：50-60个字符
       * 必须包含主要关键词
       * 避免关键词堆砌
     - description: 
       * 长度：150-160个字符
       * 包含主要关键词和1-2个长尾关键词
       * 使用行动号召（CTA）
       * 清晰描述网站价值主张
     - keywords: 
       * 最多10个关键词
       * 按重要性排序
       * 包含主要关键词和长尾关键词
       * 使用逗号分隔

3. 分类内容生成规则：
   - 分类数量配置：
     * 默认生成8个分类
     * 可通过参数指定生成数量
     * 分类数量范围：1-20个
   - 长尾词标题配置：
     * 每个分类生成1个长尾词标题
     * 可通过参数指定数量
     * 长尾词标题数量范围：1-20个
   - 每个分类必须包含以下字段：
     - id: 从1开始的序号
     - slug: 
       * 使用小写字母
       * 用连字符(-)连接单词
       * 包含主要关键词
       * 长度不超过60个字符
     - title: 
       * 首字母大写
       * 包含主要关键词
       * 长度不超过60个字符
       * 使用自然语言
     - description: 
       * 长度：150-160个字符
       * 包含主要关键词和长尾关键词
       * 使用自然语言
       * 包含价值主张
     - longTailTitleArr: 
       * 提供指定数量的长尾标题
       * 每个标题包含1-2个长尾关键词
       * 使用问题形式或操作指南形式
       * 每个标题不超过60个字符
     - image_prompt: 
       * 基于分类主题生成
       * 包含关键词相关的视觉元素
       * 描述场景、氛围和主要元素

4. 内容质量要求（基于Google E-E-A-T原则）：
   - 专业性（Expertise）：
     * 内容必须准确、专业
     * 使用行业术语
     * 提供具体数据或案例
   - 权威性（Authority）：
     * 内容来源可靠
     * 引用权威信息
     * 保持内容更新
   - 可信度（Trustworthiness）：
     * 内容真实可靠
     * 避免误导性信息
     * 提供完整信息
   - 体验（Experience）：
     * 内容实用性强
     * 解决用户实际问题
     * 提供可操作的建议

5. 示例格式：
```json
{
  "siteSEOInfo": {
    "title": "professional [Primary Keyword][service/supply/....]",
    "description": "Discover expert insights about [Primary Keyword]. Learn [Value Proposition] with our comprehensive guide on [Long-tail Keyword]. Get actionable tips and strategies for [Related Keyword].",
    "keywords": "primary keyword, long-tail keyword, related keyword, secondary keyword, brand keyword"
  },
  "categories": [
    {
      "id": "1",
      "slug": "primary-keyword-guide",
      "title": "Complete Guide to Primary Keyword",
      "description": "Master the essentials of [Primary Keyword] with our expert guide. Learn proven strategies, best practices, and actionable tips for [Long-tail Keyword] success.",
      "longTailTitleArr": [
        "How to Master Primary Keyword: Step-by-Step Guide"
      ],
      "image_prompt": "A professional scene showing [Primary Keyword] implementation, with clear visual elements representing [Key Concept] and [Related Element]"
    }
  ]
}
```

6. 更新流程：
   - 第一步：参数询问（必须执行）
     * 必须询问：需要生成的分类数量（1-20，默认8）
     * 必须询问：每个分类的长尾词标题数量（1-5，默认0）
     * 等待用户确认参数后再继续
   - 第二步：生成内容
     * 根据用户确认的参数生成相应数量的分类
     * 为每个分类生成指定数量的长尾词标题
     * 保持其他格式和规则不变
   - 第三步：内容审核
     * 确保所有内容符合SEO最佳实践
     * 验证内容质量和完整性
     * 检查关键词使用是否合理

7. 执行规则：
   - 开始更新时，必须先询问分类数量和长尾词数量
   - 显示格式：
     ```
     请确认以下参数：
     1. 分类数量：[1-20，默认8]
     2. 每个分类的长尾词标题数量：[1-5，默认0]
     
     请输入您需要的数量，或回复"默认"使用默认设置。
     ```
   - 获得用户确认后才能继续生成内容