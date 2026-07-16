if (!document.querySelector('link[href="./assets/navigation.css"]')) {
  const navigationStyles = document.createElement('link');
  navigationStyles.rel = 'stylesheet';
  navigationStyles.href = './assets/navigation.css';
  document.head.append(navigationStyles);
}

const pageName = location.pathname.split('/').pop() || 'index.html';
const navActive = pageName === 'product-search.html' || pageName === 'product.html' ? 'products'
  : pageName === 'persona.html' || pageName === 'persona-results.html' ? 'persona'
  : pageName === 'profile.html' ? 'profile'
  : pageName === 'skin-profile.html' ? 'build'
  : pageName === 'about.html' ? 'about'
  : 'home';

const header = document.querySelector('.site-header');
if (header) {
  header.innerHTML = `
    <a class="brand" href="./index.html" aria-label="Dermi Skin Match home"><span class="brand-mark brand-logo"><img src="./assets/images/Dermi.png" alt="" /></span><span>DERMI<span class="brand-sub">skin match</span></span></a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-navigation" aria-label="Open menu"><span aria-hidden="true">☰</span></button>
    <nav id="site-navigation" class="main-nav" aria-label="Main navigation">
      <a data-nav="home" href="./index.html">Home</a>
      <a data-nav="how" href="./index.html#how-it-works">How it works</a>
      <a data-nav="products" href="./product-search.html">Check a product</a>
      <a data-nav="profile" href="./profile.html">Skin profile</a>
      <a data-nav="about" href="./about.html">About Dermi</a>
      <a data-nav="persona" class="persona-nav-link" href="./persona.html">Persona</a>
      <a data-nav="build" class="button button-dark nav-cta" href="./skin-profile.html">Build profile</a>
    </nav>`;
  header.querySelector(`[data-nav="${navActive}"]`)?.classList.add('active');
}

document.querySelectorAll('a[href="./persona.html"]').forEach((link) => link.addEventListener('click', (event) => {
  if (localStorage.getItem('dermiProfile')) return;
  event.preventDefault();
  window.location.href = './skin-profile.html?next=persona';
}));

const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');
function closeMenu() {
  navToggle?.setAttribute('aria-expanded', 'false');
  mainNav?.classList.remove('is-open');
}
if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const nextOpen = navToggle.getAttribute('aria-expanded') !== 'true';
    navToggle.setAttribute('aria-expanded', String(nextOpen));
    mainNav.classList.toggle('is-open', nextOpen);
  });
  mainNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });
  document.addEventListener('click', (event) => {
    if (!mainNav.classList.contains('is-open') || header?.contains(event.target)) return;
    closeMenu();
  });
}

document.querySelectorAll('a[href="./index.html#checker"]').forEach((link) => {
  link.setAttribute('href', './product-search.html');
});
document.addEventListener('click', (event) => {
  const legacyCheckerLink = event.target.closest('a[href="./index.html#checker"]');
  if (!legacyCheckerLink) return;
  event.preventDefault();
  window.location.href = './product-search.html';
});

const searchButton = document.querySelector('#search-button');
const searchInput = document.querySelector('#product-search');
const searchMessage = document.querySelector('#search-message');
if (searchButton && searchInput && searchMessage) {
  searchButton.addEventListener('click', () => {
    const value = searchInput.value.trim();
    if (value) {
      window.location.href = `./product-search.html?q=${encodeURIComponent(value)}`;
      return;
    }
    searchMessage.textContent = 'Enter a product or brand to get started.';
    searchMessage.classList.remove('success');
  });
}
if (searchInput && searchButton) searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    searchButton.click();
  }
});
