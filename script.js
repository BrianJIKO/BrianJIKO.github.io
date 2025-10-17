// ===== PRELOADER CON PARTICLES.JS =====

// Ocultar preloader cuando la página cargue completamente
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    
    console.log('🌀 Preloader activo - CARGANDO EL MITO...');
    
    // Esperar 1.5 segundos adicionales para que se vea la animación
    setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.classList.remove('loading');
        
        console.log('✅ Preloader oculto - Página lista');
        
        // Remover el preloader del DOM después de la transición
        setTimeout(() => {
            preloader.remove();
        }, 500);
    }, 1500);
});

// ===== FIN PRELOADER =====

// Array con todas las páginas del cómic (ORDEN CORRECTO)
const comicPages = [
    'images/Portada comic.jpg',     // 0
    'images/Pagina1.jpg',            // 1
    'images/Pagina2.jpg',            // 2
    'images/Pagina3.jpg',            // 3
    'images/Pagina4.jpg',            // 4
    'images/Pagina5.jpg',            // 5
    'images/Pagina6.jpg',            // 6
    'images/Pagina7.jpg',            // 7
    'images/Pagina8.jpg',            // 8
    'images/ContraPortada.jpg'       // 9
];

// Estructura del libro con hojas para DESKTOP (dos páginas por vista)
const bookStructureDesktop = [
    { front: 0, back: 1 },      // Hoja 1: Portada → Página 1
    { front: 2, back: 3 },      // Hoja 2: Página 2 → Página 3
    { front: 4, back: 5 },      // Hoja 3: Página 4 → Página 5
    { front: 6, back: 7 },      // Hoja 4: Página 6 → Página 7
    { front: 8, back: 9 }       // Hoja 5: Página 8 → Contraportada
];

// Estructura del libro con hojas para MÓVIL (una página por vista)
const bookStructureMobile = [
    { front: 0 },      // Vista 0: Portada
    { front: 1 },      // Vista 1: Página 1
    { front: 2 },      // Vista 2: Página 2
    { front: 3 },      // Vista 3: Página 3
    { front: 4 },      // Vista 4: Página 4
    { front: 5 },      // Vista 5: Página 5
    { front: 6 },      // Vista 6: Página 6
    { front: 7 },      // Vista 7: Página 7
    { front: 8 },      // Vista 8: Página 8
    { front: 9 }       // Vista 9: Contraportada
];

// Información de páginas para el contador - DESKTOP
const pageLabelsDesktop = [
    'Portada',
    'Páginas 1-2',
    'Páginas 3-4',
    'Páginas 5-6',
    'Páginas 7-8',
    'Contraportada'
];

// Información de páginas para el contador - MÓVIL
const pageLabelsMobile = [
    'Portada',
    'Página 1',
    'Página 2',
    'Página 3',
    'Página 4',
    'Página 5',
    'Página 6',
    'Página 7',
    'Página 8',
    'Contraportada'
];

// Detectar si es móvil
function isMobile() {
    return window.innerWidth <= 480;
}

// Obtener la estructura correcta según el dispositivo
function getBookStructure() {
    return isMobile() ? bookStructureMobile : bookStructureDesktop;
}

// Obtener las etiquetas correctas según el dispositivo
function getPageLabels() {
    return isMobile() ? pageLabelsMobile : pageLabelsDesktop;
}

// Clase FlipBook corregida
class FlipBook {
    constructor(bookElem) {
        this.bookElem = bookElem;
        this.leaves = [];
        this.currentPage = 0;
        this.isAnimating = false;
        
        this.elems = {
            book: bookElem,
            buttons: {
                next: document.getElementById('nextBtn'),
                prev: document.getElementById('prevBtn'),
                close: document.getElementById('closeBtn')
            },
            pageInfo: document.getElementById('pageInfo')
        };
        
        this.buildBook();
        this.setupEvents();
        this.updatePageInfo();
    }
    
