# MassForm 公司展示主页

一个现代化的公司展示网站，具有视频背景和流畅的滚动文字切换效果。

## ✨ 特性

- **视频背景** - 支持 MP4/WebM 格式的背景视频
- **滚动切换** - 鼠标滚轮控制文字内容切换
- **响应式设计** - 完美适配桌面端和移动端
- **优雅动画** - 平滑的过渡效果和文字动画
- **多种交互** - 支持滚轮、触摸、键盘和点击导航
- **性能优化** - 自动检测设备性能并调整动画质量
- **加载动画** - 优雅的资源预加载体验

## 🚀 快速开始

1. **下载项目文件**
   ```
   index.html
   styles.css
   script.js
   ```

2. **添加必需资源**
   - 将资源文件放置到对应的 `assets/` 文件夹中
   - 详细的文件列表请参考下方"资源文件位置"部分

3. **打开网站**
   - 直接在浏览器中打开 `index.html`
   - 或使用本地服务器（推荐）

## 📁 资源文件位置

### 🖼️ 图片资源 (assets/images/)
- `logo.svg` - 公司Logo（SVG格式，白色，28px高度适配）
- `logo.png` - Logo备用文件（PNG，112x112px，透明背景）
- `og-image.jpg` - 社交分享图片（1200x630px）

### 🎯 图标资源 (assets/icons/)
- `favicon.ico` - 网站图标（多尺寸：16x16, 32x32, 48x48px）
- `favicon-16x16.png` - 小尺寸图标（16x16px）
- `favicon-32x32.png` - 标准图标（32x32px）
- `apple-touch-icon.png` - 苹果设备图标（180x180px）
- `arrow-down.svg` - 向下箭头图标（16x16px，白色）

### 🎬 视频资源 (assets/videos/)
- `background-video.mp4` - 主背景视频（必需）
  - 格式：MP4 (H.264编码)
  - 分辨率：1920x1080 或更高
  - 帧率：24fps 或 30fps
  - 时长：10-30秒循环
  - 文件大小：建议20-50MB
  - 音频：静音
- `background-video.webm` - 备用视频（可选，WebM格式）

## 🎮 交互方式

- **鼠标滚轮** - 上下滚动切换内容
- **触摸滑动** - 移动端上下滑动
- **键盘导航** - 方向键、空格键、Home/End键
- **点击导航** - 点击底部圆点切换
- **自动适配** - 根据设备性能自动优化

## 🎨 自定义内容

### 修改文字内容
编辑 `index.html` 中的 `.slide` 部分：

```html
<div class="slide active" data-slide="1">
    <h2 class="main-title">你的标题</h2>
    <h3 class="sub-title">你的副标题</h3>
    <div class="description">
        <p>你的描述文字...</p>
    </div>
</div>
```

### 修改样式
编辑 `styles.css` 中的相关变量：

```css
/* 主要颜色 */
--primary-color: #fff;
--secondary-color: #e0e0e0;
--accent-color: #b0b0b0;

/* 字体大小 */
--title-size: clamp(2.5rem, 5vw, 4rem);
--subtitle-size: clamp(2rem, 4vw, 3.2rem);
```

## 📱 浏览器支持

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- 移动端浏览器

## 🔧 技术栈

- **HTML5** - 语义化结构
- **CSS3** - 现代样式和动画
- **Vanilla JavaScript** - 原生JS交互
- **Google Fonts** - Playfair Display + Inter

## 🎯 性能优化

- 自动检测用户的动画偏好设置
- 根据设备性能调整动画质量
- 预加载关键资源
- 防抖和节流优化滚动性能
- 响应式图片和字体加载
- 视频加载失败时自动显示备用背景

## 📞 技术支持

如需自定义开发或技术支持，请联系开发团队。
