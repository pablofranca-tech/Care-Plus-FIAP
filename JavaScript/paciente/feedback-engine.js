function abrirModalCancelamento() {
    const modalCancel = document.getElementById('modal-cancelamento');
    const msgBonus = document.getElementById('msg-bonus');
    const txtMotivo = document.getElementById('motivo-cancelamento');

    if (modalCancel) {
        if (txtMotivo) txtMotivo.value = ''; 

        const ultimoMesBonus = localStorage.getItem('ultimoBonusCancelamento');
        const mesAtual = new Date().getMonth() + '-' + new Date().getFullYear();
        
        if (msgBonus) {
            msgBonus.style.display = (ultimoMesBonus !== mesAtual) ? 'block' : 'none';
        }

        modalCancel.classList.add('show');
    }
}

function fecharModalCancelamento() {
    const modalCancel = document.getElementById('modal-cancelamento');
    const bodyCancelamento = document.getElementById('modal-body-cancelamento');
    const bodySuccess = document.getElementById('modal-success-cancelamento');

    if (modalCancel) {
        modalCancel.classList.remove('show');
        setTimeout(() => {
            if (bodyCancelamento) bodyCancelamento.style.display = 'block';
            if (bodySuccess) bodySuccess.style.display = 'none';
        }, 300);
    }
}

function confirmarCancelamentoFinal() {
    const txtMotivo = document.getElementById('motivo-cancelamento');
    const bodyCancelamento = document.getElementById('modal-body-cancelamento');
    const bodySuccess = document.getElementById('modal-success-cancelamento');
    const successText = document.getElementById('success-feedback-text');

    const motivoDigitado = txtMotivo ? txtMotivo.value.trim() : '';
    const mesAtual = new Date().getMonth() + '-' + new Date().getFullYear();
    let ganhouBonus = false;

    if (motivoDigitado !== '' && localStorage.getItem('ultimoBonusCancelamento') !== mesAtual) {
        localStorage.setItem('ultimoBonusCancelamento', mesAtual);
        ganhouBonus = true;
        
        if (typeof atualizarCarePoints === "function") {
            atualizarCarePoints(5);
        }
    }

    if (bodyCancelamento) bodyCancelamento.style.display = 'none';
    if (bodySuccess) bodySuccess.style.display = 'block';

    if (successText) {
        successText.innerHTML = ganhouBonus ? 
            "Obrigado pelo seu feedback!<br>Você ganhou <strong style='color:#4ADE80'>+5 Care Points</strong>." : 
            "Sua consulta foi cancelada.";
    }

    setTimeout(fecharModalCancelamento, 3000);
}

function atualizarCarePoints(pontosASomar) {
    const pontosDisplay = document.querySelectorAll('.care-points-display');
    pontosDisplay.forEach(display => {
        let textoAtual = display.innerText;
        let pontosAtuais = parseInt(textoAtual.replace(/\D/g, '')) || 0; 
        display.innerText = (pontosAtuais + pontosASomar) + ' pts';
        
        display.style.transition = "transform 0.3s, color 0.3s";
        display.style.transform = "scale(1.2)";
        display.style.color = "#4ADE80"; 
        
        setTimeout(() => {
            display.style.transform = "scale(1)";
            display.style.color = ""; 
        }, 500);
    });
}

document.getElementById('btn-close-cancel')?.addEventListener('click', fecharModalCancelamento);
document.getElementById('btn-keep-appt')?.addEventListener('click', fecharModalCancelamento);
document.getElementById('btn-confirm-cancel')?.addEventListener('click', confirmarCancelamentoFinal);

window.abrirModalCancelamento = abrirModalCancelamento;
window.fecharModalCancelamento = fecharModalCancelamento;
window.confirmarCancelamentoFinal = confirmarCancelamentoFinal;
window.atualizarCarePoints = atualizarCarePoints;