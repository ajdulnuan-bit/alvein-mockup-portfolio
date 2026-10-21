/**
 * main.js
 * Alvin John Dulnuan - Portfolio Website Core JavaScript
 * 
 * This file contains all the interactive logic for the portfolio website.
 * It is built using pure vanilla JavaScript with no external dependencies or libraries,
 * ensuring maximum performance, control, and a lightweight footprint.
 * 
 * Features included:
 * 1. Custom Cursor
 * 2. Scroll Progress Bar
 * 3. Preloader
 * 4. Smooth Scroll
 * 5. Navbar (sticky & active states)
 * 6. Mobile Menu
 * 7. Typing Effect
 * 8. Intersection Observer Animations (staggered)
 * 9. Counter Animation
 * 10. Skill Circular Progress
 * 11. Skill Bars
 * 12. Marquee Pause
 * 13. Project Filters
 * 14. Magnetic Buttons
 * 15. Tilt Effect
 * 16. Parallax Elements
 * 17. Text Reveal
 * 18. Testimonial Carousel
 * 19. AI Chatbot
 * 20. Canvas Particle Background
 * 21. Back to Top
 * 22. Contact Form
 * 23. Scroll-triggered section backgrounds
 * 24. Easter Egg (Konami code confetti)
 * 25. Dynamic year
 */

