document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. MOBILE NAVIGATION MENU
    // ==========================================
    const menuToggle = document.getElementById("mobile-menu-toggle");
    const navMenu = document.getElementById("nav-menu");
    const navLinks = document.querySelectorAll("#nav-menu a");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            menuToggle.classList.toggle("active");
            navMenu.classList.toggle("active");
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                menuToggle.classList.remove("active");
                navMenu.classList.remove("active");
                
                // Set active class on navbar link
                navLinks.forEach(lnk => lnk.classList.remove("active"));
                link.classList.add("active");
            });
        });
    }

    // Update active link on scroll
    const sections = document.querySelectorAll("section, header");
    window.addEventListener("scroll", () => {
        let current = "";
        const scrollPosition = window.scrollY + 120; // offset

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${current}`) {
                link.classList.add("active");
            }
        });
    });

    // ==========================================
    // 2. FILTER SYSTEM
    // ==========================================
    const filterButtons = document.querySelectorAll(".filter-btn");
    const cards = document.querySelectorAll(".card");

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            const filter = button.getAttribute("data-filter");

            cards.forEach(card => {
                card.style.transition = "all 0.4s ease";
                if (filter === "all" || card.classList.contains(filter)) {
                    card.style.display = "flex";
                    setTimeout(() => {
                        card.style.opacity = "1";
                        card.style.transform = "scale(1) translateY(0)";
                    }, 50);
                } else {
                    card.style.opacity = "0";
                    card.style.transform = "scale(0.9) translateY(10px)";
                    setTimeout(() => {
                        card.style.display = "none";
                    }, 400);
                }
            });
        });
    });

    // ==========================================
    // 3. VIDEO HOVER PREVIEW
    // ==========================================
    const videos = document.querySelectorAll(".card video");

    videos.forEach(video => {
        let playPromise = null;
        let isHovered = false;

        // We handle playing only if the mouse enters
        video.addEventListener("mouseenter", () => {
            isHovered = true;
            playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    // Autoplay was prevented
                    console.log("Hover video playback prevented: " + error);
                });
            }
        });

        video.addEventListener("mouseleave", () => {
            isHovered = false;
            if (playPromise !== null) {
                playPromise.then(() => {
                    if (!isHovered) {
                        video.pause();
                        video.currentTime = 0;
                    }
                }).catch(() => {
                    video.pause();
                    video.currentTime = 0;
                });
            } else {
                video.pause();
                video.currentTime = 0;
            }
        });
    });

    // ==========================================
    // 4. VIDEO LIGHTBOX MODAL
    // ==========================================
    const lightbox = document.getElementById("video-lightbox");
    const lightboxVideo = document.getElementById("lightbox-video-player");
    const lightboxTitle = document.getElementById("lightbox-title");
    const lightboxDesc = document.getElementById("lightbox-desc");
    const specClient = document.getElementById("spec-client");
    const specTime = document.getElementById("spec-time");
    const specSoftware = document.getElementById("spec-software");
    const lightboxClose = document.getElementById("lightbox-close-btn");

    if (lightbox && lightboxVideo) {
        let lightboxPlayPromise = null;
        let isLightboxActive = false;

        cards.forEach(card => {
            card.addEventListener("click", () => {
                const videoSrc = card.getAttribute("data-video");
                const cardTitle = card.querySelector("h3").innerText;
                const cardCat = card.querySelector(".card-category").innerText;
                const client = card.getAttribute("data-client") || "Independent";
                const time = card.getAttribute("data-time") || "N/A";
                const software = card.getAttribute("data-software") || "Premiere Pro";

                // Inject metadata
                lightboxVideo.querySelector("source").setAttribute("src", videoSrc);
                lightboxVideo.load();
                
                lightboxTitle.innerText = cardTitle;
                lightboxDesc.innerText = cardCat + " Breakdown & Overview";
                specClient.innerText = client;
                specTime.innerText = time;
                specSoftware.innerText = software;

                // Open lightbox
                lightbox.classList.add("active");
                isLightboxActive = true;
                document.body.style.overflow = "hidden"; // Disable scroll

                // Auto-play the lightbox video
                lightboxPlayPromise = lightboxVideo.play();
                if (lightboxPlayPromise !== undefined) {
                    lightboxPlayPromise.catch(error => {
                        console.log("Lightbox autoplay prevented: " + error);
                    });
                }
            });
        });

        // Close lightbox handler
        const closeLightbox = () => {
            lightbox.classList.remove("active");
            isLightboxActive = false;
            document.body.style.overflow = ""; // Enable scroll
            
            const pauseAndReset = () => {
                if (!isLightboxActive) {
                    lightboxVideo.pause();
                    lightboxVideo.querySelector("source").setAttribute("src", "");
                    lightboxVideo.load();
                }
            };

            if (lightboxPlayPromise !== null) {
                lightboxPlayPromise.then(pauseAndReset).catch(pauseAndReset);
            } else {
                pauseAndReset();
            }
        };

        lightboxClose.addEventListener("click", closeLightbox);
        
        // Close on escape key
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && lightbox.classList.contains("active")) {
                closeLightbox();
            }
        });

        // Close on clicking outside lightbox content
        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // ==========================================
    // 5. INTERACTIVE PRICE ESTIMATOR
    // ==========================================
    const typeButtons = document.querySelectorAll("#calc-types .calc-option-btn");
    const styleButtons = document.querySelectorAll("#calc-styles .calc-option-btn");
    const speedButtons = document.querySelectorAll("#calc-speeds .calc-option-btn");
    const durationSlider = document.getElementById("duration-slider");
    const durationValDisplay = document.getElementById("slider-val");

    // Display Labels
    const typeLabel = document.getElementById("selected-type-name");
    const styleLabel = document.getElementById("selected-style-name");
    const speedLabel = document.getElementById("selected-speed-name");

    // Currency Toggle
    const currencyToggle = document.getElementById("currency-toggle");
    const labelUsd = document.getElementById("label-usd");
    const labelInr = document.getElementById("label-inr");
    const priceCurrency = document.getElementById("price-currency");

    // Receipt Line Items
    const receiptMultiplier = document.getElementById("receipt-multiplier");
    const receiptBase = document.getElementById("receipt-base");
    const receiptSpeed = document.getElementById("receipt-speed-fee");
    const receiptTotal = document.getElementById("receipt-total");
    const calcPriceDisplay = document.getElementById("calc-price-display");
    const calcBookBtn = document.getElementById("calc-book-btn");
    const contactMessage = document.getElementById("form-project");

    if (durationSlider) {
        let activeMultiplier = 1.0;
        let activeBase = 100;
        let activeSpeedFee = 0;
        
        // Currency Settings
        const USD_TO_INR = 84;
        let isINR = false;

        const calculatePrice = () => {
            const duration = parseInt(durationSlider.value);
            durationValDisplay.innerText = duration;

            // Duration scaling formula: length adds a small multiplier increment
            // e.g., base + (duration - 1) * 8% of base
            const durationMultiplier = 1.0 + (duration - 1) * 0.08;

            const baseCostCalculated = Math.round(activeBase * durationMultiplier);
            const totalCost = Math.round(baseCostCalculated * activeMultiplier + activeSpeedFee);

            // Currency conversion
            const rate = isINR ? USD_TO_INR : 1;
            const symbol = isINR ? "₹" : "$";
            const localeStr = isINR ? "en-IN" : "en-US";

            const displayBase = Math.round(baseCostCalculated * rate);
            const displaySpeed = Math.round(activeSpeedFee * rate);
            const displayTotal = Math.round(totalCost * rate);

            if (priceCurrency) {
                priceCurrency.innerText = symbol;
            }

            // Update receipt dashboard
            receiptMultiplier.innerText = activeMultiplier.toFixed(1) + "x";
            receiptBase.innerText = symbol + displayBase.toLocaleString(localeStr);
            receiptSpeed.innerText = symbol + displaySpeed.toLocaleString(localeStr);
            receiptTotal.innerText = symbol + displayTotal.toLocaleString(localeStr);
            
            // Dynamic count-up visual for the price display
            animatePriceDisplay(displayTotal);
        };

        // Price count animation helper
        let currentAnimatedPrice = 0;
        let priceAnimationId = null;

        const animatePriceDisplay = (targetPrice) => {
            if (priceAnimationId) {
                cancelAnimationFrame(priceAnimationId);
            }

            const localeStr = isINR ? "en-IN" : "en-US";

            if (currentAnimatedPrice !== targetPrice) {
                const diff = targetPrice - currentAnimatedPrice;
                const step = diff > 0 ? Math.ceil(diff / 6) : Math.floor(diff / 6);
                currentAnimatedPrice += step;
                calcPriceDisplay.innerText = currentAnimatedPrice.toLocaleString(localeStr);
                priceAnimationId = requestAnimationFrame(() => animatePriceDisplay(targetPrice));
            } else {
                currentAnimatedPrice = targetPrice;
                calcPriceDisplay.innerText = targetPrice.toLocaleString(localeStr);
                priceAnimationId = null;
            }
        };

        // Currency Switch Event Listener
        if (currencyToggle && labelUsd && labelInr) {
            currencyToggle.addEventListener("change", () => {
                isINR = currencyToggle.checked;
                if (isINR) {
                    labelUsd.classList.remove("active");
                    labelInr.classList.add("active");
                } else {
                    labelUsd.classList.add("active");
                    labelInr.classList.remove("active");
                }
                calculatePrice();
            });
        }

        // Button Option Toggles
        const setupOptionToggle = (buttons, updateFn) => {
            buttons.forEach(btn => {
                btn.addEventListener("click", () => {
                    buttons.forEach(b => b.classList.remove("active"));
                    btn.classList.add("active");
                    updateFn(btn);
                    calculatePrice();
                });
            });
        };

        setupOptionToggle(typeButtons, (btn) => {
            activeMultiplier = parseFloat(btn.getAttribute("data-multiplier"));
            typeLabel.innerText = btn.getAttribute("data-label");
        });

        setupOptionToggle(styleButtons, (btn) => {
            activeBase = parseInt(btn.getAttribute("data-base"));
            styleLabel.innerText = btn.getAttribute("data-label");
        });

        setupOptionToggle(speedButtons, (btn) => {
            activeSpeedFee = parseInt(btn.getAttribute("data-fee"));
            speedLabel.innerText = btn.getAttribute("data-label");
        });

        durationSlider.addEventListener("input", calculatePrice);

        // Prepopulate Contact Form from price calculator
        if (calcBookBtn && contactMessage) {
            calcBookBtn.addEventListener("click", (e) => {
                const totalText = receiptTotal.innerText;
                const typeText = typeLabel.innerText;
                const styleText = styleLabel.innerText;
                const speedText = speedLabel.innerText;
                const duration = durationSlider.value;

                contactMessage.value = `Hi Editkaro! I would like to inquire about a project.\n\nProject Specifications:\n- Category: ${typeText}\n- Duration: ${duration} minutes\n- Complexity Level: ${styleText}\n- Delivery Turnaround: ${speedText}\n- Estimated Price Outline: ${totalText}\n\nLooking forward to editing this project!`;
                
                // Smooth scroll to contact section
                document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
            });
        }

        // Initial Calculation
        calculatePrice();
    }

    // ==========================================
    // 6. TESTIMONIAL CAROUSEL SLIDER
    // ==========================================
    const carouselWrapper = document.getElementById("testimonial-carousel");
    const slides = document.querySelectorAll(".testimonial-slide");
    const prevBtn = document.getElementById("carousel-prev");
    const nextBtn = document.getElementById("carousel-next");
    const dotsContainer = document.getElementById("carousel-dots");
    let currentSlide = 0;

    if (carouselWrapper && slides.length > 0) {
        const updateCarousel = () => {
            carouselWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
            
            // Update dots
            const dots = dotsContainer.querySelectorAll(".dot");
            dots.forEach((dot, index) => {
                if (index === currentSlide) {
                    dot.classList.add("active");
                } else {
                    dot.classList.remove("active");
                }
            });
        };

        const nextSlide = () => {
            currentSlide = (currentSlide + 1) % slides.length;
            updateCarousel();
        };

        const prevSlide = () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            updateCarousel();
        };

        nextBtn.addEventListener("click", nextSlide);
        prevBtn.addEventListener("click", prevSlide);

        // Dots clicks
        const dots = dotsContainer.querySelectorAll(".dot");
        dots.forEach(dot => {
            dot.addEventListener("click", () => {
                currentSlide = parseInt(dot.getAttribute("data-slide"));
                updateCarousel();
            });
        });

        // Autoplay carousel slide every 6 seconds
        let autoplayInterval = setInterval(nextSlide, 6000);

        // Pause autoplay on mouse hover over carousel container
        const container = document.querySelector(".carousel-container");
        container.addEventListener("mouseenter", () => clearInterval(autoplayInterval));
        container.addEventListener("mouseleave", () => {
            autoplayInterval = setInterval(nextSlide, 6000);
        });
    }

    // ==========================================
    // 7. COUNTER ANIMATION & SCROLL REVEAL
    // ==========================================
    const counters = document.querySelectorAll(".counter");
    let countersAnimated = false;

    const animateCounters = () => {
        if (countersAnimated) return;
        countersAnimated = true;

        counters.forEach(counter => {
            const target = +counter.getAttribute("data-target");
            const updateCounter = () => {
                const count = +counter.innerText;
                const increment = Math.ceil(target / 80); // Speed factor

                if (count < target) {
                    counter.innerText = count + increment > target ? target : count + increment;
                    setTimeout(updateCounter, 25);
                } else {
                    counter.innerText = target;
                }
            };
            updateCounter();
        });
    };

    // Intersection Observer for Reveal & Counter
    const revealItems = document.querySelectorAll(".card, .testimonial-box, .stat-box, .feature-item, .calc-box, .calc-summary, .about-visual");
    
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Fade and lift entry
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                
                // If it is a stat-box, trigger the counter
                if (entry.target.classList.contains("stat-box")) {
                    animateCounters();
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealItems.forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)";
        revealObserver.observe(el);
    });

    // ==========================================
    // 8. CONTACT FORM SUBMISSION
    // ==========================================
    const contactForm = document.getElementById("contact-form");
    const successToast = document.getElementById("success-toast");

    if (contactForm && successToast) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();

            // Simulate form dispatching
            contactForm.querySelector("button[type='submit']").innerText = "Sending...";
            
            setTimeout(() => {
                // Show success toast
                successToast.classList.add("show");
                
                // Reset form button & text fields
                contactForm.querySelector("button[type='submit']").innerText = "Submit Inquiry";
                contactForm.reset();
                
                // Dismiss success toast after 3.5 seconds
                setTimeout(() => {
                    successToast.classList.remove("show");
                }, 3500);
                
            }, 1200);
        });
    }
});