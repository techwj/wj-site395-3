## 项目自动化工作流概述
> 基于当前项目, 利用本地node.js+cloudflare workers中的api接口来更新`data`文件夹下的`index.cjs`,入参是网站的关键词和更新指令.

### 步骤详解
#### 1.执行脚本获取核心关键词和入参
* 询问用户是否有输入的关键词
  * 如果用户回答有并输入, 那么获取到关键词
  * 如果用户回答没有
    * 让用户指定`data/prompt/content_direction.json`文件中所属id的英文关键词,获取到关键词展示到终端, 并更新所在对象.is_used的值为true
    * 用户没有指定, 则遍历`data/prompt/content_direction.json`文件, 展示并使用第一个`is_used`值为false的关键词
      * 如果所有关键词都已使用(is_used=true), 提示用户重置或添加新关键词
      * 显示当前可用关键词数量和已使用数量
* 获取更新的prompt, 获取`data/prompt/index_prompt.md`指令当作更新`index.cjs`的模板指令


#### 2.发送请求到cloudflare workers中调用ai接口
* 脚本获取到关键词和模板指令以后,触发接口调用
* 调用cloudflare workers中的api接口, 利用ai的返参来更新`data/index.cjs`中的`siteSEOInfo`和`categories`值
* **错误处理**：
  * API调用失败时重试3次，间隔5秒
  * 验证返回数据格式的完整性
  * 备份原始`index.cjs`文件


#### 3.生成图片
利用返参数据中的`categories`中每一项的`image_prompt`来调用cloudflare workers中的接口, 名称使用对象中的`slug`字段值命名, 然后保存至本地文件夹`public/images/categories`下
* **验证步骤**：
  * 检查`public/images/categories`目录是否存在，不存在则创建
  * 验证每个图片是否成功下载和保存
  * 记录生成失败的图片列表供手动处理

#### 4.验证和日志
* 验证更新后的`index.cjs`文件语法正确性
* 记录本次更新的详细日志到`logs/workflow_YYYYMMDD_HHMMSS.log`
* 显示更新摘要：关键词、分类数量、图片生成状态

#### 5.配置管理
* API接口地址和认证信息从环境变量或配置文件读取
* 支持开发/生产环境的不同配置
* 超时时间、重试次数等参数可配置