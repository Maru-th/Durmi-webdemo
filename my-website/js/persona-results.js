const personaProfileRaw = localStorage.getItem('dermiProfile');
if (!personaProfileRaw) window.location.replace('./skin-profile.html?next=persona');

const personaProfile = personaProfileRaw ? JSON.parse(personaProfileRaw) : {};
const params = new URLSearchParams(location.search);
const levels = { essential: { label: 'Essential', count: 2 }, complete: { label: 'Complete', count: 3 }, elevated: { label: 'Elevated', count: 5 } };
const level = levels[params.get('level')] ? params.get('level') : 'essential';
const budget = Math.min(20000, Math.max(500, Number(params.get('budget')) || 3000));
const productImage = './assets/images/placeeholder.png';
const esc = (value = '') => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
const list = (value = '') => String(value).split(',').map((item) => item.trim()).filter(Boolean);
function match(product) {
  const allergies = personaProfile.generalAllergies || [];
  const ingredientText = String(product.ingredients || '').toLowerCase();
  const conflict = allergies.some((allergy) => ingredientText.includes(String(allergy).toLowerCase()));
  const skin = String(personaProfile.skinType || '').toLowerCase();
  const concerns = (personaProfile.concerns || []).join(' ').toLowerCase();
  const skinMatch = skin && (product.recommended_skin_types || []).some((type) => String(type).toLowerCase() === skin);
  const concernMatch = concerns && list(product.concerns_cured).some((item) => concerns.includes(item.toLowerCase()));
  return { conflict, score: conflict ? 0 : 50 + (skinMatch ? 25 : 0) + (concernMatch ? 20 : 0) };
}
function card(product) {
  const result = match(product);
  const blobs = [`<span class="product-blob">${esc(product.category)}</span>`, ...list(product.concerns_cured).slice(0, 2).map((item) => `<span class="product-blob soft">${esc(item)}</span>`), `<span class="product-blob safe">Profile considered</span>`].join('');
  return `<article class="product-card"><a class="product-card-image" href="./product.html?product=${encodeURIComponent(product.product_name)}"><img src="${productImage}" alt="${esc(product.product_name)} placeholder"/></a><div class="product-card-body"><div class="product-card-top"><span class="card-kicker">${esc(product.brand)}</span><span class="product-status ${result.score >= 75 ? 'good' : 'review'}">${result.score}% match</span></div><h2><a href="./product.html?product=${encodeURIComponent(product.product_name)}">${esc(product.product_name)}</a></h2><p>${esc(product.product_information)}</p><div class="product-blobs">${blobs}</div><div class="product-card-footer"><strong>฿${Number(product.price_thb || 0).toLocaleString()}</strong><span class="review-placeholder">Persona pick</span></div></div></article>`;
}
function selectSet(products) {
  const candidates = products.filter((product) => Number(product.price_thb || 0) <= budget && !match(product).conflict).sort((a, b) => match(b).score - match(a).score || Number(a.price_thb) - Number(b.price_thb));
  const selected = []; let total = 0; const categories = new Set();
  for (const product of candidates) { const price = Number(product.price_thb || 0); if (selected.length >= levels[level].count || total + price > budget) continue; if (categories.has(product.category) && candidates.some((item) => !categories.has(item.category) && total + Number(item.price_thb || 0) <= budget)) continue; selected.push(product); categories.add(product.category); total += price; }
  return { selected, total };
}
fetch('./assets/Products.json').then((response) => response.json()).then((products) => {
  const set = selectSet(products);
  document.querySelector('#persona-summary').textContent = `${levels[level].label} routine · up to ฿${budget.toLocaleString()} total`;
  document.querySelector('#persona-total').textContent = `฿${set.total.toLocaleString()}`;
  document.querySelector('#persona-budget-label').textContent = `Budget ฿${budget.toLocaleString()}`;
  document.querySelector('#persona-products').innerHTML = set.selected.map(card).join('');
  document.querySelector('#persona-empty').hidden = Boolean(set.selected.length);
}).catch(() => { document.querySelector('#persona-summary').textContent = 'Persona recommendations are unavailable right now.'; document.querySelector('#persona-empty').hidden = false; });
