# 小胰宝 - 胰腺肿瘤病友宝典

## 项目介绍
小胰宝是一款专注于胰腺肿瘤患者的智能医疗助手应用，提供疾病管理、AI智能问答、医学知识库等功能。

## 环境配置

### 1. 环境变量配置
项目使用.env文件管理环境变量，支持不同环境配置：

```bash
# 开发环境
.env.development

# 生产环境
.env.production
```

环境变量配置说明：
- 开发环境默认开启debug模式，超时时间180秒
- 生产环境关闭debug模式，超时时间120秒
- 不同环境可配置不同的重试次数

### 2. 配置文件说明

#### 2.1 基础配置
复制`config/config.template.json`到`config/config.json`，并根据实际情况修改配置：

```json
{
    "ai": {
        "chat": {
            "base_url": "https://api.example.com",
            "api_key": "your_chat_api_key",
            "model": "gpt-3.5-turbo",
            "timeout": 300000,
            "system_prompt": "你是一个专业的胰腺癌医疗助手，名字叫小胰宝。"
        },
        "vision": {
            "base_url": "https://api.example.com",
            "api_key": "your_vision_api_key",
            "model": "yi-vision-v2",
            "max_tokens": 1024,
            "timeout": 300000
        }
    },
    "feishu": {
        "base_url": "https://open.feishu.cn/open-apis",
        "app_id": "your_app_id",
        "app_secret": "your_app_secret"
    }
}
```

#### 2.2 云函数配置
在`uniCloud-aliyun/cloudfunctions`目录下的云函数也需要相应配置：

1. 复制`handbook-sync/config.template.json`到`handbook-sync/config.json`
2. 配置飞书文档同步相关参数
3. 配置AI服务接口参数

## 使用说明

### 1. 安装依赖
```bash
npm install
```

### 2. 开发调试
```bash
# 运行开发环境
npm run dev
```

### 3. 生产部署
```bash
# 构建生产环境
npm run build
```

### 4. 注意事项
- 请确保将所有敏感配置信息（如API密钥）添加到.env文件中，并将.env文件添加到.gitignore
- config.json文件包含敏感信息，确保不要提交到代码仓库
- 建议在生产环境中使用环境变量或密钥管理服务来管理敏感信息

## 技术支持
- 邮箱：service@xiaoyibao.com.cn
- 官网：https://www.xiaoyibao.com.cn

## 许可证
MIT License