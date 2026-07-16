const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');
if (navToggle && mainNav) navToggle.addEventListener('click', () => { const open = navToggle.getAttribute('aria-expanded') === 'true'; navToggle.setAttribute('aria-expanded', String(!open)); mainNav.classList.toggle('is-open', !open); });
document.querySelectorAll('.main-nav a').forEach((link) => link.addEventListener('click', () => { const toggle = document.querySelector('.nav-toggle'); const nav = link.closest('.main-nav'); if (toggle && nav?.classList.contains('is-open')) { toggle.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); } }));

const searchButton = document.querySelector('#search-button');
const searchInput = document.querySelector('#product-search');
const searchMessage = document.querySelector('#search-message');
if (searchButton && searchInput && searchMessage) searchButton.addEventListener('click', () => { const value = searchInput.value.trim(); if (value) { window.location.href = `./product-search.html?q=${encodeURIComponent(value)}`; return; } searchMessage.textContent = 'Enter a product or brand to get started.'; searchMessage.classList.remove('success'); });
if (searchInput && searchButton) searchInput.addEventListener('keydown', (event) => { if (event.key === 'Enter') { event.preventDefault(); searchButton.click(); } });
