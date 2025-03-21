<template>
	<view class="container">
		<!-- 分类选择 -->
		<scroll-view class="category-scroll" scroll-x="true">
			<view class="category-list">
				<view 
					class="category-item" 
					:class="{ active: currentCategory === item.id }"
					v-for="item in categories" 
					:key="item.id"
					@tap="changeCategory(item.id)"
				>
					{{item.name}}
				</view>
			</view>
		</scroll-view>
		
		<!-- 内容列表 -->
		<scroll-view 
			class="content-scroll" 
			scroll-y="true" 
			@scrolltolower="loadMore"
			refresher-enabled
			:refresher-triggered="isRefreshing"
			@refresherrefresh="onRefresh"
		>
			<view class="handbook-list">
				<view 
					class="handbook-item" 
					v-for="item in displayList" 
					:key="item.url"
					@tap="goToDetail(item)"
				>
					<view class="item-content">
						<text class="item-title">{{item.title}}</text>
						<text class="item-desc">{{item.desc || '点击查看详情'}}</text>
						<view class="item-info">
							<text class="item-category">{{item.category}}</text>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 加载更多 -->
			<uni-load-more :status="loadMoreStatus"></uni-load-more>
		</scroll-view>
	</view>
</template>

<script>
	import handbookData from '../../static/data/handbook.js'
	
	export default {
		data() {
			return {
				categories: [
					{ id: "全部", name: "全部" },
					{ id: "新患必读", name: "新患必读" },
					{ id: "治疗指南", name: "治疗指南" },
					{ id: "并发症处理", name: "并发症处理" }
				],
				currentCategory: '全部',
				allDocuments: [],
				displayList: [],
				page: 1,
				pageSize: 10,
				loadMoreStatus: 'more',
				isRefreshing: false
			}
		},
		
		async onLoad() {
			console.log('onLoad')
			await this.loadData()
		},
		
		methods: {
			// 加载数据
			async loadData() {
				try {
					console.log('Loading handbook data:', handbookData)
					this.allDocuments = handbookData.documents
					this.updateDisplayList()
					
				} catch (error) {
					console.error('加载数据失败:', error)
					uni.showToast({
						title: '加载数据失败',
						icon: 'none'
					})
				}
			},
			
			// 更新显示列表
			updateDisplayList() {
				console.log('Updating display list')
				console.log('Current category:', this.currentCategory)
				console.log('Current page:', this.page)
				console.log('Page size:', this.pageSize)
				console.log('All documents length:', this.allDocuments.length)
				
				// 根据分类筛选文档
				let filteredDocs = this.allDocuments
				if (this.currentCategory !== '全部') {
					filteredDocs = this.allDocuments.filter(doc => doc.category === this.currentCategory)
				}
				
				console.log('Filtered docs length:', filteredDocs.length)
				
				// 分页处理
				const start = (this.page - 1) * this.pageSize
				const end = this.page * this.pageSize
				console.log('Start index:', start)
				console.log('End index:', end)
				
				// 如果是第一页，重置列表
				if (this.page === 1) {
					this.displayList = []
				}
				
				// 添加新的数据到显示列表
				const newItems = filteredDocs.slice(start, end)
				this.displayList = [...this.displayList, ...newItems]
				
				console.log('Display list length:', this.displayList.length)
				console.log('New items length:', newItems.length)
				
				// 更新加载状态
				if (this.displayList.length >= filteredDocs.length) {
					console.log('No more data to load')
					this.loadMoreStatus = 'noMore'
				} else {
					console.log('More data available')
					this.loadMoreStatus = 'more'
				}
			},
			
			// 加载更多
			loadMore() {
				console.log('LoadMore called')
				console.log('Current status:', this.loadMoreStatus)
				
				if (this.loadMoreStatus !== 'more') {
					console.log('Cannot load more:', this.loadMoreStatus)
					return
				}
				
				console.log('Loading more data...')
				console.log('Current page:', this.page)
				this.page += 1
				console.log('New page:', this.page)
				this.updateDisplayList()
			},
			
			// 刷新
			onRefresh() {
				console.log('Refreshing...')
				this.isRefreshing = true
				this.page = 1
				this.loadData().then(() => {
					this.isRefreshing = false
					uni.stopPullDownRefresh()
				})
			},
			
			// 切换分类
			changeCategory(category) {
				console.log('Changing category to:', category)
				if (this.currentCategory === category) {
					console.log('Same category, no change needed')
					return
				}
				
				this.currentCategory = category
				this.page = 1
				this.displayList = [] // 清空当前列表
				this.updateDisplayList()
			},
			
			// 跳转到详情页
			goToDetail(item) {
				if (item.url) {
					// 使用webview打开链接
					uni.navigateTo({
						url: `/pages/webview/index?url=${encodeURIComponent(item.url)}&title=${encodeURIComponent(item.title)}`
					})
				}
			}
		}
	}
</script>

<style lang="scss">
.container {
	display: flex;
	flex-direction: column;
	height: 100vh;
	background-color: #f5f5f5;
	
	.category-scroll {
		background-color: #fff;
		padding: 10px 0;
		border-bottom: 1px solid #eee;
		
		.category-list {
			white-space: nowrap;
			padding: 0 15px;
			
			.category-item {
				display: inline-block;
				padding: 6px 15px;
				margin-right: 10px;
				border-radius: 16px;
				font-size: 14px;
				color: #666;
				background-color: #f5f5f5;
				
				&.active {
					color: #fff;
					background-color: #007AFF;
				}
			}
		}
	}
	
	.content-scroll {
		flex: 1;
		
		.handbook-list {
			padding: 15px;
			
			.handbook-item {
				display: flex;
				background-color: #fff;
				border-radius: 8px;
				padding: 15px;
				margin-bottom: 12px;
				
				.item-content {
					flex: 1;
					display: flex;
					flex-direction: column;
					
					.item-title {
						font-size: 16px;
						color: #333;
						line-height: 1.4;
						margin-bottom: 8px;
					}
					
					.item-desc {
						font-size: 14px;
						color: #666;
						line-height: 1.4;
						margin-bottom: 12px;
					}
					
					.item-info {
						display: flex;
						align-items: center;
						
						.item-category {
							font-size: 12px;
							color: #007AFF;
							background-color: rgba(0,122,255,0.1);
							padding: 2px 6px;
							border-radius: 4px;
						}
					}
				}
			}
		}
	}
}
</style>
