const config = require('../../../config/config.json');

// 将飞书文档转换为宝典格式
function transformFeishuToHandbook(feishuDocs) {
    return feishuDocs.map(doc => {
        // 默认分类为 'all'
        let category = 'all';
        
        // 根据文档标题或内容判断分类
        const title = doc.title.toLowerCase();
        if (title.includes('指南') || title.includes('共识') || title.includes('方案')) {
            category = 'treatment';
        } else if (title.includes('必读') || title.includes('患者手册')) {
            category = 'mustread';
        } else if (title.includes('科普') || title.includes('解读') || title.includes('认识')) {
            category = 'science';
        } else if (title.includes('并发症') || title.includes('腹水') || title.includes('血小板')) {
            category = 'complication';
        }
        
        // 构造宝典格式的文档对象
        return {
            title: doc.title,
            desc: doc.description || '', // 如果飞书文档有描述字段
            url: doc.url,
            category: category,
            isNew: isNewDocument(doc.updated_at), // 根据更新时间判断是否为新文档
            source: 'feishu', // 标记来源
            meta: {
                feishu_node_token: doc.node_token, // 保存飞书文档的唯一标识
                last_updated: doc.updated_at
            }
        };
    });
}

// 判断文档是否为新文档（30天内更新的）
function isNewDocument(updatedAt) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return new Date(updatedAt) > thirtyDaysAgo;
}

// 合并现有文档和飞书文档
function mergeDocuments(existingDocs, feishuDocs) {
    const merged = [...existingDocs];
    
    feishuDocs.forEach(feishuDoc => {
        // 查找是否已存在相同的文档
        const existingIndex = merged.findIndex(doc => 
            doc.meta && doc.meta.feishu_node_token === feishuDoc.meta.feishu_node_token
        );
        
        if (existingIndex >= 0) {
            // 更新现有文档
            merged[existingIndex] = {
                ...merged[existingIndex],
                ...feishuDoc,
                meta: {
                    ...merged[existingIndex].meta,
                    ...feishuDoc.meta
                }
            };
        } else {
            // 添加新文档
            merged.push(feishuDoc);
        }
    });
    
    return merged;
}

module.exports = {
    transformFeishuToHandbook,
    mergeDocuments
};
