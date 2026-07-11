document.addEventListener('DOMContentLoaded', function() {
    const historyList = document.getElementById('historyList');
    const clearBtn = document.getElementById('clearHistory');
    const exportBtn = document.getElementById('exportHistory');
    const exportCSV = document.getElementById('exportCSV');
    const totalPredictions = document.getElementById('totalPredictions');
    const avgConfidence = document.getElementById('avgConfidence');
    const mostCommonDigit = document.getElementById('mostCommonDigit');

    function loadHistory() {
        const history = JSON.parse(localStorage.getItem('digitHistory') || '[]');

        // Stats
        totalPredictions.textContent = history.length;

        if (history.length > 0) {
            const avg = history.reduce((sum, h) => sum + h.confidence, 0) / history.length;
            avgConfidence.textContent = (avg * 100).toFixed(1) + '%';

            const digitCount = {};
            history.forEach(h => {
                digitCount[h.digit] = (digitCount[h.digit] || 0) + 1;
            });
            const maxDigit = Object.keys(digitCount).reduce((a, b) => digitCount[a] > digitCount[b] ? a : b);
            mostCommonDigit.textContent = maxDigit;
        } else {
            avgConfidence.textContent = '0%';
            mostCommonDigit.textContent = '-';
        }

        // List
        if (history.length === 0) {
            historyList.innerHTML = `
                <div class="empty-history">
                    <i class="fas fa-inbox fa-3x"></i>
                    <p>No predictions yet. Start recognizing digits!</p>
                    <a href="/" class="btn btn-primary">Go to Home</a>
                </div>
            `;
            return;
        }

        historyList.innerHTML = history.map(item => `
            <div class="history-item">
                <span class="h-digit">${item.digit}</span>
                <span class="h-confidence">${(item.confidence * 100).toFixed(2)}%</span>
                <span class="h-time"><i class="far fa-clock"></i> ${item.timestamp}</span>
            </div>
        `).join('');
    }

    // Clear
    clearBtn?.addEventListener('click', function() {
        if (confirm('Clear all history?')) {
            localStorage.removeItem('digitHistory');
            loadHistory();
        }
    });

    // Export JSON
    exportBtn?.addEventListener('click', function() {
        const history = JSON.parse(localStorage.getItem('digitHistory') || '[]');
        if (history.length === 0) {
            alert('No history to export!');
            return;
        }
        const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `history_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    });

    // Export CSV
    exportCSV?.addEventListener('click', function() {
        const history = JSON.parse(localStorage.getItem('digitHistory') || '[]');
        if (history.length === 0) {
            alert('No history to export!');
            return;
        }
        const headers = 'Digit,Confidence,Timestamp\n';
        const rows = history.map(h => `${h.digit},${(h.confidence * 100).toFixed(2)}%,${h.timestamp}`).join('\n');
        const csv = headers + rows;
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `history_${Date.now()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    });

    loadHistory();
});