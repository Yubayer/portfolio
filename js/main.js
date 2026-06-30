/* ============================================================
   Portfolio — shared site script
   Safe to include on every page. Each feature checks that its
   target elements exist before wiring up, so missing sections
   on a given page won't throw errors.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Typed role (hero only) ---------- */
  const typedEl = document.getElementById('typedRole');
  if (typedEl) {
    const roles = ["Senior Software Engineer", "Shopify Expert", "Senior Shopify Developer", "Shopify App Developer", "React Router v7 Developer", "Laravel Developer", "Prisma ORM.", "MySql, PostGreSql, MongoDB", "Heroku, Railway"];
    let roleIndex = 0, charIndex = 0, deleting = false;

    function typeLoop() {
      const current = roles[roleIndex];
      if (!deleting) {
        typedEl.textContent = current.slice(0, charIndex + 1);
        charIndex++;
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(typeLoop, 1400);
          return;
        }
      } else {
        typedEl.textContent = current.slice(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
        }
      }
      setTimeout(typeLoop, deleting ? 40 : 80);
    }
    typeLoop();
  }

  /* ---------- Cursor glow + parallax orbs ---------- */
  const glow = document.getElementById('cursorGlow');
  const orbs = document.querySelectorAll('.orb');

  if (glow || orbs.length) {
    window.addEventListener('mousemove', (e) => {
      const x = e.clientX;
      const y = e.clientY;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;

      if (glow) {
        glow.style.left = x + 'px';
        glow.style.top = y + 'px';
      }

      const relX = (x - cx) / cx;
      const relY = (y - cy) / cy;

      orbs.forEach((orb) => {
        const depth = parseFloat(orb.dataset.depth || 0);
        orb.style.transform = `translate(${relX * depth}px, ${relY * depth}px)`;
      });
    });
  }

  /* ---------- Tilt cards ---------- */
  document.querySelectorAll('.tilt-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = ((y - rect.height / 2) / rect.height) * -10;
      const rotateY = ((x - rect.width / 2) / rect.width) * 10;
      card.style.transform = `perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(500px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });

  /* ---------- Header: scroll state + mobile menu ---------- */
  const siteNav = document.getElementById('siteNav');
  const burgerBtn = document.getElementById('burgerBtn');
  const closeMenuBtn = document.getElementById('closeMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileMenuBackdrop = document.getElementById('mobileMenuBackdrop');

  function closeMobileMenu() {
    if (!mobileMenu || !burgerBtn) return;
    mobileMenu.classList.remove('open');
    burgerBtn.classList.remove('open');
    if (mobileMenuBackdrop) mobileMenuBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  function openMobileMenu() {
    if (!mobileMenu || !burgerBtn) return;
    mobileMenu.classList.add('open');
    burgerBtn.classList.add('open');
    if (mobileMenuBackdrop) mobileMenuBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  if (mobileMenuBackdrop) mobileMenuBackdrop.addEventListener('click', closeMobileMenu);

  if (siteNav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        siteNav.classList.add('scrolled');
      } else {
        siteNav.classList.remove('scrolled');
      }
    });
  }

  if (burgerBtn && mobileMenu) {
    burgerBtn.addEventListener('click', () => {
      if (mobileMenu.classList.contains('open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMobileMenu);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
  });

  /* ---------- Mobile nav links always close the menu on click ---------- */
  document.querySelectorAll('.mnav-link').forEach((link) => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  /* ---------- Nav link clicks ----------
     Same-page hash links (#section) smooth-scroll if the target
     exists on this page. Cross-page links (index.html#section,
     projects.html, etc.) are left alone to navigate normally. */
  document.querySelectorAll('.nav-link, .mnav-link, .footer-link').forEach((link) => {
    const href = link.getAttribute('href') || '';
    if (!href.startsWith('#')) return; // let normal page links navigate

    link.addEventListener('click', (e) => {
      const targetId = href.slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        document.querySelectorAll('.nav-link').forEach((l) => l.classList.remove('active', 'text-white'));
        document.querySelectorAll(`.nav-link[href="#${targetId}"]`).forEach((l) => l.classList.add('active', 'text-white'));
        document.querySelectorAll('.mnav-link').forEach((l) => l.classList.remove('active'));
        document.querySelectorAll(`.mnav-link[href="#${targetId}"]`).forEach((l) => l.classList.add('active'));
      }
      closeMobileMenu();
    });
  });

  /* ---------- Skill filter buttons ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');
  if (filterBtns.length && skillCards.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        filterBtns.forEach((b) => {
          b.classList.remove('bg-[#d4af37]', 'text-black');
          b.classList.add('border', 'border-white/15', 'text-gray-300');
        });
        btn.classList.add('bg-[#d4af37]', 'text-black');
        btn.classList.remove('border', 'border-white/15', 'text-gray-300');

        skillCards.forEach((card) => {
          const cats = (card.dataset.cat || '').split(' ');
          card.style.display = (filter === 'all' || cats.includes(filter)) ? '' : 'none';
        });
      });
    });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const content = item.querySelector('.faq-content');
      const iconWrap = item.querySelector('.faq-icon');
      const isOpen = content.style.display === 'block';
      const group = item.closest('[id$="List"]') || document;

      group.querySelectorAll('.faq-content').forEach((c) => c.style.display = 'none');
      group.querySelectorAll('.faq-icon').forEach((w) => {
        w.style.transform = 'rotate(0deg)';
        w.classList.remove('bg-[#d4af37]', 'border-[#d4af37]');
        w.classList.add('bg-[#d4af37]/10', 'border-[#d4af37]/30');
        const glyph = w.querySelector('.faq-icon-glyph');
        if (glyph) {
          glyph.classList.remove('text-black');
          glyph.classList.add('gold-text');
          glyph.style.transform = 'rotate(0deg)';
        }
      });

      if (!isOpen) {
        content.style.display = 'block';
        iconWrap.style.transform = 'rotate(180deg)';
        iconWrap.classList.remove('bg-[#d4af37]/10', 'border-[#d4af37]/30');
        iconWrap.classList.add('bg-[#d4af37]', 'border-[#d4af37]');
        const glyph = iconWrap.querySelector('.faq-icon-glyph');
        if (glyph) {
          glyph.classList.remove('gold-text');
          glyph.classList.add('text-black');
          glyph.style.transform = 'rotate(45deg)';
        }
      }
    });
  });

  /* ---------- FAQ category filter (faq page) ---------- */
  const faqCatBtns = document.querySelectorAll('.faq-cat-btn');
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqCatBtns.length && faqItems.length) {
    faqCatBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const cat = btn.dataset.cat;
        faqCatBtns.forEach((b) => {
          b.classList.remove('bg-[#d4af37]', 'text-black');
          b.classList.add('border', 'border-white/15', 'text-gray-300');
        });
        btn.classList.add('bg-[#d4af37]', 'text-black');
        btn.classList.remove('border', 'border-white/15', 'text-gray-300');

        faqItems.forEach((item) => {
          const itemCat = item.dataset.cat || '';
          item.style.display = (cat === 'all' || itemCat === cat) ? '' : 'none';
        });
      });
    });
  }

  /* ---------- Pricing toggle (monthly / project) ---------- */
  const pricingToggle = document.getElementById('pricingToggle');
  if (pricingToggle) {
    const monthlyEls = document.querySelectorAll('[data-price-monthly]');
    pricingToggle.addEventListener('click', () => {
      pricingToggle.classList.toggle('toggled');
      const showProject = pricingToggle.classList.contains('toggled');
      monthlyEls.forEach((el) => {
        el.textContent = showProject ? el.dataset.priceProject : el.dataset.priceMonthly;
      });
    });
  }

  /* ---------- Scroll-to-top ---------- */
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    window.addEventListener('scroll', () => {
      scrollTopBtn.style.opacity = window.scrollY > 400 ? '1' : '0';
      scrollTopBtn.style.pointerEvents = window.scrollY > 400 ? 'auto' : 'none';
    });
  }

  /* ---------- Active nav link: page match + scroll-spy ---------- */
  (function setActiveNav() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link, .mnav-link');

    function clearActive() {
      navLinks.forEach((l) => {
        l.classList.remove('active');
        if (l.classList.contains('nav-link')) l.classList.remove('text-white');
      });
    }

    function activateByHrefs(hrefs) {
      clearActive();
      navLinks.forEach((l) => {
        if (hrefs.includes(l.getAttribute('href'))) {
          l.classList.add('active');
          if (l.classList.contains('nav-link')) l.classList.add('text-white');
        }
      });
    }

    // Build a list of { id, hrefs } for every section on this page that has
    // a corresponding nav link (matches "#id" or "index.html#id" or, for the
    // page's own top/hero section, the bare page link like "index.html").
    const homeHrefVariants = ['index.html', './index.html', '', '#home'];
    const sectionLinkHrefs = Array.from(navLinks)
      .map((l) => l.getAttribute('href') || '')
      .filter((href, i, arr) => href.includes('#') && arr.indexOf(href) === i);

    const trackedSections = sectionLinkHrefs
      .map((href) => href.split('#')[1])
      .filter((id, i, arr) => id && arr.indexOf(id) === i)
      .map((id) => ({ id, el: document.getElementById(id) }))
      .filter((s) => s.el);

    const heroSection = document.getElementById('home');

    if (trackedSections.length && path === 'index.html') {
      const spy = () => {
        const probe = window.scrollY + window.innerHeight * 0.3;

        // Default to "Home" while above the first tracked section.
        let activeId = null;
        for (const { id, el } of trackedSections) {
          if (el.offsetTop <= probe) {
            activeId = id;
          }
        }

        if (activeId === null) {
          activateByHrefs(homeHrefVariants.concat(['#home']));
        } else {
          activateByHrefs([`#${activeId}`, `index.html#${activeId}`]);
        }
      };
      window.addEventListener('scroll', spy, { passive: true });
      spy();
    } else {
      // Other pages (or homepage with nothing to spy on): plain filename match.
      navLinks.forEach((link) => {
        const href = link.getAttribute('href') || '';
        const hrefPage = href.split('#')[0] || 'index.html';
        if (hrefPage === path && !href.includes('#')) {
          link.classList.add('active');
          if (link.classList.contains('nav-link')) link.classList.add('text-white');
        }
      });
    }
  })();

  /* ---------- Count-up stats (triggered on viewport entry) ---------- */
  const counters = document.querySelectorAll('.counter');
  if (counters.length && 'IntersectionObserver' in window) {
    const animateCounter = (el) => {
      const target = parseFloat(el.dataset.target);
      const decimals = parseInt(el.dataset.decimals || '0', 10);
      const duration = 1400;
      const startTime = performance.now();

      function tick(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const value = target * eased;
        el.textContent = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString();
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = decimals > 0 ? target.toFixed(decimals) : target.toLocaleString();
        }
      }
      requestAnimationFrame(tick);
    };

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          entry.target.dataset.animated = 'true';
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach((el) => counterObserver.observe(el));
  }

});
