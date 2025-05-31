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
  darkBtn.textContent = '🌙';
  darkBtn.title = 'Toggle dark mode';
  darkBtn.style.position = 'fixed';
  darkBtn.style.top = '1.2rem';
  darkBtn.style.right = '1.2rem';
  darkBtn.style.zIndex = '150';
  darkBtn.style.background = '#fff';
  darkBtn.style.border = 'none';
  darkBtn.style.borderRadius = '50%';
  darkBtn.style.width = '2.5rem';
  darkBtn.style.height = '2.5rem';
  darkBtn.style.fontSize = '1.3rem';
  darkBtn.style.cursor = 'pointer';
  darkBtn.style.boxShadow = '0 2px 8px #232a3644';
  darkBtn.style.transition = 'background 0.2s';
  darkBtn.addEventListener('click', toggleDarkMode);
  document.body.appendChild(darkBtn);

  // Restore dark mode from localStorage
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
  }

  // Back to top button
  createBackToTop();
});
