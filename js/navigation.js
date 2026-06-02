'use strict';

/* ============================================================
   ניווט בין שקופיות
   - יצירת סיידבר אוטומטית
   - ניווט במקלדת ובמגע
   - ללא אזורי קליק רחבים (אלה הסתבכו עם המגירות)
   ============================================================ */

let currentSlide = 0;
let slides;
let totalSlides;

function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

document.addEventListener('DOMContentLoaded', () => {
    slides = document.querySelectorAll('.slide');
    totalSlides = slides.length;

    const totalEl = document.getElementById('total-slides');
    if (totalEl) totalEl.textContent = totalSlides;

    generateSidebar();
    showSlide(0);

    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    if (prevBtn) prevBtn.addEventListener('click', previousSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    const toggle = document.getElementById('sidebar-toggle');
    if (toggle) {
        toggle.addEventListener('click', () => {
            document.body.classList.toggle('sidebar-open');
        });
    }
});

/**
 * הצגת שקופית לפי אינדקס
 * @param {number} n
 */
function showSlide(n) {
    if (!slides || !slides.length) return;
    if (n < 0 || n >= totalSlides) return;

    slides[currentSlide].classList.remove('active');
    currentSlide = n;
    slides[currentSlide].classList.add('active');

    const cur = document.getElementById('current-slide');
    if (cur) cur.textContent = currentSlide + 1;

    window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion() ? 'auto' : 'smooth'
    });

    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    if (prevBtn) prevBtn.disabled = currentSlide === 0;
    if (nextBtn) nextBtn.disabled = currentSlide === totalSlides - 1;

    updateSidebarHighlight();
}

function nextSlide() {
    if (currentSlide < totalSlides - 1) showSlide(currentSlide + 1);
}

function previousSlide() {
    if (currentSlide > 0) showSlide(currentSlide - 1);
}

/**
 * מעבר לשקופית לפי מספר תצוגה (1-indexed)
 */
function goToSlide(slideNumber) {
    showSlide(slideNumber - 1);
}

/* ============================================================
   יצירת סיידבר
   ============================================================ */
function generateSidebar() {
    const list = document.getElementById('sidebar-list');
    if (!list) return;

    list.innerHTML = '';

    slides.forEach((slide, index) => {
        const h2 = slide.querySelector('h2');
        const h1 = slide.querySelector('h1');
        const title = (h2 && h2.textContent.trim())
            || (h1 && h1.textContent.trim())
            || `שקף ${index + 1}`;

        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#';
        a.dataset.slide = String(index + 1);
        a.innerHTML =
            `<span class="sidebar-num">${index + 1}.</span>` +
            `<span class="sidebar-title">${title}</span>`;

        a.addEventListener('click', (e) => {
            e.preventDefault();
            showSlide(index);
            if (window.innerWidth <= 1024) {
                document.body.classList.remove('sidebar-open');
            }
        });

        li.appendChild(a);
        list.appendChild(li);
    });
}

function updateSidebarHighlight() {
    const links = document.querySelectorAll('.sidebar-list a');
    links.forEach((a, idx) => {
        a.classList.toggle('active', idx === currentSlide);
    });

    const active = document.querySelector('.sidebar-list a.active');
    if (active) {
        active.scrollIntoView({
            block: 'nearest',
            behavior: prefersReducedMotion() ? 'auto' : 'smooth'
        });
    }
}

document.addEventListener('click', (e) => {
    const slideLink = e.target.closest('.slide-link[data-slide]');
    if (slideLink) {
        e.preventDefault();
        e.stopPropagation();
        goToSlide(parseInt(slideLink.dataset.slide, 10));
        return;
    }

    if (!document.body.classList.contains('sidebar-open')) return;
    if (window.innerWidth > 1024) return;

    const sidebar = document.getElementById('slides-sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle');
    if (sidebar && sidebar.contains(e.target)) return;
    if (toggleBtn && toggleBtn.contains(e.target)) return;

    document.body.classList.remove('sidebar-open');
});

/* ============================================================
   ניווט במגע (טאצ' / סוויפ)
   ============================================================ */
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    const dx = touchEndX - touchStartX;
    const dy = Math.abs(touchEndY - touchStartY);

    if (Math.abs(dx) > 80 && Math.abs(dx) > dy * 2) {
        if (dx < 0) {
            previousSlide();
        } else {
            nextSlide();
        }
    }
}

/* ============================================================
   ניווט במקלדת
   ============================================================ */
document.addEventListener('keydown', (e) => {
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
    if (e.target.closest('.mode-toggle')) return;

    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') nextSlide();
    else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') previousSlide();
    else if (e.key === 'Home') showSlide(0);
    else if (e.key === 'End') showSlide(totalSlides - 1);
    else if (e.key === ' ') {
        e.preventDefault();
        nextSlide();
    }
});
