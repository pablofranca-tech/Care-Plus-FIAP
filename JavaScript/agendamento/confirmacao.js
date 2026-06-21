function _resolveRoot(path) {
    const segs = window.location.pathname.split('/').filter(Boolean);
    const ups = Math.max(0, segs.length - 1);
    return '../'.repeat(ups) + path.replace(/^\//, '');
}
const sidebar   = document.getElementById('sidebar');
const toggleBtn = document.getElementById('sidebarToggle');
toggleBtn.addEventListener('click', () => {
    const exp = sidebar.classList.toggle('expanded');
    toggleBtn.setAttribute('aria-expanded', exp);
    toggleBtn.querySelector('i').className = exp ? 'bi bi-x-lg' : 'bi bi-list';
});
document.addEventListener('click', e => {
    if (window.innerWidth<=768 && sidebar.classList.contains('expanded') && !sidebar.contains(e.target))
        { sidebar.classList.remove('expanded'); toggleBtn.querySelector('i').className='bi bi-list'; }
});

const params  = new URLSearchParams(window.location.search);
const DOCTORS = ['Miguel Paulo G. Cenizo','Carlos Henrique Almeida','Gabriel Tavarez da Silva'];

const booking = {
    paciente:   params.get('paciente')   || 'Pablo França',
    data:       params.get('data')       || getTodayPlusDays(2), 
    hora:       params.get('hora')       || '15:00',
    docIdx:     parseInt(params.get('doc') || '0'),
    spec:       params.get('spec')       || 'Odontologia',
};
booking.doutor = DOCTORS[booking.docIdx] || DOCTORS[0];

function getTodayPlusDays(n) {
    const d = new Date(); d.setDate(d.getDate() + n);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

const DAYS_PT = ['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'];
const MONTHS_PT = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

function parseDate(str) {
    const [y,m,d] = str.split('-').map(Number);
    return new Date(y, m-1, d);
}
function formatDate(str) {
    const d = parseDate(str);
    return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()} – ${DAYS_PT[d.getDay()]}`;
}
function daysUntil(str) {
    const now  = new Date(); now.setHours(0,0,0,0);
    const then = parseDate(str);
    return Math.round((then - now) / 86400000);
}

document.getElementById('rPaciente').textContent = booking.paciente;
document.getElementById('rData').textContent     = formatDate(booking.data);
document.getElementById('rHorario').textContent  = booking.hora;
document.getElementById('rDoutor').textContent   = booking.doutor;
document.getElementById('rEspec').textContent    = booking.spec;

const CLINIC_LAT = -23.497;
const CLINIC_LNG = -46.848;

const days = daysUntil(booking.data);
const isNear = days <= 7;

let map;
function initMap() {
    map = L.map('map', { zoomControl:true, attributionControl:true })
                .setView([CLINIC_LAT, CLINIC_LNG], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:'© OpenStreetMap'
    }).addTo(map);

    const clinicIcon = L.divIcon({
        html:`<div style="width:32px;height:32px;background:#EF4444;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 4px 12px rgba(0,0,0,.4);"></div>`,
        iconSize:[32,32], iconAnchor:[16,32], className:''
    });
    L.marker([CLINIC_LAT, CLINIC_LNG], {icon:clinicIcon})
        .addTo(map)
        .bindPopup(`<b>CarePlus – Alphaville</b><br>Unidade Barueri`);

    const userIcon = L.divIcon({
        html:`<div style="width:20px;height:20px;background:#0079C8;border-radius:50%;border:3px solid #fff;box-shadow:0 4px 12px rgba(0,0,0,.4);"></div>`,
        iconSize:[20,20], iconAnchor:[10,10], className:''
    });
    L.marker([CLINIC_LAT + 0.008, CLINIC_LNG - 0.012], {icon:userIcon})
        .addTo(map)
        .bindPopup('Sua localização');
}

if (isNear) {
    initMap();
    document.getElementById('wazeLink').href =
        `https://waze.com/ul?ll=${CLINIC_LAT},${CLINIC_LNG}&navigate=yes`;
    document.getElementById('uberLink').href =
        `https://m.uber.com/ul/?action=setPickup&dropoff[latitude]=${CLINIC_LAT}&dropoff[longitude]=${CLINIC_LNG}&dropoff[nickname]=CarePlus%20Alphaville`;
} else {
    document.getElementById('mapOverlay').style.display = 'flex';
    document.getElementById('navPill').style.display    = 'none';
    document.getElementById('overlayDate').textContent  = formatDate(booking.data);
    initMap();
}

const ICONS = ['☀️','⛅','🌤️','🌦️','🌧️','🌩️','🌈'];
const CONDS = ['ensolarado','parcialmente nublado','sol com nuvens','chuva leve','chuvoso','tempestade','pós-chuva'];

function seededRand(seed) {
    let s = seed; return ()=>{ s=(s*1103515245+12345)&0x7fffffff; return s/0x7fffffff; };
}
function buildWeather(dateStr) {
    const base = parseDate(dateStr);
    const today = new Date(); today.setHours(0,0,0,0);
    const r = seededRand(base.getFullYear()*10000 + (base.getMonth()+1)*100 + base.getDate());
    const days = [];
    for (let i=-3; i<=3; i++) {
        const d = new Date(base); d.setDate(d.getDate()+i);
        const condI = Math.floor(r()*ICONS.length);
        days.push({
            num:d.getDate(), date:d,
            icon:ICONS[condI], cond:CONDS[condI],
            temp:Math.round(18 + r()*8),
            isTarget:i===0, isToday:d.getTime()===today.getTime()
        });
    }
    return days;
}

function renderWeather() {
    const wc = document.getElementById('weatherContent');
    if (!isNear) {
        const d = parseDate(booking.data);
        wc.innerHTML = `
            <div class="weather-soon">
                <div class="soon-icon">🗓️</div>
                <div class="soon-date">${formatDate(booking.data)}</div>
                <p>A previsão do tempo para o dia da sua consulta ficará disponível <strong>7 dias antes</strong>.<br>Volte mais perto para se preparar!</p>
            </div>`;
        return;
    }
    const days = buildWeather(booking.data);
    const targetDay = days.find(d=>d.isTarget);
    const html = `
        <div style="margin-bottom:10px;display:flex;align-items:center;gap:10px;">
            <span style="font-size:32px;">${targetDay.icon}</span>
            <div>
                <div style="font-size:22px;font-weight:600;color:#fff;">${targetDay.temp}°C</div>
                <div style="font-size:12px;color:rgba(255,255,255,.65);">${targetDay.cond}</div>
            </div>
        </div>
        <div class="weather-scroll">
            ${days.map(d=>`
                <div class="weather-day ${d.isTarget?'today':''}">
                    <div class="wd-num">${d.num}</div>
                    <div class="wd-icon">${d.icon}</div>
                    <div class="wd-temp">${d.temp}°</div>
                </div>`).join('')}
        </div>`;
    wc.innerHTML = html;
}
renderWeather();

function showSuccessOverlay(message) {
    const overlay = document.getElementById('successOverlay');
    const successText = document.getElementById('successMsg');
    const confirmRow = document.querySelector('.action-bar-confirm');

    if (successText) {
        successText.textContent = message;
    }
    if (confirmRow) {
        confirmRow.style.display = 'none';
    }
    if (overlay) {
        overlay.classList.add('show');
    }
}

document.getElementById('btnAddCal')?.addEventListener('click', () => {
    const d = parseDate(booking.data);
    const y = d.getFullYear();
    const m = String(d.getMonth()+1).padStart(2,'0');
    const dd= String(d.getDate()).padStart(2,'0');
    const [h,min] = booking.hora.split(':');
    const dtStart = `${y}${m}${dd}T${h}${min}00`;
    const dtEnd   = `${y}${m}${dd}T${String(parseInt(h)+1).padStart(2,'0')}${min}00`;
    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:${dtStart}\nDTEND:${dtEnd}\nSUMMARY:Consulta ${booking.spec} – CarePlus\nDESCRIPTION:Dr. ${booking.doutor}\\nUnidade Alphaville – Barueri\nLOCATION:CarePlus Alphaville\\, Barueri SP\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([ics],{type:'text/calendar'});
    const a = document.createElement('a'); a.href=URL.createObjectURL(blob);
    a.download=`consulta-careplus.ics`; a.click();
});

document.getElementById('btnPdf').addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' });

    const BL = '#003B62', BM = '#0079C8', WT = '#FFFFFF';
    const W = 210, H = 297;

    doc.setFillColor(0,121,200);
    doc.roundedRect(0,0,W,38,0,0,'F');

    doc.setTextColor(255,255,255);
    doc.setFontSize(22); doc.setFont('helvetica','bold');
    doc.text('CarePlus', 14, 20);
    doc.setFontSize(9); doc.setFont('helvetica','normal');
    doc.setTextColor(180,220,255);
    doc.text('Part of Bupa', 14, 28);

    doc.setFontSize(16); doc.setFont('helvetica','bolditalic');
    doc.setTextColor(255,255,255);
    doc.text('Agendamento Inteligente', W-14, 20, {align:'right'});

    doc.setFillColor(0,30,60);
    doc.roundedRect(14,48,W-28,H-100,6,6,'F');

    doc.setTextColor(255,255,255);
    doc.setFontSize(20); doc.setFont('helvetica','bold');
    doc.text('Resumo da Consulta', 24, 66);

    doc.setDrawColor(0,121,200);
    doc.setLineWidth(.8);
    doc.line(24, 70, W-24, 70);

    const fields = [
        ['Paciente',     booking.paciente],
        ['Data',         formatDate(booking.data)],
        ['Horário',      booking.hora],
        ['Doutor',       `Dr. ${booking.doutor}`],
        ['Especialidade',booking.spec],
        ['Local',        'Unidade Alphaville – Barueri, SP'],
        ['Status',       'Aguardando confirmação'],
    ];

    let y = 84;
    fields.forEach(([label, value]) => {
        doc.setFontSize(11); doc.setFont('helvetica','normal');
        doc.setTextColor(150,200,240);
        doc.text(label + ':', 24, y);
        doc.setTextColor(255,255,255);
        doc.setFont('helvetica','bold');
        doc.text(value, 70, y);
        y += 13;
    });

    if (!isNear) {
        doc.setFillColor(0,60,100);
        doc.roundedRect(24, y+4, W-52, 26, 4, 4, 'F');
        doc.setFontSize(10); doc.setFont('helvetica','normal');
        doc.setTextColor(200,230,255);
        doc.text('📅  O mapa e previsão do tempo estarão disponíveis 7 dias antes da consulta.', 30, y+14, {maxWidth:W-64});
        doc.text('Acesse o app CarePlus próximo à data para mais detalhes.', 30, y+22, {maxWidth:W-64});
        y += 36;
    }

    doc.setFillColor(0,59,98);
    doc.roundedRect(0,H-20,W,20,0,0,'F');
    doc.setFontSize(9); doc.setFont('helvetica','normal');
    doc.setTextColor(150,200,240);
    doc.text(`Gerado em ${new Date().toLocaleDateString('pt-BR')} • CarePlus – Part of Bupa`, W/2, H-8, {align:'center'});

    doc.save(`resumo-consulta-careplus.pdf`);
});

