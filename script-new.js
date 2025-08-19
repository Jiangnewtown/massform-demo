// 简化的滚动控制脚本
let scrollStage = 0; // 0: 大标题, 1: 小标题, 2: 背景图展示
let isScrolling = false;

// 等待页面加载完成
window.addEventListener('load', function() {
    const video = document.querySelector('.video-background video');
    const fallbackBg = document.querySelector('.fallback-bg');
    const slides = document.querySelectorAll('.slide');
    
    if (video) {
        video.style.display = 'block';
        video.style.opacity = '1';
    }
    
    if (fallbackBg) {
        fallbackBg.style.display = 'block';
        fallbackBg.style.zIndex = '-2';
        fallbackBg.style.opacity = '1';
    }
    
    scrollStage = 0;
    
    slides.forEach((slide, index) => {
        slide.classList.remove('active', 'show-subtitle', 'show-background', 'show-description');
        if (index === 0) {
            slide.classList.add('active');
        }
    });
    
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 1000);
    }
    
    document.addEventListener('wheel', function(e) {
        if (isScrolling) {
            return;
        }
        
        e.preventDefault();
        isScrolling = true;
        
        const activeSlide = document.querySelector('.slide.active');
        if (!activeSlide) {
            isScrolling = false;
            return;
        }
        
        if (e.deltaY > 0) {
            // 向下滚动
            if (scrollStage === 0) {
                scrollStage = 1;
                activeSlide.classList.add('show-description');
            } else if (scrollStage === 1) {
                scrollStage = 2;
                showBackgroundImage();
                activeSlide.classList.add('show-background');
            }
        } else {
            // 向上滚动
            if (scrollStage === 2) {
                scrollStage = 1;
                hideBackgroundImage();
                activeSlide.classList.remove('show-background');
            } else if (scrollStage === 1) {
                scrollStage = 0;
                activeSlide.classList.remove('show-description');
            }
        }

        setTimeout(() => {
            isScrolling = false;
        }, 800); // 增加延迟以匹配CSS动画时间
        
    }, { passive: false });
});

// 显示背景图，停止视频
function showBackgroundImage() {
    const video = document.querySelector('.video-background video');
    const fallbackBg = document.querySelector('.fallback-bg');
    const videoBackground = document.querySelector('.video-background');
    const videoOverlay = document.querySelector('.video-overlay');
    
    if (video) {
        video.pause();
        video.style.display = 'none';
    }
    
    if (fallbackBg) {
        fallbackBg.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: url("assets/images/background2.jpg") center/cover no-repeat !important;
            z-index: -1 !important;
            opacity: 1 !important;
            display: block !important;
        `;
    }
    
    if (videoBackground) {
        videoBackground.style.backgroundImage = 'url("assets/images/background2.jpg")';
        videoBackground.style.backgroundSize = 'cover';
        videoBackground.style.backgroundPosition = 'center';
    }
    
    if (videoOverlay) {
        videoOverlay.style.background = 'rgba(0, 0, 0, 0.3)';
    }
}

// 隐藏背景图，恢复视频
function hideBackgroundImage() {
    const video = document.querySelector('.video-background video');
    const fallbackBg = document.querySelector('.fallback-bg');
    const videoBackground = document.querySelector('.video-background');
    const videoOverlay = document.querySelector('.video-overlay');
    
    if (fallbackBg) {
        fallbackBg.style.backgroundImage = '';
        fallbackBg.style.background = '';
        fallbackBg.style.zIndex = '-2';
    }
    
    if (videoBackground) {
        videoBackground.style.backgroundImage = '';
    }
    
    if (videoOverlay) {
        videoOverlay.style.background = 'rgba(0, 0, 0, 0.6)';
    }
    
    if (video) {
        video.style.display = 'block';
        video.play().catch(e => {});
    }
}
