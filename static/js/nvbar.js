document.addEventListener('DOMContentLoaded', function() {
    // ===== NAVBAR SCROLL EFFECT =====
    const navbar = document.getElementById('navbar');
    const navProgress = document.getElementById('navProgress');

    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        const height = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollY / height) * 100;

        // Navbar shadow on scroll
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Progress bar
        navProgress.style.width = progress + '%';
    });

    // ===== NAV TOGGLE =====
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    navToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu on link click (mobile)
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // ===== THEME TOGGLE =====
    const themeToggle = document.getElementById('themeToggle');
    let darkMode = true;

    themeToggle.addEventListener('click', function(e) {
        e.preventDefault();
        darkMode = !darkMode;

        const body = document.body;
        const icon = this.querySelector('i');
        const span = this.querySelector('span');

        if (darkMode) {
            body.style.background = 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)';
            icon.className = 'fas fa-moon';
            span.textContent = 'Theme';
        } else {
            body.style.background = 'linear-gradient(135deg, #f5f7fa, #c3cfe2)';
            icon.className = 'fas fa-sun';
            span.textContent = 'Theme';
        }
    });

    // ===== NAV HOVER ANIMATION =====
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('mouseenter', function() {
            const icon = this.querySelector('i');
            gsap.to(icon, {
                duration: 0.3,
                scale: 1.2,
                ease: 'back.out(2)'
            });
        });

        link.addEventListener('mouseleave', function() {
            const icon = this.querySelector('i');
            gsap.to(icon, {
                duration: 0.3,
                scale: 1,
                ease: 'power2.out'
            });
        });
    });

    // ===== ACTIVE LINK HIGHLIGHT =====
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath !== '/' && href !== '/' && currentPath.startsWith(href))) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});