    buildBook() {
        // Limpiar libro
        this.bookElem.innerHTML = '';
        
        const mobile = isMobile();
        const bookStructure = getBookStructure();
        
        // Crear hojas del libro
        bookStructure.forEach((leaf, index) => {
            const leafElem = document.createElement('div');
            leafElem.className = 'leaf';
            
            // Crear página frontal (derecha - lo que ves ANTES de voltear)
            const frontPage = document.createElement('div');
            frontPage.className = 'page front';
            const frontImg = document.createElement('img');
            frontImg.className = 'page-img';
            frontImg.src = comicPages[leaf.front];
            frontImg.alt = `Página ${leaf.front}`;
            frontImg.draggable = false;
            
            // Zoom en móvil: doble tap para hacer zoom
            if (mobile) {
                let lastTap = 0;
                let currentScale = 1;
                let isZoomed = false;
                
                frontImg.addEventListener('touchend', (e) => {
                    const currentTime = new Date().getTime();
                    const tapLength = currentTime - lastTap;
                    
                    if (tapLength < 300 && tapLength > 0) {
                        // Doble tap detectado
                        e.preventDefault();
                        isZoomed = !isZoomed;
                        currentScale = isZoomed ? 2 : 1;
                        frontImg.style.transform = `scale(${currentScale})`;
                        frontImg.style.transition = 'transform 0.3s ease';
                        frontImg.style.transformOrigin = 'center center';
                        
                        if (isZoomed) {
                            frontPage.classList.add('zoomed');
                            frontPage.style.overflow = 'auto';
                        } else {
                            frontPage.classList.remove('zoomed');
                            frontPage.style.overflow = 'hidden';
                        }
                    }
                    lastTap = currentTime;
                });
            }
            
            frontPage.appendChild(frontImg);
            leafElem.appendChild(frontPage);
            
            // Crear página trasera solo en desktop y si existe
            if (!mobile && leaf.back !== undefined) {
                const backPage = document.createElement('div');
                backPage.className = 'page back';
                const backImg = document.createElement('img');
                backImg.className = 'page-img';
                backImg.src = comicPages[leaf.back];
                backImg.alt = `Página ${leaf.back}`;
                backImg.draggable = false;
                backPage.appendChild(backImg);
                leafElem.appendChild(backPage);
            }
            
            this.bookElem.appendChild(leafElem);
            this.leaves.push(leafElem);
        });
        
        // Inicializar todas las posiciones
        this.leaves.forEach((leaf, index) => {
            this.setPagePosition(leaf, index - this.currentPage, index);
        });
    }
    
    setPagePosition(leaf, position, index) {
        const bookStructure = getBookStructure();
        // Calcular z-index: hojas sin voltear van de mayor a menor z-index
        // Hojas volteadas tienen z-index bajo y en orden
        let zIndex;
        
        if (position < 0) {
            // Hoja ya volteada - z-index bajo, en orden de volteado
            zIndex = index + 1;
            leaf.style.transform = `translate3d(0, 0, ${zIndex}px) rotateY(-180deg)`;
            leaf.classList.add('turned');
        } else {
            // Hoja sin voltear - z-index alto, orden inverso
            zIndex = (bookStructure.length - index) + 100;
            leaf.style.transform = `translate3d(0, 0, 1px) rotateY(0deg)`;
            leaf.classList.remove('turned');
        }
        
        leaf.style.zIndex = zIndex;
    }
    
    turnPage(delta) {
        if (this.isAnimating) return;
        
        const newPage = this.currentPage + delta;
        
        // Verificar límites
        if (newPage < 0 || newPage > this.leaves.length) {
            return;
        }
        
        this.isAnimating = true;
        
        // Añadir clase de animación a la hoja que se está volteando
        if (delta > 0 && newPage > 0) {
            // Volteando hacia adelante
            this.leaves[newPage - 1].classList.add('turning');
        } else if (delta < 0 && newPage < this.leaves.length) {
            // Volteando hacia atrás
            this.leaves[newPage].classList.add('turning');
        }
        
        this.currentPage = newPage;
        
        // Actualizar posición de todas las hojas
        this.leaves.forEach((leaf, index) => {
            this.setPagePosition(leaf, index - this.currentPage, index);
        });
        
        // Actualizar interfaz
        this.updateButtons();
        this.updatePageInfo();
        
        // Remover clase de animación después de completar
        setTimeout(() => {
            this.leaves.forEach(leaf => leaf.classList.remove('turning'));
            this.isAnimating = false;
        }, 1000);
    }
    
