'use strict';

/* ============================================================
   ניהול ערכת צבעים ומצב תצוגה (בהיר/כהה)
   ============================================================ */

// ברירת המחדל החדשה: ערכת "warm" (טרקוטה+זהב+זית)
const savedTheme = localStorage.getItem('theme') || 'warm';
const savedMode = localStorage.getItem('mode') || 'light';

document.documentElement.setAttribute('data-theme', savedTheme);
document.documentElement.setAttribute('data-mode', savedMode);

document.addEventListener('DOMContentLoaded', () => {
    const themeSelect = document.getElementById('theme-select');
    if (themeSelect) themeSelect.value = savedTheme;

    document.querySelector(`.mode-btn[data-mode="${savedMode}"]`)?.classList.add('active');
});

/**
 * החלפת ערכת צבעים
 * @param {string} theme
 */
function changeTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

/**
 * החלפת מצב תצוגה (בהיר/כהה)
 * @param {string} mode - 'light' או 'dark'
 */
function changeMode(mode) {
    document.documentElement.setAttribute('data-mode', mode);
    localStorage.setItem('mode', mode);

    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-checked', 'false');
    });

    const activeBtn = document.querySelector(`.mode-btn[data-mode="${mode}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
        activeBtn.setAttribute('aria-checked', 'true');
    }
}
