const profileState = {
  scan: { source: '', imageAnalyzed: false, imageDeleted: true, detectedSkinType: '', detectedConcerns: [], previewAvailable: false },
  skinType: '', concerns: [], livingHabits: [], makeup: '', budget: '', generalAllergies: [], pastProductAllergies: [], customAnswers: {}
};

const panels = [...document.querySelectorAll('[data-panel]')].filter((panel) => Number(panel.dataset.panel) < 4);
const nodes = [...document.querySelectorAll('.progress-node')];
const continueButton = document.querySelector('#continue-step');
const backButton = document.querySelector('#back-step');
const saveExitButton = document.querySelector('#save-exit');
const scanMessage = document.querySelector('#scan-message');
const scanStage = document.querySelector('.scan-stage');
const cameraButton = document.querySelector('#start-camera');
const photoUpload = document.querySelector('#photo-upload');
const uploadButton = document.querySelector('.upload-button');
const cameraVideo = document.querySelector('#camera-video');
const scanPreview = document.querySelector('#scan-preview');
const scanPlaceholder = document.querySelector('#scan-placeholder');
const scanGuide = document.querySelector('#scan-guide');
const scanLoading = document.querySelector('#scan-loading');
const scanComplete = document.querySelector('#scan-complete');

const skipScanButton = document.createElement('button');
skipScanButton.id = 'skip-face-scan';
skipScanButton.className = 'text-button skip-face-scan';
skipScanButton.type = 'button';
skipScanButton.textContent = 'Skip face scan';
document.querySelector('.scan-actions').append(skipScanButton);
const scanDescription = document.querySelector('[data-panel="1"] .panel-heading p:not(.step-kicker)');
if (scanDescription) scanDescription.textContent = 'A fresh-face photo can give Dermi an initial read, but it is optional. You can build your profile from questions instead.';

document.querySelector('[data-panel="4"]')?.remove();
document.body.insertAdjacentHTML('beforeend', `
  <div id="signup-mockup" class="signup-mockup" role="dialog" aria-modal="true" aria-labelledby="signup-mockup-title">
    <div class="signup-mockup-card">
      <p class="step-kicker">WELCOME TO DERMI</p><h2 id="signup-mockup-title">Create your skin profile</h2>
      <p>Sign in to save your profile and keep your recommendations available across devices.</p>
      <button id="signup-google" class="google-signup-button" type="button"><span aria-hidden="true">G</span> Continue with Google</button>
      <div class="signup-divider" aria-hidden="true"><span></span><b>or</b><span></span></div>
      <label class="signup-email-label" for="signup-email">Email address</label><input id="signup-email" type="email" placeholder="you@example.com" autocomplete="email" />
      <button id="signup-email-button" class="button button-dark" type="button">Continue with email</button>
      <button id="signup-guest" class="guest-continue" type="button">Continue without an account</button><p id="signup-status" class="inline-message" role="status"></p>
    </div>
  </div>`);

let currentStep = 1;
let questionIndex = 0;
let questions = [];
let questionLoadError = false;
let questionsLoaded = false;
let cameraStream;
let scanState = 'idle';
let analysisTimer;
let completionTimer;
let uploadedImageUrl = '';
let signupGateOpen = true;

const signupMockup = document.querySelector('#signup-mockup');
const signupStatus = document.querySelector('#signup-status');

function setMessage(message, error = false) { scanMessage.textContent = message; scanMessage.classList.toggle('error', error); }
function stopCamera() { cameraStream?.getTracks().forEach((track) => track.stop()); cameraStream = undefined; cameraVideo.srcObject = null; }
function knownKey(key) { return ['skinType', 'concerns', 'livingHabits', 'makeup', 'budget', 'generalAllergies', 'pastProductAllergies'].includes(key); }
function getAnswer(question) { return knownKey(question.key) ? profileState[question.key] : profileState.customAnswers?.[question.key]; }
function setAnswer(question, value) { if (knownKey(question.key)) profileState[question.key] = value; else profileState.customAnswers[question.key] = value; }
function isAnswered(question) { const value = getAnswer(question); return Array.isArray(value) ? value.length > 0 : Boolean(value?.trim ? value.trim() : value); }

