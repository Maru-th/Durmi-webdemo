const hasProfile = Boolean(localStorage.getItem('dermiProfile'));
if (!hasProfile) window.location.replace('./skin-profile.html?next=persona');

const personaProfile = hasProfile ? JSON.parse(localStorage.getItem('dermiProfile')) : {};
const escPersona = (value = '') => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
const traits = document.createElement('div');
traits.className = 'persona-section persona-traits';
const concerns = (personaProfile.concerns || []).slice(0, 3);
traits.innerHTML = `<span class="card-kicker">01 · YOUR SKIN TRAITS</span><h2>Your skin, at a glance</h2><div class="persona-trait-grid"><div class="persona-skin-type"><span>SKIN TYPE</span><strong>${escPersona(personaProfile.skinType || 'Not provided')}</strong></div><div class="persona-concerns"><span>MAIN CONCERNS</span>${concerns.length ? `<div>${concerns.map((concern) => `<b>${escPersona(concern)}</b>`).join('')}</div>` : '<p>Not provided</p>'}</div></div>${!personaProfile.skinType || !concerns.length ? '<a class="text-link persona-update-link" href="./profile.html">Update profile</a>' : ''}`;
const personaPanel = document.querySelector('.persona-panel');
personaPanel.prepend(traits);
document.querySelector('.persona-section:not(.persona-traits) .card-kicker').textContent = '02 · ROUTINE LEVEL';
document.querySelector('.budget-section .card-kicker').textContent = '03 · TOTAL BUDGET';

const budgetInput = document.querySelector('#persona-budget');
const budgetValue = document.querySelector('#persona-budget-value');
const submit = document.querySelector('#persona-submit');
let selectedLevel = 'essential';

function snapBudget(value) {
  const step = value < 5000 ? 100 : value < 10000 ? 500 : 1000;
  return Math.min(20000, Math.max(500, Math.round(value / step) * step));
}
function updateBudget() {
  const budget = snapBudget(Number(budgetInput.value));
  budgetInput.value = budget;
  budgetValue.textContent = `฿${budget.toLocaleString()}`;
  submit.href = `./persona-results.html?level=${selectedLevel}&budget=${budget}`;
}
document.querySelectorAll('.persona-level').forEach((button) => button.addEventListener('click', () => {
  selectedLevel = button.dataset.level;
  document.querySelectorAll('.persona-level').forEach((item) => { const selected = item === button; item.classList.toggle('selected', selected); item.setAttribute('aria-checked', String(selected)); });
  updateBudget();
}));
budgetInput.addEventListener('input', updateBudget);
updateBudget();
