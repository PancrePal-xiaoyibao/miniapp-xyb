<template>
  <view class="home-container">
    <!-- 头部 -->
    <view class="app-header">
      <image src="/static/logo.png" mode="aspectFit" class="logo" />
      <text class="title">小胰宝公益助手</text>
      <text class="slogan">您的随身健康管家</text>
    </view>

    <!-- 项目介绍 -->
    <view class="section project-introduction">
      <text class="section-title">关于小胰宝</text>
      <text class="section-text">小胰宝公益助手（<text class="link" @click="openUrl('https://www.xiaoyibao.com.cn')">www.xiaoyibao.com.cn</text>），由病友SamQin创立上线，现已捐助<text class="link" @click="openUrl('https://chancefoundation.com.cn')">天工开物基金会</text>，由小X宝开源社区专业团队管理。主旨是为帮助每年数十万新增胰腺肿瘤患者及家属，获得公益AI信息服务，克服专业医学和治疗的医患信息差。</text>
      <text class="section-text">使用小胰宝及其它癌肿的AI助手，可获得7x24小时公益信息服务，帮助病患高效率、准确理解病情状态、治疗术语、规范治疗指南，以及综合治疗的复杂信息，克服慌乱情绪，选择科学和有效治疗路线，并最终获得更长的治疗收益。</text>
    </view>

    <!-- 项目及服务 -->
    <view class="section services">
      <text class="section-title">我们的服务</text>
      <text class="section-text">小X宝社区积极推动AI技术和患者公益应用的融合，提供技术和运营双开源。通过微光成炬计划积极寻找跨癌肿的KOL们，根据需要，自由使用多种技术，自由构建智能助手，自主运营公益项目，服务不同癌肿群体需求。</text>
      <view class="service-list">
        <text class="service-item" @click="openUrl('https://www.xiaomengbao.cn')">小萌宝：面向肛肠肿瘤患者家属的公益应用</text>
        <text class="service-item" @click="openUrl('http://www.xiaofeibao.com.cn')">小肺宝：肺癌患者AI助手应用</text>
        <text class="service-item">小粉宝：乳腺肿瘤患者应用，研发上线</text>
      </view>
    </view>

    <!-- 招募志愿者 -->
    <view class="section volunteer-recruitment">
      <text class="section-title">加入我们</text>
      <text class="section-text">我们招募志愿者加入，欢迎关注了解（<text class="link" @click="openUrl('https://uei55ql5ok.feishu.cn/wiki/RNEBwi47CiRDC7kEswOcssVRn81')">招募信息</text>）</text>
    </view>

    <!-- 备案信息 -->
    <view class="icp-footer">
      <text>©2024 小X宝开源社区-天工开物基金会旗下公益开源项目</text>
      <text>沪ICP备2023031159号-6X</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    openUrl(url) {
      // 使用webview页面打开外部链接
      uni.navigateTo({
        url: `/pages/webview/index?url=${encodeURIComponent(url)}`
      });
    }
  }
}
</script>

<style lang="scss">
.home-container {
  min-height: 100vh;
  background-color: #f9f9f9;
  padding-bottom: 40rpx;

  .app-header {
    background-color: #4CAF50;
    padding: 40rpx 30rpx;
    text-align: center;

    .logo {
      width: 120rpx;
      height: 120rpx;
      margin-bottom: 20rpx;
    }

    .title {
      font-size: 36rpx;
      color: #fff;
      font-weight: bold;
      display: block;
      margin-bottom: 10rpx;
    }

    .slogan {
      font-size: 28rpx;
      color: rgba(255, 255, 255, 0.9);
      display: block;
    }
  }

  .section {
    margin: 30rpx;
    padding: 30rpx;
    background-color: #fff;
    border-radius: 16rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);

    .section-title {
      font-size: 32rpx;
      color: #2196F3;
      font-weight: bold;
      margin-bottom: 20rpx;
      display: block;
    }

    .section-text {
      font-size: 28rpx;
      color: #333;
      line-height: 1.6;
      margin-bottom: 20rpx;
      display: block;
    }
  }

  .service-list {
    margin-top: 20rpx;

    .service-item {
      font-size: 28rpx;
      color: #2196F3;
      line-height: 1.6;
      padding: 10rpx 0;
      display: block;
      text-decoration: underline;
    }
  }

  .link {
    color: #2196F3;
    text-decoration: underline;
    display: inline;
  }

  .icp-footer {
    text-align: center;
    padding: 30rpx;
    
    text {
      font-size: 24rpx;
      color: #999;
      display: block;
      line-height: 1.6;
    }
  }
}
</style>