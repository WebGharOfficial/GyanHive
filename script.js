// Smooth scroll for nav links and CTA
function scrollToContact() {
  document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
}

// Only handle anchor links (starting with #) for smooth scrolling
document.querySelectorAll('.nav-btn-group a, .hero-cta-group a, .mobile-nav-links a').forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    // Only prevent default for anchor links (starting with #)
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const targetElement = document.querySelector(href);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
      // Close mobile nav if open
      if (window.innerWidth < 700) closeMobileNav();
    }
    // For all other links (like Learn More buttons), let them work normally
  });
});

// Hamburger mobile nav
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav-overlay');
function openMobileNav() {
  hamburger.classList.add('active');
  mobileNav.classList.add('active');
  document.body.style.overflow = 'hidden';
  hamburger.setAttribute('aria-expanded', 'true');
  mobileNav.setAttribute('aria-hidden', 'false');
}
function closeMobileNav() {
  hamburger.classList.remove('active');
  mobileNav.classList.remove('active');
  document.body.style.overflow = '';
  hamburger.setAttribute('aria-expanded', 'false');
  mobileNav.setAttribute('aria-hidden', 'true');
}
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    if (mobileNav.classList.contains('active')) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  });
  // Close on overlay click
  mobileNav.addEventListener('click', (e) => {
    if (e.target === mobileNav) closeMobileNav();
  });
}

// Fade-in on scroll
function fadeInOnScroll() {
  document.querySelectorAll('.fade-in').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60) {
      el.classList.add('visible');
    }
  });
}
window.addEventListener('scroll', fadeInOnScroll);
window.addEventListener('DOMContentLoaded', fadeInOnScroll);

// FAQ accordion
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  question.addEventListener('click', () => {
    item.classList.toggle('active');
  });
});

// Sticky nav shadow on scroll
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (window.scrollY > 10) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// Scroll to top button
const scrollBtn = document.getElementById('scrollToTopBtn');
window.addEventListener('scroll', () => {
  if (!scrollBtn) return;
  if (window.scrollY > 200) {
    scrollBtn.style.visibility = 'visible';
    scrollBtn.style.opacity = '1';
  } else {
    scrollBtn.style.visibility = 'hidden';
    scrollBtn.style.opacity = '0';
  }
});
if (scrollBtn) {
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Update login button to Dashboard if logged in
window.addEventListener('DOMContentLoaded', function() {
  function getDashboardUrl(user) {
    if (!user) return 'login.html';
    if (user.role === 'student' && user.adminApproved) return 'student.html';
    if (user.role === 'teacher' && user.verified) return 'teacher.html';
    if (user.role === 'admin') return 'admin.html';
    return 'login.html';
  }
  try {
    const userStr = localStorage.getItem('currentUser');
    const loginBtn = document.getElementById('loginBtn');
    const mobileLoginBtn = document.getElementById('mobileLoginBtn');
    if (userStr) {
      const user = JSON.parse(userStr);
      const dashboardUrl = getDashboardUrl(user);
      if (loginBtn) {
        loginBtn.textContent = 'Dashboard';
        loginBtn.href = dashboardUrl;
      }
      if (mobileLoginBtn) {
        mobileLoginBtn.textContent = 'Dashboard';
        mobileLoginBtn.href = dashboardUrl;
      }
    } else {
      if (loginBtn) {
        loginBtn.textContent = 'Login';
        loginBtn.href = 'login.html';
      }
      if (mobileLoginBtn) {
        mobileLoginBtn.textContent = 'Login';
        mobileLoginBtn.href = 'login.html';
      }
    }
  } catch (e) { /* ignore */ }
}); 