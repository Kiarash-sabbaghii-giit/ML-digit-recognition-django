document.addEventListener('DOMContentLoaded', function() {
    // ===== PRELOADER =====
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.classList.add('hidden');
    }, 1200);

    // ===== AOS INIT =====
    AOS.init({
        duration: 1000,
        once: true,
        offset: 80,
        easing: 'ease-out-cubic'
    });

    // ===== PARTICLES =====
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: ['#4facfe', '#00f2fe', '#f093fb', '#f5576c'] },
                shape: { type: 'circle' },
                opacity: { value: 0.4, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1 } },
                size: { value: 3, random: true, anim: { enable: true, speed: 2, size_min: 0.1 } },
                line_linked: { enable: true, distance: 150, color: '#4facfe', opacity: 0.1, width: 1 },
                move: { enable: true, speed: 2, direction: 'none', random: true, straight: false, out_mode: 'out' }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: { enable: true, mode: 'grab' },
                    onclick: { enable: true, mode: 'push' },
                    resize: true
                },
                modes: {
                    grab: { distance: 200, line_linked: { opacity: 0.3 } },
                    push: { particles_nb: 4 }
                }
            },
            retina_detect: true
        });
    }

    // ===== NAVBAR =====
    const navbar = document.getElementById('navbar');
    const navProgress = document.getElementById('navProgress');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    // Scroll
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        const height = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollY / height) * 100;

        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        navProgress.style.width = progress + '%';
    });

    // Mobile Toggle
    navToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // ===== THEME TOGGLE =====
    const themeToggle = document.getElementById('themeToggle');
    let darkMode = true;

    themeToggle.addEventListener('click', function() {
        darkMode = !darkMode;
        const body = document.body;
        const icon = this.querySelector('i');

        if (darkMode) {
            body.style.background = 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)';
            icon.className = 'fas fa-moon';
        } else {
            body.style.background = 'linear-gradient(135deg, #f5f7fa, #c3cfe2)';
            icon.className = 'fas fa-sun';
        }
    });

    // ===== GSAP HEADER =====
    const tl = gsap.timeline();
    tl.from('.header-badge', { duration: 0.6, y: -20, opacity: 0, ease: 'power2.out' })
      .from('.header h1', { duration: 1, y: 40, opacity: 0, ease: 'back.out(1.7)' }, '-=0.3')
      .from('.subtitle', { duration: 0.6, y: 20, opacity: 0, ease: 'power2.out' }, '-=0.5')
      .from('.header-stats', { duration: 0.6, scale: 0.9, opacity: 0, ease: 'power2.out' }, '-=0.3');

    // ===== MOUSE 3D EFFECT =====
    const container = document.querySelector('.container');
    if (container) {
        document.addEventListener('mousemove', function(e) {
            const x = (e.clientX / window.innerWidth - 0.5) * 8;
            const y = (e.clientY / window.innerHeight - 0.5) * 8;
            container.style.transform = `perspective(1000px) rotateX(${-y}deg) rotateY(${x}deg)`;
            container.style.transition = 'transform 0.2s ease';
        });
    }

    // ===== SCROLL ANIMATIONS =====
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.feature-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: { trigger: card, start: 'top 85%' },
            duration: 0.6,
            y: 30,
            opacity: 0,
            delay: i * 0.08,
            ease: 'power2.out'
        });
    });
});