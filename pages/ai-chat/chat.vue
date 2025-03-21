<template>
	<view class="chat-container">
		<scroll-view class="messages" scroll-y scroll-with-animation="true" :scroll-into-view="scrollToMessage"
			@scrolltoupper="onScrollToUpper" :enhanced="true" :show-scrollbar="false">
			<view class="messages-inner">
				<block v-for="(item, index) in messages" :key="index">
					<view :id="'msg-' + item.id" v-if="item.role === 'user' || item.role === 'assistant'"
						:class="['message', item.role === 'user' ? 'user' : 'ai']">
						<view class="role-label">{{item.role === 'user' ? '我' : '小胰宝AI助手'}}</view>
						<view class="message-content">
							<image v-if="item.type === 'image'" :src="item.imageUrl" mode="widthFix" class="message-image"></image>
							<text v-else user-select>{{item.content}}</text>
						</view>
					</view>
					<view :id="'msg-' + item.id" v-else-if="item.role === 'system'" class="message system">
						<view class="message-content">
							<text user-select>{{item.content}}</text>
						</view>
					</view>
				</block>
			</view>

			<view v-if="loading" class="message system">
				<view class="message-content">正在思考中...</view>
			</view>

			<view v-if="error" class="message system">
				<view class="message-content error">{{error}}</view>
			</view>
		</scroll-view>

		<view class="input-box">
			<view class="attachment-btn" @tap="showUploadOptions">
				<image class="attachment-icon" src="/static/images/attachment.png" mode="aspectFit"></image>
			</view>
			<input class="input-field" type="text" v-model="inputValue" placeholder="输入您的问题..." @input="onInput"
				@confirm="sendMessage" />
			<button class="send-btn" @tap="sendMessage">发送</button>
		</view>

		<!-- 上传选项弹窗 -->
		<view :class="['upload-options', isShowUploadOptions ? 'show' : '']" @tap="hideUploadOptions">
			<view class="upload-options-content" @tap.stop="preventBubble">
				<view class="upload-option" @tap="chooseImage('album')">
					<image class="option-icon" src="/static/images/image.png" mode="aspectFit"></image>
					<text>上传图片</text>
				</view>
				<view class="upload-option" @tap="chooseFile">
					<image class="option-icon" src="/static/images/file.png" mode="aspectFit"></image>
					<text>上传文件</text>
				</view>
				<view class="upload-option" @tap="takePhoto">
					<image class="option-icon" src="/static/images/camera.png" mode="aspectFit"></image>
					<text>拍照</text>
				</view>
			</view>
		</view>
		<canvas canvas-id="compressCanvas" style="position: absolute; left: -9999px;"></canvas>
	</view>
</template>

