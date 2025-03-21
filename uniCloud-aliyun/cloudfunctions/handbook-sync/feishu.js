const axios = require('axios');
let config;

try {
    config = require('./config.json');
} catch (error) {
    console.error('配置文件不存在，请根据 config.template.json 创建 config.json');
    throw new Error('缺少配置文件');
}

const BASE_URL = config.feishu.base_url;

// 获取飞书访问令牌
async function getFeiShuToken() {
    try {
        const response = await axios.post(`${BASE_URL}/auth/v3/tenant_access_token/internal`, {
            app_id: config.feishu.app_id,
            app_secret: config.feishu.app_secret
        });
        return response.data.tenant_access_token;
    } catch (error) {
        console.error('获取飞书Token失败:', error);
        throw error;
    }
}

// 获取Wiki空间下的文档
async function getWikiDocs(token) {
    try {
        const response = await axios.get(`${BASE_URL}/wiki/v2/spaces/${config.feishu.wiki_space_id}/nodes`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data.data.items;
    } catch (error) {
        console.error('获取Wiki文档失败:', error);
        throw error;
    }
}

// 获取文档内容
async function getWikiContent(token, nodeToken) {
    try {
        const response = await axios.get(`${BASE_URL}/wiki/v2/spaces/${nodeToken}/nodes`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data.data;
    } catch (error) {
        console.error('获取文档内容失败:', error);
        throw error;
    }
}

module.exports = {
    getFeiShuToken,
    getWikiDocs,
    getWikiContent
};
