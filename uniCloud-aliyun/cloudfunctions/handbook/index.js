'use strict';
const db = uniCloud.database()
const handbookDB = db.collection('handbook')

exports.main = async (event, context) => {
	const { action, data } = event
	
	switch (action) {
		case 'getList':
			return await getList(data)
		case 'getDetail':
			return await getDetail(data)
		case 'increaseViewCount':
			return await increaseViewCount(data)
		default:
			return {
				code: 404,
				msg: '未找到对应的方法'
			}
	}
}

// 获取列表
async function getList(data) {
	const { category, page = 1, pageSize = 10 } = data
	let query = {}
	
	if (category) {
		query.category = category
	}
	
	try {
		const list = await handbookDB
			.where(query)
			.skip((page - 1) * pageSize)
			.limit(pageSize)
			.orderBy('update_time', 'desc')  
			.get()
			
		const total = await handbookDB
			.where(query)
			.count()
			
		return {
			code: 0,
			msg: 'success',
			data: {
				list: list.data,
				total: total.total,
				page,
				pageSize
			}
		}
	} catch (e) {
		console.error('获取列表失败:', e)
		return {
			code: 500,
			msg: '获取列表失败'
		}
	}
}

// 获取详情
async function getDetail(data) {
	const { id } = data
	
	if (!id) {
		return {
			code: 400,
			msg: '缺少必要参数'
		}
	}
	
	try {
		const detail = await handbookDB.doc(id).get()
		
		return {
			code: 0,
			msg: 'success',
			data: detail.data[0]
		}
	} catch (e) {
		return {
			code: 500,
			msg: '获取详情失败'
		}
	}
}

// 增加浏览次数
async function increaseViewCount(data) {
	const { id } = data
	
	if (!id) {
		return {
			code: 400,
			msg: '缺少必要参数'
		}
	}
	
	try {
		await handbookDB.doc(id).update({
			view_count: db.command.inc(1)
		})
		
		return {
			code: 0,
			msg: 'success'
		}
	} catch (e) {
		return {
			code: 500,
			msg: '更新浏览次数失败'
		}
	}
}
