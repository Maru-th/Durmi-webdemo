const profileState = {
  scan: { source: '', imageAnalyzed: false, imageDeleted: true, detectedSkinType: '', detectedConcerns: [] },
  skinType: '', concerns: [], livingHabits: [], makeup: '', budget: '', generalAllergies: [], pastProductAllergies: []
};

document.querySelector('[data-panel="4"]')?.remove();
const panels = [...document.querySelectorAll('[data-panel]')];
const nodes = [...document.querySelectorAll('.progress-node')];
const continueButton = document.querySelector('#continue-step');
const backButton = document.querySelector('#back-step');
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
const scanReview = document.querySelector('#scan-review');

let currentStep = 1;
let cameraStream;
let selectedReactions = [];
let scanState = 'idle';
let analysisTimer;
let completionTimer;
let uploadedImageUrl = '';

function stopCamera() {
  cameraStream?.getTracks().forEach((track) => track.stop());
  cameraStream = undefined;
  cameraVideo.srcObject = null;
}

function setMessage(message, error = false) {
  scanMessage.textContent = message;
  scanMessage.classList.toggle('error', error);
}

function updateScanUi(state) {
  scanState = state;
  scanStage.dataset.scanState = state;
  const isBusy = state === 'analyzing' || state === 'complete';

  scanGuide.hidden = state !== 'camera';
  scanLoading.hidden = state !== 'analyzing';
  scanComplete.hidden = state !== 'complete';
  scanReview.hidden = state !== 'photoReady';
  cameraButton.disabled = isBusy;
  photoUpload.disabled = isBusy;
  uploadButton.classList.toggle('is-disabled', isBusy);
  uploadButton.setAttribute('aria-disabled', String(isBusy));

  const labels = {
    idle: 'Open camera',
    camera: 'Capture photo',
    photoReady: 'Analyze this photo',
    analyzing: 'Analyzing...',
    complete: 'Scan complete'
  };
  cameraButton.textContent = labels[state];
  continueButton.disabled = currentStep === 1 && (!profileState.scan.imageAnalyzed || isBusy);
}