    updateButtons() {
        if (this.currentPage === 0) {
            this.elems.buttons.prev.setAttribute('disabled', 'disabled');
        } else {
            this.elems.buttons.prev.removeAttribute('disabled');
        }
        
        if (this.currentPage === this.leaves.length) {
            this.elems.buttons.next.setAttribute('disabled', 'disabled');
        } else {
            this.elems.buttons.next.removeAttribute('disabled');
        }
    }
    
    updatePageInfo() {
        const pageLabels = getPageLabels();
        if (this.currentPage < pageLabels.length) {
            this.elems.pageInfo.textContent = pageLabels[this.currentPage];
        }
    }
    
    setupEvents() {
        // Botón siguiente
        this.elems.buttons.next.addEventListener('click', () => {
            this.turnPage(1);
        });
        
        // Botón anterior
        this.elems.buttons.prev.addEventListener('click', () => {
            this.turnPage(-1);
        });
        
        // Navegación con teclado
        document.addEventListener('keydown', (e) => {
            if (!comicViewer.classList.contains('hidden')) {
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    this.turnPage(1);
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    this.turnPage(-1);
                } else if (e.key === 'Escape') {
                    closeComicViewer();
                }
            }
        });
        
        // Soporte táctil mejorado para móviles
        let touchStartX = 0;
        let touchStartY = 0;
        let touchStartTime = 0;
        let isSwiping = false;
        
        this.bookElem.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
                touchStartTime = Date.now();
                isSwiping = false;
            }
        }, { passive: true });
        
        this.bookElem.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1 && !isSwiping) {
                const touchCurrentX = e.touches[0].clientX;
                const touchCurrentY = e.touches[0].clientY;
                const diffX = Math.abs(touchCurrentX - touchStartX);
                const diffY = Math.abs(touchCurrentY - touchStartY);
                
                // Detectar si es un swipe horizontal
                if (diffX > 30 && diffX > diffY) {
                    isSwiping = true;
                }
            }
        }, { passive: true });
        
        this.bookElem.addEventListener('touchend', (e) => {
            if (e.changedTouches.length === 1 && isSwiping) {
                const touchEndX = e.changedTouches[0].clientX;
                const touchTime = Date.now() - touchStartTime;
                const diff = touchStartX - touchEndX;
                
                // Swipe rápido y suficiente distancia
                if (Math.abs(diff) > 50 && touchTime < 500) {
                    if (diff > 0) {
                        this.turnPage(1); // Swipe izquierda = siguiente
                    } else {
                        this.turnPage(-1); // Swipe derecha = anterior
                    }
                }
            }
            isSwiping = false;
        }, { passive: true });
    }
    
    reset() {
        this.currentPage = 0;
        this.isAnimating = false;
        this.leaves.forEach((leaf, index) => {
            this.setPagePosition(leaf, index, index);
        });
        this.updateButtons();
        this.updatePageInfo();
    }
}

// Variables globales
let flipBook = null;
const readBtn = document.getElementById('readBtn');
const comicCover = document.getElementById('comicCover');
const closeBtn = document.getElementById('closeBtn');
const comicViewer = document.getElementById('comicViewer');
let currentDeviceType = isMobile() ? 'mobile' : 'desktop';

// Función para abrir el visor
function openComicViewer() {
    comicViewer.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    // Verificar si cambió el tipo de dispositivo
    const newDeviceType = isMobile() ? 'mobile' : 'desktop';
    
    // Crear el libro si no existe o si cambió el tipo de dispositivo
    if (!flipBook || currentDeviceType !== newDeviceType) {
        const bookElem = document.getElementById('book');
        flipBook = new FlipBook(bookElem);
        currentDeviceType = newDeviceType;
    } else {
        flipBook.reset();
    }
}

// Detectar cambio de orientación o tamaño de ventana
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const newDeviceType = isMobile() ? 'mobile' : 'desktop';
        if (currentDeviceType !== newDeviceType && !comicViewer.classList.contains('hidden')) {
            // Reconstruir el libro si cambió el tipo de dispositivo
            const bookElem = document.getElementById('book');
            flipBook = new FlipBook(bookElem);
            currentDeviceType = newDeviceType;
        }
    }, 300);
});

