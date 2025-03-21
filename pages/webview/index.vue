<template>
	<view class="container">
		<web-view :src="url" @message="handleMessage" @error="handleError" @load="handleLoad"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url: '',
				title: ''
			}
		},
		onLoad(options) {
			console.log('webview onLoad options:', options)
			
			try {
				// 处理URL参数
				let targetUrl = ''
				
				// 1. 直接从 options.url 获取
				if (options.url) {
					targetUrl = decodeURIComponent(options.url)
				}
				// 2. 从 qqdocurl 获取（兼容腾讯文档）
				else if (options.qqdocurl) {
					targetUrl = decodeURIComponent(options.qqdocurl)
				}
				// 3. 处理其他情况
				else {
					// 将所有参数拼接成查询字符串
					const queryParams = Object.entries(options)
						.filter(([key]) => key !== 'title')
						.map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
						.join('&')
					
					targetUrl = queryParams ? `?${queryParams}` : ''
				}
				
				// 解码标题
				this.title = decodeURIComponent(options.title || '')
				console.log('解码后的标题:', this.title)
				
				// 验证和清理URL
				if (!targetUrl) {
					throw new Error('URL不能为空')
				}
				
				// 移除可能存在的 .html 后缀
				targetUrl = targetUrl.replace(/\.html($|\?)/, '$1')
				
				// 确保URL是完整的http(s)链接
				if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
					targetUrl = 'https://' + targetUrl.replace(/^\/+/, '')
				}
				
				console.log('处理后的URL:', targetUrl)
				this.url = targetUrl
				
				// 设置页面标题
				if (this.title) {
					uni.setNavigationBarTitle({
						title: this.title
					})
				}
			} catch (error) {
				console.error('webview 初始化错误:', error)
				uni.showToast({
					title: '页面加载失败',
					icon: 'none'
				})
				
				// 延迟返回上一页
				setTimeout(() => {
					uni.navigateBack()
				}, 2000)
			}
		},
		methods: {
			// 处理webview消息
			handleMessage(event) {
				console.log('webview消息:', event)
			},
			
			// 处理webview错误
			handleError(error) {
				console.error('webview错误:', error)
				uni.showToast({
					title: '页面加载出错',
					icon: 'none'
				})
			},
			
			// 处理webview加载完成
			handleLoad(event) {
				console.log('webview加载完成:', event)
			}
		}
	}
</script>

<style>
	.container {
		width: 100%;
		height: 100vh;
	}
</style>
