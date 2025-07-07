工作流概述:
我现在要实现这么一个事情, 写一个脚本node.js:
  - 提示用户输入网站名称(默认不能包含数字),网站数量(默认为0). 
  - 然后生成网站名称的数组. 例如用户输入wj-site.
    - 数量为0的话, 数组就是['wj-site0']
    - 数量为n的话, 数组就是['wj-site0', 'wj-site1', ...,'wj-siten']
  - 获取根目录下的[content_direction.json]文件
    - 遍历json对象中的contentDirections,获取每个对象的'id','name','name_zh'
    - 提示用户输入选择哪个id项目
    - 用户输入数字以后, 获取这个id对象的字段'subDirections'中'is_used'为false的项,生成一个数组,将这个数组及数量打印到终端上
    - 根据刚才用户输入的网站数量数值, 与subDirections中条件数组长度比较,
      - 如果subDirections中条件数组大于等于网站数量
        - 更新subDirections中的条件数组,给每一个对象绑定新的key值:'bind-site-name', value是就是网站名称
        - 每个对象的字段'is_used'的value更新为布尔值true
      - 如果subDirections中的条件数组小于网站数量
        - 终端输出两个数量的对比
        - 更新网站名称数组,删除多余的数量
        - 更新subDirections中的条件数组, 给每一个对象绑定新的key值,'bind-site-name', value值是网站名称
      -



     将一个网站模板稍微配置一下(文件夹名称, 仓库名称, 关键词), 然后



本工作流用来描述项目的初始化及部署到github, cloudflare上的步骤及各步骤中的要求.
使用node.js来衔接各个阶段.


一. 本地输入
执行脚本, 提示用户输出创建的用户数量





一. 本地更新步骤:

1.使用当前nuxt项目当作模板, 根据项目根目录下'data/prompt/index_prompt.md'指令的要求, 和'data/prompt/content_direction.json'中外部, 来更新'data/index.cjs'文件

2.当第一步完成以后, 然后执行本地脚本'update-categoriesJson-and-rename-categoriesImg'来更新'content/categories/index.json'文件和'public/images/categories'下的图片名称

3.本地项目中


二.更新本地git信息
0.如果存在.git文件,先删除
1.'git init'初始化当前仓库
2.请求用户输入名称数组, 例如[wj-site20]
3.根据名称数组,来对每个仓库设置远程地址: git remote add origin https://github.com/wjspark/[wj-site20].git

4.git branch -M main 更改分支名称为main



三.创建github仓库
1.根据设置的仓库名称, 远程在目标github仓库上创建仓库
2.设置仓库的action中的一些权限
3.设置仓库的变量和私密变量


四.推送仓库
1.推送本地仓库到远程
2.触发工作流执行
3.工作流完成以后, 部署项目到cloudflare pages上

