<template>
  <view class="handbook-detail">
    <!-- 文章内容 -->
    <view class="article-content" v-if="article">
      <view class="article-title">{{article.title}}</view>
      <view class="article-meta">
        <text class="category">{{article.category}}</text>
        <text class="date">{{article.updateTime}}</text>
      </view>
      <rich-text :nodes="article.content"></rich-text>
    </view>

    <!-- 相关文章 -->
    <view class="related-articles" v-if="relatedArticles.length > 0">
      <view class="section-title">相关文章</view>
      <view class="article-list">
        <view class="article-item" 
              v-for="item in relatedArticles" 
              :key="item._id"
              @tap="viewArticle(item._id)">
          <text class="title">{{item.title}}</text>
          <text class="category">{{item.category}}</text>
        </view>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <view class="action-btn" @tap="toggleFavorite">
        <uni-icons :type="isFavorite ? 'star-filled' : 'star'" size="24" :color="isFavorite ? '#FFC107' : '#666'"></uni-icons>
        <text>{{isFavorite ? '已收藏' : '收藏'}}</text>
      </view>
      <view class="action-btn" @tap="copyLink">
        <uni-icons type="link" size="24" color="#666"></uni-icons>
        <text>复制链接</text>
      </view>
      <view class="action-btn" @tap="share">
        <uni-icons type="redo" size="24" color="#666"></uni-icons>
        <text>分享</text>
      </view>
      <view class="action-btn" @tap="showFeedback">
        <uni-icons type="chat" size="24" color="#666"></uni-icons>
        <text>反馈</text>
      </view>
    </view>

    <!-- 反馈弹窗 -->
    <uni-popup ref="feedbackPopup" type="bottom">
      <view class="feedback-popup" @tap.stop="stopPropagation">
        <view class="popup-header">
          <text class="title">文章反馈</text>
          <view class="close-btn" @tap="hideFeedback">
            <uni-icons type="close" size="24" color="#666"></uni-icons>
          </view>
        </view>
        <view class="popup-content">
          <textarea 
            class="feedback-input" 
            v-model="feedbackText"
            placeholder="请输入您的反馈意见"
            maxlength="500"
          ></textarea>
        </view>
        <view class="popup-footer">
          <button class="submit-btn" @tap="submitFeedback">提交反馈</button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import { config } from '@/config'

