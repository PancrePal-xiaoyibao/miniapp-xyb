'use strict';

const db = uniCloud.database()
const dbCmd = db.command

exports.main = async (event, context) => {
	const { action, data } = event
	
	switch (action) {
		case 'getLatestData':
			return await getLatestData(context)
		case 'getAlertList':
			return await getAlertList(data)
		case 'getAlertDetail':
			return await getAlertDetail(data)
		case 'updateCondition':
			return await updateCondition(data)
		case 'updateTreatment':
			return await updateTreatment(data)
		default:
			return {
				code: -1,
				msg: '未知的操作类型'
			}
	}
}

// 获取最新数据
async function getLatestData(context) {
	try {
		const userId = context.USERID // 从 context 中获取用户 ID
		
		// 获取最新的提醒
		const alertsResult = await db.collection('disease_alerts')
			.where({
				userId,
				status: 'active'
			})
			.orderBy('createTime', 'desc')
			.limit(5)
			.get()
			
		// 获取最新的病情记录
		const conditionResult = await db.collection('disease_conditions')
			.where({
				userId
			})
			.orderBy('createTime', 'desc')
			.limit(1)
			.get()
			
		// 获取最新的治疗方案
		const treatmentResult = await db.collection('disease_treatments')
			.where({
				userId
			})
			.orderBy('createTime', 'desc')
			.limit(1)
			.get()
			
		return {
			code: 0,
			data: {
				alerts: alertsResult.data,
				latestCondition: conditionResult.data[0]?.content || '',
				treatment: treatmentResult.data[0] || null
			}
		}
	} catch (e) {
		console.error(e)
		return {
			code: -1,
			msg: '获取数据失败'
		}
	}
}

// 获取提醒列表
async function getAlertList(data) {
	const { userId, page = 1, pageSize = 20 } = data
	
	try {
		const result = await db.collection('disease_alerts')
			.where({
				userId,
				status: 'active'
			})
			.orderBy('createTime', 'desc')
			.skip((page - 1) * pageSize)
			.limit(pageSize)
			.get()
			
		return {
			code: 0,
			data: result.data
		}
	} catch (e) {
		console.error(e)
		return {
			code: -1,
			msg: '获取提醒列表失败'
		}
	}
}

// 获取提醒详情
async function getAlertDetail(data) {
	const { alertId } = data
	
	try {
		const result = await db.collection('disease_alerts')
			.doc(alertId)
			.get()
			
		return {
			code: 0,
			data: result.data
		}
	} catch (e) {
		console.error(e)
		return {
			code: -1,
			msg: '获取提醒详情失败'
		}
	}
}

// 更新病情记录
async function updateCondition(data) {
	const { userId, content } = data
	
	try {
		await db.collection('disease_conditions')
			.add({
				userId,
				content,
				createTime: Date.now()
			})
			
		return {
			code: 0,
			msg: '更新成功'
		}
	} catch (e) {
		console.error(e)
		return {
			code: -1,
			msg: '更新病情记录失败'
		}
	}
}

// 更新治疗方案
async function updateTreatment(data) {
	const { userId, plan, effect, advice } = data
	
	try {
		await db.collection('disease_treatments')
			.add({
				userId,
				plan,
				effect,
				advice,
				createTime: Date.now()
			})
			
		return {
			code: 0,
			msg: '更新成功'
		}
	} catch (e) {
		console.error(e)
		return {
			code: -1,
			msg: '更新治疗方案失败'
		}
	}
}
