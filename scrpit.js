// ========================================
// PRELOADER MEJORADO CON AUDIO Y TIMING
// ========================================

const preloader = document.getElementById('preloader');
const preloaderVideo = document.getElementById('preloader-video');
const preloaderAudio = document.getElementById('preloader-audio');
let isRemoved = false;

// Bloquear scroll y ocultar contenido inicialmente
document.body.classList.add('preloader-active');

function removePreloader() {
    if (isRemoved) return;
    
    isRemoved = true;
    
    // Fade out del preloader
    preloader.classList.add('fade-out');
    
    // Después de la transición, remover del DOM y habilitar scroll
    setTimeout(() => {
        preloader.style.display = 'none';
        document.body.classList.remove('preloader-active');
        
        // Iniciar animaciones de la página
        initPageAnimations();
    }, 800);
}

// Reproducir audio con manejo de errores
if (preloaderAudio) {
    const playAudio = () => {
        preloaderAudio.play().catch(err => {
            console.log('Audio bloqueado por el navegador:', err);
        });
    };
    
    // Intentar reproducir
    playAudio();
    
    // Backup: reproducir al hacer clic (por políticas de autoplay)
    document.addEventListener('click', playAudio, { once: true });
}

// Remover preloader cuando el video termine (aprox 3 segundos)
if (preloaderVideo) {
    preloaderVideo.addEventListener('ended', removePreloader);
}

// Seguridad: forzar remoción a los 3.5 segundos (por si el evento 'ended' falla)
setTimeout(removePreloader, 3500);

// ========================================
// INICIALIZAR ANIMACIONES DESPUÉS DEL PRELOADER
// ========================================

function initPageAnimations() {
    // Animar contadores del hero
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        const numbers = heroStats.querySelectorAll('.stat-number');
        numbers.forEach(num => {
            animateCounter(num);
        });
    }
    
    // Revelar floating badges
    const floatingBadges = document.querySelectorAll('.floating-badge');
    floatingBadges.forEach((badge, index) => {
        setTimeout(() => {
            badge.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            badge.style.opacity = '1';
            badge.style.transform = 'scale(1)';
        }, 300 + (index * 200));
    });
}

// ========================================
// HEADER SCROLL EFFECT
// ========================================

const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ========================================
// MENÚ MÓVIL
// ========================================

const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        if (navLinks.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    document.addEventListener('click', (e) => {
        if (!mobileMenuBtn.contains(e.target) && !navLinks.contains(e.target)) {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// ========================================
// SMOOTH SCROLLING
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========================================
// ANIMACIÓN DE CONTADORES
// ========================================

const animateCounter = (element) => {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            if (target === 100) {
                element.textContent = Math.floor(current) + '%';
            } else {
                element.textContent = Math.floor(current) + '+';
            }
            requestAnimationFrame(updateCounter);
        } else {
            if (target === 100) {
                element.textContent = target + '%';
            } else {
                element.textContent = target + '+';
            }
        }
    };
    
    updateCounter();
};

// ========================================
// SCROLL ANIMATIONS - SECCIONES
// ========================================

const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.about, .projects, .process, .skills, .cta').forEach(section => {
    sectionObserver.observe(section);
});

// ========================================
// ANIMACIÓN TARJETAS DE PROYECTO
// ========================================

const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.project-card').forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.15}s`;
    projectObserver.observe(card);
});

// ========================================
// ANIMACIÓN PROCESO STEPS
// ========================================

const processStepsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const steps = entry.target.querySelectorAll('.process-step');
            steps.forEach((step, index) => {
                setTimeout(() => {
                    step.classList.add('visible');
                }, index * 200);
            });
            processStepsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const processSteps = document.querySelector('.process-steps');
if (processSteps) {
    processStepsObserver.observe(processSteps);
}

// ========================================
// ANIMACIÓN SKILL CARDS
// ========================================

const skillCardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.skill-card').forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
    skillCardObserver.observe(card);
});

// ========================================
// PARALLAX EFFECT HERO IMAGE
// ========================================

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroImage = document.querySelector('.hero-image');
    
    if (heroImage && scrolled < window.innerHeight) {
        heroImage.style.transform = `translateY(${scrolled * 0.2}px)`;
    }
});

// ========================================
// NAVEGACIÓN ACTIVA
// ========================================

const sections = document.querySelectorAll('section[id]');

const setActiveNav = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
};

window.addEventListener('scroll', setActiveNav);

// ========================================
// CURSOR PERSONALIZADO
// ========================================

const cursor = document.createElement('div');
cursor.style.cssText = `
    position: fixed;
    width: 20px;
    height: 20px;
    border: 2px solid var(--primary-teal);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.2s ease;
    mix-blend-mode: difference;
    display: none;
`;
document.body.appendChild(cursor);

if (window.innerWidth > 768) {
    cursor.style.display = 'block';
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
    });

    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.backgroundColor = 'rgba(20, 184, 166, 0.2)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.backgroundColor = 'transparent';
        });
    });
}

// ========================================
// CONSOLE MESSAGE
// ========================================

console.log('%c¡Hola! 👋', 'font-size: 20px; color: #14B8A6; font-weight: bold;');
console.log('%cGracias por visitar mi portafolio.', 'font-size: 14px; color: #64748B;');
console.log('%c¿Interesado en colaborar? ¡Contactémonos!', 'font-size: 14px; color: #14B8A6;');