document.addEventListener('DOMContentLoaded', () => {
    "use strict";

    // ==========================================================================
    // UTILITY FUNCTIONS
    // ==========================================================================

    /**
     * Debounce function to limit the rate at which a function can fire.
     * Useful for scroll and resize events.
     * @param {Function} func - The function to debounce
     * @param {number} wait - The delay in milliseconds
     * @returns {Function} - The debounced function
     */
    function debounce(func, wait = 20) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    /**
     * Throttle function to ensure a function is called at most once in a specified time period.
     * @param {Function} func - The function to throttle
     * @param {number} limit - The time limit in milliseconds
     * @returns {Function} - The throttled function
     */
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    /**
     * Easing function: easeOutQuad
     * @param {number} t - Current time
     * @param {number} b - Start value
     * @param {number} c - Change in value
     * @param {number} d - Duration
     * @returns {number} - Interpolated value
     */
    function easeOutQuad(t, b, c, d) {
        t /= d;
        return -c * t * (t - 2) + b;
    }

    /**
     * Helper to select a single element
     * @param {string} selector - CSS selector
     * @param {Element} parent - Parent element to search within
     * @returns {Element|null}
     */
    const $ = (selector, parent = document) => parent.querySelector(selector);

    /**
     * Helper to select multiple elements
     * @param {string} selector - CSS selector
     * @param {Element} parent - Parent element to search within
     * @returns {NodeList}
     */
    const $$ = (selector, parent = document) => parent.querySelectorAll(selector);

    // ==========================================================================
    // 25. DYNAMIC YEAR IN FOOTER
    // ==========================================================================
    const initDynamicYear = () => {
        const yearElement = $('#current-year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    };
    initDynamicYear();


    // ==========================================================================
    // 3. PRELOADER
    // ==========================================================================
    const initPreloader = () => {
        const preloader = $('.preloader');
        const counterElement = $('.preloader-count');
        
        if (!preloader || !counterElement) return;

        let count = 0;
        
        const updateCounter = () => {
            count++;
            counterElement.textContent = count + '%';
            
            if (count < 100) {
                setTimeout(updateCounter, 20);
            } else {
                // Animation complete
                preloader.classList.add('loaded');
                setTimeout(() => {
                    document.body.classList.add('loaded');
                    preloader.remove(); // Remove from DOM to free resources
                }, 500);
            }
        };
        
        updateCounter();
    };
    initPreloader();


    // ==========================================================================
    // 1. CUSTOM CURSOR
    // ==========================================================================
    const initCustomCursor = () => {
        // Only initialize on non-touch devices
        if (window.matchMedia("(pointer: coarse)").matches) return;

        const cursorOuter = $('.custom-cursor');
        const cursorInner = $('.cursor-dot');
        
        if (!cursorOuter || !cursorInner) return;

        let mouseX = 0;
        let mouseY = 0;
        let outerX = 0;
        let outerY = 0;
        
        // Listen to mouse move
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Instantly move inner dot
            cursorInner.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
            
            // Show cursors if they were hidden
            if (cursorOuter.style.opacity === '0' || cursorOuter.style.opacity === '') {
                cursorOuter.style.opacity = '1';
                cursorInner.style.opacity = '1';
            }
        });

        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            cursorOuter.style.opacity = '0';
            cursorInner.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            cursorOuter.style.opacity = '1';
            cursorInner.style.opacity = '1';
        });

        // Smooth follow for outer ring using requestAnimationFrame
        const render = () => {
            // Calculate distance and ease
            outerX += (mouseX - outerX) * 0.15;
            outerY += (mouseY - outerY) * 0.15;
            
            cursorOuter.style.transform = `translate(${outerX}px, ${outerY}px)`;
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);

        // Hover effect for interactive elements
        const interactiveElements = $$('a, button, .magnetic-btn, .project-card, input, textarea, select');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOuter.classList.add('cursor-hover');
                cursorInner.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                cursorOuter.classList.remove('cursor-hover');
                cursorInner.classList.remove('cursor-hover');
            });
        });
    };
    initCustomCursor();


    // ==========================================================================
    // 2. SCROLL PROGRESS BAR
    // ==========================================================================
    const initScrollProgress = () => {
        const progressBar = $('#scrollProgress');
        if (!progressBar) return;

        const updateProgress = () => {
            const scrollTotal = document.documentElement.scrollTop || document.body.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = (scrollTotal / height) * 100;
            progressBar.style.width = `${scrollPercent}%`;
        };

        window.addEventListener('scroll', throttle(updateProgress, 10));
        updateProgress(); // Initial check
    };
    initScrollProgress();


    // ==========================================================================
    // 4. SMOOTH SCROLL
    // ==========================================================================
    const initSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    };
    initSmoothScroll();


    // ==========================================================================
    // 5. NAVBAR & ACTIVE STATES
    // ==========================================================================
    const initNavbar = () => {
        const navbar = $('.navbar');
        const sections = $$('section[id]');
        const navLinks = $$('.nav-link');
        
        if (!navbar) return;

        const handleScroll = () => {
            const scrollY = window.scrollY;

            // Sticky navbar styling
            if (scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Active link highlighting
            let currentSection = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                // Adjust by 100px for earlier activation
                if (scrollY >= (sectionTop - 100) && scrollY < (sectionTop + sectionHeight - 100)) {
                    currentSection = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSection}`) {
                    link.classList.add('active');
                }
            });
        };

        window.addEventListener('scroll', throttle(handleScroll, 50));
        handleScroll(); // Init
    };
    initNavbar();


    // ==========================================================================
    // 6. MOBILE MENU
    // ==========================================================================
    const initMobileMenu = () => {
        const hamburger = $('.hamburger');
        const navMenu = $('.nav-menu');
        const navLinks = $$('.nav-link');

        if (!hamburger || !navMenu) return;

        const toggleMenu = () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevent body scroll when menu open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        };

        hamburger.addEventListener('click', toggleMenu);

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    toggleMenu();
                }
            });
        });
    };
    initMobileMenu();


    // ==========================================================================
    // 7. TYPING EFFECT
    // ==========================================================================
    const initTypingEffect = () => {
        const typingElement = $('.typing-text');
        if (!typingElement) return;

        const words = [
            'Software Engineer', 
            'Full-Stack Developer', 
            'UI/UX Enthusiast', 
            'Problem Solver', 
            'System Administrator', 
            'Tech Visionary'
        ];
        
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        const typeSpeed = 80;
        const deleteSpeed = 40;
        const pauseTime = 2000;

        const type = () => {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                // Remove char
                typingElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                // Add char
                typingElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }

            let nextSpeed = isDeleting ? deleteSpeed : typeSpeed;

            // If word is complete
            if (!isDeleting && charIndex === currentWord.length) {
                nextSpeed = pauseTime; // Pause at end of word
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length; // Next word
                nextSpeed = 500; // Small pause before typing next word
            }

            setTimeout(type, nextSpeed);
        };

        // Start typing
        setTimeout(type, 1000);
    };
    initTypingEffect();


    // ==========================================================================
    // 8. INTERSECTION OBSERVER ANIMATIONS (STAGGERED)
    // ==========================================================================
    const initScrollAnimations = () => {
        const animatedElements = $$('.animate-on-scroll');
        
        if (animatedElements.length === 0) return;

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };

        const observer = new IntersectionObserver((entries, obs) => {
            // Group entries by their parent section to calculate stagger correctly
            const parentMap = new Map();

            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const parent = el.closest('section') || el.parentElement;
                    
                    if (!parentMap.has(parent)) {
                        parentMap.set(parent, []);
                    }
                    parentMap.get(parent).push(el);
                    
                    // Stop observing once animated
                    obs.unobserve(el);
                }
            });

            // Apply stagger delays
            parentMap.forEach((elements) => {
                elements.forEach((el, index) => {
                    // 100ms delay per element
                    const delay = index * 100;
                    el.style.transitionDelay = `${delay}ms`;
                    
                    // We need a slight timeout to ensure styles apply
                    setTimeout(() => {
                        el.classList.add('animated');
                    }, 50);
                });
            });
        }, observerOptions);

        animatedElements.forEach(el => observer.observe(el));
    };
    initScrollAnimations();


    // ==========================================================================
    // 9. COUNTER ANIMATION
    // ==========================================================================
    const initCounters = () => {
        const counters = $$('.counter');
        if (counters.length === 0) return;

        const animateCounter = (counter) => {
            const target = parseInt(counter.getAttribute('data-target'), 10);
            const duration = 2000;
            const startTime = performance.now();
            const startValue = 0;

            const updateCounter = (currentTime) => {
                const elapsed = currentTime - startTime;
                
                if (elapsed < duration) {
                    const val = Math.round(easeOutQuad(elapsed, startValue, target - startValue, duration));
                    counter.textContent = val;
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target; // Ensure exact final value
                }
            };
            requestAnimationFrame(updateCounter);
        };

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    };
    initCounters();


    // ==========================================================================
    // 10. SKILL CIRCULAR PROGRESS
    // ==========================================================================
    const initSkillCircles = () => {
        const circles = $$('.skill-circle');
        if (circles.length === 0) return;

        const animateCircle = (circleContainer) => {
            const svgCircle = circleContainer.querySelector('.skill-circle-fill');
            if (!svgCircle) return;
            
            const progress = parseInt(circleContainer.getAttribute('data-progress'), 10);
            if (isNaN(progress)) return;

            // Calculate dash offset
            const radius = svgCircle.r.baseVal.value;
            const circumference = radius * 2 * Math.PI;
            
            svgCircle.style.strokeDasharray = `${circumference} ${circumference}`;
            svgCircle.style.strokeDashoffset = circumference;

            // Trigger reflow
            svgCircle.getBoundingClientRect();

            // Animate
            const offset = circumference - progress / 100 * circumference;
            
            // Set transition dynamically
            svgCircle.style.transition = 'stroke-dashoffset 2s ease-out';
            svgCircle.style.strokeDashoffset = offset;
        };

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCircle(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        circles.forEach(circle => observer.observe(circle));
    };
    initSkillCircles();


    // ==========================================================================
    // 11. SKILL BARS
    // ==========================================================================
    const initSkillBars = () => {
        const bars = $$('.skill-progress');
        if (bars.length === 0) return;

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const progress = bar.getAttribute('data-progress');
                    
                    bar.style.transition = 'width 1.5s ease-out';
                    bar.style.width = `${progress}%`;
                    
                    obs.unobserve(bar);
                }
            });
        }, { threshold: 0.5 });

        bars.forEach(bar => {
            bar.style.width = '0%'; // Initial state
            observer.observe(bar);
        });
    };
    initSkillBars();


    // ==========================================================================
    // 12. MARQUEE PAUSE
    // ==========================================================================
    const initMarqueePause = () => {
        const tracks = $$('.marquee-track');
        if (tracks.length === 0) return;

        tracks.forEach(track => {
            track.addEventListener('mouseenter', () => {
                track.style.animationPlayState = 'paused';
            });
            track.addEventListener('mouseleave', () => {
                track.style.animationPlayState = 'running';
            });
        });
    };
    initMarqueePause();


    // ==========================================================================
    // 13. PROJECT FILTERS
    // ==========================================================================
    const initProjectFilters = () => {
        const filterBtns = $$('.filter-btn');
        const projects = $$('.project-card');
        
        if (filterBtns.length === 0 || projects.length === 0) return;

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-category');

                projects.forEach(project => {
                    const category = project.getAttribute('data-category');
                    
                    // Add smooth transition logic
                    if (filterValue === 'all' || filterValue === category) {
                        project.style.display = 'block'; // Or whatever default is
                        setTimeout(() => {
                            project.style.opacity = '1';
                            project.style.transform = 'scale(1)';
                        }, 10);
                    } else {
                        project.style.opacity = '0';
                        project.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            project.style.display = 'none';
                        }, 300); // Wait for transition
                    }
                    
                    // Set initial transitions if not set
                    if (!project.style.transition) {
                        project.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    }
                });
            });
        });
    };
    initProjectFilters();


    // ==========================================================================
    // 14. MAGNETIC BUTTONS
    // ==========================================================================
    const initMagneticButtons = () => {
        const magneticBtns = $$('.magnetic-btn');
        if (magneticBtns.length === 0) return;

        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const btnX = rect.left + rect.width / 2;
                const btnY = rect.top + rect.height / 2;
                
                // Calculate distance from center
                const distX = e.clientX - btnX;
                const distY = e.clientY - btnY;
                
                // Maximum translation of 15px
                const maxX = 15;
                const maxY = 15;
                
                // Cap the movement based on mouse position relative to center
                const x = Math.max(-maxX, Math.min(maxX, distX * 0.3));
                const y = Math.max(-maxY, Math.min(maxY, distY * 0.3));
                
                btn.style.transform = `translate(${x}px, ${y}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0px, 0px)';
                btn.style.transition = 'transform 0.3s ease';
                setTimeout(() => {
                    btn.style.transition = '';
                }, 300);
            });
        });
    };
    initMagneticButtons();


    // ==========================================================================
    // 15. TILT EFFECT
    // ==========================================================================
    const initTiltEffect = () => {
        const tiltCards = $$('.tilt-card');
        if (tiltCards.length === 0) return;

        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left; // x position within the element
                const y = e.clientY - rect.top;  // y position within the element
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Calculate percentages (-1 to 1)
                const percentX = (x - centerX) / centerX;
                const percentY = -((y - centerY) / centerY); // Invert Y for correct tilt
                
                // Max rotation 10deg
                const maxRotation = 10;
                
                card.style.transform = `perspective(1000px) rotateY(${percentX * maxRotation}deg) rotateX(${percentY * maxRotation}deg)`;
                
                // Optional: Dynamic glare if element has a .glare child
                const glare = card.querySelector('.glare');
                if (glare) {
                    glare.style.opacity = '1';
                    glare.style.transform = `translate(${percentX * 20}%, ${-percentY * 20}%)`;
                }
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
                card.style.transition = 'transform 0.5s ease';
                
                const glare = card.querySelector('.glare');
                if (glare) {
                    glare.style.opacity = '0';
                    glare.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                }
                
                setTimeout(() => {
                    card.style.transition = '';
                    if (glare) glare.style.transition = '';
                }, 500);
            });
        });
    };
    initTiltEffect();


    // ==========================================================================
    // 16. PARALLAX ELEMENTS
    // ==========================================================================
    const initParallax = () => {
        const parallaxEls = $$('.parallax-el');
        if (parallaxEls.length === 0) return;

        const updateParallax = () => {
            const scrollY = window.scrollY;
            
            parallaxEls.forEach(el => {
                const speed = parseFloat(el.getAttribute('data-speed')) || 0.5;
                const yPos = -(scrollY * speed);
                el.style.transform = `translateY(${yPos}px)`;
            });
        };

        window.addEventListener('scroll', throttle(updateParallax, 10));
    };
    // initParallax(); // Optional: Might conflict with intersection observers, better isolated


    // ==========================================================================
    // 17. TEXT REVEAL
    // ==========================================================================
    const initTextReveal = () => {
        const textRevealEls = $$('.reveal-text');
        if (textRevealEls.length === 0) return;

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        textRevealEls.forEach(el => observer.observe(el));
    };
    initTextReveal();


    // ==========================================================================
    // 18. TESTIMONIAL CAROUSEL
    // ==========================================================================
    const initTestimonialCarousel = () => {
        const carousels = $$('.testimonial-carousel');
        if (carousels.length === 0) return;

        carousels.forEach(carousel => {
            const slides = carousel.querySelectorAll('.testimonial-slide');
            const prevBtn = carousel.querySelector('.prev-btn');
            const nextBtn = carousel.querySelector('.next-btn');
            const dotsContainer = carousel.querySelector('.carousel-dots');
            
            if (slides.length <= 1) return;

            let currentIndex = 0;
            let timer;

            // Create dots
            if (dotsContainer) {
                dotsContainer.innerHTML = ''; // clear if any
                slides.forEach((_, idx) => {
                    const dot = document.createElement('span');
                    dot.classList.add('dot');
                    if (idx === 0) dot.classList.add('active');
                    dot.addEventListener('click', () => goToSlide(idx));
                    dotsContainer.appendChild(dot);
                });
            }

            const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];

            const showSlide = (index) => {
                slides.forEach(slide => {
                    slide.style.opacity = '0';
                    slide.style.display = 'none';
                    slide.classList.remove('active');
                });
                
                if (dots.length) {
                    dots.forEach(dot => dot.classList.remove('active'));
                    dots[index].classList.add('active');
                }

                slides[index].style.display = 'block';
                // Trigger reflow
                slides[index].getBoundingClientRect();
                slides[index].style.opacity = '1';
                slides[index].classList.add('active');
                
                currentIndex = index;
            };

            const nextSlide = () => {
                let next = (currentIndex + 1) % slides.length;
                showSlide(next);
            };

            const prevSlide = () => {
                let prev = (currentIndex - 1 + slides.length) % slides.length;
                showSlide(prev);
            };

            const goToSlide = (index) => {
                showSlide(index);
                resetTimer();
            };

            const resetTimer = () => {
                clearInterval(timer);
                timer = setInterval(nextSlide, 5000);
            };

            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    nextSlide();
                    resetTimer();
                });
            }

            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    prevSlide();
                    resetTimer();
                });
            }

            // Init
            showSlide(0);
            resetTimer();
        });
    };
    initTestimonialCarousel();


    // ==========================================================================
    // 19. AI CHATBOT
    // ==========================================================================
    const initChatbot = () => {
        const toggleBtn = $('.chatbot-toggle');
        const chatWindow = $('.chatbot-window');
        if (!toggleBtn || !chatWindow) return;

        const closeBtn = $('.chatbot-close');
        const inputField = $('.chatbot-input');
        const sendBtn = $('.chatbot-send');
        const messagesBody = $('.chatbot-messages');
        
        let isOpen = false;

        const widget = toggleBtn.closest('.chatbot-widget');
        const toggleChat = () => {
            isOpen = !isOpen;
            widget.classList.toggle('active', isOpen);
            if (isOpen) inputField.focus();
        };

        toggleBtn.addEventListener('click', toggleChat);
        if (closeBtn) closeBtn.addEventListener('click', toggleChat);

        // Portfolio context for AI
        const portfolioContext = `You are AJ's AI Portfolio Assistant for Alvin John Dulnuan's personal website. 
You ONLY answer questions related to Alvin's portfolio, skills, and professional profile.
Keep responses short (2-3 sentences max), friendly, and use emojis.
If asked something unrelated, politely redirect to portfolio topics.

ALVIN'S PROFILE:
- Full Name: Alvin John Dulnuan
- Location: Aritao, Nueva Vizcaya, Philippines
- Education: BS Information Technology (BSIT) student
- Email: ajdulnuan09@gmail.com
- Phone: +63 917 845 2396
- Goal: Become a world-class Software Engineer

SKILLS: HTML5 (92%), CSS3/SASS (85%), JavaScript (85%), React (78%), PHP (82%), Python (80%), Java (75%), Node.js (70%), Git/GitHub (88%), MySQL (80%), Linux/CLI (75%), XAMPP/Apache/Nginx (85%), Docker/DevOps (65%), Figma/UI Design (70%)

SERVICES: Web Development, Mobile Development, System Administration, UI/UX Design, Database Engineering, AI Integration

PROJECTS:
1. Netflix Streaming Platform (React, Node.js, MongoDB, TMDb API)
2. Spotify Music Streaming App (React, Spotify API, Web Audio)
3. Tesla Automotive Website (React, Styled Components, Framer Motion)
4. ShopHub E-Commerce Platform (PHP, Laravel, MySQL, Stripe)
5. EduTrack Student Management System (Java, Spring Boot, MySQL)
6. NexaBot AI Chatbot Platform (Python, TensorFlow, Flask, NLP)
7. FlowBoard Project Manager (React, Node.js, Socket.io, MongoDB)
8. SkyPulse Weather Dashboard (JavaScript, OpenWeather API, Chart.js)

STATUS: Available for freelance work and collaboration`;

        // Local fallback responses
        const localResponses = [
            { keywords: ['hello', 'hi', 'hey', 'sup', 'yo'], response: "Hey there! 👋 I'm AJ's AI assistant. Ask me about his skills, projects, experience, or how to hire him!" },
            { keywords: ['skills', 'technologies', 'tech', 'stack', 'know', 'language', 'programming'], response: "Alvin is skilled in JavaScript, Python, PHP, Java, React, Node.js, MySQL, Git, Docker, and System Administration. He's a true full-stack developer! 🚀" },
            { keywords: ['projects', 'work', 'portfolio', 'built', 'made', 'create'], response: "Alvin has built 8+ major projects including Netflix, Spotify, and Tesla platform recreations, an e-commerce system, AI chatbot platform, and more! Check the Projects section above 💻" },
            { keywords: ['contact', 'email', 'hire', 'reach', 'message'], response: "You can reach Alvin at ajdulnuan09@gmail.com or call +63 917 845 2396. He's open for freelance & collaboration! Use the contact form above 📧" },
            { keywords: ['education', 'school', 'study', 'degree', 'college', 'university'], response: "Alvin is pursuing a BS in Information Technology at the College of Accountancy, Management, Computing and Information Sciences. Specializing in software dev & system admin 🎓" },
            { keywords: ['location', 'where', 'address', 'from', 'live', 'based'], response: "Alvin is based in Aritao, Nueva Vizcaya, Philippines 🇵🇭 — building world-class software from the highlands!" },
            { keywords: ['service', 'offer', 'do', 'help', 'provide'], response: "Alvin offers: Web Development, Mobile Apps, System Administration, UI/UX Design, Database Engineering, and AI Integration. What do you need built? 💼" },
            { keywords: ['experience', 'years', 'long', 'senior'], response: "Alvin has 3+ years of coding experience, 10+ completed projects, 500+ hours coded, and expertise across 12+ technologies! 📊" },
            { keywords: ['price', 'cost', 'rate', 'charge', 'budget', 'pay'], response: "For pricing and project quotes, reach out directly at ajdulnuan09@gmail.com. Alvin offers competitive rates and quality work! 💰" },
            { keywords: ['available', 'free', 'open', 'ready'], response: "Yes! Alvin is currently available for freelance projects and collaboration. Don't hesitate to reach out! ✅" },
            { keywords: ['netflix', 'spotify', 'tesla'], response: "Alvin recreated Netflix (streaming platform), Spotify (music app), and Tesla (automotive website) — showcasing his ability to build complex, production-grade applications! 🎬🎵🚗" },
            { keywords: ['name', 'who', 'about'], response: "I'm the AI assistant for Alvin John Dulnuan — a passionate BSIT student and aspiring software engineer from Aritao, Nueva Vizcaya. He builds incredible digital experiences! ✨" }
        ];
        
        const defaultResponse = "Great question! I'm focused on Alvin's portfolio. Try asking about his skills, projects, services, or how to contact him! 😊";

        // Gemini AI API call
        const GEMINI_API_KEY = 'AIzaSyBh2m0Z3bVbVLkXjRjVvJOqPFtwCkd8Cqk';
        const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

        let chatHistory = [];

        const getAIResponse = async (userMessage) => {
            chatHistory.push({ role: 'user', parts: [{ text: userMessage }] });

            try {
                const response = await fetch(GEMINI_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        system_instruction: { parts: [{ text: portfolioContext }] },
                        contents: chatHistory,
                        generationConfig: {
                            temperature: 0.7,
                            maxOutputTokens: 150,
                            topP: 0.9
                        }
                    })
                });

                if (!response.ok) throw new Error('API failed');

                const data = await response.json();
                const botText = data.candidates?.[0]?.content?.parts?.[0]?.text || null;
                
                if (botText) {
                    chatHistory.push({ role: 'model', parts: [{ text: botText }] });
                    return botText;
                }
                throw new Error('No response text');
            } catch (err) {
                // Fallback to local keyword matching
                console.log('AI API fallback:', err.message);
                return getLocalResponse(userMessage);
            }
        };

        const getLocalResponse = (text) => {
            text = text.toLowerCase();
            for (const rule of localResponses) {
                if (rule.keywords.some(kw => text.includes(kw))) {
                    return rule.response;
                }
            }
            return defaultResponse;
        };

        const scrollToBottom = () => {
            messagesBody.scrollTop = messagesBody.scrollHeight;
        };

        const appendMessage = (text, sender) => {
            const msgDiv = document.createElement('div');
            msgDiv.classList.add('chat-message', sender);
            const bubble = document.createElement('div');
            bubble.classList.add('chat-bubble');
            bubble.textContent = text;
            msgDiv.appendChild(bubble);
            messagesBody.appendChild(msgDiv);
            scrollToBottom();
        };

        const showTypingIndicator = () => {
            const typingDiv = document.createElement('div');
            typingDiv.classList.add('chat-message', 'bot');
            typingDiv.id = 'typingIndicator';
            typingDiv.innerHTML = '<div class="chat-bubble typing-dots"><span></span><span></span><span></span></div>';
            messagesBody.appendChild(typingDiv);
            scrollToBottom();
        };

        const hideTypingIndicator = () => {
            const typingDiv = document.getElementById('typingIndicator');
            if (typingDiv) typingDiv.remove();
        };

        const processUserInput = async (text) => {
            showTypingIndicator();
            const response = await getAIResponse(text);
            hideTypingIndicator();
            appendMessage(response, 'bot');
        };

        const handleSend = () => {
            const text = inputField.value.trim();
            if (text === '') return;

            appendMessage(text, 'user');
            inputField.value = '';
            
            processUserInput(text);
        };

        if (sendBtn) {
            sendBtn.addEventListener('click', handleSend);
        }

        if (inputField) {
            inputField.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    handleSend();
                }
            });
        }
    };
    initChatbot();


    // ==========================================================================
    // 20. CANVAS PARTICLE BACKGROUND
    // ==========================================================================
    const initParticles = () => {
        const canvas = document.getElementById('particleCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        let mouseX = -1000;
        let mouseY = -1000;
        const mouseRadius = 200; // cursor influence radius

        const resizeCanvas = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('resize', debounce(() => {
            resizeCanvas();
            createParticles();
        }, 100));

        // Track mouse on the whole page
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        document.addEventListener('mouseleave', () => {
            mouseX = -1000;
            mouseY = -1000;
        });

        resizeCanvas();

        const isLightMode = () => document.documentElement.getAttribute('data-theme') === 'light';

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.baseVx = (Math.random() - 0.5) * 0.8;
                this.baseVy = (Math.random() - 0.5) * 0.8;
                this.vx = this.baseVx;
                this.vy = this.baseVy;
                this.radius = Math.random() * 2.5 + 1;
                this.opacity = Math.random() * 0.5 + 0.3;
                this.colorIndex = Math.floor(Math.random() * 4);
                // Twinkle
                this.twinkleSpeed = Math.random() * 0.02 + 0.01;
                this.twinklePhase = Math.random() * Math.PI * 2;
            }

            update(time) {
                // Cursor attraction/repulsion
                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < mouseRadius && dist > 0) {
                    // Push particles away from cursor gently, pull back slowly
                    const force = (mouseRadius - dist) / mouseRadius;
                    const angle = Math.atan2(dy, dx);
                    // Particles orbit around cursor
                    this.vx += Math.cos(angle + Math.PI / 2) * force * 0.3;
                    this.vy += Math.sin(angle + Math.PI / 2) * force * 0.3;
                    // Slight pull toward cursor
                    this.vx += Math.cos(angle) * force * 0.05;
                    this.vy += Math.sin(angle) * force * 0.05;
                }

                // Dampen back to base speed
                this.vx += (this.baseVx - this.vx) * 0.02;
                this.vy += (this.baseVy - this.vy) * 0.02;

                // Speed limit
                const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                if (speed > 3) {
                    this.vx = (this.vx / speed) * 3;
                    this.vy = (this.vy / speed) * 3;
                }

                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (this.x < 0) { this.x = 0; this.vx = Math.abs(this.vx); }
                if (this.x > width) { this.x = width; this.vx = -Math.abs(this.vx); }
                if (this.y < 0) { this.y = 0; this.vy = Math.abs(this.vy); }
                if (this.y > height) { this.y = height; this.vy = -Math.abs(this.vy); }

                // Twinkle opacity
                this.twinklePhase += this.twinkleSpeed;
                this.currentOpacity = this.opacity * (0.6 + 0.4 * Math.sin(this.twinklePhase));
            }

            draw() {
                const light = isLightMode();
                const darkColors = [[0, 212, 255], [124, 58, 237], [255, 255, 255], [0, 255, 136]];
                const lightColors = [[30, 30, 80], [80, 20, 160], [0, 80, 130], [40, 40, 70]];
                const colors = light ? lightColors : darkColors;
                const c = colors[this.colorIndex];

                // Glow if near cursor
                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const nearCursor = dist < mouseRadius;

                if (nearCursor) {
                    const glowSize = this.radius * 3;
                    const glowAlpha = (1 - dist / mouseRadius) * 0.4;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, glowSize, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${glowAlpha})`;
                    ctx.fill();
                }

                ctx.beginPath();
                ctx.arc(this.x, this.y, nearCursor ? this.radius * 1.5 : this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${this.currentOpacity || this.opacity})`;
                ctx.fill();
            }
        }

        const createParticles = () => {
            particles = [];
            const count = Math.min(150, Math.floor((width * height) / 12000));
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        };

        createParticles();
        let time = 0;

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            time++;

            const light = isLightMode();
            const lineRGB = light ? '30, 30, 80' : '0, 212, 255';
            const mouseLineRGB = light ? '80, 20, 160' : '124, 58, 237';

            for (let i = 0; i < particles.length; i++) {
                particles[i].update(time);
                particles[i].draw();

                // Lines between nearby particles
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 160) {
                        const alpha = 0.35 * (1 - dist / 160);
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(${lineRGB}, ${alpha})`;
                        ctx.lineWidth = 0.7;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }

                // Lines from cursor to nearby particles
                const dxM = mouseX - particles[i].x;
                const dyM = mouseY - particles[i].y;
                const distM = Math.sqrt(dxM * dxM + dyM * dyM);

                if (distM < mouseRadius) {
                    const alpha = 0.5 * (1 - distM / mouseRadius);
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(${mouseLineRGB}, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(mouseX, mouseY);
                    ctx.lineTo(particles[i].x, particles[i].y);
                    ctx.stroke();
                }
            }

            // Draw cursor dot
            if (mouseX > 0 && mouseY > 0) {
                ctx.beginPath();
                ctx.arc(mouseX, mouseY, 3, 0, Math.PI * 2);
                ctx.fillStyle = light ? 'rgba(80, 20, 160, 0.6)' : 'rgba(0, 212, 255, 0.6)';
                ctx.fill();
            }

            requestAnimationFrame(animate);
        };
        
        animate();
    };
    initParticles();


    // ==========================================================================
    // 21. BACK TO TOP
    // ==========================================================================
    const initBackToTop = () => {
        const bttBtn = $('#backToTop');
        if (!bttBtn) return;

        window.addEventListener('scroll', throttle(() => {
            if (window.scrollY > 500) {
                bttBtn.classList.add('visible');
            } else {
                bttBtn.classList.remove('visible');
            }
        }, 100));

        bttBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    };
    initBackToTop();


    // ==========================================================================
    // 22. CONTACT FORM
    // ==========================================================================
    const initContactForm = () => {
        const form = $('#contactForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Basic validation
            let valid = true;
            const requiredFields = form.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    valid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });

            if (valid) {
                // Show success animation
                const btn = form.querySelector('button[type="submit"]');
                const originalText = btn.textContent;
                
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                btn.disabled = true;

                // Simulate API call
                setTimeout(() => {
                    btn.innerHTML = '<i class="fas fa-check"></i> Sent Successfully!';
                    btn.classList.add('success-btn');
                    form.reset();
                    
                    // Reset button after 3 seconds
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.disabled = false;
                        btn.classList.remove('success-btn');
                    }, 3000);
                }, 1500);
            }
        });

        // Remove error class on input
        form.addEventListener('input', (e) => {
            if (e.target.hasAttribute('required')) {
                e.target.classList.remove('error');
            }
        });
    };
    initContactForm();


    // ==========================================================================
    // 23. SCROLL-TRIGGERED SECTION BACKGROUNDS
    // ==========================================================================
    const initSectionBackgrounds = () => {
        const sections = $$('.section-bg-change');
        if (sections.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('bg-active');
                } else {
                    // Optional: remove if you want it to revert when scrolling away
                    // entry.target.classList.remove('bg-active');
                }
            });
        }, { threshold: 0.3 });

        sections.forEach(section => observer.observe(section));
    };
    initSectionBackgrounds();


    // ==========================================================================
    // 24. EASTER EGG (KONAMI CODE)
    // ==========================================================================
    const initKonamiCode = () => {
        // up up down down left right left right b a
        const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        let konamiIndex = 0;

        document.addEventListener('keydown', (e) => {
            if (e.key === konamiCode[konamiIndex]) {
                konamiIndex++;
                if (konamiIndex === konamiCode.length) {
                    triggerConfetti();
                    konamiIndex = 0; // Reset
                }
            } else {
                konamiIndex = 0; // Reset if wrong key
            }
        });

        const triggerConfetti = () => {
            // Create canvas for confetti
            const canvas = document.createElement('canvas');
            canvas.style.position = 'fixed';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.width = '100vw';
            canvas.style.height = '100vh';
            canvas.style.pointerEvents = 'none';
            canvas.style.zIndex = '9999';
            document.body.appendChild(canvas);

            const ctx = canvas.getContext('2d');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const particles = [];
            const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'];

            for (let i = 0; i < 150; i++) {
                particles.push({
                    x: canvas.width / 2,
                    y: canvas.height / 2,
                    r: Math.random() * 6 + 2,
                    dx: Math.random() * 10 - 5,
                    dy: Math.random() * -10 - 5,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    tilt: Math.floor(Math.random() * 10) - 10,
                    tiltAngle: 0,
                    tiltAngleInc: (Math.random() * 0.07) + 0.05
                });
            }

            let animationFrame;

            const render = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                let remaining = false;

                particles.forEach((p, index) => {
                    p.tiltAngle += p.tiltAngleInc;
                    p.y += (Math.cos(p.tiltAngle) + 1 + p.r / 2) / 2;
                    p.x += Math.sin(p.tiltAngle) * 2;
                    p.dy += 0.1; // gravity
                    p.x += p.dx;
                    p.y += p.dy;

                    if (p.y < canvas.height) {
                        remaining = true;
                        ctx.beginPath();
                        ctx.lineWidth = p.r;
                        ctx.strokeStyle = p.color;
                        ctx.moveTo(p.x + p.tilt + p.r, p.y);
                        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r);
                        ctx.stroke();
                    }
                });

                if (remaining) {
                    animationFrame = requestAnimationFrame(render);
                } else {
                    document.body.removeChild(canvas);
                    cancelAnimationFrame(animationFrame);
                }
            };
            
            render();
            console.log("🎮 Konami Code Activated! Enjoy the confetti! 🎉");
        };
    };
    initKonamiCode();

    // ==========================================================================
    // 26. DARK/LIGHT MODE TOGGLE
    // ==========================================================================
    const initThemeToggle = () => {
        const toggle = document.getElementById('themeToggle');
        if (!toggle) return;
        
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateToggleIcon(toggle, savedTheme);
        
        toggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            updateToggleIcon(toggle, next);
        });
    };
    function updateToggleIcon(btn, theme) {
        btn.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }
    initThemeToggle();

    // End of main.js
});


    // ==========================================================================
    // AURORA BOREALIS — LIVE CANVAS EFFECT (CURSOR-REACTIVE)
    // ==========================================================================
    const initAurora = () => {
        const canvas = document.getElementById('auroraCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width, height;
        let mouseX = 0.5;
        let mouseY = 0.5;
        let targetMouseX = 0.5;
        let targetMouseY = 0.5;
        let time = 0;

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Track mouse position (normalized 0-1)
        document.addEventListener('mousemove', (e) => {
            targetMouseX = e.clientX / width;
            targetMouseY = e.clientY / height;
        });

        // Aurora wave configuration — SLOW like dancing grass, HIGH visibility
        const waves = [
            { color: [0, 212, 255],   baseY: 0.3,  amplitude: 80,  frequency: 0.003, speed: 0.0012, width: 220, opacity: 0.25 },
            { color: [124, 58, 237],   baseY: 0.4,  amplitude: 100, frequency: 0.002, speed: 0.0009, width: 270, opacity: 0.20 },
            { color: [255, 0, 110],    baseY: 0.35, amplitude: 60,  frequency: 0.004, speed: 0.0015, width: 200, opacity: 0.15 },
            { color: [0, 255, 136],    baseY: 0.45, amplitude: 70,  frequency: 0.0025, speed: 0.0010, width: 180, opacity: 0.13 },
            { color: [0, 180, 255],    baseY: 0.25, amplitude: 90,  frequency: 0.0035, speed: 0.0013, width: 240, opacity: 0.18 },
            { color: [180, 80, 255],   baseY: 0.5,  amplitude: 50,  frequency: 0.003, speed: 0.0008, width: 210, opacity: 0.14 },
        ];

        const drawAuroraWave = (wave, t) => {
            const { color, baseY, amplitude, frequency, speed, width: waveWidth, opacity } = wave;

            // Mouse influence — aurora follows cursor
            const mouseInfluenceX = (mouseX - 0.5) * 200;
            const mouseInfluenceY = (mouseY - 0.5) * 150;

            const points = [];
            const segments = 80;

            for (let i = 0; i <= segments; i++) {
                const x = (i / segments) * width;
                const normalizedX = i / segments;

                // Multiple sine waves for organic shape
                const y = height * baseY
                    + Math.sin(normalizedX * Math.PI * 2 * 1.5 + t * speed * 60) * amplitude * 0.6
                    + Math.sin(normalizedX * Math.PI * 3 + t * speed * 40 + 1.5) * amplitude * 0.3
                    + Math.sin(normalizedX * Math.PI * 0.5 + t * speed * 20) * amplitude * 0.4
                    + mouseInfluenceY * Math.sin(normalizedX * Math.PI)
                    + mouseInfluenceX * Math.cos(normalizedX * Math.PI * 0.8) * 0.3;

                points.push({ x, y });
            }

            // Draw the aurora band with vertical gradient streaks
            for (let i = 0; i < points.length - 1; i++) {
                const p1 = points[i];
                const p2 = points[i + 1];
                const midY = (p1.y + p2.y) / 2;

                // Vertical gradient from wave center upward (aurora rises)
                const grad = ctx.createLinearGradient(p1.x, midY - waveWidth, p1.x, midY + waveWidth * 0.3);

                // Shimmer effect — opacity varies along the wave
                const shimmer = 0.5 + 0.5 * Math.sin(i * 0.15 + t * speed * 30);
                const dynamicOpacity = opacity * (0.6 + shimmer * 0.4);

                grad.addColorStop(0, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0)`);
                grad.addColorStop(0.3, `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${dynamicOpacity * 0.5})`);
                grad.addColorStop(0.5, `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${dynamicOpacity})`);
                grad.addColorStop(0.7, `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${dynamicOpacity * 0.3})`);
                grad.addColorStop(1, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0)`);

                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.moveTo(p1.x, midY - waveWidth);
                ctx.lineTo(p2.x, (p2.y + midY) / 2 - waveWidth);
                ctx.lineTo(p2.x, (p2.y + midY) / 2 + waveWidth * 0.3);
                ctx.lineTo(p1.x, midY + waveWidth * 0.3);
                ctx.closePath();
                ctx.fill();
            }

            // Add bright core line along the wave
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
                const xc = (points[i].x + points[i - 1].x) / 2;
                const yc = (points[i].y + points[i - 1].y) / 2;
                ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
            }
            ctx.strokeStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity * 0.8})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
        };

        // Add floating bright spots near cursor
        const drawCursorGlow = () => {
            const cx = mouseX * width;
            const cy = mouseY * height;
            const glowRadius = 250;

            const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowRadius);
            grad.addColorStop(0, 'rgba(0, 212, 255, 0.06)');
            grad.addColorStop(0.3, 'rgba(124, 58, 237, 0.04)');
            grad.addColorStop(0.6, 'rgba(0, 255, 136, 0.02)');
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(cx, cy, glowRadius, 0, Math.PI * 2);
            ctx.fill();
        };

        // Render loop
        const render = () => {
            // Smooth mouse following
            mouseX += (targetMouseX - mouseX) * 0.03;
            mouseY += (targetMouseY - mouseY) * 0.03;

            time += 0.15;

            // Clear
            ctx.clearRect(0, 0, width, height);

            // Draw cursor glow
            drawCursorGlow();

            // Draw each aurora wave
            waves.forEach((wave, i) => {
                drawAuroraWave(wave, time + i * 100);
            });

            requestAnimationFrame(render);
        };

        render();
    };
    initAurora();
