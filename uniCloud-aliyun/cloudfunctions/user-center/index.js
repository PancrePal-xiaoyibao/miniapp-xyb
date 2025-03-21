const db = uniCloud.database();
const collection = db.collection('uni-id-users');

exports.main = async (event, context) => {
    try {
        const { action, params } = event;
        
        switch (action) {
            case 'login':
                return await login(params);
            case 'getUserInfo':
                return await getUserInfo(params);
            case 'updateUserInfo':
                return await updateUserInfo(params);
            default:
                return {
                    code: 404,
                    msg: '未找到对应的方法'
                }
        }
    } catch (error) {
        console.error('操作失败：', error);
        return {
            code: -1,
            msg: '操作失败',
            error: error
        }
    }
}

// 登录方法
async function login(params) {
    const { username } = params;
    
    try {
        // 查找用户
        const userInfo = await collection.where({
            username: username
        }).get();
        
        console.log('查询结果：', userInfo);
        
        if (!userInfo.data || userInfo.data.length === 0) {
            // 用户不存在，创建新用户
            const addResult = await collection.add({
                username,
                nickname: username,
                create_time: Date.now(),
                last_login_time: Date.now(),
                status: 1
            });
            
            console.log('创建用户结果：', addResult);
            
            if (addResult.id) {
                const newUserInfo = await collection.doc(addResult.id).get();
                return {
                    code: 0,
                    msg: '注册并登录成功',
                    data: newUserInfo.data[0]
                }
            }
        } else {
            // 更新登录时间
            await collection.doc(userInfo.data[0]._id).update({
                last_login_time: Date.now()
            });
            
            return {
                code: 0,
                msg: '登录成功',
                data: userInfo.data[0]
            }
        }
    } catch (e) {
        console.error('登录失败：', e);
        return {
            code: -1,
            msg: '登录失败',
            error: e
        }
    }
}

// 获取用户信息
async function getUserInfo(params) {
    const { userId } = params;
    
    try {
        const userInfo = await collection.doc(userId).get();
        return {
            code: 0,
            msg: '获取成功',
            data: userInfo.data[0]
        }
    } catch (e) {
        console.error('获取用户信息失败：', e);
        return {
            code: -1,
            msg: '获取失败',
            error: e
        }
    }
}

// 更新用户信息
async function updateUserInfo(params) {
    const { userId, ...updateData } = params;
    
    try {
        await collection.doc(userId).update(updateData);
        return {
            code: 0,
            msg: '更新成功'
        }
    } catch (e) {
        console.error('更新用户信息失败：', e);
        return {
            code: -1,
            msg: '更新失败',
            error: e
        }
    }
}