document.getElementById('btnConfirm').addEventListener('click', () => {
    showSuccessOverlay(`Agendamento com sucesso! Nos vemos em breve. Sua consulta de ${booking.spec} com Dr. ${booking.doutor} em ${formatDate(booking.data)} às ${booking.hora} está confirmada.`);
});

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('status') === 'success') {
    showSuccessOverlay(`Agendamento com sucesso! Nos vemos em breve. Sua consulta de ${booking.spec} com Dr. ${booking.doutor} em ${formatDate(booking.data)} às ${booking.hora} está confirmada.`);
}

const btnOpenCancel = document.getElementById('btnOpenCancelModal');
const modalCancel = document.getElementById('modalCancelamento');
const btnKeepAppt = document.getElementById('btnKeepAppt');
const btnConfirmCancel = document.getElementById('btnConfirmCancel');

if (btnOpenCancel && modalCancel) {
    btnOpenCancel.addEventListener('click', () => {
        modalCancel.classList.add('show');
    });
}

if (btnKeepAppt && modalCancel) {
    btnKeepAppt.addEventListener('click', () => {
        modalCancel.classList.remove('show');
    });
}

if (btnConfirmCancel) {
    btnConfirmCancel.addEventListener('click', () => {
        window.location.href = _resolveRoot('/index.html'); 
    });
}