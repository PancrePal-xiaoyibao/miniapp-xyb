<template>
	<view class="document-viewer">
		<!-- 网页浏览器 -->
		<web-view 
			:src="url" 
			@message="handleMessage"
			@onPostMessage="handlePostMessage"
		></web-view>
		
		<!-- 加载提示 -->
		<view class="loading" v-if="loading">
			<uni-load-more status="loading" :content-text="loadingText"></uni-load-more>
		</view>
		
		<!-- 错误提示 -->
		<view class="error" v-if="error">
			<view class="error-content">
				<uni-icons type="error" size="64" color="#ff4d4f"></uni-icons>
				<text class="error-text">{{error}}</text>
				<button class="retry-btn" @tap="retry">重试</button>
			</view>
		</view>
	</view>
</template>

<script>
import { config } from '@/config'

export default {
	data() {
		return {
			url: '',
			title: '',
			loading: true,
			error: '',
			loadingText: {
				contentdown: '文档加载中...',
				contentrefresh: '文档加载中...',
				contentnomore: '加载完成'
			}
		}
	},
	
	onLoad(options) {
		const { url, title } = options
		
		if (!url) {
			this.error = '无效的文档链接'
			this.loading = false
			return
		}
		
		this.url = decodeURIComponent(url)
		this.title = decodeURIComponent(title || '')
		
		// 设置页面标题
		if (this.title) {
			uni.setNavigationBarTitle({
				title: this.title
			})
		}
		
		// 开始加载文档
		this.loadDocument()
	},
	
	methods: {
		// 加载文档
		loadDocument() {
			this.loading = true
			this.error = ''
			
			// 检查文档类型
			if (this.url.includes('docs.qq.com/pdf')) {
				// 腾讯文档需要特殊处理
				this.handleTencentDoc()
			} else {
				// 其他文档直接加载
				setTimeout(() => {
					this.loading = false
				}, 1000)
			}
		},
		
		// 处理腾讯文档
		handleTencentDoc() {
			// 腾讯文档在移动端需要特殊处理
			// #ifdef MP-WEIXIN
			// 微信小程序中使用腾讯文档小程序打开
			wx.navigateToMiniProgram({
				appId: 'wx7b0b5f0ce2c47e4a', // 腾讯文档小程序的 appId
				path: `pages/detail/detail?url=${encodeURIComponent(this.url)}`,
				fail: (err) => {
					console.error('打开腾讯文档失败:', err)
					this.error = '打开文档失败，请稍后重试'
				},
				complete: () => {
					this.loading = false
				}
			})
			// #endif
			
			// #ifdef H5
			// H5端直接加载
			setTimeout(() => {
				this.loading = false
			}, 1000)
			// #endif
		},
		
		// 处理网页消息
		handleMessage(event) {
			console.log('收到网页消息:', event)
		},
		
		// 处理 PostMessage
		handlePostMessage(event) {
			console.log('收到 PostMessage:', event)
		},
		
		// 重试加载
		retry() {
			this.loadDocument()
		}
	}
}
</script>

<style lang="scss">
.document-viewer {
	position: relative;
	width: 100vw;
	height: 100vh;
	background: #fff;
	
	web-view {
		width: 100%;
		height: 100%;
	}
	
	.loading,
	.error {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #fff;
	}
	
	.error-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 40rpx;
		
		.error-text {
			font-size: 28rpx;
			color: #666;
			margin: 30rpx 0;
			text-align: center;
		}
		
		.retry-btn {
			margin-top: 20rpx;
			background: $uni-color-primary;
			color: #fff;
			font-size: 28rpx;
			padding: 16rpx 40rpx;
			border-radius: 8rpx;
		}
	}
}
</style>
