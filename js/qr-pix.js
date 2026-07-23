(function () {
    'use strict';

    const chaveInput = document.getElementById('chave');
    const valorInput = document.getElementById('valor');
    const identificadorInput = document.getElementById('identificador');
    const gerarBtn = document.getElementById('gerarPixBtn');
    const qrImg = document.getElementById('qrcode-pix');
    const resultadoTitulo = document.getElementById('resultado-titulo-pix');
    const copiaColaTextarea = document.getElementById('copia-cola-pix');
    const copiarBtn = document.getElementById('copiarPixBtnPix');
    const resultadoArea = document.getElementById('qr-result-area-pix');

    function crc16(str) {
        let crc = 0xFFFF;
        for (let c = 0; c < str.length; c++) {
            crc ^= str.charCodeAt(c) << 8;
            for (let i = 0; i < 8; i++) {
                if (crc & 0x8000) {
                    crc = (crc << 1) ^ 0x1021;
                } else {
                    crc = crc << 1;
                }
            }
        }
        let hex = (crc & 0xFFFF).toString(16).toUpperCase();
        return hex.padStart(4, '0');
    }

    function f(id, valor) {
        const tam = valor.length.toString().padStart(2, '0');
        return id + tam + valor;
    }

    function gerarQrPix() {
        let chaveOriginal = chaveInput.value.trim();
        let valorNum = parseFloat(valorInput.value) || 0;
        const valor = valorNum.toFixed(2);
        let nomeAmigo = identificadorInput.value.trim();

        if (!chaveOriginal) {
            window.showToast('Por favor, insira a sua chave Pix.', '#92400e');
            return;
        }

        let chavePronta = '';
        if (chaveOriginal.includes('@')) {
            chavePronta = chaveOriginal;
        } else {
            let apenasNumeros = chaveOriginal.replace(/\D/g, '');
            if (apenasNumeros.length === 11 && (chaveOriginal.startsWith('(') || apenasNumeros.startsWith('9') || apenasNumeros.substring(2, 3) === '9')) {
                chavePronta = '+55' + apenasNumeros;
            } else if (apenasNumeros.length === 11 || apenasNumeros.length === 14) {
                chavePronta = apenasNumeros;
            } else {
                chavePronta = chaveOriginal.replace(/\s+/g, '');
            }
        }

        let txidTexto = '***';
        if (nomeAmigo) {
            txidTexto = nomeAmigo
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-zA-Z0-9]/g, '')
                .toUpperCase()
                .substring(0, 25);
        }

        const payloadFormat = f('00', '01');
        const gui = f('00', 'br.gov.bcb.pix');
        const key = f('01', chavePronta);
        const merchantAccount = f('26', gui + key);

        const categoryCode = f('52', '0000');
        const currency = f('53', '986');
        const transactionAmount = f('54', valor);
        const countryCode = f('58', 'BR');
        const merchantName = f('59', 'DIVISAO STREAMING');
        const merchantCity = f('60', 'GOIANIA');

        const txid = f('05', txidTexto);
        const additionalData = f('62', txid);

        let payload = payloadFormat + merchantAccount + categoryCode + currency + transactionAmount + countryCode + merchantName + merchantCity + additionalData;
        payload += '6304';

        const hash = crc16(payload);
        const pixCopiaCola = payload + hash;

        resultadoTitulo.textContent = 'Aponte a câmera para pagar via Pix:';
        copiaColaTextarea.value = pixCopiaCola;
        document.getElementById('pix-copia-cola-container-pix').style.display = 'block';

        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(pixCopiaCola)}`;
        qrImg.src = qrCodeUrl;

        resultadoArea.style.display = 'block';
    }

    gerarBtn.addEventListener('click', gerarQrPix);

    copiarBtn.addEventListener('click', function () {
        const text = copiaColaTextarea.value;
        if (!text) {
            window.showToast('Nenhum código para copiar.', '#92400e');
            return;
        }
        navigator.clipboard.writeText(text)
            .then(() => window.showToast('Código Pix copiado!', 'var(--color-toast-bg)'))
            .catch(() => {
                copiaColaTextarea.select();
                document.execCommand('copy');
                window.showToast('Código Pix copiado!', 'var(--color-toast-bg)');
            });
    });

})();