<script>
	import config from '@/config/config.js'

	export default {
		data() {
			return {
				messages: [],
				inputValue: '',
				loading: false,
				error: null,
				tempFilePath: '',
				scrollToMessage: '',
				windowHeight: 0,
				isShowUploadOptions: false,  // 修改变量名
				isRecording: false,
				recordTime: 0,
				recordTimeoutID: null,
				sending: false,
				maxInputLength: 500,
				aiInitialized: false,
				userId: '',
				currentPersona: '您好，我是小胰宝AI助手。我专注于胰腺癌相关问题的咨询，可以为您提供专业的建议和解答。'
			}
		},
		async onLoad() {
			try {
				// 获取系统信息
				const systemInfo = uni.getSystemInfoSync()

				// 计算安全区域
				const { windowHeight, windowWidth } = systemInfo
				const safeArea = systemInfo.safeArea || {
					bottom: windowHeight,
					height: windowHeight,
					left: 0,
					right: windowWidth,
					top: 0,
					width: windowWidth
				}

				this.systemInfo = systemInfo
				this.safeArea = safeArea
				this.inputBottom = 0
				this.windowHeight = windowHeight

				const chatHistory = uni.getStorageSync('chatHistory') || []

				this.userId = uni.getStorageSync('userId') || `user_${Date.now()}`
				this.messages = chatHistory.length > 0 ? chatHistory : [{
					id: Date.now().toString(),
					type: 'system',
					role: 'system',
					content: '您好，我是小胰宝，您的专业胰腺癌AI助手。请问有什么可以帮您？',
					timestamp: new Date().toISOString()
				}]

				// 如果没有存储过用户ID，保存一个
				if (!uni.getStorageSync('userId')) {
					uni.setStorageSync('userId', this.userId)
				}

				// 加载历史记录
				this.loadHistory()

				// 延迟滚动到底部，确保消息列表已渲染
				setTimeout(() => this.scrollToBottom(), 300)

			} catch (error) {
				console.error('页面加载失败:', error)
				uni.showToast({
					title: '加载失败，请重试',
					icon: 'none'
				})
			}
		},
		onShow() {
			// 每次页面显示时滚动到底部
			setTimeout(() => this.scrollToBottom(), 300)
		},
		methods: {
			// 输入框内容变化
			onInput(e) {
				this.inputValue = e.detail.value
			},

			// 发送消息
			async sendMessage() {
				if (this.sending) return // 防止重复发送

				const { inputValue, tempFilePath } = this
				if (!inputValue && !tempFilePath) return

				this.sending = true

				try {
					let messageContent = inputValue
					let messageType = 'text'

					// 如果有临时文件，优先发送文件
					if (tempFilePath) {
						messageContent = {
							path: tempFilePath,
							type: 'file'
						}
						messageType = 'file'
					}

					// 创建用户消息
					const userMessage = {
						id: Date.now().toString(),
						userId: this.userId,
						type: messageType,
						role: 'user',
						content: messageContent,
						timestamp: new Date().toISOString()
					}

					// 添加消息到列表
					this.appendMessage(userMessage)

					// 清空输入
					this.inputValue = ''
					this.tempFilePath = ''
					this.isShowUploadOptions = false

					// 发送到AI处理
					await this.sendToAI(userMessage)
				} catch (error) {
					console.error('发送消息失败:', error)
					uni.showToast({
						title: '发送失败，请重试',
						icon: 'none'
					})
				} finally {
					this.sending = false
				}
			},

			// 调用 AI 助手
			async callAI(messages) {
				try {
					// 找到最近的图片分析消息和结果
					let contextMessages = messages.slice();
					let lastImageIndex = -1;
					let lastImageAnalysis = null;

					for (let i = contextMessages.length - 1; i >= 0; i--) {
						const msg = contextMessages[i];
						if (msg.type === 'image') {
							lastImageIndex = i;
							break;
						}
						if (lastImageIndex !== -1 && i === lastImageIndex + 1) {
							lastImageAnalysis = msg;
							break;
						}
					}

					// 如果找到了图片和分析结果，添加到系统消息中
					let systemMessage = {
						role: 'system',
						content: '你是一个专业的胰腺癌医疗助手，名字叫小胰宝。'
					};

					if (lastImageIndex !== -1 && lastImageAnalysis) {
						systemMessage.content += '\n\n上下文：用户之前上传了一张医疗图像，你的分析结果是：' + lastImageAnalysis.content;
					}

					const response = await uni.request({
						url: `${config.AI.CHAT_API_BASE}/chat/completions`,
						method: 'POST',
						data: {
							model: config.AI.CHAT_MODEL,
							messages: [
								systemMessage,
								...messages.map(msg => ({
									role: msg.role,
									content: msg.content
								}))
							]
						},
						header: {
							'Authorization': `Bearer ${config.AI.CHAT_API_KEY}`,
							'Content-Type': 'application/json'
						},
						timeout: 300000
					})

					console.log('API响应:', response)  // 添加日志

					if (response.statusCode === 200 && response.data.choices && response.data.choices[0]) {
						return response.data.choices[0].message.content
					} else {
						console.error('API错误响应:', response.data)  // 添加错误日志
						throw new Error(response.data.error || 'AI处理失败')
					}
				} catch (error) {
					console.error('AI处理失败:', error)
					throw new Error(error.message || 'AI处理失败，请重试')
				}
			},

			// 发送消息到AI处理
			async sendToAI(userMessage) {
				try {
					console.log('调用AI模型...')
					this.loading = true
					this.error = null

					// 如果是图片消息，使用 yi-vision API 处理
					if (userMessage.type === 'image') {
						// 调用图片分析
						const response = await this.callImageAnalysis(userMessage.imageUrl)
						if (response) {
							// 添加AI的分析结果到消息列表
							const aiMessage = {
								id: Date.now().toString(),
								type: 'text',
								role: 'assistant',
								content: response,
								timestamp: new Date().toISOString()
							}
							this.appendMessage(aiMessage)

							// 添加提示消息
							this.appendMessage({
								id: Date.now().toString(),
								type: 'text',
								role: 'system',
								content: '您可以继续询问关于这张图片的问题，我会根据上下文为您解答。',
								timestamp: new Date().toISOString()
							})
						} else {
							throw new Error('图片分析失败')
						}
						return
					}

					// 使用 FastGPT API 处理文本消息
					const response = await this.callAI(this.messages.filter(msg => msg.role !== 'system'))

					if (response) {
						const aiMessage = {
							id: Date.now().toString(),
							type: 'text',
							role: 'assistant',
							content: response,
							timestamp: new Date().toISOString()
						}
						this.appendMessage(aiMessage)
					} else {
						throw new Error('AI处理失败')
					}
				} catch (error) {
					console.error('AI处理失败:', error)
					this.error = error.message || 'AI处理失败，请重试'
				} finally {
					this.loading = false
				}
			},

			// 调用图片分析
			async callImageAnalysis(imageUrl) {
				try {
					console.log('图片URL:', imageUrl)  // 添加日志
					
					const requestData = {
						model: config.AI.YI_VISION_MODEL,
						messages: [
							{
								role: 'user',
								content: [
									{
										type: 'image_url',
										image_url: {
											url: imageUrl
										}
									},
									{
										type: 'text',
										text: '请分析这张医疗图像，注意可能的异常区域。'
									}
								]
							}
						],
						stream: false,
						max_tokens: 1024
					}
					
					console.log('请求数据:', requestData)  // 添加请求数据日志
					
					// 直接调用 API
					const response = await uni.request({
						url: `${config.AI.YI_VISION_API_BASE}/chat/completions`,
						method: 'POST',
						data: requestData,
						header: {
							'Authorization': `Bearer ${config.AI.YI_VISION_API_KEY}`,
							'Content-Type': 'application/json'
						},
						timeout: 300000
					})

					console.log('API响应:', response)  // 添加响应日志

					if (response.statusCode !== 200) {
						console.error('API错误响应:', response.data)  // 添加错误日志
						throw new Error(`API请求失败: ${response.statusCode} - ${JSON.stringify(response.data)}`)
					}

					if (!response.data || !response.data.choices || !response.data.choices[0]) {
						throw new Error('无效的API响应格式: ' + JSON.stringify(response.data))
					}

					return response.data.choices[0].message.content
				} catch (error) {
					console.error('图片分析失败:', error)
					throw new Error(error.message || '图片分析失败，请重试')
				}
			},

			// 处理图片上传
			async handleImageUpload(tempFilePath) {
				try {
					console.log('开始处理图片:', tempFilePath);
					
					// 隐藏上传菜单
					this.hideUploadOptions();

					// 显示上传提示
					uni.showLoading({
						title: '正在处理图片...',
						mask: true
					});

					if (!tempFilePath) {
						throw new Error('未获取到图片路径');
					}

					// 获取图片信息
					const imageInfo = await new Promise((resolve, reject) => {
						uni.getImageInfo({
							src: tempFilePath,
							success: (res) => {
								console.log('获取图片信息成功:', res);
								resolve(res);
							},
							fail: (error) => {
								console.error('获取图片信息失败:', error);
								reject(error);
							}
						});
					});

					console.log('图片信息:', imageInfo);

					// 计算压缩质量和目标尺寸
					let quality = 70;
					let targetWidth = imageInfo.width;
					let targetHeight = imageInfo.height;

					// 如果图片太大，按比例缩小
					const maxSize = 1024;
					if (imageInfo.width > maxSize || imageInfo.height > maxSize) {
						const ratio = Math.min(maxSize / imageInfo.width, maxSize / imageInfo.height);
						targetWidth = Math.floor(imageInfo.width * ratio);
						targetHeight = Math.floor(imageInfo.height * ratio);
						quality = 60;
					}

					console.log('压缩参数:', { targetWidth, targetHeight, quality });

					// 使用canvas压缩图片
					const ctx = uni.createCanvasContext('compressCanvas', this);
					const canvasId = 'compressCanvas';

					const compressedImage = await new Promise((resolve, reject) => {
						ctx.drawImage(tempFilePath, 0, 0, targetWidth, targetHeight);
						ctx.draw(false, () => {
							// 添加延时确保canvas绘制完成
							setTimeout(() => {
								uni.canvasToTempFilePath({
									canvasId,
									quality: quality,
									success: (res) => {
										console.log('压缩成功:', res);
										resolve(res);
									},
									fail: (error) => {
										console.error('压缩失败:', error);
										reject(error);
									}
								}, this);
							}, 100);
						});
					});

					// 直接上传原图
					console.log('开始上传图片到uniCloud...');
					const uploadRes = await uniCloud.uploadFile({
						filePath: tempFilePath,
						cloudPath: `chat-images/${Date.now()}-${Math.random().toString(36).slice(-6)}.jpg`
					});

					console.log('uniCloud上传结果:', uploadRes);

					if (!uploadRes || !uploadRes.fileID) {
						console.error('上传失败，返回结果:', uploadRes);
						throw new Error('上传失败: 未获取到文件ID');
					}

					// 获取临时访问链接
					console.log('开始获取临时访问链接...');
					const tempUrlRes = await uniCloud.getTempFileURL({
						fileList: [uploadRes.fileID]
					});

					console.log('获取临时链接结果:', tempUrlRes);

					if (!tempUrlRes.fileList || !tempUrlRes.fileList[0] || !tempUrlRes.fileList[0].tempFileURL) {
						console.error('获取临时链接失败，返回结果:', tempUrlRes);
						throw new Error('获取文件访问链接失败');
					}

					const imageUrl = tempUrlRes.fileList[0].tempFileURL;
					console.log('最终图片访问链接:', imageUrl);

					// 添加用户消息
					const userMessage = {
						id: Date.now().toString(),
						type: 'image',
						role: 'user',
						content: '图片分析请求',
						imageUrl: imageUrl,
						fileID: uploadRes.fileID,
						timestamp: new Date().toISOString()
					};

					this.appendMessage(userMessage);

					// 发送到AI处理
					await this.sendToAI(userMessage);
				} catch (error) {
					console.error('图片处理失败:', error);
					uni.showToast({
						title: error.message || '图片处理失败，请重试',
						icon: 'none',
						duration: 2000
					});
				} finally {
					uni.hideLoading();
				}
			},

			// 选择文件
			async chooseFile() {
				try {
					const res = await uni.chooseFile({
						count: 1,
						type: 'all',
						extension: ['.pdf', '.doc', '.docx', '.txt'],
					})
					
					if (res.tempFiles && res.tempFiles.length > 0) {
						const file = res.tempFiles[0]
						this.tempFilePath = file.path
						
						// 显示上传提示
						uni.showLoading({
							title: '正在处理文件...',
							mask: true
						})
						
						// 上传到云存储
						const uploadRes = await uniCloud.uploadFile({
							filePath: file.path,
							cloudPath: `chat-files/${Date.now()}-${Math.random().toString(36).slice(-6)}${file.name}`
						})
						
						if (!uploadRes.fileID) {
							throw new Error('上传失败');
						}
						
						// 获取临时访问链接
						const fileList = await uniCloud.getTempFileURL({
							fileList: [uploadRes.fileID]
						})
						
						const fileUrl = fileList[0].tempFileURL
						
						// 添加用户消息
						const userMessage = {
							id: Date.now().toString(),
							type: 'file',
							role: 'user',
							content: '文件分析请求',
							fileUrl: fileUrl,
							fileName: file.name,
							fileID: uploadRes.fileID,
							timestamp: new Date().toISOString()
						}
						
						this.appendMessage(userMessage)
						this.hideUploadOptions()
						
						// 发送到AI处理
						await this.sendToAI(userMessage)
					}
				} catch (error) {
					console.error('文件处理失败:', error)
					uni.showToast({
						title: error.message || '文件处理失败，请重试',
						icon: 'none'
					})
				} finally {
					uni.hideLoading()
				}
			},

			// 加载历史记录
			loadHistory() {
				const chatHistory = uni.getStorageSync('chatHistory')
				if (chatHistory && chatHistory.length > 0) {
					this.messages = chatHistory
				}
			},

			// 添加消息到列表
			appendMessage(msg) {
				this.messages.push(msg)
				// 保存到本地存储
				uni.setStorageSync('chatHistory', this.messages)
				this.scrollToBottom()
			},

			// 移除消息
			removeMessage(messageId) {
				this.messages = this.messages.filter(msg => msg.id !== messageId)
				uni.setStorageSync('chatHistory', this.messages)
			},

			// 滚动到底部
			scrollToBottom() {
				setTimeout(() => {
					const lastMessage = this.messages[this.messages.length - 1]
					if (lastMessage) {
						this.scrollToMessage = 'msg-' + lastMessage.id
					}
				}, 100)
			},

			// 显示上传选项
			showUploadOptions() {
				this.isShowUploadOptions = true
			},
			
			// 隐藏上传选项
			hideUploadOptions() {
				this.isShowUploadOptions = false
			},

			// 防止点击内容区域时关闭弹窗
			preventBubble() {
				// do nothing
			},

			// 从相册选择图片
			async chooseImage(source) {
				try {
					const res = await uni.chooseImage({
						count: 1,
						sourceType: [source],
						sizeType: ['compressed']
					})
					if (res.tempFilePaths && res.tempFilePaths[0]) {
						await this.handleImageUpload(res.tempFilePaths[0])
					}
				} catch (error) {
					console.error('选择图片失败:', error)
				}
			},

			// 拍照
			async takePhoto() {
				try {
					const res = await uni.chooseImage({
						count: 1,
						sourceType: ['camera'],
						sizeType: ['compressed']
					})
					if (res.tempFilePaths && res.tempFilePaths[0]) {
						await this.handleImageUpload(res.tempFilePaths[0])
					}
				} catch (error) {
					console.error('拍照失败:', error)
				}
			},

			// 到顶部加载更多
			onScrollToUpper() {
				// 暂时不实现加载更多的功能
			},

			// 切换AI角色
			switchPersona(persona) {
				this.currentPersona = persona
				uni.showToast({
					title: '已切换AI角色',
					icon: 'none'
				})
			}
		}
	}
