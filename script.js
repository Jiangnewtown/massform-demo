// 全局变量
let currentSlide = 1;
let isScrolling = false;
let scrollTimeout;
let isLoading = true;

// DOM 元素
let slides, dots, totalSlides;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化DOM元素
    slides = document.querySelectorAll('.slide');
    dots = document.querySelectorAll('.dot');
    totalSlides = slides.length;
    
    // 显示加载动画
    showLoadingScreen();
    
    // 预加载资源后初始化
    preloadResources().then(() => {
        initializeSlider();
        setupEventListeners();
        hideLoadingScreen();
    });
});

// 显示加载动画
function showLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        loadingScreen.style.display = 'flex';
    }
}

// 隐藏加载动画
function hideLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                isLoading = false;
            }, 500);
        }, 1000);
    }
}

// 预加载资源
function preloadResources() {
    return new Promise((resolve) => {
        const resources = [

        ];
        
        let loadedCount = 0;
        const totalResources = resources.length;
        
        if (totalResources === 0) {
            resolve();
            return;
        }
        
        resources.forEach(src => {
            const img = new Image();
            img.onload = img.onerror = () => {
                loadedCount++;
                if (loadedCount === totalResources) {
                    resolve();
                }
            };
            img.src = src;
        });
        
        // 最大等待时间3秒
        setTimeout(resolve, 3000);
    });
}

// 初始化滑块
function initializeSlider() {
    // 确保第一个滑块是激活状态，但不是scrolled状态
    slides.forEach((slide, index) => {
        slide.classList.remove('active', 'scrolled');
        if (index === 0) {
            slide.classList.add('active');
        }
    });
    
    // 确保第一个圆点是激活状态
    dots.forEach((dot, index) => {
        dot.classList.remove('active');
        if (index === 0) {
            dot.classList.add('active');
        }
    });
    
    currentSlide = 1;
    document.body.classList.add('loaded');
}

// 设置事件监听器
function setupEventListeners() {
    window.addEventListener('wheel', handleScroll, { passive: false });
    
    let touchStartY = 0;
    let touchEndY = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    
    document.addEventListener('touchend', function(e) {
        touchEndY = e.changedTouches[0].screenY;
        handleTouchScroll();
    }, { passive: true });
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            updateSlide(index + 1);
        });
    });
    
    document.addEventListener('keydown', handleKeyboard);
    window.addEventListener('resize', debounce(handleResize, 250));
    
    // 初始化视频背景
    initializeVideoBackground();
}

// 初始化视频背景
function initializeVideoBackground() {
    const video = document.querySelector('.video-background video');
    const fallbackBg = document.querySelector('.fallback-bg');
    
    if (video) {
        video.addEventListener('error', handleVideoError);
        video.addEventListener('loadeddata', handleVideoLoaded);
        video.addEventListener('canplay', handleVideoLoaded);
        
        // 尝试加载视频
        video.load();
        
        // 检查视频是否能加载
        setTimeout(() => {
            if (video.readyState === 0 || video.networkState === 3) {
                // 视频无法加载，显示备用背景
                handleVideoError();
            }
        }, 5000);
    } else {
        // 如果没有视频元素，直接显示备用背景
        handleVideoError();
    }
}

// 处理视频错误
function handleVideoError() {
    console.log('视频加载失败，使用备用背景');
    const video = document.querySelector('.video-background video');
    const fallbackBg = document.querySelector('.fallback-bg');
    if (video) {
        video.style.display = 'none';
    }
    if (fallbackBg) {
        fallbackBg.style.display = 'block';
    }
}

// 处理视频加载
function handleVideoLoaded() {
    console.log('视频加载成功');
    const video = document.querySelector('.video-background video');
    const fallbackBg = document.querySelector('.fallback-bg');
    if (video) {
        video.style.display = 'block';
    }
    if (fallbackBg) {
        fallbackBg.style.display = 'none';
    }
}

// 处理滚轮事件
function handleScroll(e) {
    if (isLoading) return;
    
    e.preventDefault();
    const delta = e.deltaY;
    const activeSlide = document.querySelector('.slide.active');
    
    // 如果当前slide还没有scrolled状态，第一次滚动时添加scrolled类
    if (activeSlide && !activeSlide.classList.contains('scrolled')) {
        activeSlide.classList.add('scrolled');
        return;
    }
    
    // 如果已经是scrolled状态，才进行slide切换
    if (isScrolling) return;
    
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        if (delta > 0) {
            nextSlide();
        } else {
            prevSlide();
        }
    }, 50);
}

// 处理触摸滚动
function handleTouchScroll() {
    if (isLoading) return;
    
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            nextSlide();
        } else {
            prevSlide();
        }
    }
}

// 处理键盘事件
function handleKeyboard(e) {
    if (isLoading) return;
    
    switch(e.key) {
        case 'ArrowDown':
        case ' ':
            e.preventDefault();
            nextSlide();
            break;
        case 'ArrowUp':
            e.preventDefault();
            prevSlide();
            break;
        case 'Home':
            e.preventDefault();
            updateSlide(1);
            break;
        case 'End':
            e.preventDefault();
            updateSlide(totalSlides);
            break;
    }
}

// 下一张滑块
function nextSlide() {
    if (currentSlide < totalSlides) {
        updateSlide(currentSlide + 1);
    }
}

// 上一张滑块
function prevSlide() {
    if (currentSlide > 1) {
        updateSlide(currentSlide - 1);
    }
}

// 更新滑块
function updateSlide(slideNumber) {
    if (slideNumber === currentSlide || isScrolling) return;
    
    isScrolling = true;
    const previousSlide = currentSlide;
    currentSlide = slideNumber;
    
    slides.forEach((slide, index) => {
        slide.classList.remove('active', 'scrolled');
        if (index === slideNumber - 1) {
            slide.classList.add('active');
            // 如果不是第一次进入这个slide，立即添加scrolled类
            if (previousSlide !== slideNumber) {
                setTimeout(() => {
                    slide.classList.add('scrolled');
                }, 300);
            }
        }
    });
    
    dots.forEach((dot, index) => {
        dot.classList.remove('active');
        if (index === slideNumber - 1) {
            dot.classList.add('active');
        }
    });
    
    triggerTextAnimation(slideNumber);
    
    setTimeout(() => {
        isScrolling = false;
    }, 800);
}

// 触发文字动画
function triggerTextAnimation(slideNumber) {
    const activeSlide = document.querySelector(`[data-slide="${slideNumber}"]`);
    if (!activeSlide) return;
    
    const paragraphs = activeSlide.querySelectorAll('.description p');
    
    paragraphs.forEach(p => {
        p.style.animation = 'none';
        p.offsetHeight;
        p.style.animation = null;
    });
}

// 处理窗口大小改变
function handleResize() {
    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => {
        slide.style.height = 'auto';
    });
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 导出函数供外部使用
window.MassFormSlider = {
    nextSlide,
    prevSlide,
    goToSlide: updateSlide,
    getCurrentSlide: () => currentSlide,
    getTotalSlides: () => totalSlides
};
