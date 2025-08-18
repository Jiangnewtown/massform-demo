# 项目文件结构

```
massform-demo/
├── index.html                 # 主页面文件
├── styles.css                 # 样式文件
├── script.js                  # JavaScript交互文件
├── README.md                  # 项目说明文档
├── project-structure.md       # 项目结构说明（本文件）
│
├── assets/                    # 资源文件夹
│   ├── images/               # 图片资源
│   │   ├── logo.svg          # 公司Logo（SVG格式）
│   │   ├── logo.png          # 公司Logo（PNG备用）
│   │   └── og-image.jpg      # 社交媒体分享图片
│   │
│   ├── icons/                # 图标资源
│   │   ├── arrow-down.svg    # 向下箭头图标
│   │   ├── favicon.ico       # 网站图标
│   │   ├── favicon-16x16.png # 16x16像素图标
│   │   ├── favicon-32x32.png # 32x32像素图标
│   │   └── apple-touch-icon.png # 苹果设备图标
│   │
│   └── videos/               # 视频资源
│       ├── background-video.mp4  # 主背景视频（MP4格式）
│       └── background-video.webm # 备用背景视频（WebM格式）
│
└── docs/                     # 文档文件夹（可选）
    ├── design-specs.md       # 设计规范
    └── deployment-guide.md   # 部署指南
```

## 📁 资源文件详细说明

### 🖼️ 图片资源 (assets/images/)

**logo.svg** - 主要Logo文件
- 格式：SVG矢量图
- 建议尺寸：适合28px高度显示
- 颜色：白色或透明背景
- 用途：导航栏品牌标识

**logo.png** - Logo备用文件
- 格式：PNG（透明背景）
- 尺寸：112x112px（4倍分辨率）
- 用途：SVG不支持时的备用方案

**og-image.jpg** - 社交分享图片
- 格式：JPG
- 尺寸：1200x630px
- 用途：Facebook、Twitter等社交媒体分享

### 🎯 图标资源 (assets/icons/)

**favicon.ico** - 网站图标
- 格式：ICO
- 尺寸：包含16x16, 32x32, 48x48像素
- 用途：浏览器标签页图标

**favicon-16x16.png** - 小尺寸图标
- 格式：PNG
- 尺寸：16x16px
- 用途：现代浏览器小图标

**favicon-32x32.png** - 标准图标
- 格式：PNG
- 尺寸：32x32px
- 用途：现代浏览器标准图标

**apple-touch-icon.png** - 苹果设备图标
- 格式：PNG
- 尺寸：180x180px
- 用途：iOS设备添加到主屏幕时的图标

**arrow-down.svg** - 向下箭头
- 格式：SVG
- 尺寸：16x16px
- 颜色：白色
- 用途：滚动提示箭头

### 🎬 视频资源 (assets/videos/)

**background-video.mp4** - 主背景视频
- 格式：MP4 (H.264编码)
- 分辨率：1920x1080 (Full HD) 或更高
- 帧率：24fps 或 30fps
- 时长：10-30秒（循环播放）
- 文件大小：建议20-50MB
- 音频：无（静音）

**background-video.webm** - 备用视频
- 格式：WebM (VP9编码)
- 规格：与MP4版本相同
- 用途：更好的压缩率，现代浏览器支持

## 🎨 资源创建建议

### Logo设计要求
- 简洁现代的设计风格
- 在深色背景上清晰可见
- 支持单色（白色）显示
- 可缩放至不同尺寸

### 视频内容建议
- 抽象纹理或几何图案
- 自然景观（森林、水流、云层）
- 品牌相关的视觉元素
- 避免过于明亮或快速运动的内容
- 确保文字在视频上清晰可读

### 图标设计规范
- 使用一致的设计语言
- 简洁的线条和形状
- 适合小尺寸显示
- 支持高分辨率屏幕

## 📋 资源获取方式

1. **自行设计** - 使用Figma、Adobe Illustrator等工具
2. **素材网站** - Unsplash、Pexels（视频）、Feather Icons（图标）
3. **AI生成** - Midjourney、DALL-E等AI工具
4. **外包设计** - 委托专业设计师制作

## ⚠️ 注意事项

- 所有资源文件路径必须与代码中的引用路径一致
- 视频文件较大，建议使用CDN或压缩优化
- 图标需要多种尺寸以适配不同设备
- 确保所有资源都有适当的版权许可
