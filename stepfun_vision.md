基于图片的多轮对话
除了直接使用图片进行图像理解，你还可以使用图片进行多轮对话，通过将其放置在上下文中，即可完成多轮对话。

具体实现可以参考如下代码。

from openai import OpenAI
import os
 
API_KEY= os.getenv("API_KEY")
client = OpenAI(api_key=API_KEY, base_url="https://api.stepfun.com/v1")
 
completion = client.chat.completions.create(
  model="step-1v-8k",
  messages=[
      {
          "role": "system",
          "content": "你是由阶跃星辰提供的AI聊天助手，你除了擅长中文，英文，以及多种其他语言的对话以外，还能够根据用户提供的图片，对内容进行精准的内容文本描述。在保证用户数据安全的前提下，你能对用户的问题和请求，作出快速和精准的回答。同时，你的回答和建议应该拒绝黄赌毒，暴力恐怖主义的内容",
      },
      {
          "role": "user",
          "content": [
              {
                  "type": "text",
                  "text": "用优雅的语言描述这张图片",
              },
              {
                  "type": "image_url",
                  "image_url": {
                      "url": "https://www.stepfun.com/assets/section-1-CTe4nZiO.webp"
                  },
              },
          ],
      },
      # 将模型给予的返回重新插入会对话上下文，进行一轮新的对话
      {
          "role":"assistant",
          "content": "这幅图片中，我们看到了一座现代建筑，它坐落在一个宁静而宽敞的广场上。建筑的外墙以简洁的线条和明亮的色彩为特色，彰显出一种现代美学。夜幕降临，天空呈现出淡淡的蓝色，与建筑的暖色灯光形成了鲜明的对比，营造出一种温馨而宁静的氛围。\n\n广场上，几盏路灯散发出柔和的光芒，为周围的树木和地面铺上了一层温暖的光辉。树木静静地矗立在广场上，为这座建筑增添了一丝自然的气息。远处的高楼大厦在夜色中若隐若现，与这座建筑形成了鲜明的对比，展现出城市的繁华与宁静并存的景象。\n\n总的来说，这幅图片通过巧妙的构图和色彩运用，展现了一座现代建筑在夜幕中的美丽景象，让人感受到城市中的宁静与温馨。"
      },
      # 将用户的新问题继续追问大模型
      {
          "role":"user",
          "content":"那这张照片可能是在哪个国家拍摄的？"
      }
  ],
)
 
print(completion.model_dump_json(indent=3))