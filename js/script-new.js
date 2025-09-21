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
    // 触摸事件变量
    let touchStartY = 0;
    let touchEndY = 0;
    let touchStartTime = 0;
    const minSwipeDistance = 50; // 最小滑动距离
    const maxSwipeTime = 300; // 最大滑动时间(ms)

    // 主初始化函数 - 页面加载时执行的设置
    const init = () => {
        handleLoadingScreen(); // 处理加载屏幕和视频初始化
        setupInitialState(); // 设置页面初始状态
        window.addEventListener('wheel', handleWheel, { passive: false }); // 绑定滚轮事件(非被动模式以便阻止默认行为)
        
        // 添加移动端触摸事件支持
        window.addEventListener('touchstart', handleTouchStart, { passive: false });
        window.addEventListener('touchend', handleTouchEnd, { passive: false });
    };

    // 触摸开始事件处理
    const handleTouchStart = (e) => {
        if (scrollLocked) {
            // 检查触摸是否在导航栏或交互元素上
            const target = e.target;
            const inNavbar = target.closest('.navbar') || target.closest('.mobile-menu');
            const interactive = target.closest('a, button, input, textarea, select, label');
            
            // 如果在导航栏或交互元素上，不处理滑动手势
            if (inNavbar || interactive) {
                return;
            }
            
            touchStartY = e.touches[0].clientY;
            touchStartTime = Date.now();
        }
    };

    // 触摸结束事件处理
    const handleTouchEnd = (e) => {
        if (scrollLocked) {
            // 检查触摸是否在导航栏或交互元素上
            const target = e.target;
            const inNavbar = target.closest('.navbar') || target.closest('.mobile-menu');
            const interactive = target.closest('a, button, input, textarea, select, label');
            
            // 检查移动端菜单是否打开
            const mobileMenu = document.querySelector('.mobile-menu');
            const menuIsOpen = mobileMenu && mobileMenu.classList.contains('active');
            
            // 如果菜单打开且触摸在菜单外部，关闭菜单
            if (menuIsOpen && !inNavbar) {
                // 关闭菜单
                const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
                const navbar = document.querySelector('.navbar');
                
                if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
                if (mobileMenu) mobileMenu.classList.remove('active');
                if (navbar) navbar.classList.remove('menu-open');
                
                // 不处理滑动手势，只关闭菜单
                return;
            }
            
            // 如果在导航栏或交互元素上，允许正常点击
            if (inNavbar || interactive) {
                return;
            }
            
            // 只有在非导航栏区域才处理滑动手势
            if (touchStartY === 0) return; // 如果没有记录开始位置，说明开始时就被跳过了
            
            touchEndY = e.changedTouches[0].clientY;
            const touchTime = Date.now() - touchStartTime;
            const swipeDistance = Math.abs(touchEndY - touchStartY);
            
            // 检查是否为有效滑动
            if (swipeDistance >= minSwipeDistance && touchTime <= maxSwipeTime) {
                e.preventDefault(); // 只在确认是滑动手势时才阻止默认行为
                if (isScrolling) return;
                
                isScrolling = true;
                const swipeUp = touchStartY > touchEndY; // 向上滑动
                
                if (swipeUp) {
                    // 向上滑动：推进到下一阶段
                    if (scrollStage < 2) {
                        scrollStage++;
                    } else {
                        startProgressiveReveal();
                    }
                } else {
                    // 向下滑动：回到上一阶段
                    if (scrollStage > 0) {
                        scrollStage--;
                        if (scrollStage < 2) {
                            hideBackgroundImage();
                        }
                    }
                }
                
                updateSlideState();
                setTimeout(() => { isScrolling = false; }, 1000);
            }
            
            // 重置触摸开始位置
            touchStartY = 0;
        }
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

    // 开始渐进式显示背景图片 - 优化移动端性能
    function startProgressiveReveal() {
        console.log('开始渐进式显示背景图片');
        
        // 检测是否为移动设备
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // 移动端：使用更流畅的切换方式
            startMobileOptimizedTransition();
        } else {
            // 桌面端：保持原有效果
            startDesktopTransition();
        }
    }
    
    // 移动端优化的切换逻辑
    function startMobileOptimizedTransition() {
        // 1. 预加载背景图片以确保流畅切换
        const bgImage = new Image();
        bgImage.onload = () => {
            // 2. 同步进行视频淡出和背景图片淡入
            performMobileTransition();
        };
        bgImage.src = 'assets/images/background2.jpg';
        
        // 如果图片已缓存，直接执行
        if (bgImage.complete) {
            performMobileTransition();
        }
    }
    
    // 执行移动端流畅切换
    function performMobileTransition() {
        // 使用 requestAnimationFrame 确保流畅动画
        requestAnimationFrame(() => {
            // 1. 立即开始背景图片显示（无延迟）
            if (backgroundImageContainer) {
                backgroundImageContainer.style.transition = 'opacity 0.6s ease-out';
                backgroundImageContainer.classList.add('show-background');
            }
            
            // 2. 同时开始视频淡出
            if (video) {
                video.style.transition = 'opacity 0.6s ease-out';
                video.style.opacity = '0';
                // 延迟暂停视频以避免卡顿
                setTimeout(() => video.pause(), 300);
            }
            
            // 3. 视频遮罩同步淡出
            if (videoOverlay) {
                videoOverlay.style.transition = 'background 0.6s ease-out';
                videoOverlay.style.background = 'rgba(0, 0, 0, 0)';
            }
            
            // 4. 文字内容切换
            setTimeout(() => {
                // 隐藏原始内容
                const mainTitle = document.querySelector('.main-title');
                const subtitle = document.querySelector('.subtitle');
                if (mainTitle) {
                    mainTitle.style.transition = 'opacity 0.4s ease-out';
                    mainTitle.style.opacity = '0';
                }
                if (subtitle) {
                    subtitle.style.transition = 'opacity 0.4s ease-out';
                    subtitle.style.opacity = '0';
                }
                
                // 显示背景文本
                setTimeout(() => {
                    const bgText = document.querySelector('.background-text-content');
                    if (bgText) {
                        bgText.style.transition = 'opacity 0.5s ease-in';
                        bgText.classList.add('show');
                    }
                    
                    // 解锁滚动
                    setTimeout(() => {
                        unlockScroll();
                    }, 200);
                }, 200);
            }, 300);
        });
    }
    
    // 桌面端切换逻辑（保持原有效果）
    function startDesktopTransition() {
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
            
            // 解锁滚动
            setTimeout(() => {
                unlockScroll();
            }, 400);
        }, 400);
    }
    
    // 显示背景图片 - 兼容原有逻辑
    function showBackgroundImage() {
        startProgressiveReveal();
    }

    // 隐藏背景图片 - 恢复视频播放（移动端优化）
    function hideBackgroundImage() {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // 移动端：使用优化的反向切换
            performMobileReverseTransition();
        } else {
            // 桌面端：保持原有逻辑
            performDesktopReverseTransition();
        }
    }
    
    // 移动端优化的反向切换
    function performMobileReverseTransition() {
        requestAnimationFrame(() => {
            // 1. 立即隐藏背景文字内容
            const bgText = document.querySelector('.background-text-content');
            if (bgText) {
                bgText.style.transition = 'opacity 0.3s ease-out';
                bgText.classList.remove('show');
            }
            
            // 2. 同步开始视频恢复和背景图片淡出
            if (video) {
                video.style.transition = 'opacity 0.5s ease-in';
                video.style.opacity = '1';
                video.play().catch(() => {});
            }
            
            if (videoOverlay) {
                videoOverlay.style.transition = 'background 0.5s ease-in';
                videoOverlay.style.background = 'rgba(0, 0, 0, 0.6)';
            }
            
            // 3. 延迟隐藏背景图片容器
            setTimeout(() => {
                if (backgroundImageContainer) {
                    backgroundImageContainer.style.transition = 'opacity 0.4s ease-out';
                    backgroundImageContainer.classList.remove('show-background');
                }
                
                // 4. 恢复文字内容
                setTimeout(() => {
                    const mainTitle = document.querySelector('.main-title');
                    const subtitle = document.querySelector('.subtitle');
                    if (mainTitle) {
                        mainTitle.style.transition = 'opacity 0.4s ease-in';
                        mainTitle.style.opacity = '1';
                    }
                    if (subtitle) {
                        subtitle.style.transition = 'opacity 0.4s ease-in';
                        subtitle.style.opacity = '1';
                    }
                }, 100);
            }, 200);
        });
    }
    
    // 桌面端反向切换逻辑
    function performDesktopReverseTransition() {
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
            video.style.opacity = '1';
            video.play().catch(() => {});
        }
        if (videoOverlay) {
            videoOverlay.style.background = 'rgba(0, 0, 0, 0.6)';
        }
        
        // 然后让背景图片滚动下去
        setTimeout(() => {
            if (backgroundImageContainer) {
                backgroundImageContainer.classList.remove('show-background');
            }
        }, 200);
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
