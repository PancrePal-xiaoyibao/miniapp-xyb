const db = uniCloud.database();
const collection = db.collection('chat_history');

exports.main = async (event, context) => {
	const { action, params } = event;
	
	switch (action) {
		case 'saveMessage':
			return await saveMessage(params);
		case 'getHistoryList':
			return await getHistoryList(params);
		case 'deleteHistory':
			return await deleteHistory(params);
		default:
			return {
				code: 404,
				msg: '未找到对应的方法'
			}
	}
}

// 保存消息
async function saveMessage(params) {
	const { userId, content, type = 'user' } = params;
	
	try {
		const res = await collection.add({
			user_id: userId,
			content,
			type,
			create_time: Date.now(),
			status: 1
		});
		
		return {
			code: 0,
			msg: '保存成功',
			data: res
		}
	} catch (e) {
		return {
			code: -1,
			msg: '保存失败',
			error: e
		}
	}
}

// 获取历史记录
async function getHistoryList(params) {
	const { userId, page = 1, pageSize = 20 } = params;
	
	try {
		const list = await collection
			.where({
				user_id: userId
			})
			.orderBy('create_time', 'desc')
			.skip((page - 1) * pageSize)
			.limit(pageSize)
			.get();
			
		return {
			code: 0,
			msg: '获取成功',
			data: list.data
		}
	} catch (e) {
		return {
			code: -1,
			msg: '获取失败',
			error: e
		}
	}
}

// 删除历史记录
async function deleteHistory(params) {
	const { userId, messageId } = params;
	
	try {
		await collection.doc(messageId).where({
			user_id: userId
		}).remove();
		
		return {
			code: 0,
			msg: '删除成功'
		}
	} catch (e) {
		return {
			code: -1,
			msg: '删除失败',
			error: e
		}
	}
}