export default {
  data() {
    return {
      article: null,
      relatedArticles: [],
      isFavorite: false,
      feedbackText: ''
    }
  },

  onLoad(options) {
    const { id } = options
    if (id) {
      this.loadArticle(id)
    }
  },

  methods: {
    // 加载文章详情
    async loadArticle(id) {
      try {
        const { result } = await uniCloud.callFunction({
          name: 'manageHandbook',
          data: {
            action: 'getArticleDetail',
            data: { id }
          }
        })

        if (result.success) {
          const { article, relatedArticles } = result.data
          this.article = article
          this.relatedArticles = relatedArticles

          // 检查是否已收藏
          this.checkFavorite(id)
        } else {
          throw new Error(result.error)
        }
      } catch (error) {
        console.error('加载文章失败:', error)
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      }
    },

    // 检查是否已收藏
    async checkFavorite(articleId) {
      try {
        const { result } = await uniCloud.callFunction({
          name: 'manageHandbook',
          data: {
            action: 'checkFavorite',
            data: { articleId }
          }
        })

        if (result.success) {
          this.isFavorite = result.data.isFavorite
        }
      } catch (error) {
        console.error('检查收藏状态失败:', error)
      }
    },

    // 切换收藏状态
    async toggleFavorite() {
      try {
        const { result } = await uniCloud.callFunction({
          name: 'manageHandbook',
          data: {
            action: 'toggleFavorite',
            data: { articleId: this.article._id }
          }
        })

        if (result.success) {
          this.isFavorite = result.data.isFavorite
          uni.showToast({
            title: result.data.isFavorite ? '收藏成功' : '取消收藏',
            icon: 'success'
          })
        } else {
          throw new Error(result.error)
        }
      } catch (error) {
        console.error('操作收藏失败:', error)
        uni.showToast({
          title: '操作失败',
          icon: 'none'
        })
      }
    },

    // 复制链接
    copyLink() {
      const path = `${config.UI.ROUTES.HANDBOOK.DETAIL}?id=${this.article._id}`
      uni.setClipboardData({
        data: path,
        success: () => {
          uni.showToast({
            title: '链接已复制',
            icon: 'success'
          })
        }
      })
    },

    // 分享
    share() {
      uni.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline']
      })
    },

    // 查看相关文章
    viewArticle(id) {
      uni.redirectTo({
        url: `${config.UI.ROUTES.HANDBOOK.DETAIL}?id=${id}`
      })
    },

    // 显示反馈弹窗
    showFeedback() {
      this.$refs.feedbackPopup.open()
    },

    // 隐藏反馈弹窗
    hideFeedback() {
      this.$refs.feedbackPopup.close()
      this.feedbackText = ''
    },

    // 提交反馈
    async submitFeedback() {
      if (!this.feedbackText.trim()) {
        uni.showToast({
          title: '请输入反馈内容',
          icon: 'none'
        })
        return
      }

      try {
        const { result } = await uniCloud.callFunction({
          name: 'manageHandbook',
          data: {
            action: 'submitFeedback',
            data: {
              articleId: this.article._id,
              content: this.feedbackText
            }
          }
        })

        if (result.success) {
          uni.showToast({
            title: '反馈已提交',
            icon: 'success'
          })
          this.hideFeedback()
        } else {
          throw new Error(result.error)
        }
      } catch (error) {
        console.error('提交反馈失败:', error)
        uni.showToast({
          title: '提交失败',
          icon: 'none'
        })
      }
    },

    // 阻止事件冒泡
    stopPropagation() {
      return
    }
  },

  // 分享到聊天
  onShareAppMessage() {
    return {
      title: this.article?.title || config.UI.SHARE.HANDBOOK.TITLE,
      path: `${config.UI.ROUTES.HANDBOOK.DETAIL}?id=${this.article?._id}`
    }
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: this.article?.title || config.UI.SHARE.HANDBOOK.TITLE,
      query: this.article?._id ? `id=${this.article._id}` : ''
    }
  }
}
</script>

<style lang="scss">
.handbook-detail {
  padding: 20rpx;
  min-height: 100vh;
  background: #fff;

  .article-content {
    padding-bottom: 120rpx;

    .article-title {
      font-size: 36rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 20rpx;
    }

    .article-meta {
      display: flex;
      align-items: center;
      margin-bottom: 30rpx;
      font-size: 24rpx;
      color: #999;

      .category {
        background: #f5f5f5;
        padding: 4rpx 16rpx;
        border-radius: 20rpx;
        margin-right: 20rpx;
      }
    }
  }

  .related-articles {
    margin-top: 40rpx;
    padding-bottom: 120rpx;

    .section-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 20rpx;
    }

    .article-item {
      padding: 20rpx;
      background: #f8f8f8;
      border-radius: 12rpx;
      margin-bottom: 20rpx;

      .title {
        font-size: 28rpx;
        color: #333;
        margin-bottom: 10rpx;
        display: block;
      }

      .category {
        font-size: 24rpx;
        color: #666;
      }
    }
  }

  .bottom-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100rpx;
    background: #fff;
    border-top: 1rpx solid #eee;
    display: flex;
    align-items: center;
    padding: 0 30rpx;

    .action-btn {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      text {
        font-size: 24rpx;
        color: #666;
        margin-top: 6rpx;
      }
    }
  }

  .feedback-popup {
    background: #fff;
    border-radius: 24rpx 24rpx 0 0;
    padding: 30rpx;

    .popup-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30rpx;

      .title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
      }
    }

    .feedback-input {
      width: 100%;
      height: 200rpx;
      background: #f8f8f8;
      border-radius: 12rpx;
      padding: 20rpx;
      font-size: 28rpx;
    }

    .submit-btn {
      margin-top: 30rpx;
      background: $uni-color-primary;
      color: #fff;
      border-radius: 12rpx;
    }
  }
}
</style>
