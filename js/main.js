// Simple script placeholder for future interactivity
console.log("Welcome to sudo awakening!");

// Typewriter effect for hero title
function typeWriter(element, text, speed = 80) {
  let i = 0;
  element.textContent = '';
  function typing() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(typing, speed);
    }
  }
  typing();
}

// --- DARK MODE TOGGLE ---
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// --- BACK TO TOP BUTTON ---
function createBackToTop() {
  const btn = document.createElement('button');
  btn.id = 'backToTop';
  btn.title = 'Back to top';
  btn.innerHTML = '↑';
  document.body.appendChild(btn);
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  const heroTitle = document.querySelector('.hero .mono');
  if (heroTitle) {
    typeWriter(heroTitle, 'sudo awakening');
  }

  // Matrix-style binary rain effect
  const canvas = document.createElement('canvas');
  canvas.id = 'matrix-bg';
  canvas.style.position = 'fixed';
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.zIndex = '-1';
  canvas.style.pointerEvents = 'none';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let width = window.innerWidth;
  let height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;

  const fontSize = 16;
  const columns = Math.floor(width / fontSize);
  const drops = Array(columns).fill(1);

  function drawMatrix() {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.15)';
    ctx.fillRect(0, 0, width, height);
    ctx.font = fontSize + 'px JetBrains Mono, monospace';
    ctx.fillStyle = '#818cf8';
    for (let i = 0; i < drops.length; i++) {
      const text = Math.random() > 0.5 ? '0' : '1';
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }
  setInterval(drawMatrix, 50);

  window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  });

  // Dark mode toggle button
  let darkBtn = document.createElement('button');
  darkBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="7" width="18" height="10" rx="5" fill="#232a36" stroke="#34c759" stroke-width="2"/><circle cx="8.5" cy="12" r="1.5" fill="#fff"/><circle cx="15.5" cy="12" r="1.5" fill="#fff"/><rect x="9.5" y="15" width="5" height="1.5" rx="0.75" fill="#34c759"/></svg>';
  darkBtn.title = 'Toggle dark mode';
  darkBtn.className = 'dark-toggle-btn';
  darkBtn.addEventListener('click', toggleDarkMode);
  document.body.appendChild(darkBtn);

  // Restore dark mode from localStorage
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
  }

  // Back to top button
  createBackToTop();
});
