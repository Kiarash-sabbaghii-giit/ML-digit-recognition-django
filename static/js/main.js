document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const resultSection = document.getElementById('resultSection');
    const imagePreview = document.getElementById('imagePreview');
    const predictedDigit = document.getElementById('predictedDigit');
    const confidenceFill = document.getElementById('confidenceFill');
    const confidenceText = document.getElementById('confidenceText');
    const probabilitiesContainer = document.getElementById('probabilities');
    const resetBtn = document.getElementById('resetBtn');
    const saveBtn = document.getElementById('saveResult');
    const closeBtn = document.getElementById('closeResult');
    const downloadBtn = document.getElementById('downloadResult');
    const imageSize = document.getElementById('imageSize');
    const imageDimensions = document.getElementById('imageDimensions');
    const demoBtn = document.getElementById('demoBtn');

    let isProcessing = false;

    // ===== Upload Events =====
    uploadArea.addEventListener('click', () => fileInput.click());

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleFile(e.target.files[0]);
        }
    });

    // ===== Demo =====
    demoBtn?.addEventListener('click', function() {
        const canvas = document.createElement('canvas');
        canvas.width = 28;
        canvas.height = 28;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 28, 28);
        ctx.fillStyle = 'black';
        ctx.font = 'bold 22px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('5', 14, 16);

        canvas.toBlob((blob) => {
            const file = new File([blob], 'demo.png', { type: 'image/png' });
            handleFile(file);
        });
    });

    // ===== Handle File =====
    function handleFile(file) {
        if (!file || !file.type.startsWith('image/')) {
            showMessage('Please select a valid image', 'error');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showMessage('Image must be under 5MB', 'error');
            return;
        }

        if (isProcessing) return;
        isProcessing = true;

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = function() {
                imageDimensions.textContent = `${this.naturalWidth}x${this.naturalHeight}`;
                imageSize.textContent = (file.size / 1024).toFixed(1) + ' KB';
            };
            img.src = e.target.result;

            imagePreview.src = e.target.result;
            resultSection.style.display = 'block';
            uploadArea.style.display = 'none';

            gsap.from(resultSection, {
                duration: 0.6,
                opacity: 0,
                y: 30,
                ease: 'power2.out'
            });

            predictedDigit.textContent = '...';
            confidenceFill.style.width = '0%';
            confidenceText.textContent = '0%';
            probabilitiesContainer.innerHTML = '';
        };
        reader.readAsDataURL(file);

        const formData = new FormData();
        formData.append('image', file);

        fetch('/predict/', {
            method: 'POST',
            body: formData,
            headers: { 'X-CSRFToken': getCsrfToken() }
        })
        .then(response => response.json())
        .then(data => {
            isProcessing = false;
            if (data.success) {
                updateResult(data);
                saveToHistory(data);
            } else {
                showMessage(data.error || 'Prediction failed', 'error');
                resetUI();
            }
        })
        .catch(() => {
            isProcessing = false;
            showMessage('Connection error!', 'error');
            resetUI();
        });
    }

    // ===== Update Result =====
    function updateResult(data) {
        const digit = data.digit;
        const confidence = data.confidence;
        const probs = data.all_probabilities;

        predictedDigit.textContent = digit;
        predictedDigit.style.animation = 'none';
        setTimeout(() => {
            predictedDigit.style.animation = 'popIn 0.5s ease';
        }, 10);

        setTimeout(() => {
            confidenceFill.style.width = (confidence * 100) + '%';
            confidenceText.textContent = (confidence * 100).toFixed(2) + '%';
            const color = confidence > 0.8 ? '#4facfe' : confidence > 0.5 ? '#f093fb' : '#f5576c';
            confidenceFill.style.background = `linear-gradient(90deg, ${color}, ${color})`;
        }, 300);

        probabilitiesContainer.innerHTML = '';
        const maxProb = Math.max(...probs);
        probs.forEach((prob, index) => {
            const item = document.createElement('div');
            item.className = 'prob-item';
            const isHighest = prob === maxProb;
            const pct = (prob * 100).toFixed(1);

            item.innerHTML = `
                <div class="num">${index}</div>
                <div class="bar">
                    <div class="bar-fill" style="width:0%; ${isHighest ? 'background:linear-gradient(90deg,#f093fb,#f5576c);' : ''}"></div>
                </div>
                <div class="pct">${pct}%</div>
            `;
            probabilitiesContainer.appendChild(item);

            setTimeout(() => {
                const fill = item.querySelector('.bar-fill');
                fill.style.width = pct + '%';
            }, 100 + index * 40);
        });
    }

    // ===== Save to History =====
    function saveToHistory(data) {
        let history = JSON.parse(localStorage.getItem('digitHistory') || '[]');
        history.unshift({
            digit: data.digit,
            confidence: data.confidence,
            timestamp: new Date().toLocaleString('en-US', {
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            }),
            id: Date.now()
        });
        if (history.length > 20) history = history.slice(0, 20);
        localStorage.setItem('digitHistory', JSON.stringify(history));
    }

    // ===== Get CSRF =====
    function getCsrfToken() {
        return document.querySelector('[name=csrfmiddlewaretoken]')?.value || '';
    }

    // ===== Show Message =====
    function showMessage(message, type = 'info') {
        const div = document.createElement('div');
        div.className = `toast-message ${type}`;
        div.innerHTML = `
            <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(div);
        setTimeout(() => div.classList.add('show'), 10);
        setTimeout(() => {
            div.classList.remove('show');
            setTimeout(() => div.remove(), 300);
        }, 3000);
    }

    // ===== Reset =====
    function resetUI() {
        gsap.to(resultSection, {
            duration: 0.4,
            opacity: 0,
            y: -20,
            ease: 'power2.in',
            onComplete: () => {
                resultSection.style.display = 'none';
                uploadArea.style.display = 'block';
                fileInput.value = '';
                isProcessing = false;
            }
        });
    }

    closeBtn?.addEventListener('click', resetUI);
    resetBtn?.addEventListener('click', resetUI);

    // ===== Save =====
    saveBtn?.addEventListener('click', function() {
        const digit = predictedDigit.textContent;
        const confidence = confidenceText.textContent;
        this.innerHTML = '<i class="fas fa-check"></i> Saved!';
        this.style.background = 'linear-gradient(135deg, #00f2fe, #4facfe)';
        setTimeout(() => {
            this.innerHTML = '<i class="fas fa-save"></i> Save';
            this.style.background = '';
        }, 1500);
        showMessage(`✅ Digit ${digit} saved! ${confidence}`, 'info');
    });

    // ===== Download =====
    downloadBtn?.addEventListener('click', function() {
        const digit = predictedDigit.textContent;
        const confidence = confidenceText.textContent;
        const report = `
===========================
AI DIGIT RECOGNITION REPORT
===========================
Predicted Digit: ${digit}
Confidence: ${confidence}
Timestamp: ${new Date().toLocaleString()}
Image: ${imagePreview.src ? 'Uploaded' : 'N/A'}
Dimensions: ${imageDimensions?.textContent || 'N/A'}
File Size: ${imageSize?.textContent || 'N/A'}
===========================
Generated by AI Recognizer Pro v3.0
        `.trim();

        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `digit_report_${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    });
});

// ===== Toast Styles =====
const style = document.createElement('style');
style.textContent = `
    .toast-message {
        position: fixed;
        bottom: 30px;
        right: 30px;
        z-index: 9999;
        padding: 14px 24px;
        border-radius: 12px;
        background: rgba(15,12,41,0.95);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255,255,255,0.05);
        color: #fff;
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        gap: 12px;
        transform: translateX(120%);
        transition: transform 0.4s cubic-bezier(0.4,0,0.2,1);
        max-width: 400px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    .toast-message.show { transform: translateX(0); }
    .toast-message.error i { color: #f5576c; }
    .toast-message.info i { color: #4facfe; }
`;
document.head.appendChild(style);