// Función para cerrar el visor
function closeComicViewer() {
    comicViewer.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Event Listeners
readBtn.addEventListener('click', openComicViewer);
comicCover.addEventListener('click', openComicViewer);
closeBtn.addEventListener('click', closeComicViewer);

// Cerrar al hacer clic fuera del libro
comicViewer.addEventListener('click', (e) => {
    if (e.target === comicViewer) {
        closeComicViewer();
    }
});

// Precargar imágenes
function preloadImages() {
    comicPages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Efecto parallax (movimiento muy sutil)
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            document.body.style.backgroundPositionY = `calc(-200px + ${scrolled * 0.1}px)`;
            ticking = false;
        });
        ticking = true;
    }
});

// Efecto Typewriter para el texto descriptivo
function typewriterEffect(element, speed = 30) {
    if (!element) {
        console.warn('Elemento typewriter no encontrado');
        return;
    }
    
    const text = element.getAttribute('data-text');
    if (!text) {
        console.warn('Atributo data-text no encontrado');
        return;
    }
    
    // Verificar si ya se está ejecutando
    if (element.classList.contains('typing-active') || 
        element.classList.contains('typing-complete')) {
        console.warn('Typewriter ya ejecutándose o completado');
        return;
    }
    
    console.log('🎬 Iniciando typewriter:', text.substring(0, 50) + '...');
    
    element.classList.add('typing-active');
    element.innerHTML = ''; // Usar innerHTML para limpiar completamente
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            // Animación completada
            element.classList.add('typing-complete');
            element.classList.remove('typing-active');
            console.log('⌨️  Efecto typewriter completado');
        }
    }
    
    type();
}

// Observador para activar el typewriter cuando sea visible
function initTypewriterObserver() {
    const typewriterElement = document.getElementById('typewriterText');
    if (!typewriterElement) return;
    
    // Limpiar cualquier texto existente y prevenir ejecución múltiple
    if (typewriterElement.classList.contains('typing-complete') || 
        typewriterElement.classList.contains('typing-active')) {
        return;
    }
    
    const isMobileDevice = window.innerWidth <= 480;
    
    if (isMobileDevice) {
        // En móvil, iniciar inmediatamente después del título
        setTimeout(() => {
            // Limpiar el texto original antes de empezar
            typewriterElement.textContent = '';
            typewriterEffect(typewriterElement, 25);
        }, 1200);
    } else {
        // En desktop, usar IntersectionObserver
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && 
                    !entry.target.classList.contains('typing-complete') &&
                    !entry.target.classList.contains('typing-active')) {
                    setTimeout(() => {
                        // Limpiar el texto original antes de empezar
                        entry.target.textContent = '';
                        typewriterEffect(entry.target, 30);
                    }, 1000);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '0px'
        });
        
        observer.observe(typewriterElement);
    }
}

// Animación SplitText para el título
function initTitleAnimation() {
    const titleElement = document.getElementById('comicTitle');
    if (!titleElement) return;
    
    // Esperar a que GSAP esté disponible
    if (typeof gsap === 'undefined' || typeof SplitText === 'undefined') {
        console.warn('GSAP o SplitText no están cargados - usando fallback CSS');
        // Si GSAP no está disponible, hacer fade in simple con CSS
        setTimeout(() => {
            titleElement.classList.add('animated');
        }, 300);
        initTypewriterObserver();
        return;
    }
    
    gsap.registerPlugin(ScrollTrigger);
    
    // Dividir el texto en caracteres
    const split = new SplitText(titleElement, {
        type: 'chars',
        charsClass: 'char'
    });
    
    // Animar cada carácter con fade in visible
    const isMobileDevice = window.innerWidth <= 480;
    
    gsap.fromTo(
        split.chars,
        {
            opacity: 0,
            y: 50,
            rotationX: -90,
            scale: 0.5
        },
        {
            opacity: 1,
            y: 0,
            rotationX: 0,
            scale: 1,
            duration: 0.8,
            ease: 'back.out(1.7)',
            stagger: 0.04,
            delay: isMobileDevice ? 0.5 : 0.3,
            scrollTrigger: isMobileDevice ? null : {
                trigger: titleElement,
                start: 'top 85%',
                once: true
            },
            onStart: () => {
                titleElement.classList.add('animated');
            },
            onComplete: () => {
                console.log('✨ Animación del título completada con fade in');
            }
        }
    );
}

