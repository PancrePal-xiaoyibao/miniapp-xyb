'use strict';

const axios = require('axios')
const { getActiveVisionService } = require('../common/visionConfig')

const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1秒

async function retryRequest(fn, retries = MAX_RETRIES) {
    try {
        return await fn()
    } catch (error) {
        if (retries > 0 && error.response?.status >= 500) {
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY))
            return retryRequest(fn, retries - 1)
        }
        throw error
    }
}

exports.main = async (event, context) => {
    const { imageUrl, message = '请分析这张医疗图像，注意可能的异常区域。' } = event
    
    try {
        const visionService = getActiveVisionService()
        console.log('使用视觉服务:', visionService.type)
        
        const response = await retryRequest(() => 
            axios.post(`${visionService.apiBase}/chat/completions`, {
                model: visionService.model,
                messages: [
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'text',
                                text: message
                            },
                            {
                                type: 'image_url',
                                image_url: {
                                    url: imageUrl
                                }
                            }
                        ]
                    }
                ]
            }, {
                headers: {
                    'Authorization': `Bearer ${visionService.apiKey}`,
                    'Content-Type': 'application/json'
                },
                timeout: 180000
            })
        )
        
        // 验证响应数据结构
        if (!response.data?.choices?.[0]?.message?.content) {
            throw new Error('无效的 API 响应格式')
        }

        return {
            code: 0,
            content: response.data.choices[0].message.content,
            service: visionService.type
        }
    } catch (error) {
        console.error('图像分析失败:', error)
        return {
            code: -1,
            error: error.message || '图像分析失败',
            service: error.service
        }
    }
}