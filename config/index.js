// 导入配置文件
const config = require('./config.json');

// 转换配置格式以保持兼容性
module.exports = {
  // 全局配置参数
  AI: {
    // 腾讯云配置
    ENV: config.cloud.env,
    
    // 文本对话 API 配置
    CHAT_API_BASE: config.ai.chat.base_url,
    CHAT_API_KEY: config.ai.chat.api_key,
    CHAT_MODEL: config.ai.chat.model,
    
    // 图像分析 API 配置
    YI_VISION_API_BASE: config.ai.vision.base_url,
    YI_VISION_API_KEY: config.ai.vision.api_key,
    YI_VISION_MODEL: config.ai.vision.model,
    
    // 模型配置
    MODEL: {
      CHAT: {
        PROVIDER: 'fastgpt',
        NAME: 'gpt-3.5-turbo'
      },
      VISION: {
        PROVIDER: '01-ai',
        NAME: 'yi-vision'
      }
    },
    
    // AI人设配置
    PERSONA: {
      DEFAULT: {
        name: '小胰宝',
        role: '专业的胰腺癌医疗助手',
        description: '专注于胰腺癌相关问题的AI助手，为患者及家属提供专业的医疗建议和支持。'
      }
    },

    // 系统提示词
    SYSTEM_PROMPTS: {
      DEFAULT: `你是一个专业的胰腺癌医疗助手，名字叫小胰宝。你需要：
1. 用专业但平易近人的语气回答问题
2. 回答要简洁明了，重点突出
3. 对于治疗方案，要强调需要在医生指导下进行
4. 对于症状描述，要建议及时就医检查
5. 始终保持关怀和同理心
6. 不要做出确定的诊断
7. 如果不确定，要诚实地表示不确定
8. 每次回答都要包含就医建议
9. 拒绝与医疗无关的问题，专注于胰腺癌相关咨询`,
      
      IMAGE: `你是一个专业的医疗影像分析助手。在分析医疗图像时，你需要：
1. 客观描述图像内容和特征
2. 指出可能需要关注的区域
3. 建议就医进行专业检查和诊断
4. 不要做出确定的诊断结论
5. 保持专业和谨慎的态度
6. 强调需要专业医生的进一步解读`
    }
  },

  // 飞书配置
  FEISHU: {
    BASE_URL: config.feishu.base_url,
    APP_ID: config.feishu.app_id,
    APP_SECRET: config.feishu.app_secret,
    WIKI_SPACE_ID: config.feishu.wiki_space_id,
    REFRESH_INTERVAL: config.feishu.refresh_interval
  },

  // 云开发配置
  CLOUD: {
    ENV: config.cloud.env, // 云开发环境ID
    STORAGE: {
      MEDICAL_IMAGES: 'medical_images/', // 医疗图片存储路径
      MAX_SIZE: 10 * 1024 * 1024, // 最大文件大小（10MB）
    },
    COLLECTIONS: {
      USERS: 'users',
      CHAT_HISTORY: 'chat_history',
      DISEASE_RECORDS: 'disease_records',
      APPOINTMENTS: 'appointments',
      HANDBOOK: 'handbook'
    }
  },

  // 疾病管理配置
  DISEASE_MGMT: {
    // 疾病类型
    TYPES: {
      PANCREATIC_CANCER: '胰腺癌',
      PANCREATITIS: '胰腺炎',
      OTHER: '其他'
    },
    // 症状严重程度
    SEVERITY: {
      LOW: '轻度',
      MEDIUM: '中度',
      HIGH: '重度'
    },
    // 治疗阶段
    STAGES: {
      DIAGNOSIS: '诊断阶段',
      TREATMENT: '治疗阶段',
      FOLLOW_UP: '随访阶段',
      RECOVERY: '康复阶段'
    }
  },

  // 手册配置
  HANDBOOK: {
    // 手册分类
    CATEGORIES: config.handbook.categories,
    // 文档列表
    DOCUMENTS: [
      {
        title: '2024CSCO10MB胰腺癌诊疗指南',
        desc: '最新版胰腺癌诊疗指南，包含最新的治疗方案和建议',
        url: 'https://docs.qq.com/pdf/DRnNpclFSYW1ub3Ju',
        category: 'mustread',
        isNew: true
      },
      {
        title: '2022版胰腺癌诊疗指南',
        desc: '中国胰腺癌诊疗指南2022版',
        url: 'https://docs.qq.com/pdf/DRllhdklBSmZDWUxo',
        category: 'mustread'
      },
      {
        title: 'NCCN胰腺癌患者手册',
        desc: '权威的患者指导手册，帮助理解疾病和治疗',
        url: 'https://docs.qq.com/pdf/DRkVQTUNoQkpSaFVU',
        category: 'mustread'
      },
      {
        title: '2024CSCO肿瘤相关性贫血临床实践指南',
        url: 'https://docs.qq.com/pdf/DRkNIR3RXUWNxaFlJ',
        category: 'treatment'
      },
      {
        title: '2024CSCO抗肿瘤药物相关肝损伤诊疗指南',
        url: 'https://docs.qq.com/pdf/DRnlMZm9ackRTbnRk',
        category: 'treatment'
      },
      {
        title: '中国腹膜后肿瘤诊治专家共识（2019版）',
        url: 'https://mp.weixin.qq.com/s/6N6UI3F3NwWeT2KQ8IBxmA',
        category: 'treatment'
      },
      {
        title: '肿瘤放射治疗质量安全评价标准指南',
        url: 'https://docs.qq.com/pdf/DRnNGdUpmcWNzbkVy',
        category: 'treatment'
      },
      {
        title: '中国胰腺实性肿瘤影像学诊断报告规范循证学指南',
        url: 'https://mp.weixin.qq.com/s/pGXkTvkl_RyiHsZlYZAlGw',
        category: 'treatment'
      },
      {
        title: '肝胆胰恶性肿瘤腹腔化疗专家共识（2020版）',
        url: 'https://mp.weixin.qq.com/s/Pe4sD3iKHlIiPflImBr7Jwv',
        category: 'treatment'
      },
      {
        title: '中国腹腔热灌注化疗技术临床应用专家共识',
        url: 'https://mp.weixin.qq.com/s/ayNYT-_EV6cWToBXWariTA',
        category: 'treatment'
      },
      {
        title: '晚期胰腺癌介入治疗临床操作指南（试行）（第六版)',
        url: 'https://docs.qq.com/pdf/DRlBtT0JVYlNoV1JO',
        category: 'treatment'
      },
      {
        title: '肠肿瘤腹腔灌注化疗并发症防治中国专家共识（2022版）',
        url: 'https://mp.weixin.qq.com/s/ZoXT0qx_knOFyMY9M6eSaQ',
        category: 'treatment'
      },
      {
        title: '癌症相关性疼痛评估中国专家共识（2023 版）',
        url: 'https://mp.weixin.qq.com/s/nLnNfvH8C95PmS7DzwmzAA',
        category: 'treatment'
      },
      {
        title: '腹腔镜或机器人辅助胰腺癌根治术中国专家共识（2022版)',
        url: 'https://docs.qq.com/pdf/DRlNwZmtPckRLRGFG',
        category: 'treatment'
      },
      {
        title: '恶性肿瘤患者康复期营养管理专家共识(2023版)',
        url: 'https://mp.weixin.qq.com/s/1NNep0hsYqxo9uW21ahwmg',
        category: 'nutrition'
      },
      {
        title: '中国成人患者肠外肠内营养临床应用指南（2023版）',
        url: 'https://mp.weixin.qq.com/s/HhglOAwBOMQfQL1Dsaoklg',
        category: 'nutrition'
      },
      {
        title: '血栓性血小板减少性紫癜诊断与治疗中国指南（2022年版）',
        url: 'https://mp.weixin.qq.com/s/Blulth4tjx0p_n4rzfiM1g',
        category: 'complication'
      },
      {
        title: '恶性肠梗阻治疗中国专家共识(2023年)',
        url: 'https://mp.weixin.qq.com/s/DmmYLK9Ln8a4QO_kHfegPA',
        category: 'complication'
      }
    ],
    // 更新频率（天）
    UPDATE_INTERVAL: 7,
    // 文档类型
    DOC_TYPES: {
      PDF: 'pdf',
      WECHAT: 'wechat'
    }
  },

  // 用户配置
  USER: {
    // 消息历史记录配置
    CHAT_HISTORY: {
      MAX_LENGTH: 100,    // 最大保存消息数
      EXPIRE_DAYS: 30,    // 消息过期天数
    },
    // 用户设置
    SETTINGS: {
      DEFAULT_PERSONA: 'DEFAULT',
      ENABLE_VOICE: true,
      ENABLE_IMAGE: true,
      AUTO_SAVE_HISTORY: true,
      MAX_HISTORY: 100
    },
    // 用户角色
    ROLES: {
      ADMIN: 'admin',
      DOCTOR: 'doctor',
      PATIENT: 'patient',
      FAMILY: 'family'
    }
  },

  // 界面配置
  UI: {
    // 聊天界面配置
    CHAT: {
      MAX_INPUT_LENGTH: config.ui.chat.max_input_length,
      MESSAGE_PAGE_SIZE: config.ui.chat.message_page_size,
      TYPING_INDICATOR: '正在思考中...',
      LOADING_TEXT: '正在思考中...',
      ERROR_MESSAGE: '抱歉，AI响应失败，请稍后重试'
    },
    // 主题颜色
    COLORS: {
      PRIMARY: '#4CAF50',
      SECONDARY: '#2196F3',
      ERROR: '#F44336',
      WARNING: '#FFC107',
      SUCCESS: '#8BC34A',
      INFO: '#00BCD4'
    },
    // 页面路由
    ROUTES: {
      HOME: '/pages/index/index',
      CHAT: '/pages/ai-chat/chat',
      DISEASE: '/pages/disease-mgmt/disease',
      HANDBOOK: {
        LIST: '/pages/handbook/index',
        DETAIL: '/pages/handbook/detail',
        DOCUMENT: '/pages/handbook/document/index'
      },
      PRIVACY: '/pages/privacy/privacy',
      ADMIN: '/pages/admin/admin'
    },
    // 分享配置
    SHARE: {
      DEFAULT_TITLE: '小胰宝 - 您的胰腺健康助手',
      DEFAULT_PATH: '/pages/index/index',
      HANDBOOK: {
        TITLE: '胰腺健康知识手册',
        PATH: '/pages/handbook/index'
      }
    }
  },

  // 版本信息
  VERSION: {
    NUMBER: '1.0.0',
    BUILD: '20240204',
    ENV: process.env.NODE_ENV || 'production'  // 'development' | 'staging' | 'production'
  }
}