function updateProgress(step) {
  nodes.forEach((node, index) => { node.classList.toggle('active', index + 1 === step); node.classList.toggle('complete', index + 1 < step); node.querySelector('span').textContent = index + 1 < step ? '✓' : `0${index + 1}`; });
}
function showPanel(step) { currentStep = step; panels.forEach((panel) => { const active = Number(panel.dataset.panel) === step; panel.hidden = !active; panel.classList.toggle('active', active); }); updateProgress(step); backButton.disabled = step === 1 && questionIndex === 0; }
function updateScanUi(state) {
  scanState = state; scanStage.dataset.scanState = state;
  const busy = state === 'analyzing' || state === 'complete';
  scanGuide.hidden = state !== 'camera'; scanLoading.hidden = state !== 'analyzing'; scanComplete.hidden = state !== 'complete';
  cameraButton.disabled = busy; photoUpload.disabled = busy; uploadButton.classList.toggle('is-disabled', busy); uploadButton.setAttribute('aria-disabled', String(busy));
  cameraButton.textContent = ({ idle: 'Open camera', camera: 'Capture photo', photoReady: 'Analyze this photo', analyzing: 'Analyzing…', complete: 'Scan complete' })[state];
  continueButton.disabled = currentStep === 1 && (!profileState.scan.imageAnalyzed || busy);
}

