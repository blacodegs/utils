(function () {
    'use strict';

    const textarea = document.getElementById('textInput');
    const charCount = document.getElementById('charCount');
    const wordCount = document.getElementById('wordCount');
    const removedCount = document.getElementById('removedCount');
    const statusText = document.getElementById('statusText');
    const copyBtn = document.getElementById('copyBtn');
    const clearBtn = document.getElementById('clearBtn');

    let lastRemoved = 0;

    function cleanText(raw) {
        if (!raw) return { cleaned: '', removed: 0 };
        const lineBreaks = raw.match(/[\r\n]+/g);
        const removedCount = lineBreaks ? lineBreaks.length : 0;
        let cleaned = raw;
        cleaned = cleaned.replace(/\s*-\s*[\r\n]+\s*/g, '');
        cleaned = cleaned.replace(/[\r\n]+/g, '');
        cleaned = cleaned.replace(/\t+/g, ' ');
        cleaned = cleaned.replace(/[ ]{2,}/g, ' ');
        cleaned = cleaned.trim();
        return { cleaned, removed: removedCount };
    }

    function updateStats(text) {
        const len = text.length;
        const words = text ? text.trim().split(/\s+/).filter(w => w.length > 0).length : 0;
        charCount.textContent = len;
        wordCount.textContent = words;
    }

    function processAndUpdate(rawText) {
        const { cleaned, removed } = cleanText(rawText);
        textarea.value = cleaned;
        lastRemoved = removed;
        removedCount.textContent = removed;
        updateStats(cleaned);

        if (removed > 0) {
            statusText.textContent = '✓ Texto limpo';
            statusText.style.color = 'var(--color-status-success)';
        } else if (cleaned.length > 0) {
            statusText.textContent = '✓ Texto já estava limpo';
            statusText.style.color = 'var(--color-status-neutral)';
        } else {
            statusText.textContent = 'Aguardando texto...';
            statusText.style.color = 'var(--color-status-neutral)';
        }
        textarea.dispatchEvent(new Event('input'));
    }

    textarea.addEventListener('paste', function (e) {
        e.preventDefault();
        const clipboardData = e.clipboardData || window.clipboardData;
        const pastedText = clipboardData.getData('text/plain');
        if (pastedText) {
            processAndUpdate(pastedText);
        } else {
            const fallback = e.clipboardData.getData('text/html');
            if (fallback) {
                const temp = document.createElement('div');
                temp.innerHTML = fallback;
                const textOnly = temp.textContent || temp.innerText || '';
                processAndUpdate(textOnly);
            }
        }
    });

    textarea.addEventListener('input', function () {
        const currentText = textarea.value;
        const hasBreaks = /[\r\n\t]/.test(currentText);

        if (hasBreaks) {
            processAndUpdate(currentText);
        } else {
            updateStats(currentText);
            removedCount.textContent = lastRemoved;

            if (currentText.length > 0) {
                if (lastRemoved > 0) {
                    statusText.textContent = '✓ Texto limpo';
                    statusText.style.color = 'var(--color-status-success)';
                } else {
                    statusText.textContent = '✓ Texto limpo';
                    statusText.style.color = 'var(--color-status-neutral)';
                }
            } else {
                lastRemoved = 0;
                removedCount.textContent = '0';
                statusText.textContent = 'Aguardando texto...';
                statusText.style.color = 'var(--color-status-neutral)';
            }
        }
    });

    copyBtn.addEventListener('click', function () {
        const textToCopy = textarea.value;
        if (!textToCopy) {
            window.showToast('Não há texto para copiar', '#92400e');
            return;
        }
        navigator.clipboard.writeText(textToCopy)
            .then(() => window.showToast('Texto limpo copiado com sucesso!', 'var(--color-toast-bg)'))
            .catch(() => {
                textarea.select();
                document.execCommand('copy');
                window.showToast('Copiado!', 'var(--color-toast-bg)');
            });
    });

    clearBtn.addEventListener('click', function () {
        textarea.value = '';
        lastRemoved = 0;
        removedCount.textContent = '0';
        updateStats('');
        statusText.textContent = 'Campo limpo';
        statusText.style.color = 'var(--color-status-neutral)';
        textarea.focus();
        window.showToast('Campo esvaziado', 'var(--color-toast-bg)');
    });

    updateStats('');
    removedCount.textContent = '0';
    lastRemoved = 0;
    statusText.textContent = 'Cole seu texto (Ctrl+V)';
    statusText.style.color = 'var(--color-status-neutral)';

    textarea.addEventListener('focus', function () {
        this.placeholder = '';
    });
    textarea.addEventListener('blur', function () {
        if (!this.value) {
            this.placeholder =
                'Cole aqui (Ctrl+V) qualquer texto copiado de PDF, sites ou documentos. As quebras de linha e tabulações serão removidas automaticamente, e o texto ficará justificado.';
        }
    });

})();