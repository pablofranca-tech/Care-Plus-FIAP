function abrirCheckinOnline(e) {
    if(e) e.preventDefault();
    
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('show'));
    
    const modalCheckin = document.getElementById('modal-checkin');
    const step1 = document.getElementById('checkin-step-1');
    const step2 = document.getElementById('checkin-step-2');
    const checkboxes = document.querySelectorAll('.chk-step');
    const btnGerar = document.getElementById('btn-gerar-senha');

    if (modalCheckin) {
        if (step1) step1.style.display = 'block';
        if (step2) step2.style.display = 'none';
        checkboxes.forEach(c => c.checked = false);
        
        if (btnGerar) {
            btnGerar.disabled = true;
            btnGerar.style.background = 'rgba(255,255,255,0.1)';
            btnGerar.style.color = 'rgba(255,255,255,0.4)';
            btnGerar.style.cursor = 'not-allowed';
        }

        modalCheckin.classList.add('show');

        setTimeout(() => {
            const LAT = -23.497;
            const LNG = -46.848;
            if (!window.miniMapInstance && typeof L !== 'undefined') {
                window.miniMapInstance = L.map('mini-map', { zoomControl: false, attributionControl: false }).setView([LAT, LNG], 16);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(window.miniMapInstance);
                L.marker([LAT, LNG]).addTo(window.miniMapInstance);
                L.circle([LAT + 0.001, LNG - 0.001], {radius: 40, color: '#4ADE80', fillOpacity: 0.5}).addTo(window.miniMapInstance);
            }
            if(window.miniMapInstance) window.miniMapInstance.invalidateSize();
        }, 300);
    }
}

function fecharCheckin() {
    const modalCheckin = document.getElementById('modal-checkin');
    if (modalCheckin) modalCheckin.classList.remove('show');
}

document.addEventListener('change', (e) => {
    if (e.target.classList.contains('chk-step')) {
        const checkboxes = document.querySelectorAll('.chk-step');
        const btnGerar = document.getElementById('btn-gerar-senha');
        const todasMarcadas = Array.from(checkboxes).every(c => c.checked);

        if (btnGerar) {
            btnGerar.disabled = !todasMarcadas;
            btnGerar.style.background = todasMarcadas ? 'linear-gradient(135deg, #0079C8, #005fa0)' : 'rgba(255,255,255,0.1)';
            btnGerar.style.color = todasMarcadas ? '#fff' : 'rgba(255,255,255,0.4)';
            btnGerar.style.cursor = todasMarcadas ? 'pointer' : 'not-allowed';
        }
    }
});

function processarGerarSenha() {
    document.getElementById('checkin-step-1').style.display = 'none';
    document.getElementById('checkin-step-2').style.display = 'block';

    const btnHomeCheckin = document.getElementById('btnCheckinDashboard');
    if (btnHomeCheckin) {
        btnHomeCheckin.innerHTML = '<i class="bi bi-check-all"></i> Check-in Realizado';
        btnHomeCheckin.style.opacity = '0.6';
        btnHomeCheckin.disabled = true;
        btnHomeCheckin.onclick = null;
    }

    if (typeof atualizarCarePoints === "function") {
        atualizarCarePoints(10);
    }
}

document.getElementById('btnBaixarHemograma')?.addEventListener('click', () => {
    const { jsPDF } = window.jspdf || window.jspdf_umd || {};
    if (!jsPDF) {
        console.error("Biblioteca jsPDF não encontrada!");
        return;
    }

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const BLUE = '#0079C8';
    const DARK = '#003B62';
    const GRAY = '#64748b';
    const LIGHT_GRAY = '#f1f5f9';
    const W = 210;

    doc.setFillColor(BLUE);
    doc.rect(0, 0, W, 4, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(DARK);
    doc.text('CarePlus', 20, 25);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(GRAY);
    doc.text('DIAGNÓSTICO AVANÇADO • PART OF BUPA', 20, 31);

    doc.setFontSize(9);
    doc.text('PACIENTE:', W - 80, 20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('WILLIAM SILVA', W - 80, 24);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(GRAY);
    doc.text('DATA: 10/10/2025', W - 80, 28);
    doc.text('PROTOCOLO: #CP-2025-08842', W - 80, 32);

    doc.setDrawColor(BLUE);
    doc.setLineWidth(0.5);
    doc.line(20, 40, W - 20, 40);

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(DARK);
    doc.text('HEMOGRAMA COMPLETO', 20, 52);

    const headers = ['PARÂMETRO', 'RESULTADO', 'UNIDADE', 'REFERÊNCIA'];
    const data = [
        ['Eritrócitos', '5.10', 'milhões/mm³', '4.50 - 6.00'],
        ['Hemoglobina', '15.2', 'g/dL', '13.5 - 17.5'],
        ['Hematócrito', '46', '%', '41 - 53'],
        ['Leucócitos', '6.800', '/mm³', '4.500 - 11.000'],
        ['Plaquetas', '245.000', '/mm³', '150.000 - 450.000']
    ];

    let currentY = 65;

    doc.setFillColor(LIGHT_GRAY);
    doc.rect(20, currentY, W - 40, 10, 'F');
    doc.setFontSize(9);
    doc.setTextColor(GRAY);
    doc.text(headers[0], 25, currentY + 6.5);
    doc.text(headers[1], 80, currentY + 6.5);
    doc.text(headers[2], 115, currentY + 6.5);
    doc.text(headers[3], 155, currentY + 6.5);

    currentY += 10;

    data.forEach((row) => {
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        
        doc.text(row[0], 25, currentY + 10);
        doc.setFont('helvetica', 'bold');
        doc.text(row[1], 80, currentY + 10);
        doc.setFont('helvetica', 'normal');
        doc.text(row[2], 115, currentY + 10);
        
        doc.setFillColor(LIGHT_GRAY);
        doc.roundedRect(153, currentY + 6, 32, 6, 1, 1, 'F');
        doc.setFontSize(8);
        doc.text(row[3], 156, currentY + 10);

        doc.setDrawColor(240, 240, 240);
        doc.line(20, currentY + 14, W - 20, currentY + 14);
        currentY += 14;
    });

    const footerY = 260;
    doc.setFontSize(8);
    doc.setTextColor(GRAY);
    doc.text('CarePlus Alphaville - Laboratório Unidade I', 20, footerY);
    doc.text('Responsável Técnico: Dr. Roberto Mendes - CRBM 9842', 20, footerY + 4);

    doc.setDrawColor(GRAY);
    doc.line(W - 80, footerY, W - 20, footerY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Dr. Roberto Mendes', W - 80, footerY + 5, { align: 'left' });
    doc.setFont('helvetica', 'normal');
    doc.text('Hematologista', W - 80, footerY + 9);

    doc.save('Hemograma_William_Silva.pdf');
});

window.abrirCheckinOnline = abrirCheckinOnline;
window.fecharCheckin = fecharCheckin;
window.processarGerarSenha = processarGerarSenha;