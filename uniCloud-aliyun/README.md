我来帮你创建一个项目的 README.md 文件：

```markdown:/Users/qinxiaoqiang/Downloads/uniapp-miniapp/xiaoyibao/README.md
# 小胰宝 - 胰腺癌智能问答助手

## 项目简介
小胰宝是一个基于多模型AI技术的，服务胰腺肿瘤患者的智能问答助手，为患者及其家属提供专业、可靠的胰腺癌相关信息咨询服务。

## 主要功能
- 💬 智能问答：回答胰腺癌相关问题
- 🖼️ 医学影像分析：支持CT、核磁等医学影像的智能分析
- 🏥 就医指导：提供就医建议和注意事项
- ⚕️ 专业解答：基于医学知识库的专业咨询服务

## 技术架构
- 前端：uni-app
- 后端：uniCloud
- AI模型：
  - 文本对话：FastGPT
  - 图像分析：多模型协同（FastGPT Vision/Stepfun Vision/Yi Vision）

## 环境配置
1. 复制环境变量模板文件：
```bash
cp .env.example .env
```

2. 配置必要的环境变量：
```plaintext
# FastGPT API配置
FASTGPT_API_BASE=your_fastgpt_api_base_url
FASTGPT_API_KEY=your_fastgpt_api_key

# Yi Vision API配置
YI_VISION_API_BASE=your_yi_vision_api_base_url
YI_VISION_API_KEY=your_yi_vision_api_key

# Stepfun API配置
STEPFUN_API_BASE=your_stepfun_api_base_url
STEPFUN_API_KEY=your_stepfun_api_key
```

## 开发说明
1. 安装依赖
```bash
npm install
```

2. 本地开发
```bash
npm run dev
```

3. 发布部署
```bash
npm run build
```

## 宝典页面配置说明

### 数据结构
宝典内容存储在`handbook`集合中，主要字段包括：
- title: 文章标题
- desc: 文章描述
- content: 文章内容
- category: 分类（all/mustread/science/complication/treatment）
- source: 内容来源（manual/feishu）
- url: 外部链接
- view_count: 浏览次数

### 内容管理方式
1. 手动添加
   - 在`handbook-content.json`中配置静态内容
   - 通过`handbook-init`云函数初始化基础内容

2. 飞书文档同步
   - 配置飞书文档空间信息
   - 使用`handbook-sync`云函数自动同步文档
   - 支持增量更新和文档版本管理

### 注意事项
- 请确保 API Key 等敏感信息不要提交到代码仓库
- 医学建议仅供参考，具体诊疗请遵医嘱
- 图像分析结果需要专业医生进行确认

## 许可证
MIT License

## 联系方式
- 技术支持：[service@xiaoyibao.com.cn](mailto:service@xiaoyibao.com.cn)
- 官方网站：[https://www.xiaoyibao.com.cn](https://www.xiaoyibao.com.cn)
```

这个 README.md 包含了项目的基本信息、功能特点、技术架构、环境配置、开发说明等重要信息，可以帮助其他开发者快速了解和上手项目。如果需要添加或修改其他内容，请告诉我。