function escapeHtml(value = '') { return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]); }
function questionShell(question, content) {
  const optional = question.required ? '' : '<button class="text-button question-skip" type="button">Skip for now</button>';
  return `<div class="panel-heading"><div><p class="step-kicker">${question.section === 'allergies' ? 'STEP 03 / 03' : 'STEP 02 / 03'}</p><h2>${escapeHtml(question.label)}</h2><p>${escapeHtml(question.helpText || '')}</p></div><span class="panel-badge">${question.required ? 'Required' : 'Optional'}</span></div><div class="question-sequence"><div class="question-count"><span>Question ${questionIndex + 1} of ${questions.length}</span><div><i style="width:${((questionIndex + 1) / questions.length) * 100}%"></i></div></div>${content}<p class="form-error question-error" role="alert"></p>${optional}</div>`;
}
function renderChoice(question) {
  const value = getAnswer(question);
  if (question.type === 'select') return `<select class="one-question-input" data-question-input><option value="">Choose one</option>${(question.options || []).map((option) => `<option value="${escapeHtml(option)}" ${value === option ? 'selected' : ''}>${escapeHtml(option)}</option>`).join('')}</select>`;
  if (question.type === 'text') return `<textarea class="one-question-input" data-question-input rows="4" placeholder="Add your answer">${escapeHtml(value || '')}</textarea>`;
  const selected = Array.isArray(value) ? value : [];
  return `<div class="option-grid ${question.type === 'multiple' ? 'multi' : ''}" data-question-options>${(question.options || []).map((option) => `<button type="button" class="${question.type === 'multiple' ? selected.includes(option) : value === option ? 'selected' : ''}" data-option="${escapeHtml(option)}">${escapeHtml(option)}</button>`).join('')}</div>`;
}
function renderAllergy(question) {
  const selected = profileState.generalAllergies;
  return `<div class="chip-list one-question-chips" data-question-options>${(question.options || []).map((option) => `<button type="button" class="${selected.includes(option) ? 'selected' : ''}" data-option="${escapeHtml(option)}">${escapeHtml(option)}</button>`).join('')}</div><div class="custom-entry"><input id="custom-allergy" type="text" placeholder="Add another ingredient" /><button id="add-allergy" class="text-button" type="button">Add</button></div><div class="added-list">${selected.filter((value) => !(question.options || []).includes(value)).map((value, index) => `<span class="added-chip">${escapeHtml(value)} <button type="button" data-remove-allergy="${index}" aria-label="Remove ${escapeHtml(value)}">×</button></span>`).join('')}</div><p class="safety-note">Used for filtering only. Dermi does not diagnose allergies.</p>`;
}
function renderProducts() {
  return `<div class="product-fields"><input id="product-name" type="text" placeholder="Product name" /><input id="product-brand" type="text" placeholder="Brand (optional)" /></div><div class="reaction-list" data-reactions>${['Redness','Itching','Burning','Breakouts','Swelling','Other'].map((value) => `<button type="button" data-reaction="${value}">${value}</button>`).join('')}</div><textarea id="product-notes" rows="3" placeholder="Optional notes about what happened"></textarea><button id="add-product" class="button button-outline" type="button">Add product <span>＋</span></button><div class="product-list">${profileState.pastProductAllergies.map((item, index) => `<div class="product-allergy-card"><strong>${escapeHtml(item.productName)}</strong><small>${escapeHtml(item.brand || 'Brand not specified')}</small><span class="product-reactions">${escapeHtml((item.reactions || []).join(' · ') || 'Reaction not specified')}</span><button type="button" data-remove-product="${index}" aria-label="Remove ${escapeHtml(item.productName)}">×</button></div>`).join('')}</div>`;
}
function renderQuestion() {
  if (!questionsLoaded) { showPanel(2); panels[1].innerHTML = '<div class="panel-heading"><div><p class="step-kicker">PROFILE SETUP</p><h2>Loading your questions…</h2><p>Please wait a moment before continuing.</p></div></div>'; continueButton.disabled = true; return; }
  if (questionLoadError) { showPanel(2); panels[1].innerHTML = '<div class="panel-heading"><div><p class="step-kicker">PROFILE SETUP</p><h2>Questions are unavailable</h2><p>Refresh the page and try again before completing your profile.</p></div></div>'; continueButton.disabled = true; return; }
  const question = questions[questionIndex];
  if (!question) return finishProfile();
  const step = question.section === 'allergies' ? 3 : 2;
  showPanel(step); continueButton.disabled = false; continueButton.innerHTML = questionIndex === questions.length - 1 ? 'Finish profile <span>→</span>' : 'Continue <span>→</span>';
  const content = question.type === 'ingredient-allergies' ? renderAllergy(question) : question.type === 'past-product-reactions' ? renderProducts() : renderChoice(question);
  panels.find((panel) => Number(panel.dataset.panel) === step).innerHTML = questionShell(question, content);
}
function applyScanResults() {
  profileState.scan.detectedSkinType = 'Combination'; profileState.scan.detectedConcerns = ['Dryness and dehydration'];
  if (!profileState.skinType) profileState.skinType = 'Combination'; if (!profileState.concerns.length) profileState.concerns = ['Dryness and dehydration'];
}
function markScanReady(source, imageUrl) { clearTimeout(analysisTimer); clearTimeout(completionTimer); profileState.scan.source = source; profileState.scan.imageAnalyzed = false; scanPreview.src = imageUrl; scanPreview.hidden = false; cameraVideo.hidden = true; scanPlaceholder.hidden = true; stopCamera(); updateScanUi('photoReady'); setMessage('Photo ready. Click Analyze this photo when you are happy with the framing.'); }
async function startCamera() { try { cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false }); cameraVideo.srcObject = cameraStream; cameraVideo.hidden = false; scanPreview.hidden = true; scanPlaceholder.hidden = true; updateScanUi('camera'); await cameraVideo.play(); setMessage('Camera ready. Center your face inside the frame.'); } catch { stopCamera(); updateScanUi('idle'); setMessage('Camera access was unavailable. You can upload a photo instead.', true); } }
function captureCamera() { if (!cameraStream || cameraVideo.hidden) return startCamera(); const canvas = document.querySelector('#scan-canvas'); canvas.width = cameraVideo.videoWidth || 720; canvas.height = cameraVideo.videoHeight || 960; canvas.getContext('2d').drawImage(cameraVideo, 0, 0, canvas.width, canvas.height); markScanReady('camera', canvas.toDataURL('image/jpeg', .85)); }
function analyzePhoto() { if (scanState !== 'photoReady') return; updateScanUi('analyzing'); setMessage('Reading your skin signals...'); analysisTimer = setTimeout(() => { profileState.scan.imageAnalyzed = true; applyScanResults(); updateScanUi('complete'); setMessage('Scan complete. Opening questions...'); completionTimer = setTimeout(() => { questionIndex = 0; renderQuestion(); }, 850); }, 1200); }
function resetScan() { clearTimeout(analysisTimer); clearTimeout(completionTimer); stopCamera(); if (uploadedImageUrl) URL.revokeObjectURL(uploadedImageUrl); uploadedImageUrl = ''; photoUpload.value = ''; profileState.scan = { source: '', imageAnalyzed: false, imageDeleted: true, detectedSkinType: '', detectedConcerns: [], previewAvailable: false }; scanPreview.removeAttribute('src'); scanPreview.hidden = true; cameraVideo.hidden = true; scanPlaceholder.hidden = false; updateScanUi('idle'); setMessage(''); }
function skipFaceScan() { resetScan(); questionIndex = 0; setMessage('Face scan skipped. You can add one later if you wish.'); renderQuestion(); }

