document.addEventListener('DOMContentLoaded', async () => {
    // 初始化导航栏组件
    const navbar = new NavbarComponent();
    await navbar.init();
    navbar.setActivePage('Our Story');
    
    // 滚动淡入动画
    const fadeItems = document.querySelectorAll('.scroll-fade-item');

    const observerOptions = {
        root: null, // use the viewport
        rootMargin: '0px',
        threshold: 0.1 // trigger when 10% of the item is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop observing once it's visible
            }
        });
    }, observerOptions);

    fadeItems.forEach(item => {
        observer.observe(item);
    });
});
