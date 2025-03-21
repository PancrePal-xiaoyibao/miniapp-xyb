'use strict';
const db = uniCloud.database()
const dbCmd = db.command

exports.main = async (event, context) => {
	const handbookCollection = db.collection('handbook')
	
	// 指南文档数据
	const guides = [
		{
			title: '2024CSCO10MB胰腺癌诊疗指南',
			description: '最新版胰腺癌诊疗指南，包含最新的治疗方案和建议',
			category: '诊疗指南',
			link: 'https://docs.qq.com/pdf/DRnNpclFSYW1ub3Ju',
			cover: '/static/images/guide-icon.png',
			create_date: Date.now(),
			view_count: 0,
			sort: 100 // 排序权重，数字越大越靠前
		},
		{
			title: '2022版胰腺癌诊疗指南',
			description: '中国胰腺癌诊疗指南2022版',
			category: '诊疗指南',
			link: 'https://docs.qq.com/pdf/DRllhdklBSmZDWUxo',
			cover: '/static/images/guide-icon.png',
			create_date: Date.now(),
			view_count: 0,
			sort: 90
		},
		{
			title: 'NCCN胰腺癌患者手册',
			description: '权威的患者指导手册，帮助理解疾病和治疗',
			category: '诊疗指南',
			link: 'https://docs.qq.com/pdf/DRkVQTUNoQkpSaFVU',
			cover: '/static/images/guide-icon.png',
			create_date: Date.now(),
			view_count: 0,
			sort: 80
		}
	]
	
	// 治疗方案数据
	const treatments = [
		{
			title: 'FOLFIRINOX方案',
			category: '治疗方案',
			link: 'https://docs.qq.com/pdf/DRmZYVHFOY2pOZXVY',
			cover: '/static/images/treatment-icon.png',
			create_date: Date.now(),
			view_count: 0,
			sort: 70
		},
		{
			title: 'AG方案',
			category: '治疗方案',
			link: 'https://docs.qq.com/pdf/DRmxRdkZYY0VQWU1L',
			cover: '/static/images/treatment-icon.png',
			create_date: Date.now(),
			view_count: 0,
			sort: 60
		},
		{
			title: 'GS方案',
			category: '治疗方案',
			link: 'https://docs.qq.com/pdf/DRkFJc0VIWXRhRVVw',
			cover: '/static/images/treatment-icon.png',
			create_date: Date.now(),
			view_count: 0,
			sort: 50
		}
	]
	
	// 营养支持数据
	const nutrition = [
		{
			title: '营养支持方案',
			category: '营养支持',
			link: 'https://docs.qq.com/doc/DRmxWVkVQY0VEWU1p',
			cover: '/static/images/nutrition-icon.png',
			create_date: Date.now(),
			view_count: 0,
			sort: 40
		}
	]
	
	// 资源数据
	const resources = [
		{
			title: '胰腺癌术语解释',
			description: '常见医学术语中英文对照与解释',
			category: '其他资源',
			link: 'https://docs.qq.com/sheet/DRmRRY0VVY0VRSXZK',
			cover: '/static/images/guide-icon.png',
			create_date: Date.now(),
			view_count: 0,
			sort: 30
		}
	]
	
	// 合并所有数据
	const allData = [...guides, ...treatments, ...nutrition, ...resources]
	
	try {
		// 清空现有数据
		await handbookCollection.where({}).remove()
		
		// 批量插入新数据
		for (let item of allData) {
			await handbookCollection.add(item)
		}
		
		return {
			code: 0,
			msg: '初始化数据成功'
		}
	} catch (e) {
		return {
			code: -1,
			msg: '初始化数据失败',
			error: e
		}
	}
}