function showStep(step) {
  currentStep = step;
  panels.forEach((panel) => {
    const isCurrent = Number(panel.dataset.panel) === step;
    panel.hidden = !isCurrent;
    panel.classList.toggle('active', isCurrent);
  });
  nodes.forEach((node, index) => {
    node.classList.toggle('active', index + 1 === step);
    node.classList.toggle('complete', index + 1 < step);
    node.querySelector('span').textContent = index + 1 < step ? '✓' : `0${index + 1}`;
  });
  backButton.disabled = step <= 1;
  continueButton.hidden = step > 3;
  document.querySelector('#save-exit').hidden = step > 3;

  if (step === 1 && scanState === 'complete') {
    updateScanUi('photoReady');
    setMessage('Scan complete. You can analyze this photo again or retake it.');
  } else {
    updateScanUi(scanState);
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function applyDetectedResults() {
  const skinButton = [...document.querySelectorAll('[data-choice-group="skinType"] [data-choice]')]
    .find((button) => button.dataset.choice === profileState.scan.detectedSkinType);
  const concernButton = [...document.querySelectorAll('[data-choice-group="concerns"] [data-choice]')]
    .find((button) => button.dataset.choice === 'Dryness and dehydration');
  if (skinButton && !profileState.skinType) skinButton.click();
  if (concernButton && !profileState.concerns.length) concernButton.click();
}

function markScanReady(source, imageUrl) {
  clearTimeout(analysisTimer);
  clearTimeout(completionTimer);
  profileState.scan.source = source;
  profileState.scan.imageAnalyzed = false;
  scanPreview.src = imageUrl;
  scanPreview.hidden = false;
  cameraVideo.hidden = true;
  scanPlaceholder.hidden = true;
  stopCamera();
  updateScanUi('photoReady');
  setMessage('Photo ready. Click Analyze this photo when you are happy with the framing.');
}

async function startCamera() {
  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
    cameraVideo.srcObject = cameraStream;
    cameraVideo.hidden = false;
    scanPreview.hidden = true;
    scanPlaceholder.hidden = true;
    updateScanUi('camera');
    await cameraVideo.play();
    setMessage('Camera ready. Center your face inside the frame.');
  } catch (error) {
    stopCamera();
    updateScanUi('idle');
    setMessage('Camera access was unavailable. You can upload a photo instead.', true);
  }
}

function captureCamera() {
  if (!cameraStream || cameraVideo.hidden) {
    startCamera();
    return;
  }
  const canvas = document.querySelector('#scan-canvas');
  canvas.width = cameraVideo.videoWidth || 720;
  canvas.height = cameraVideo.videoHeight || 960;
  canvas.getContext('2d').drawImage(cameraVideo, 0, 0, canvas.width, canvas.height);
  markScanReady('camera', canvas.toDataURL('image/jpeg', 0.85));
}

function analyzePhoto() {
  if (scanState !== 'photoReady') return;
  updateScanUi('analyzing');
  setMessage('Reading your skin signals...');
  analysisTimer = window.setTimeout(() => {
    profileState.scan.imageAnalyzed = true;
    profileState.scan.detectedSkinType = 'Combination';
    profileState.scan.detectedConcerns = ['Dryness and dehydration'];
    applyDetectedResults();
    updateScanUi('complete');
    setMessage('Scan complete. Opening skin questions...');
    completionTimer = window.setTimeout(() => showStep(2), 850);
  }, 1200);
}

function resetScan() {
  clearTimeout(analysisTimer);
  clearTimeout(completionTimer);
  stopCamera();
  if (uploadedImageUrl) URL.revokeObjectURL(uploadedImageUrl);
  uploadedImageUrl = '';
  photoUpload.value = '';
  profileState.scan = { source: '', imageAnalyzed: false, imageDeleted: true, detectedSkinType: '', detectedConcerns: [] };
  scanPreview.removeAttribute('src');
  scanPreview.hidden = true;
  cameraVideo.hidden = true;
  scanPlaceholder.hidden = false;
  updateScanUi('idle');
  setMessage('');
}

cameraButton.addEventListener('click', () => {
  if (scanState === 'idle') startCamera();
  else if (scanState === 'camera') captureCamera();
  else if (scanState === 'photoReady') analyzePhoto();
});

photoUpload.addEventListener('change', (event) => {
  const file = event.target.files?.[0];
  if (!file || scanState === 'analyzing' || scanState === 'complete') return;
  if (uploadedImageUrl) URL.revokeObjectURL(uploadedImageUrl);
  uploadedImageUrl = URL.createObjectURL(file);
  markScanReady('upload', uploadedImageUrl);
});

document.querySelector('#retake-scan').addEventListener('click', resetScan);

document.querySelectorAll('[data-choice-group]').forEach((group) => group.addEventListener('click', (event) => {
  const button = event.target.closest('[data-choice]');
  if (!button) return;
  const key = group.dataset.choiceGroup;
  if (group.classList.contains('multi') || key === 'concerns' || key === 'livingHabits' || key === 'generalAllergies') {
    profileState[key] = profileState[key].includes(button.dataset.choice)
      ? profileState[key].filter((value) => value !== button.dataset.choice)
      : [...profileState[key], button.dataset.choice];
    button.classList.toggle('selected', profileState[key].includes(button.dataset.choice));
  } else {
    profileState[key] = button.dataset.choice;
    group.querySelectorAll('button').forEach((item) => item.classList.toggle('selected', item === button));
  }
}));

document.querySelector('[data-field="makeup"]').addEventListener('change', (event) => { profileState.makeup = event.target.value; });
document.querySelector('#add-allergy').addEventListener('click', () => {
  const input = document.querySelector('#custom-allergy');
  const value = input.value.trim();
  if (!value) return;
  profileState.generalAllergies.push(value);
  input.value = '';
  renderAllergyChips();
});

function renderAllergyChips() {
  document.querySelector('#allergy-chips').innerHTML = profileState.generalAllergies
    .map((item, index) => `<span class="added-chip">${item}<button type="button" data-remove-allergy="${index}" aria-label="Remove ${item}">×</button></span>`).join('');
  document.querySelectorAll('[data-remove-allergy]').forEach((button) => button.addEventListener('click', () => {
    profileState.generalAllergies.splice(Number(button.dataset.removeAllergy), 1);
    renderAllergyChips();
  }));
}

document.querySelector('[data-reaction-group]').addEventListener('click', (event) => {
  const button = event.target.closest('[data-reaction]');
  if (!button) return;
  const value = button.dataset.reaction;
  selectedReactions = selectedReactions.includes(value)
    ? selectedReactions.filter((item) => item !== value)
    : [...selectedReactions, value];
  button.classList.toggle('selected', selectedReactions.includes(value));
});

document.querySelector('#add-product').addEventListener('click', () => {
  const name = document.querySelector('#product-name').value.trim();
  if (!name) return document.querySelector('#product-name').focus();
  profileState.pastProductAllergies.push({
    productName: name,
    brand: document.querySelector('#product-brand').value.trim(),
    reactions: [...selectedReactions],
    notes: document.querySelector('#product-notes').value.trim()
  });
  document.querySelector('#product-name').value = '';
  document.querySelector('#product-brand').value = '';
  document.querySelector('#product-notes').value = '';
  selectedReactions = [];
  document.querySelectorAll('[data-reaction]').forEach((button) => button.classList.remove('selected'));
  renderProducts();
});

function renderProducts() {
  document.querySelector('#product-allergy-list').innerHTML = profileState.pastProductAllergies.map((item, index) =>
    `<article class="product-allergy-card"><div><strong>${item.productName}</strong><small>${item.brand || 'Brand not specified'}</small></div><div class="product-reactions">${item.reactions.length ? item.reactions.join(' · ') : 'Reaction not specified'}</div><button type="button" data-remove-product="${index}" aria-label="Remove ${item.productName}">×</button></article>`
  ).join('');
  document.querySelectorAll('[data-remove-product]').forEach((button) => button.addEventListener('click', () => {
    profileState.pastProductAllergies.splice(Number(button.dataset.removeProduct), 1);
    renderProducts();
  }));
}

function validateStep(step) {
  const error = document.querySelector('#questions-error');
  if (error) error.textContent = '';
  if (step === 1 && !profileState.scan.imageAnalyzed) {
    setMessage('Capture or upload a photo, then analyze it before continuing.', true);
    return false;
  }
  if (step === 2 && (!profileState.skinType || !profileState.concerns.length || !profileState.livingHabits.length || !profileState.budget)) {
    if (error) error.textContent = 'Please choose a skin type, at least one concern, one environment, and a budget preference.';
    return false;
  }
  return true;
}

continueButton.addEventListener('click', () => {
  if (!validateStep(currentStep)) return;
  if (currentStep === 2) profileState.makeup = document.querySelector('[data-field="makeup"]').value;
  if (currentStep < 3) showStep(currentStep + 1);
  else {
    profileState.updatedAt = new Date().toISOString();
    profileState.scan.previewAvailable = false;
    localStorage.setItem('dermiProfile', JSON.stringify(profileState));
    window.location.href = './profile.html';
  }
});

backButton.addEventListener('click', () => { if (currentStep > 1) showStep(currentStep - 1); });
document.querySelector('#save-exit').addEventListener('click', () => {
  profileState.updatedAt = new Date().toISOString();
  profileState.scan.previewAvailable = false;
  localStorage.setItem('dermiProfile', JSON.stringify(profileState));
  window.location.href = './profile.html';
});
document.querySelector('#save-profile')?.addEventListener('click', () => {
  localStorage.setItem('dermiProfile', JSON.stringify(profileState));
  document.querySelector('#save-message').textContent = 'Your profile has been saved on this device.';
});

showStep(1);
