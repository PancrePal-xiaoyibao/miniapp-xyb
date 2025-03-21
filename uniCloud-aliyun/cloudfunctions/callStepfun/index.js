'use strict';

const axios = require('axios')
const config = require('./config')

exports.main = async (event, context) => {
    const { imageUrl, message = '用优雅的语言描述这张图片' } = event
    
    try {
        console.log('开始处理图片分析请求...')
        console.log('图片URL:', imageUrl)
        
        // 调用 Stepfun Vision API
        const response = await axios.post(`${config.API_BASE}/chat/completions`, {
            model: config.MODEL.NAME,
            messages: [
                {
                    role: 'system',
                    content: config.SYSTEM_PROMPT
                },
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
                'Authorization': `Bearer ${config.API_KEY}`,
                'Content-Type': 'application/json'
            },
            timeout: 180000  // 3分钟超时
        })
        
        if (response.data && response.data.choices && response.data.choices[0]) {
            return {
                code: 0,
                content: response.data.choices[0].message.content
            }
        } else {
            throw new Error('无效的 API 响应')
        }
    } catch (error) {
        console.error('调用 Stepfun Vision API 失败:', error)
        if (error.response) {
            console.error('错误响应:', error.response.data)
        }
        return {
            code: -1,
            error: (error.response?.data?.error?.message || error.message) || '图片分析失败'
        }
    }
}