// 导航栏组件JavaScript模块
class NavbarComponent {
    constructor() {
        this.mobileMenuOpen = false;
        this.init();
    }

    // 初始化导航栏
    async init() {
        await this.loadNavbar();
        this.setupMobileMenu();
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
            
            // 切换菜单状态
            mobileMenuToggle.classList.toggle('active', this.mobileMenuOpen);
            mobileMenu.classList.toggle('active', this.mobileMenuOpen);
            
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
        
        if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
        if (mobileMenu) mobileMenu.classList.remove('active');
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
}

// 导出组件类
window.NavbarComponent = NavbarComponent;
