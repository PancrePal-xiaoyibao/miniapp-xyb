'use strict';
const config = require('../../config/config.json');
const {
    getFeiShuToken,
    getWikiDocs,
    getWikiContent
} = require('./feishu');
const { transformFeishuToHandbook, mergeDocuments } = require('./transformer');

const db = uniCloud.database();
const handbookDB = db.collection('handbook');
const syncLogsDB = db.collection('sync_logs');

// 记录同步日志
async function logSync(status, details) {
    await syncLogsDB.add({
        timestamp: Date.now(),
        status,
        details
    });
}

// 更新宝典内容
async function updateHandbook(docs) {
    // 先清空现有的手动添加的文档
    await handbookDB.where({
        source: 'manual'
    }).remove();
    
    // 读取手动添加的文档
    const manualContent = require('../../../handbook-content.json');
    const manualDocs = manualContent.documents.map(doc => ({
        ...doc,
        source: 'manual',
        create_time: Date.now(),
        update_time: Date.now(),
        view_count: 0
    }));
    
    // 添加手动文档
    for (const doc of manualDocs) {
        try {
            await handbookDB.add(doc);
        } catch (error) {
            console.error(`添加手动文档失败: ${doc.title}`, error);
            throw error;
        }
    }
    
    // 处理飞书文档
    for (const doc of docs) {
        try {
            // 检查文档是否已存在
            const existing = await handbookDB.where({
                feishu_node_token: doc.node_token
            }).get();

            const docData = {
                title: doc.title,
                content: doc.content,
                desc: doc.description || '',
                url: doc.url,
                category: doc.category || 'all',
                source: 'feishu',
                feishu_node_token: doc.node_token,
                update_time: Date.now()
            };

            if (existing.data.length > 0) {
                // 更新现有文档
                await handbookDB.doc(existing.data[0]._id).update(docData);
            } else {
                // 创建新文档
                await handbookDB.add({
                    ...docData,
                    create_time: Date.now(),
                    view_count: 0
                });
            }
        } catch (error) {
            console.error(`更新文档失败: ${doc.title}`, error);
            throw error;
        }
    }
}

exports.main = async (event, context) => {
    try {
        // 开始同步
        await logSync('start', '开始同步飞书文档');
        
        // 获取访问令牌
        const token = await getFeiShuToken();
        
        // 获取所有文档
        const docs = await getWikiDocs(token);
        
        // 获取每个文档的详细内容
        const fullDocs = await Promise.all(
            docs.map(async doc => {
                const content = await getWikiContent(token, doc.node_token);
                return { ...doc, content };
            })
        );
        
        // 转换为宝典格式
        const transformedDocs = transformFeishuToHandbook(fullDocs);
        
        // 获取现有文档
        const existingDocs = await handbookDB.get();
        
        // 合并文档
        const mergedDocs = mergeDocuments(existingDocs.data, transformedDocs);
        
        // 更新数据库
        await updateHandbook(mergedDocs);
        
        // 记录成功日志
        await logSync('success', `同步完成，更新了 ${docs.length} 个文档`);
        
        return {
            code: 200,
            msg: '同步成功',
            data: {
                total: docs.length
            }
        };
    } catch (error) {
        // 记录错误日志
        await logSync('error', error.message);
        
        return {
            code: 500,
            msg: '同步失败',
            error: error.message
        };
    }
};
