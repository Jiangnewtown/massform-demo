document.addEventListener('DOMContentLoaded', async () => {
    // 初始化导航栏组件
    const navbar = new NavbarComponent();
    await navbar.init();
    navbar.setActivePage('home');
    
    // 滚动阶段控制变量
    let scrollStage = 0; // 0: 初始状态(只显示大标题), 1: 显示描述文字, 2: 显示背景图片, 3: 解锁自由滚动
    let isScrolling = false; // 防止滚动过快的节流控制
    let scrollLocked = true; // 是否锁定滚动(三阶段模式)
    let observer; // 交叉观察器(用于自由滚动模式)

    // DOM元素获取
    const activeSlide = document.querySelector('.slide.active'); // 当前激活的文字滑块
    const video = document.querySelector('.video-background video'); // 背景视频元素
    const backgroundImageContainer = document.querySelector('.background-image-container'); // 背景图片容器
    const videoBackground = document.querySelector('.video-background'); // 视频背景容器
    const videoOverlay = document.querySelector('.video-overlay'); // 视频遮罩层
    const dots = document.querySelectorAll('.dot'); // 滚动指示点
    const scrollIndicator = document.querySelector('.scroll-indicator'); // 滚动指示器

    // 初始化
    // 主初始化函数 - 页面加载时执行的设置
    const init = () => {
        handleLoadingScreen(); // 处理加载屏幕和视频初始化
        setupInitialState(); // 设置页面初始状态
        window.addEventListener('wheel', handleWheel, { passive: false }); // 绑定滚轮事件(非被动模式以便阻止默认行为)
    };

    // 鼠标滚轮事件处理 - 实现三阶段滚动控制
    const handleWheel = (e) => {
        if (scrollLocked) {
            // 锁定滚动模式：三阶段切换
            e.preventDefault(); // 阻止默认滚动行为
            if (isScrolling) return; // 防止滚动过快

            isScrolling = true;
            const scrollDown = e.deltaY > 0; // 判断滚动方向

            if (scrollDown) {
                // 向下滚动：推进到下一阶段
                if (scrollStage < 2) {
                    scrollStage++; // 阶段0→1→2
                } else {
                    // 第三阶段：开始渐进式显示背景图片
                    startProgressiveReveal();
                }
            } else {
                // 向上滚动：回到上一阶段
                if (scrollStage > 0) {
                    scrollStage--; // 阶段2→1→0
                    if (scrollStage < 2) {
                        hideBackgroundImage(); // 隐藏背景图片
                    }
                }
            }
            updateSlideState(); // 更新界面状态
            setTimeout(() => { isScrolling = false; }, 1000); // 1秒后重置滚动锁
        } else {
            // 自由滚动模式：检测是否需要重新锁定
            if (window.scrollY === 0 && e.deltaY < 0) {
                lockScroll(); // 滚动到顶部且向上滚动时重新锁定
            }
        }
    };

    // 更新界面状态 - 根据当前滚动阶段显示对应内容
    const updateSlideState = () => {
        if (!activeSlide) return;

        // 阶段1：显示描述文字
        if (scrollStage >= 1) {
            activeSlide.classList.add('show-description'); // 显示小标题和描述
        } else {
            activeSlide.classList.remove('show-description'); // 只显示大标题
        }

        // 阶段2：显示背景图片
        if (scrollStage >= 2) {
            activeSlide.classList.add('show-background'); // 文字内容淡出
            showBackgroundImage(); // 显示背景图片，暂停视频
        } else {
            activeSlide.classList.remove('show-background'); // 恢复文字显示
            hideBackgroundImage(); // 隐藏背景图片，恢复视频
        }
        updateDots(); // 更新滚动指示点
    };

    // 解锁自由滚动 - 从三阶段模式切换到正常页面滚动
    const unlockScroll = () => {
        scrollLocked = false; // 解除滚动锁定
        scrollStage = 3; // 设置为解锁状态
        document.body.classList.add('scroll-unlocked'); // 添加解锁样式类
        scrollIndicator.style.opacity = '0'; // 隐藏滚动指示器
        
        // 保持背景图显示并让它参与正常页面滚动
        if (backgroundImageContainer) {
            backgroundImageContainer.classList.add('show-background');
        }
        
        initIntersectionObserver(); // 初始化滚动观察器
        updateDots(); // 更新指示点状态
    };

    // 重新锁定滚动 - 从自由滚动模式回到三阶段模式
    const lockScroll = () => {
        if (isScrolling) return; // 防止重复触发
        isScrolling = true;

        scrollLocked = true; // 重新锁定滚动
        scrollStage = 2; // 设置为背景图显示阶段
        document.body.classList.remove('scroll-unlocked'); // 移除解锁样式
        scrollIndicator.style.opacity = '1'; // 显示滚动指示器
        
        // 重新进入锁定模式时保持背景图显示
        if (backgroundImageContainer) {
            backgroundImageContainer.classList.add('show-background');
        }
        
        if (observer) observer.disconnect(); // 断开滚动观察器
        
        setTimeout(() => { isScrolling = false; }, 500); // 500ms后重置滚动锁
    };

    // 更新滚动指示点 - 显示当前所在阶段
    const updateDots = () => {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === scrollStage); // 激活对应阶段的指示点
        });
    };

    // 初始化交叉观察器 - 用于自由滚动模式下的内容显示控制
    const initIntersectionObserver = () => {
        // 简化的观察器，用于后续可能的滚动动画扩展
        console.log('自由滚动模式已启用 - 可以正常滚动浏览后续内容');
    };

    // 开始渐进式显示背景图片
    function startProgressiveReveal() {
        console.log('开始渐进式显示背景图片');
        
        // 立即显示背景图片容器
        if (backgroundImageContainer) {
            backgroundImageContainer.classList.add('show-background');
        }
        
        // 延迟处理视频和文字
        setTimeout(() => {
            if (video) {
                video.pause();
                video.style.opacity = '0';
            }
            if (videoOverlay) {
                videoOverlay.style.background = 'rgba(0, 0, 0, 0)';
            }
            
            // 显示背景文本
            const bgText = document.querySelector('.background-text-content');
            if (bgText) bgText.classList.add('show');
            
            // 隐藏原始内容
            const mainTitle = document.querySelector('.main-title');
            const subtitle = document.querySelector('.subtitle');
            if (mainTitle) mainTitle.style.opacity = '0';
            if (subtitle) subtitle.style.opacity = '0';
            
            // 解锁滚动，让用户可以继续滚动查看图片的其余部分
            setTimeout(() => {
                unlockScroll();
            }, 800);
        }, 800);
    }
    
    // 显示背景图片 - 兼容原有逻辑
    function showBackgroundImage() {
        startProgressiveReveal();
    }

    // 隐藏背景图片 - 恢复视频播放
    function hideBackgroundImage() {
        // 立即隐藏背景文字内容
        const bgText = document.querySelector('.background-text-content');
        if (bgText) bgText.classList.remove('show');
        
        // 恢复大标题和小标题
        const mainTitle = document.querySelector('.main-title');
        const subtitle = document.querySelector('.subtitle');
        if (mainTitle) mainTitle.style.opacity = '1';
        if (subtitle) subtitle.style.opacity = '1';
        
        // 先恢复视频播放
        if (video) {
            video.style.opacity = '1'; // 视频淡入
            video.play().catch(() => {}); // 恢复播放(忽略可能的播放错误)
        }
        if (videoOverlay) {
            videoOverlay.style.background = 'rgba(0, 0, 0, 0.6)'; // 恢复视频遮罩层
        }
        
        // 然后让背景图片滚动下去
        setTimeout(() => {
            if (backgroundImageContainer) {
                backgroundImageContainer.classList.remove('show-background'); // 背景图片滚动回屏幕下方
            }
        }, 200); // 200ms延迟确保视频先恢复
    }

    // 设置初始状态 - 页面加载时的默认显示
    const setupInitialState = () => {
        if (activeSlide) {
            activeSlide.classList.add('active'); // 激活第一个文字滑块
        }
        updateDots(); // 初始化指示点状态
    };

    // 处理加载屏幕 - 页面加载完成后的初始化
    const handleLoadingScreen = () => {
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('hidden'); // 隐藏加载屏幕
            }, 500);
        }
        
        // 初始化背景视频播放
        if (video) {
            video.style.display = 'block'; // 显示视频元素
            video.style.opacity = '1'; // 设置完全不透明
            video.play().catch(() => {}); // 开始播放(忽略可能的自动播放限制错误)
        }
    };


    init();
});
