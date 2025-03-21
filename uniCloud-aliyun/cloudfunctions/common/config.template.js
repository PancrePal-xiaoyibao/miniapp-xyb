// 配置模板文件
module.exports = {
    AI: {
        // FastGPT
        FASTGPT: {
            API_BASE: process.env.FASTGPT_API_BASE,
            API_KEY: process.env.FASTGPT_API_KEY
        },
        // Yi Vision
        YI: {
            API_BASE: process.env.YI_VISION_API_BASE,
            API_KEY: process.env.YI_VISION_API_KEY
        },
        // Stepfun
        STEPFUN: {
            API_BASE: process.env.STEPFUN_API_BASE,
            API_KEY: process.env.STEPFUN_API_KEY
        }
    }
}