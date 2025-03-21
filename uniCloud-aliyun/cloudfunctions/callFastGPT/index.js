'use strict';

const axios = require('axios')
const config = require('./config')

exports.main = async (event, context) => {
	const { messages } = event
	
	try {
		// 调用 FastGPT API
		const response = await axios.post(`${config.CHAT_API_BASE}/chat/completions`, {
			model: config.MODEL.NAME,
			messages: [
				{
					role: 'system',
					content: config.SYSTEM_PROMPT
				},
				...messages
			],
			temperature: 0.7,
			max_tokens: config.REPLY_LIMIT.MAX_TOKENS
		}, {
			headers: {
				'Authorization': `Bearer ${config.CHAT_API_KEY}`,
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
		console.error('调用 FastGPT API 失败:', error)
		return {
			code: -1,
			error: error.message || '对话生成失败'
		}
	}
}
