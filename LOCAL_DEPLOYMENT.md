# 本地部署指南

## 🚀 快速启动

### 前提条件
- 现代浏览器（Chrome 60+, Firefox 55+, Safari 12+, Edge 79+）
- 本地HTTP服务器（推荐，避免跨域问题）

### 方法一：使用Python HTTP服务器（推荐）

1. **检查Python是否已安装**
   ```bash
   python --version
   ```

2. **启动本地服务器**
   ```bash
   # 在项目根目录下执行
   python -m http.server 8000
   ```

3. **访问网站**
   - 打开浏览器访问：`http://localhost:8000`
   - 或者：`http://127.0.0.1:8000`

### 方法二：使用VS Code Live Server

1. **安装扩展**
   - 在VS Code中安装 "Live Server" 扩展

2. **启动服务**
   - 右键点击 `index.html` 文件
   - 选择 "Open with Live Server"
   - 自动在浏览器中打开，支持热重载

### 方法三：使用Node.js http-server

1. **安装http-server**
   ```bash
   npm install -g http-server
   ```

2. **启动服务器**
   ```bash
   http-server -p 8000
   ```

### 方法四：直接打开文件（不推荐）

直接双击 `index.html` 文件，但可能遇到：
- 视频文件加载失败
- 字体加载问题
- 其他跨域限制

## 🎮 功能测试

启动后可以测试以下功能：

### 基本交互
- **鼠标滚轮** - 上下滚动切换内容页面
- **触摸滑动** - 移动端上下滑动
- **键盘导航** - 方向键↑↓、空格键、Home/End键
- **点击导航** - 点击底部圆点切换页面

### 视频背景
- 检查背景视频是否正常播放
- 视频应该自动循环播放
- 如果视频加载失败，会显示备用背景图

### 响应式设计
- 调整浏览器窗口大小测试响应式效果
- 在移动设备上测试触摸交互

## 🔧 常见问题

### 视频不播放
- 确保 `assets/videos/background-video.mp4` 文件存在
- 检查视频文件格式和编码
- 某些浏览器需要用户交互后才能播放视频

### 字体显示异常
- 检查网络连接（使用Google Fonts）
- 确保使用HTTP服务器而非直接打开文件

### 滚动不流畅
- 检查浏览器性能设置
- 在低性能设备上会自动降低动画质量

## 📁 项目结构

```
massform-demo/
├── index.html          # 主页面
├── styles.css          # 样式文件
├── script.js           # 交互脚本
├── assets/
│   ├── videos/         # 视频文件
│   ├── icons/          # 图标文件
│   └── images/         # 图片文件
├── README.md           # 项目说明
└── LOCAL_DEPLOYMENT.md # 本文件
```

## 🛠️ 开发模式

### 实时预览
使用VS Code Live Server可以实现：
- 文件保存后自动刷新浏览器
- 实时查看修改效果
- 移动端调试支持

### 调试工具
- 按F12打开浏览器开发者工具
- Console面板查看JavaScript错误
- Network面板检查资源加载状态
- Elements面板调试CSS样式

## 🚪 停止服务

### Python HTTP服务器
在终端中按 `Ctrl + C` 停止服务

### VS Code Live Server
- 点击状态栏的"Port: 5500"按钮
- 或者在命令面板中执行"Live Server: Stop Live Server"

## 📱 移动端测试

### 本地网络访问
1. 确保电脑和手机在同一WiFi网络
2. 查看电脑IP地址：`ipconfig`（Windows）或 `ifconfig`（Mac/Linux）
3. 在手机浏览器访问：`http://[电脑IP]:8000`

### Chrome DevTools模拟
1. 按F12打开开发者工具
2. 点击设备图标切换到移动端视图
3. 选择不同设备进行测试

## ⚡ 性能优化

项目已包含以下优化：
- 自动检测用户动画偏好
- 根据设备性能调整动画质量
- 防抖和节流优化滚动性能
- 预加载关键资源
- 响应式图片和字体加载

## 🎯 生产部署

本项目为静态网站，可以部署到：
- Netlify（已配置 `netlify.toml`）
- Vercel
- GitHub Pages
- 任何静态文件托管服务

详细部署说明请参考 `README.md` 文件。
