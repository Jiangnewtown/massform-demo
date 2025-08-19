document.addEventListener('DOMContentLoaded', () => {
    let scrollStage = 0; // 0: 初始, 1: 描述, 2: 背景, 3: 解锁
    let isScrolling = false;
    let scrollLocked = true;
    let observer;

    const activeSlide = document.querySelector('.slide.active');
    const video = document.querySelector('.video-background video');
    const fallbackBg = document.querySelector('.fallback-bg');
    const videoBackground = document.querySelector('.video-background');
    const videoOverlay = document.querySelector('.video-overlay');
    const dots = document.querySelectorAll('.dot');
    const scrollIndicator = document.querySelector('.scroll-indicator');

    // 初始化
    const init = () => {
        handleLoadingScreen();
        setupInitialState();
        window.addEventListener('wheel', handleWheel, { passive: false });
    };

    const handleWheel = (e) => {
        if (scrollLocked) {
            e.preventDefault();
            if (isScrolling) return;

            isScrolling = true;
            const scrollDown = e.deltaY > 0;

            if (scrollDown) {
                if (scrollStage < 2) {
                    scrollStage++;
                } else {
                    unlockScroll();
                }
            } else {
                if (scrollStage > 0) {
                    scrollStage--;
                }
            }
            updateSlideState();
            setTimeout(() => { isScrolling = false; }, 1000);
        } else {
            if (window.scrollY === 0 && e.deltaY < 0) {
                lockScroll();
            }
        }
    };

    const updateSlideState = () => {
        if (!activeSlide) return;

        // Stage 1: Show description
        if (scrollStage >= 1) {
            activeSlide.classList.add('show-description');
        } else {
            activeSlide.classList.remove('show-description');
        }

        // Stage 2: Show background
        if (scrollStage >= 2) {
            activeSlide.classList.add('show-background');
            showBackgroundImage();
        } else {
            activeSlide.classList.remove('show-background');
            hideBackgroundImage();
        }
        updateDots();
    };

    const unlockScroll = () => {
        scrollLocked = false;
        scrollStage = 3;
        document.body.classList.add('scroll-unlocked');
        scrollIndicator.style.opacity = '0';
        
        // 保持背景图显示并让它参与滚动
        if (fallbackBg) {
            fallbackBg.classList.add('show-background');
        }
        
        initIntersectionObserver();
        updateDots();
    };

    const lockScroll = () => {
        if (isScrolling) return;
        isScrolling = true;

        scrollLocked = true;
        scrollStage = 2;
        document.body.classList.remove('scroll-unlocked');
        scrollIndicator.style.opacity = '1';
        
        // 重新进入锁定模式时保持背景图显示
        if (fallbackBg) {
            fallbackBg.classList.add('show-background');
        }
        
        if (observer) observer.disconnect();
        
        setTimeout(() => { isScrolling = false; }, 500);
    };

    const updateDots = () => {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === scrollStage);
        });
    };

    const initIntersectionObserver = () => {
        // 简化的观察器，不再需要复杂的reveal动画
        console.log('自由滚动模式已启用');
    };

    function showBackgroundImage() {
        if (video) {
            video.pause();
            video.style.opacity = '0';
        }
        
        if (fallbackBg) {
            fallbackBg.classList.add('show-background');
        }
        
        if (videoOverlay) {
            videoOverlay.style.background = 'rgba(0, 0, 0, 0.3)';
        }
    }

    function hideBackgroundImage() {
        if (fallbackBg) {
            fallbackBg.classList.remove('show-background');
        }
        
        if (videoOverlay) {
            videoOverlay.style.background = 'rgba(0, 0, 0, 0.6)';
        }
        
        if (video) {
            video.style.opacity = '1';
            video.play().catch(() => {});
        }
    }

    const setupInitialState = () => {
        if (activeSlide) {
            activeSlide.classList.add('active');
        }
        updateDots();
    };

    const handleLoadingScreen = () => {
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
            }, 500);
        }
        
        // 初始化视频
        if (video) {
            video.style.display = 'block';
            video.style.opacity = '1';
            video.play().catch(() => {});
        }
    };

    init();
});
