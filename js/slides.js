'use strict';

// ===== Slide Navigation =====
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

document.getElementById('total-slides').textContent = totalSlides;

/**
 * Display a specific slide
 * @param {number} n - Slide index to display
 */
function showSlide(n) {
    slides[currentSlide].classList.remove('active');
    currentSlide = (n + totalSlides) % totalSlides;
    slides[currentSlide].classList.add('active');

    document.getElementById('current-slide').textContent = currentSlide + 1;

    // Automatic scroll to top of slide
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

    // Update navigation buttons
    document.getElementById('prev-btn').disabled = currentSlide === 0;
    document.getElementById('next-btn').disabled = currentSlide === totalSlides - 1;
}

/**
 * Navigate to the next slide
 */
function nextSlide() {
    if (currentSlide < totalSlides - 1) {
        showSlide(currentSlide + 1);
    }
}

/**
 * Navigate to the previous slide
 */
function previousSlide() {
    if (currentSlide > 0) {
        showSlide(currentSlide - 1);
    }
}

// ===== Touch Events for Mobile =====
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', function (e) {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

/**
 * Handle swipe gesture for navigation
 * RTL: Swipe right = next, Swipe left = previous
 */
function handleSwipe() {
    const horizontalDiff = touchEndX - touchStartX;
    const verticalDiff = Math.abs(touchEndY - touchStartY);
    
    // Require at least 80px horizontal swipe and ensure it's more horizontal than vertical
    // This prevents accidental navigation during vertical scrolling
    if (Math.abs(horizontalDiff) > 80 && Math.abs(horizontalDiff) > verticalDiff * 2) {
        if (horizontalDiff < 0) {
            previousSlide(); // Swipe left = previous (RTL)
        } else {
            nextSlide(); // Swipe right = next (RTL)
        }
    }
}

// ===== Keyboard Navigation =====
document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') nextSlide();
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') previousSlide();
    if (e.key === 'Home') showSlide(0);
    if (e.key === 'End') showSlide(totalSlides - 1);
    if (e.key === ' ') {
        e.preventDefault();
        nextSlide();
    }
});

// ===== Click Navigation =====
const slideshowContainer = document.getElementById('slideshow-container');
const isRTL = document.documentElement.classList.contains('rtl-mode');

document.addEventListener('click', function (e) {
    // Check if click is on button, link, or other interactive element
    if (e.target.closest('button, a, .slide-link-span, input, select, textarea')) {
        return;
    }

    const slideContent = e.target.closest('.slide');
    if (slideContent && !e.target.closest('.navigation-controls')) {
        const containerRect = slideshowContainer.getBoundingClientRect();
        const clickX = e.clientX - containerRect.left;
        const containerWidth = containerRect.width;
        const margin = containerWidth * 0.15;

        if (isRTL) {
            // In RTL: left = next, right = previous
            if (clickX < margin) {
                nextSlide();
            } else if (clickX > containerWidth - margin) {
                previousSlide();
            }
        } else {
            // In LTR: left = previous, right = next
            if (clickX < margin) {
                previousSlide();
            } else if (clickX > containerWidth - margin) {
                nextSlide();
            }
        }
    }
});

// ===== Mouse Move for Visual Indication =====
document.addEventListener('mousemove', function (e) {
    const slideContent = e.target.closest('.slide');
    if (slideContent) {
        const containerRect = slideshowContainer.getBoundingClientRect();
        const mouseX = e.clientX - containerRect.left;
        const containerWidth = containerRect.width;
        const margin = containerWidth * 0.15;

        document.body.classList.remove('show-nav-prev', 'show-nav-next');

        if (isRTL) {
            if (mouseX < margin && currentSlide < totalSlides - 1) {
                document.body.classList.add('show-nav-next');
            } else if (mouseX > containerWidth - margin && currentSlide > 0) {
                document.body.classList.add('show-nav-prev');
            }
        } else {
            if (mouseX < margin && currentSlide > 0) {
                document.body.classList.add('show-nav-prev');
            } else if (mouseX > containerWidth - margin && currentSlide < totalSlides - 1) {
                document.body.classList.add('show-nav-next');
            }
        }
    }
});

slideshowContainer.addEventListener('mouseleave', function () {
    document.body.classList.remove('show-nav-prev', 'show-nav-next');
});