function selectedReactions() { return [...document.querySelectorAll('[data-reaction].selected')].map((button) => button.dataset.reaction); }
function bindQuestionInput(event) {
  const question = questions[questionIndex]; if (!question) return;
  const option = event.target.closest('[data-option]');
  if (option) { const value = option.dataset.option; if (question.type === 'multiple') { const selected = getAnswer(question) || []; setAnswer(question, selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]); } else if (question.type === 'ingredient-allergies') { profileState.generalAllergies = profileState.generalAllergies.includes(value) ? profileState.generalAllergies.filter((item) => item !== value) : [...profileState.generalAllergies, value]; } else setAnswer(question, value); renderQuestion(); return; }
  if (event.target.matches('[data-reaction]')) { event.target.classList.toggle('selected'); return; }
  if (event.target.id === 'add-allergy') { const input = document.querySelector('#custom-allergy'); const value = input.value.trim(); if (value && !profileState.generalAllergies.includes(value)) profileState.generalAllergies.push(value); renderQuestion(); return; }
  if (event.target.matches('[data-remove-allergy]')) { const custom = profileState.generalAllergies.filter((value) => !(question.options || []).includes(value)); profileState.generalAllergies = profileState.generalAllergies.filter((value) => value !== custom[Number(event.target.dataset.removeAllergy)]); renderQuestion(); return; }
  if (event.target.id === 'add-product') { const name = document.querySelector('#product-name').value.trim(); if (!name) return document.querySelector('#product-name').focus(); profileState.pastProductAllergies.push({ productName: name, brand: document.querySelector('#product-brand').value.trim(), reactions: selectedReactions(), notes: document.querySelector('#product-notes').value.trim() }); renderQuestion(); return; }
  if (event.target.matches('[data-remove-product]')) { profileState.pastProductAllergies.splice(Number(event.target.dataset.removeProduct), 1); renderQuestion(); return; }
  if (event.target.matches('.question-skip')) { questionIndex += 1; renderQuestion(); }
}
function validateQuestion() { const question = questions[questionIndex]; const error = document.querySelector('.question-error'); if (!question || !question.required || isAnswered(question)) return true; if (error) error.textContent = 'Please answer this question before continuing.'; return false; }
function finishProfile() { profileState.updatedAt = new Date().toISOString(); profileState.scan.previewAvailable = false; localStorage.setItem('dermiProfile', JSON.stringify(profileState)); window.location.href = './profile.html'; }

cameraButton.addEventListener('click', () => { if (scanState === 'idle') startCamera(); else if (scanState === 'camera') captureCamera(); else if (scanState === 'photoReady') analyzePhoto(); });
photoUpload.addEventListener('change', (event) => { const file = event.target.files?.[0]; if (!file || ['analyzing', 'complete'].includes(scanState)) return; if (uploadedImageUrl) URL.revokeObjectURL(uploadedImageUrl); uploadedImageUrl = URL.createObjectURL(file); markScanReady('upload', uploadedImageUrl); });
document.querySelector('#retake-scan').addEventListener('click', resetScan);
skipScanButton.addEventListener('click', skipFaceScan);
document.addEventListener('click', bindQuestionInput);
document.addEventListener('change', (event) => { const question = questions[questionIndex]; if (event.target.matches('[data-question-input]') && question) setAnswer(question, event.target.value); });
continueButton.addEventListener('click', () => { if (currentStep === 1) return; if (!validateQuestion()) return; questionIndex += 1; renderQuestion(); });
backButton.addEventListener('click', () => { if (currentStep === 1) return; if (questionIndex > 0) { questionIndex -= 1; renderQuestion(); } else { showPanel(1); updateScanUi(scanState); } });
saveExitButton.addEventListener('click', () => { profileState.updatedAt = new Date().toISOString(); localStorage.setItem('dermiProfile', JSON.stringify(profileState)); window.location.href = './profile.html'; });

function enterBuilder(message) { signupGateOpen = false; signupMockup.hidden = true; document.body.classList.remove('signup-gate-open'); setMessage(message); cameraButton.focus(); }
document.body.classList.add('signup-gate-open'); document.querySelector('#signup-google').focus();
document.querySelector('#signup-google').addEventListener('click', () => { signupStatus.textContent = 'Google sign-in is a demo. Opening your builder…'; setTimeout(() => enterBuilder('You can start with a camera scan or upload a photo.'), 500); });
document.querySelector('#signup-email-button').addEventListener('click', () => { signupStatus.textContent = 'Email sign-in is a demo. Opening your builder…'; setTimeout(() => enterBuilder('You can start with a camera scan or upload a photo.'), 500); });
document.querySelector('#signup-guest').addEventListener('click', () => enterBuilder('You are continuing without an account. Your profile stays on this device.'));
document.addEventListener('keydown', (event) => { if (event.key !== 'Tab' || !signupGateOpen) return; const focusable = [...signupMockup.querySelectorAll('button,input')]; const first = focusable[0]; const last = focusable.at(-1); if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); } });

fetch('./assets/skin-profile-questions.json').then((response) => { if (!response.ok) throw new Error('Question file unavailable'); return response.json(); }).then((data) => { questions = Array.isArray(data.questions) ? data.questions : []; if (!questions.length) throw new Error('No questions found'); }).catch(() => { questionLoadError = true; }).finally(() => { questionsLoaded = true; if (currentStep > 1) renderQuestion(); else { showPanel(1); updateScanUi('idle'); } });
