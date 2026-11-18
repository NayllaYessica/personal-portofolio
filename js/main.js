const root = document.documentElement;
const themeBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const paletteToggle = document.getElementById('palette-toggle');
const paletteMenu = document.getElementById('palette-menu');
const paletteOptions = document.querySelectorAll('.palette-option');
const menuBtn = document.getElementById('menu-toggle');
const menuIcon = document.getElementById('menu-icon');
const nav = document.getElementById('nav');

function applyTheme(theme) {
  const isDark = theme === 'dark';
  root.setAttribute('data-theme', isDark ? 'dark' : 'light');
  themeIcon.textContent = isDark ? '☀' : '☾';
  themeBtn.setAttribute('aria-label', isDark ? 'Aktifkan tema terang' : 'Aktifkan tema gelap');
  document.querySelector('meta[name="theme-color"]').setAttribute('content', isDark ? '#171d19' : '#f7f6f1');
}

function applyPalette(palette) {
  const validPalettes = ['sage', 'rose', 'lavender', 'sky'];
  const selectedPalette = validPalettes.includes(palette) ? palette : 'sage';
  root.setAttribute('data-palette', selectedPalette);
  paletteOptions.forEach((option) => {
    option.setAttribute('aria-pressed', String(option.dataset.palette === selectedPalette));
  });
}

applyTheme(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
applyPalette(root.getAttribute('data-palette'));

themeBtn.addEventListener('click', () => {
  const nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(nextTheme);
  try {
    localStorage.setItem('theme', nextTheme);
  } catch (error) {
    console.warn('Preferensi tema tidak dapat disimpan di browser ini.', error);
  }
});

function closePaletteMenu() {
  paletteMenu.hidden = true;
  paletteToggle.setAttribute('aria-expanded', 'false');
}

paletteToggle.addEventListener('click', () => {
  const isOpen = paletteToggle.getAttribute('aria-expanded') !== 'true';
  paletteMenu.hidden = !isOpen;
  paletteToggle.setAttribute('aria-expanded', String(isOpen));
});

paletteOptions.forEach((option) => {
  option.addEventListener('click', () => {
    const palette = option.dataset.palette;
    applyPalette(palette);
    closePaletteMenu();
    try {
      localStorage.setItem('palette', palette);
    } catch (error) {
      console.warn('Preferensi warna tidak dapat disimpan di browser ini.', error);
    }
  });
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('.palette-control')) closePaletteMenu();
});

function closeMenu() {
  nav.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.setAttribute('aria-label', 'Buka menu');
  menuIcon.textContent = '☰';
}

menuBtn.addEventListener('click', () => {
  const isOpen = menuBtn.getAttribute('aria-expanded') !== 'true';
  nav.classList.toggle('open', isOpen);
  menuBtn.setAttribute('aria-expanded', String(isOpen));
  menuBtn.setAttribute('aria-label', isOpen ? 'Tutup menu' : 'Buka menu');
  menuIcon.textContent = isOpen ? '×' : '☰';
});

nav.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});

const logo = document.querySelector('.logo');
const logoMark = document.querySelector('.logo-mark');
let greetingTimeout;

logo.addEventListener('click', () => {
  logoMark.classList.add('is-greeting');
  window.clearTimeout(greetingTimeout);
  greetingTimeout = window.setTimeout(() => {
    logoMark.classList.remove('is-greeting');
  }, 1600);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !paletteMenu.hidden) {
    closePaletteMenu();
    paletteToggle.focus();
    return;
  }
  if (event.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuBtn.focus();
  }
});

const filterButtons = document.querySelectorAll('.filter-btn');
const projects = document.querySelectorAll('.project');
const projectCount = document.getElementById('project-count');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const category = button.dataset.filter;
    let visibleCount = 0;

    filterButtons.forEach((filterButton) => {
      filterButton.setAttribute('aria-pressed', String(filterButton === button));
    });

    projects.forEach((project) => {
      const isVisible = category === 'all' || project.dataset.category === category;
      project.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    projectCount.textContent = `${visibleCount} proyek`;
  });
});

const revealBlocks = document.querySelectorAll('.section:not(.hero) .container');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  revealBlocks.forEach((block) => block.classList.add('reveal'));
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealBlocks.forEach((block) => observer.observe(block));
}

document.getElementById('year').textContent = new Date().getFullYear();
