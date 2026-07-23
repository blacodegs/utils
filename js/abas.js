(function () {
    'use strict';

    // ============================================
    // TOAST GLOBAL (para todos os scripts)
    // ============================================
    window.showToast = function (message, bgColor = 'var(--color-toast-bg)') {
        const toast = document.getElementById('toast');
        if (!toast) return;
        toast.textContent = message;
        toast.style.background = bgColor;
        toast.classList.add('show');
        clearTimeout(toast._timeout);
        toast._timeout = setTimeout(() => toast.classList.remove('show'), 2800);
    };

    // ============================================
    // CONTROLE DE ABAS
    // ============================================
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');

    function switchTab(tabId) {
        contents.forEach(content => content.classList.remove('active'));
        tabs.forEach(btn => btn.classList.remove('active'));

        const target = document.getElementById(tabId);
        if (target) target.classList.add('active');

        const clickedBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
        if (clickedBtn) clickedBtn.classList.add('active');

        // Oculta as áreas de resultado ao trocar de aba
        document.querySelectorAll('.qr-result-area').forEach(el => el.style.display = 'none');
    }

    tabs.forEach(btn => {
        btn.addEventListener('click', function () {
            const tabId = this.dataset.tab;
            switchTab(tabId);
        });
    });

    // Inicializa com a primeira aba ativa (já definida no HTML)
})();