</script>

<style>
	.chat-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background-color: #ffffff;
		padding-bottom: env(safe-area-inset-bottom);
		font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
	}

	.messages {
		flex: 1;
		padding: 20rpx;
		overflow-y: auto;
		margin-bottom: 120rpx;
	}

	.message {
		margin: 20rpx;
		padding: 20rpx;
		border-radius: 10rpx;
		max-width: 80%;
	}

	.message.user {
		margin-left: auto;
		background-color: #007AFF;
		color: #FFFFFF;
	}

	.message.ai {
		margin-right: auto;
		background-color: #F5F5F5;
		color: #333333;
	}

	.message.system {
		margin: 20rpx auto;
		background-color: #f0f9ff;
		color: #666666;
		font-size: 28rpx;
		text-align: center;
		max-width: 90%;
	}

	.message-content {
		word-break: break-all;
		line-height: 1.5;
	}

	.message-image {
		width: 100%;
		max-width: 400rpx;
		border-radius: 8rpx;
	}

	.role-label {
		font-size: 24rpx;
		margin-bottom: 10rpx;
		color: #999999;
	}

	.user .role-label {
		color: #FFFFFF;
		opacity: 0.8;
	}

	.input-box {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 40rpx;
		background-color: #ffffff;
		border-top: 1rpx solid #e5e5e5;
		display: flex;
		align-items: center;
		padding-bottom: calc(1rpx + env(safe-area-inset-bottom));
		box-sizing: content-box;
	}

	.attachment-btn {
		width: 80rpx;
		height: 80rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 16rpx;
		background-color: #e8e8e8;
		border-radius: 4rpx;
	}

	.attachment-icon {
		width: 48rpx;
		height: 48rpx;
	}

	.input-field {
		flex: 1;
		height: 90rpx;
		padding: 0 24rpx;
		background: #f5f5f5;
		border-radius: 4rpx;
		font-size: 26rpx;
	}

	.send-btn {
		margin-left: 16rpx;
		width: 120rpx;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		background: #3C7EFF;
		color: white;
		border-radius: 4rpx;
		font-size: 28rpx;
		padding: 0;
	}

	.upload-options {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 100;
		opacity: 0;
		visibility: hidden;
		transition: all 0.3s;
	}

	.upload-options.show {
		opacity: 1;
		visibility: visible;
	}

	.upload-options-content {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background: white;
		padding: 30rpx;
		border-radius: 20rpx 20rpx 0 0;
		transform: translateY(100%);
		transition: transform 0.3s;
	}

	.upload-options.show .upload-options-content {
		transform: translateY(0);
	}

	.upload-option {
		display: flex;
		align-items: center;
		padding: 20rpx 0;
	}

	.option-icon {
		width: 48rpx;
		height: 48rpx;
		margin-right: 20rpx;
	}

	.error {
		color: #ff4d4f;
	}

	.system .message-content {
		background: #f0f0f0;
		color: #666;
		text-align: center;
		margin: 0 auto;
	}
</style>
