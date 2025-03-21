<script>
	export default {
		onLaunch: function() {
			console.log('App Launch');
			uni.switchTab({
				url: '/pages/ai-chat/chat'
			});
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	/* 全局样式 */
	page {
		background-color: #f9f9f9;
		font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
		-webkit-font-smoothing: antialiased;
	}
	
	/* 主题色 */
	:root {
		--primary-color: #4CAF50;
		--secondary-color: #3C7EFF;
		--text-color: #333;
		--light-text: #999;
		--border-color: #eee;
	}
	
	/* 通用文本样式 */
	.text-primary {
		color: var(--primary-color);
	}
	
	.text-secondary {
		color: var(--secondary-color);
	}
	
	/* 通用间距 */
	.mt-2 {
		margin-top: 20rpx;
	}
	
	.mb-2 {
		margin-bottom: 20rpx;
	}
	
	.p-2 {
		padding: 20rpx;
	}
</style>
