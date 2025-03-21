'use strict';

const axios = require('axios')
const config = require('./config')

exports.main = async (event, context) => {
	const { imageUrl } = event
	
	try {
		console.log('开始处理图片分析请求...')
		console.log('图片URL:', imageUrl)
		console.log('API配置:', {
			baseUrl: config.API_BASE,
			model: config.MODEL.NAME,
			hasApiKey: !!config.API_KEY
		})

		// 调用 Yi Vision API
		console.log('开始调用 Yi Vision API...')
		const response = await axios.post(`${config.API_BASE}/chat/completions`, {
			model: config.MODEL.NAME,
			messages: [
				{
					role: 'user',
					content: [
						{
							type: 'text',
							text: '请分析这张医疗图像，注意可能的异常区域。'
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
			timeout: 180000  // 增加到3分钟
		})
		
		console.log('API响应状态:', response.status)
		
		if (response.data && response.data.choices && response.data.choices[0]) {
			return {
				code: 0,
				content: response.data.choices[0].message.content
			}
		} else {
			throw new Error('无效的 API 响应')
		}
	} catch (error) {
		console.error('调用 Yi Vision API 失败:', error)
		if (error.response) {
			console.error('错误响应:', error.response.data)
		}
		return {
			code: -1,
			error: (error.response?.data?.error?.message || error.message) || '图片分析失败'
		}
	}
}
