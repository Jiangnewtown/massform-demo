// 导航栏组件JavaScript模块
class NavbarComponent {
    constructor() {
        this.mobileMenuOpen = false;
        this.logoState = 'font'; // 'font' 或 'bird'
        this.isAnimating = false;
    }

    // 初始化导航栏
    async init() {
        await this.loadNavbar();
        this.setupMobileMenu();
        this.setupLogoInteractions();
        this.setInitialLogoState();
        this.setupProductsLink();
    }

    // 加载导航栏HTML
    async loadNavbar() {
        try {
            const response = await fetch('components/navbar.html');
            const navbarHTML = await response.text();
            
            // 查找导航栏容器或创建一个
            let navContainer = document.querySelector('[data-navbar]');
            if (!navContainer) {
                navContainer = document.createElement('div');
                navContainer.setAttribute('data-navbar', '');
                document.body.insertBefore(navContainer, document.body.firstChild);
            }
            
            navContainer.innerHTML = navbarHTML;
        } catch (error) {
            console.error('Failed to load navbar:', error);
        }
    }

    // 设置移动端菜单功能
    setupMobileMenu() {
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const mobileMenu = document.querySelector('.mobile-menu');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        
        if (!mobileMenuToggle || !mobileMenu) return;
        
        // 汉堡菜单点击事件
        mobileMenuToggle.addEventListener('click', (event) => {
            this.mobileMenuOpen = !this.mobileMenuOpen;
            
            // 获取导航栏元素
            const navbar = document.querySelector('.navbar');
            
            // 切换菜单状态
            mobileMenuToggle.classList.toggle('active', this.mobileMenuOpen);
            mobileMenu.classList.toggle('active', this.mobileMenuOpen);
            
            // 切换导航栏的menu-open状态
            if (navbar) {
                navbar.classList.toggle('menu-open', this.mobileMenuOpen);
            }
            
            // 阻止事件冒泡
            event.stopPropagation();
        });
        
        // 点击菜单链接时关闭菜单
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });
        
        // 点击页面其他区域时关闭菜单
        document.addEventListener('click', (e) => {
            if (this.mobileMenuOpen && !mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
        
        // ESC键关闭菜单
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.mobileMenuOpen) {
                this.closeMobileMenu();
            }
        });
    }
    
    // 关闭移动端菜单
    closeMobileMenu() {
        this.mobileMenuOpen = false;
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const mobileMenu = document.querySelector('.mobile-menu');
        const navbar = document.querySelector('.navbar');
        
        if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
        if (mobileMenu) mobileMenu.classList.remove('active');
        if (navbar) navbar.classList.remove('menu-open');
    }

    // 设置Logo交互功能
    setupLogoInteractions() {
        const brandContainer = document.querySelector('#brand-container');
        const brandLogo = document.querySelector('#brand-logo');
        
        if (!brandContainer || !brandLogo) return;
        
        // 点击事件：切换到logo-font.png
        brandContainer.addEventListener('click', () => {
            if (this.isAnimating) return;
            this.switchLogo('font');
        });
        
        // 滚动事件：根据滚动位置切换logo
        let scrollTimeout;
        window.addEventListener('wheel', (e) => {
            if (this.isAnimating) return;
            
            // 清除之前的超时
            clearTimeout(scrollTimeout);
            
            // 设置延迟，避免过于频繁的切换
            scrollTimeout = setTimeout(() => {
                if (e.deltaY > 0) { // 向下滚动
                    this.switchLogo('bird');
                } else if (e.deltaY < 0) { // 向上滚动
                    // 只有在接近顶部时才切换回font logo
                    if (window.scrollY <= 50) {
                        this.switchLogo('font');
                    }
                }
            }, 100);
        });
    }
    
    // 切换Logo图片
    switchLogo(targetState) {
        if (this.logoState === targetState || this.isAnimating) return;
        
        const brandLogo = document.querySelector('#brand-logo');
        if (!brandLogo) return;
        
        this.isAnimating = true;
        
        // 淡出当前图片
        brandLogo.classList.add('fade-out');
        
        setTimeout(() => {
            // 切换图片源
            if (targetState === 'font') {
                brandLogo.src = 'assets/icons/logo-font.png';
                brandLogo.alt = 'MassForm Font Logo';
                brandLogo.style.height = '';  // 使用CSS控制
                brandLogo.setAttribute('data-logo-type', 'font');
            } else {
                brandLogo.src = 'assets/icons/logo-bird.png';
                brandLogo.alt = 'MassForm Bird Logo';
                brandLogo.style.height = '';  // 使用CSS控制
                brandLogo.setAttribute('data-logo-type', 'bird');
            }
            
            // 淡入新图片
            brandLogo.classList.remove('fade-out');
            brandLogo.classList.add('fade-in');
            
            this.logoState = targetState;
            
            setTimeout(() => {
                brandLogo.classList.remove('fade-in');
                this.isAnimating = false;
            }, 400);
        }, 200);
    }

    // 设置初始logo状态
    setInitialLogoState() {
        const brandLogo = document.querySelector('#brand-logo');
        if (!brandLogo) return;
        
        // 确保初始状态设置正确的data属性和高度
        brandLogo.setAttribute('data-logo-type', 'font');
        brandLogo.style.height = '';  // 清除任何内联样式，使用CSS控制
    }

    // 设置当前页面的活跃状态
    setActivePage(pageName) {
        const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.textContent.trim().toLowerCase() === pageName.toLowerCase() || 
                (pageName === 'home' && link.getAttribute('href') === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    // 设置 Products 链接的跳转功能
    setupProductsLink() {
        // 获取所有 Products 链接（桌面端和移动端）
        const productLinks = document.querySelectorAll('a.nav-link[href="#"], a.mobile-nav-link[href="#"]');
        
        productLinks.forEach(link => {
            if (link.textContent.trim() === 'Products') {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showTransitionPage();
                });
            }
        });
    }

    // 显示过渡页面并跳转
    showTransitionPage() {
        // 众筹页面链接 - 请替换为你的实际众筹链接
        const crowdfundingUrl = 'https://www.kickstarter.com/your-project-link'; // TODO: 替换为实际链接
        
        const transitionOverlay = document.getElementById('products-transition');
        const skipBtn = document.getElementById('skip-btn');
        const countdownSpan = document.getElementById('countdown');
        
        if (!transitionOverlay) return;
        
        // 关闭移动端菜单（如果打开）
        this.closeMobileMenu();
        
        // 显示过渡页面
        transitionOverlay.classList.add('active');
        
        // 倒计时
        let timeLeft = 3;
        countdownSpan.textContent = timeLeft;
        
        const countdownInterval = setInterval(() => {
            timeLeft--;
            if (timeLeft > 0) {
                countdownSpan.textContent = timeLeft;
            } else {
                clearInterval(countdownInterval);
                window.location.href = crowdfundingUrl;
            }
        }, 1000);
        
        // 立即跳转按钮
        skipBtn.onclick = () => {
            clearInterval(countdownInterval);
            window.location.href = crowdfundingUrl;
        };
        
        // ESC键关闭（可选）
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                clearInterval(countdownInterval);
                transitionOverlay.classList.remove('active');
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }
}

// 导出组件类
window.NavbarComponent = NavbarComponent;
