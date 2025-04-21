const API_URL = 'https://docvox-api.fly.dev';
let currentFile = null;

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    initDragDrop();
    setupEventListeners();
});

function initDragDrop() {
    const dropZone = document.getElementById('dropZone');
    
    ['dragover', 'dragleave', 'drop'].forEach(event => {
        dropZone.addEventListener(event, preventDefaults);
    });

    ['dragover', 'dragenter'].forEach(event => {
        dropZone.addEventListener(event, highlight);
    });

    ['dragleave', 'drop'].forEach(event => {
        dropZone.addEventListener(event, unhighlight);
    });

    dropZone.addEventListener('drop', handleDrop);
}

function setupEventListeners() {
    document.getElementById('phraseSlider').addEventListener('input', updatePhraseCount);
    document.getElementById('generateBtn').addEventListener('click', processFile);
    document.getElementById('fileInput').addEventListener('change', handleFileSelect);
}

async function processFile(e) {
    e.preventDefault();
    if (!currentFile) return showError('Veuillez sélectionner un fichier');

    toggleUIState(true);
    
    try {
        const formData = new FormData();
        formData.append('file', currentFile);
        formData.append('max_sentences', document.getElementById('phraseSlider').value);

        const response = await fetch(`${API_URL}/process/`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('Erreur de traitement');
        
        const data = await response.json();
        updateUI(data);
        
    } catch (error) {
        showError(error.message);
    } finally {
        toggleUIState(false);
    }
}

// Helpers
function updateUI(data) {
    document.getElementById('summaryBox').textContent = data.summary;
    document.getElementById('audioPlayer').src = `${API_URL}/${data.audio_file}`;
    document.getElementById('downloadSummary').href = `${API_URL}/${data.summary_file}`;
    document.getElementById('downloadAudio').href = `${API_URL}/${data.audio_file}`;
    document.getElementById('resultContainer').classList.remove('hidden');
}

function toggleUIState(isLoading) {
    document.getElementById('loader').classList.toggle('hidden', !isLoading);
    document.getElementById('generateBtn').disabled = isLoading;
}

function showError(message) {
    alert(`Erreur : ${message}`);
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight() {
    document.getElementById('dropZone').style.backgroundColor = 'rgba(74, 109, 229, 0.1)';
}

function unhighlight() {
    document.getElementById('dropZone').style.backgroundColor = '';
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    currentFile = dt.files[0];
    updateFileDisplay();
}

function handleFileSelect(e) {
    currentFile = e.target.files[0];
    updateFileDisplay();
}

function updateFileDisplay() {
    document.getElementById('fileStatus').textContent = currentFile 
        ? `Fichier sélectionné : ${currentFile.name}` 
        : 'Glissez votre fichier ici ou cliquez pour choisir';
}

function updatePhraseCount(e) {
    document.getElementById('phraseCount').textContent = e.target.value;
}