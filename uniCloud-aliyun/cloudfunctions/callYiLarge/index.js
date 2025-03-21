'use strict';

const axios = require('axios')
const config = require('../../../config/index')

exports.main = async (event, context) => {
	const { message, persona = 'DEFAULT' } = event
	
	try {
		// 调用 FastGPT API
		const response = await axios.post(`${config.AI.CHAT_API_BASE}/chat/completions`, {
			model: config.AI.MODEL.CHAT.NAME,
			messages: [
				{
					role: 'system',
					content: config.AI.SYSTEM_PROMPTS.DEFAULT
				},
				{
					role: 'user',
					content: message
				}
			],
			temperature: 0.7,
			max_tokens: config.AI.REPLY_LIMIT.MAX_TOKENS
		}, {
			headers: {
				'Authorization': `Bearer ${context.env.CHAT_API_KEY || config.AI.CHAT_API_KEY}`,
				'Content-Type': 'application/json'
			}
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
		console.error('调用 AI 模型失败:', error)
		return {
			code: -1,
			error: error.message || '请求失败'
		}
	}
}
