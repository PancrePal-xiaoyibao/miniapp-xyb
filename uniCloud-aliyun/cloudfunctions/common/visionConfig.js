const config = {
    // FastGPT 配置
    fastgpt: {
        enabled: process.env.FASTGPT_API_KEY && process.env.FASTGPT_API_BASE,
        apiBase: process.env.FASTGPT_API_BASE,
        apiKey: process.env.FASTGPT_API_KEY,
        model: 'gpt-4-vision'
    },
    
    // Stepfun 配置
    stepfun: {
        enabled: process.env.STEPFUN_API_KEY && process.env.STEPFUN_API_BASE,
        apiBase: process.env.STEPFUN_API_BASE,
        apiKey: process.env.STEPFUN_API_KEY,
        model: 'step-1o-vision-32k'
    },
    
    // Yi Vision 配置
    yi: {
        enabled: process.env.YI_VISION_API_KEY && process.env.YI_VISION_API_BASE,
        apiBase: process.env.YI_VISION_API_BASE,
        apiKey: process.env.YI_VISION_API_KEY,
        model: 'yi-vision-v2'
    }
}

// 获取可用的视觉服务配置
function getActiveVisionService() {
    if (config.fastgpt.enabled) {
        return {
            type: 'fastgpt',
            ...config.fastgpt
        }
    }
    
    if (config.stepfun.enabled) {
        return {
            type: 'stepfun',
            ...config.stepfun
        }
    }
    
    if (config.yi.enabled) {
        return {
            type: 'yi',
            ...config.yi
        }
    }
    
    throw new Error('未配置任何可用的视觉服务')
}

module.exports = {
    config,
    getActiveVisionService
}