// Inicialización del contenido principal
window.addEventListener('DOMContentLoaded', () => {
    // Inicializar partículas si particles.js está disponible
    if (typeof particlesJS !== 'undefined') {
        // Partículas azules
        particlesJS("particleCanvas-Blue", {
            particles: {
                number: {
                    value: 100,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: "#1B5F70"
                },
                shape: {
                    type: "circle",
                    stroke: {
                        width: 0,
                        color: "#000000"
                    }
                },
                opacity: {
                    value: 0.5,
                    random: false,
                    anim: {
                        enable: true,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 10,
                    random: true,
                    anim: {
                        enable: false,
                        speed: 10,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: false
                },
                move: {
                    enable: true,
                    speed: 0.5,
                    direction: "none",
                    random: true,
                    straight: false,
                    out_mode: "bounce",
                    bounce: false
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: {
                        enable: true,
                        mode: "grab"
                    },
                    onclick: {
                        enable: false
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 200,
                        line_linked: {
                            opacity: 0.2
                        }
                    }
                }
            },
            retina_detect: true
        });

        // Partículas blancas
        particlesJS("particleCanvas-White", {
            particles: {
                number: {
                    value: 250,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: "#ffffff"
                },
                shape: {
                    type: "circle",
                    stroke: {
                        width: 0,
                        color: "#000000"
                    }
                },
                opacity: {
                    value: 0.5,
                    random: true,
                    anim: {
                        enable: false,
                        speed: 0.2,
                        opacity_min: 0,
                        sync: false
                    }
                },
                size: {
                    value: 15,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 10,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: false
                },
                move: {
                    enable: true,
                    speed: 0.5,
                    direction: "none",
                    random: true,
                    straight: false,
                    out_mode: "bounce",
                    bounce: false,
                    attract: {
                        enable: true,
                        rotateX: 3945.7382081613637,
                        rotateY: 157.82952832645452
                    }
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: {
                        enable: false
                    },
                    onclick: {
                        enable: false
                    },
                    resize: true
                }
            },
            retina_detect: true
        });
    }
    
    preloadImages();
    
    // Iniciar animación del título con un pequeño delay después de que se oculte el preloader
    setTimeout(() => {
        initTitleAnimation();
        initTypewriterObserver();
    }, 2300); // 1500ms del preloader + 500ms de transición + 300ms extra
    
    console.log('📖 Cómic Digital "El Dios Azul"');
    console.log('📚 Estructura del libro:');
    console.log(`🖥️  Modo actual: ${isMobile() ? 'Móvil' : 'Desktop/Tablet'}`);
    
    if (isMobile()) {
        console.log('📱 MÓVIL - Una página por vista:');
        console.log('   Vista 0: Portada');
        console.log('   Vista 1: Página 1');
        console.log('   Vista 2: Página 2');
        console.log('   Vista 3: Página 3');
        console.log('   Vista 4: Página 4');
        console.log('   Vista 5: Página 5');
        console.log('   Vista 6: Página 6');
        console.log('   Vista 7: Página 7');
        console.log('   Vista 8: Página 8');
        console.log('   Vista 9: Contraportada');
        console.log('👆 MÓVIL: Swipe horizontal para cambiar de página');
    } else {
        console.log('💻 DESKTOP - Dos páginas por vista:');
        console.log('   Vista 0: Portada (sola)');
        console.log('   Vista 1: Páginas 1-2');
        console.log('   Vista 2: Páginas 3-4');
        console.log('   Vista 3: Páginas 5-6');
        console.log('   Vista 4: Páginas 7-8');
        console.log('   Vista 5: Contraportada (sola)');
    }
    
    console.log('✨ Problema de superposición solucionado');
    console.log('🎬 Animación GSAP SplitText activada');
    console.log('⌨️  Efecto Typewriter activado');
    console.log('📱 Responsive: Desktop, Tablet y Móvil');
});