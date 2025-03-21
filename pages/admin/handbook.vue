<template>
	<view class="container">
		<view class="header">
			<button type="primary" @tap="addNew">新增内容</button>
		</view>
		<view class="handbook-list">
			<view class="handbook-item" v-for="item in list" :key="item._id">
				<view class="item-header">
					<text class="item-title">{{item.title}}</text>
					<button type="default" @tap="editItem(item)">编辑</button>
					<button type="warn" @tap="deleteItem(item._id)">删除</button>
				</view>
				<view class="item-content">
					<text>分类：{{item.category}}</text>
					<text>浏览次数：{{item.view_count}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: []
			}
		},
		onLoad() {
			this.fetchHandbookList()
		},
		methods: {
			// 获取病友宝典列表
			async fetchHandbookList() {
				try {
					const { data } = await uniCloud.callFunction({
						name: 'handbook',
						data: {
							action: 'getList',
							data: {}
						}
					})
					this.list = data.list
				} catch (e) {
					uni.showToast({
						title: '获取数据失败',
						icon: 'none'
					})
				}
			},
			// 新增内容
			addNew() {
				uni.navigateTo({
					url: '/pages/admin/handbookEdit'
				})
			},
			// 编辑内容
			editItem(item) {
				uni.navigateTo({
					url: `/pages/admin/handbookEdit?id=${item._id}`
				})
			},
			// 删除内容
			async deleteItem(id) {
				try {
					await uniCloud.callFunction({
						name: 'handbook',
						data: {
							action: 'delete',
							data: { id }
						}
					})
					uni.showToast({
						title: '删除成功',
						icon: 'success'
					})
					this.fetchHandbookList()
				} catch (e) {
					uni.showToast({
						title: '删除失败',
						icon: 'none'
					})
				}
			}
		}
	}
</script>

<style>
	.container {
		padding: 20rpx;
	}
	.header {
		display: flex;
		justify-content: flex-end;
		margin-bottom: 20rpx;
	}
	.handbook-list {
		display: flex;
		flex-direction: column;
	}
	.handbook-item {
		background-color: #fff;
		margin-bottom: 20rpx;
		padding: 20rpx;
		border-radius: 8rpx;
		box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
	}
	.item-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10rpx;
	}
	.item-title {
		font-size: 32rpx;
		font-weight: bold;
	}
	.item-content {
		font-size: 28rpx;
		color: #666;
	}
</style>
