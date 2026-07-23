(function () {
    'use strict';

    const urlInput = document.getElementById('url-input');
    const gerarBtn = document.getElementById('gerarUrlBtn');
    const qrImg = document.getElementById('qrcode');
    const resultadoTitulo = document.getElementById('resultado-titulo');
    const pixCopiaContainer = document.getElementById('pix-copia-cola-container');
    const resultadoArea = document.getElementById('qr-result-area');

    gerarBtn.addEventListener('click', function () {
        const url = urlInput.value.trim();
        if (!url || url === 'https://' || url === 'http://') {
            window.showToast('Por favor, insira uma URL válida.', '#92400e');
            return;
        }

        resultadoTitulo.textContent = 'Escaneie para acessar o link:';
        pixCopiaContainer.style.display = 'none';

        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(url)}`;
        qrImg.src = qrCodeUrl;

        resultadoArea.style.display = 'block';
    });

})();