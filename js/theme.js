'use strict';

/* ============================================================
   ניהול ערכת צבעים ומצב תצוגה (בהיר/כהה)
   ============================================================ */

const savedTheme = localStorage.getItem('theme') || 'warm';
const savedMode = localStorage.getItem('mode') || 'light';

document.documentElement.setAttribute('data-theme', savedTheme);
document.documentElement.setAttribute('data-mode', savedMode);

document.addEventListener('DOMContentLoaded', () => {
    const themeSelect = document.getElementById('theme-select');
    if (themeSelect) {
        themeSelect.value = savedTheme;
        themeSelect.addEventListener('change', () => changeTheme(themeSelect.value));
    }

    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => changeMode(btn.dataset.mode));
    });

    syncModeButtons(savedMode);
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
    syncModeButtons(mode);
}

function syncModeButtons(mode) {
    document.querySelectorAll('.mode-btn').forEach(btn => {
        const isActive = btn.dataset.mode === mode;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-checked', String(isActive));
    });
}

document.addEventListener('keydown', (e) => {
    const radiogroup = e.target.closest('[role="radiogroup"]');
    if (!radiogroup || !radiogroup.querySelector('.mode-btn')) return;

    const buttons = [...radiogroup.querySelectorAll('.mode-btn')];
    const currentIndex = buttons.findIndex(btn => btn.classList.contains('active'));
    if (currentIndex === -1) return;

    let nextIndex = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        nextIndex = (currentIndex + 1) % buttons.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
    }

    if (nextIndex !== -1) {
        e.preventDefault();
        e.stopPropagation();
        changeMode(buttons[nextIndex].dataset.mode);
        buttons[nextIndex].focus();
    }
});
