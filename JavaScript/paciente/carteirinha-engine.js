const modal = document.getElementById('modal-carteirinha');
const btnClose = document.getElementById('btn-close-modal');
const cardInner = document.getElementById('card-inner');
const btnFlip = document.getElementById('btn-flip');

if (modal) {
    const btnOpenCards = document.querySelectorAll('.card-btn'); 

    btnOpenCards.forEach(btn => {
        if(btn.innerText.includes('Carteirinha')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                modal.classList.add('show');
            });
        }
    });

    if (btnClose) {
        btnClose.addEventListener('click', () => {
            modal.classList.remove('show');
            setTimeout(() => {
                if (cardInner) cardInner.classList.remove('is-flipped');
            }, 400);
        });
    }

    modal.addEventListener('click', (e) => {
        if(e.target === modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                if (cardInner) cardInner.classList.remove('is-flipped');
            }, 400);
        }
    });

    if (btnFlip) {
        btnFlip.addEventListener('click', () => {
            if (cardInner) cardInner.classList.toggle('is-flipped');
        });
    }
}

document.getElementById('btn-baixar-cartao')?.addEventListener('click', () => {
    const { jsPDF } = window.jspdf || window.jspdf_umd || {};
    if (!jsPDF) return;

    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [85, 55] });

    const BLUE_DARK = '#003B62';
    const BLUE_LIGHT = '#0079C8';

    doc.setFillColor(BLUE_DARK);
    doc.rect(0, 0, 85, 55, 'F');
    doc.setFillColor(BLUE_LIGHT);
    doc.rect(0, 0, 85, 15, 'F');

    doc.setTextColor(255, 255, 255);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('CarePlus', 5, 10);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.text('IDENTIFICAÇÃO DO BENEFICIÁRIO', 55, 10);

    doc.setFontSize(7);
    doc.setTextColor(200, 200, 200);
    doc.text('NOME DO BENEFICIÁRIO', 5, 22);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text('WILLIAM SILVA', 5, 26);

    doc.setFontSize(7);
    doc.setTextColor(200, 200, 200);
    doc.text('NÚMERO DA CARTEIRINHA', 5, 34);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text('0000 1234 5678 9012', 5, 38);

    doc.setFontSize(7);
    doc.setTextColor(200, 200, 200);
    doc.text('PLANO', 5, 46);
    doc.text('VALIDADE', 55, 46);
    doc.setTextColor(255, 255, 255);
    doc.text('EXECUTIVO I', 5, 50);
    doc.text('INDETERMINADA', 55, 50);

    doc.save('Carteirinha_CarePlus_William.pdf');
});

document.getElementById('btn-apple-wallet')?.addEventListener('click', function() {
    const btn = this;
    const originalIcon = btn.innerHTML;
    
    btn.innerHTML = '<div class="spinner-border spinner-border-sm" role="status"></div>';
    btn.style.pointerEvents = 'none';

    setTimeout(() => {
        btn.innerHTML = '<i class="bi bi-check2-all" style="color: #4ADE80;"></i>';
        
        alert("Carteira Digital: Cartão CarePlus adicionado com sucesso ao seu Apple iPhone!");
        
        setTimeout(() => {
            btn.innerHTML = originalIcon;
            btn.style.pointerEvents = 'auto';
        }, 2000);
    }, 1500);
});

document.getElementById('btn-baixar-cartao')?.addEventListener('click', () => {
    const { jsPDF } = window.jspdf || window.jspdf_umd || {};
    if (!jsPDF) return;

    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [85.6, 54] });

    try {
        doc.addImage(ASSETS_IMAGES.carteirinha_frente, 'PNG', 0, 0, 85.6, 54);
        
        doc.addPage([85.6, 54], 'landscape');
        
        doc.addImage(ASSETS_IMAGES.carteirinha_verso, 'PNG', 0, 0, 85.6, 54);

        doc.save('Carteirinha_CarePlus_Completa.pdf');
    } catch (err) {
        console.error("Erro ao gerar PDF:", err);
    }
});