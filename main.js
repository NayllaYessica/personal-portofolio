// ===== 1. DARK MODE =====
const root = document.documentElement;
const themeBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  themeIcon.textContent = theme === 'dark' ? '☀' : '☾';
  themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
}
applyTheme(root.getAttribute('data-theme') || 'light');

themeBtn.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  try { localStorage.setItem('theme', next); } catch (e) {} // simpan pilihan pengguna
});

// ===== 2. MENU MOBILE =====
const menuBtn = document.getElementById('menu-toggle');
const nav = document.getElementById('nav');

menuBtn.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(open));
});
nav.addEventListener('click', (e) => {          // tutup menu setelah link diklik
  if (e.target.tagName === 'A') {
    nav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }
});

// ===== 3. FADE-IN SAAT SECTION MUNCUL =====
const blocks = document.querySelectorAll('.section:not(.hero) .container');
blocks.forEach((el) => el.classList.add('reveal'));
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
blocks.forEach((el) => observer.observe(el));

// ===== 4. TAHUN FOOTER OTOMATIS =====
document.getElementById('year').textContent = new Date().getFullYear();
