我想做一个美观的房屋缺陷资料网页html，希望是一个单页面应用，所有的东西使用cdn或者不需要复杂的框架方法来实现

这个设计包含房屋缺陷的浏览、搜寻、管理、浏览，这个房屋检查系统设计如下：
整体界面设计
1. 顶部导航栏
左侧：Logo + "房屋检查系统"标题
中间：搜索框（支持关键词搜索）
右侧：新增缺陷按钮 + 用户头像
2. 左侧标签筛选面板(标签管理系统)
工艺
[砌筑 ×] [抹灰 ×] [防水 ×] 
[木作 ×] [油漆 ×] [+ 新增]
位置
[主卧 ×] [客厅 ×] [厨房 ×]
[卫生间 ×] [阳台 ×] [+ 新增]
部位
[墙面 ×] [地面 ×] [天花 ×]
[门窗 ×] [踢脚线 ×] [+ 新增]

3. 缺陷卡片展示区
┌────────────────────────────────────────────────┐
│ 001 墙面裂缝                                  │
├────────────────────────────────────────────────┤
│ [缺陷照片缩略图]                              │
│                                                │
│ 标签：                                         │
│ [砌筑工艺] [客厅] [墙面] [高风险] [2024-03-20]│
│                                                │
│ [查看详情] [编辑] [删除]                      │
└────────────────────────────────────────────────┘
4. 缺陷详情页
缺陷详情

基础信息：
- 编号：001
- 缺陷名称：墙面裂缝
- 工艺：砌筑工艺
- 位置：客厅
- 部位：墙面
- 风险程度：高风险
- 更新时间：2024-03-20

缺陷信息：
- 描述：墙面开裂，裂缝宽度约0.3mm...
- 照片：[照片展示区，支持多张]

示范信息：
- 描述：正确的墙面施工方法...
- 照片：[照片展示区，支持多张]

规范信息：
- 描述：根据XX规范第X条...
- 照片：[照片展示区，支持多张]

[返回列表] [编辑] [删除]

5. 新增/编辑缺陷表单
新增缺陷

基础信息：
- 编号：[自动生成]
- 缺陷名称：[文本框]
- 工艺：[下拉选择]
- 位置：[选择标签]
- 部位：[选择标签]
- 风险程度：[低/中/高风险]

缺陷信息：
- 描述：[文本框]
- 照片：[拖拽上传区域]

示范信息：
- 描述：[文本框]
- 照片：[拖拽上传区域]

规范信息：
- 描述：[文本框]
- 照片：[拖拽上传区域]

[取消] [保存]

6. 卡片设计
圆角边框
轻微阴影效果
悬停时微微上浮
照片缩略图固定比例
标签设计
圆角胶囊形状
图标+文字组合
删除按钮悬停显示
点击效果反馈
交互设计
平滑过渡动画
加载状态提示
操作成功/失败提示
删除确认对话框
7. 功能特点

8. 简单直观的标签管理
清晰的信息层级展示
便捷的照片上传和预览
响应式布局适配
实时搜索和筛选
数据导出功能
这个设计注重：
1. 视觉美观：现代简约风格紧凑
操作便捷：减少操作步骤
信息清晰：重要信息突出显示
功能完整：满足所有基本需求
排查容易：丰富的debug信息帮助排查错误

8. 视觉层次
9. 标签样式区分
工艺标签：蓝色底
位置标签：浅蓝色底
部位标签：灰色底
风险等级：黄色底（醒目警示）
时间标签：浅灰色底
2. 圆角设计
卡片圆角
标签胶囊形状
按钮圆角统一
4. 配色方案
主背景：纯白色
左侧导航：浅灰背景
标签：不同类别使用不同色系
文字层次：深灰到浅灰
5. 间距规范
卡片间距统一
内容区域留白充足
标签之间适当间距
分类组之间明确间隔
6. 交互设计
添加按钮使用虚线框
标签可点击样式
视图切换按钮
悬停效果
7. 图标运用
功能图标简洁明了
分类图标统一风格
视图切换图标直观
8. 响应式考虑
网格布局自适应
卡片宽度弹性调整
图片等比例缩放
9. 细节处理
图片展示区统一比例
文字截断处理（...）
时间格式统一
编号格式规范
这种设计风格：
简洁现代
层次分明
3. 信息清晰
操作直观
视觉统一 