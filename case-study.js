// ========================================
// INTERSECTION OBSERVER - ANIMACIONES
// ========================================

const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

// Observer para secciones generales
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observar elementos generales
document.querySelectorAll('.video-container, .context-content, .problem-content').forEach(el => {
    sectionObserver.observe(el);
});

// ========================================
// ANIMACIÓN PROCESO CARDS (SECUENCIAL)
// ========================================

const processObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.process-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('visible');
                }, index * 150);
            });
            processObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

const processGrid = document.querySelector('.process-grid');
if (processGrid) {
    processObserver.observe(processGrid);
}

// ========================================
// ANIMACIÓN FEATURE CARDS
// ========================================

const featureObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.feature-card').forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
    featureObserver.observe(card);
});

// ========================================
// ANIMACIÓN LEARNING ITEMS
// ========================================

const learningObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.learning-item').forEach((item, index) => {
    item.style.transitionDelay = `${index * 0.15}s`;
    learningObserver.observe(item);
});

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
// ANIMACIÓN NÚMEROS RESULTADOS
// ========================================

const animateNumber = (element) => {
    const text = element.textContent;
    const hasPercent = text.includes('%');
    const hasMinus = text.includes('menos');
    const number = parseInt(text.replace(/\D/g, ''));
    
    if (isNaN(number)) return;
    
    const duration = 2000;
    const increment = number / (duration / 16);
    let current = 0;
    
    const updateNumber = () => {
        current += increment;
        if (current < number) {
            if (hasMinus) {
                element.textContent = `${Math.floor(current)}% menos tiempo`;
            } else if (hasPercent) {
                element.textContent = `${Math.floor(current)}%`;
            } else {
                element.textContent = Math.floor(current);
            }
            requestAnimationFrame(updateNumber);
        } else {
            element.textContent = text;
        }
    };
    
    updateNumber();
};

const resultsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const numbers = entry.target.querySelectorAll('.result-number');
            numbers.forEach(num => {
                if (!num.classList.contains('animated')) {
                    num.classList.add('animated');
                    animateNumber(num);
                }
            });
            resultsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const resultsSection = document.querySelector('.results-section');
if (resultsSection) {
    resultsObserver.observe(resultsSection);
}

// ========================================
// VIDEO CONTROLS
// ========================================

const video = document.querySelector('.video-container video');
if (video) {
    // Pausar cuando no esté visible
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                video.pause();
            }
        });
    }, { threshold: 0.5 });
    
    videoObserver.observe(video);
}

// ========================================
// PARALLAX SUAVE EN SCROLL
// ========================================

let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            
            // Parallax en hero
            const hero = document.querySelector('.case-hero');
            if (hero && scrolled < window.innerHeight) {
                hero.style.transform = `translateY(${scrolled * 0.3}px)`;
                hero.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
            }
            
            ticking = false;
        });
        
        ticking = true;
    }
});

// ========================================
// CURSOR PERSONALIZADO (OPCIONAL)
// ========================================

if (window.innerWidth > 768) {
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
    `;
    document.body.appendChild(cursor);
    
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

console.log('%c📊 Caso de Estudio - Plataforma CVs IA', 'font-size: 18px; color: #14B8A6; font-weight: bold;');
console.log('%cDiseñado por Brian Jiménez Korzelius', 'font-size: 12px; color: #64748B;');

// ========================================
// PREVENIR COMPORTAMIENTO DEFAULT
// ========================================

document.querySelectorAll('a[href="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
    });
});