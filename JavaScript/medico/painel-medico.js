function _resolveRoot(path) {
    const segs = window.location.pathname.split('/').filter(Boolean);
    const ups = Math.max(0, segs.length - 1);
    return '../'.repeat(ups) + path.replace(/^\//, '');
}
const navSidebar = document.getElementById('navSidebar');
const toggleBtn  = document.getElementById('sidebarToggle');
toggleBtn.addEventListener('click', () => {
    const exp = navSidebar.classList.toggle('expanded');
    toggleBtn.setAttribute('aria-expanded', exp);
    toggleBtn.querySelector('i').className = exp ? 'bi bi-x-lg' : 'bi bi-list';
});
document.addEventListener('click', e => {
    if (window.innerWidth<=768 && navSidebar.classList.contains('expanded') && !navSidebar.contains(e.target))
        { navSidebar.classList.remove('expanded'); toggleBtn.querySelector('i').className='bi bi-list'; }
});

const PATIENTS = [
    {
        id: 'william',
        name: 'William Souza',
        age: 28,
        unit: 'Unidade Alphaville',
        spec: 'Odontologia',
        apptTime: '09:00',
        apptDate: 'Hoje, 17/10/2025',
        status: 'today',
        prontuario: {
            medicacao:    { label:'Medicação uso contínuo', value:'Rivotril 0,5mg',  type:'warn' },
            doenca:       { label:'Doença pré-existente',   value:'Não',             type:'ok'   },
            alergia:      { label:'Alergias',               value:'Dipirona',        type:'alert'},
            sintomas:     { label:'Sintoma relatado',        value:'Dor ao mastigar no lado esquerdo', type:'warn' },
            ultima:       { label:'Última consulta',         value:'Há 6 meses',     type:'ok'   },
            fumante:      { label:'Fumante',                 value:'Não',            type:'ok'   },
            alcool:       { label:'Consumo de álcool',       value:'Ocasional',      type:'ok'   },
            obs:          { label:'Observações',             value:'Paciente relata ansiedade com procedimentos', type:'warn' },
    },
    historico: [
        { spec:'Odontologia', date:'10/04/2025 • 09:00', icon:'🦷', status:'Realizado' },
        { spec:'Odontologia', date:'15/11/2024 • 11:00', icon:'🦷', status:'Realizado' },
        { spec:'Clínica Médica', date:'02/07/2024 • 14:00', icon:'🩺', status:'Realizado' },
    ],
        chat: [
            { from:'them', text:'Bom dia, Dr. Cenizo! Queria confirmar minha consulta de amanhã.', time:'08:14' },
            { from:'me',   text:'Bom dia, William! Confirmado. Nos vemos amanhã às 09h. 😊', time:'08:22' },
        ],
    },
    {
    id: 'ana',
    name: 'Ana Beatriz F.',
    age: 34,
    unit: 'Unidade Alphaville',
    spec: 'Odontologia',
    apptTime: '10:30',
    apptDate: 'Hoje, 17/10/2025',
    status: 'today',
    prontuario: {
        medicacao: { label:'Medicação uso contínuo', value:'Não',              type:'ok'   },
        doenca:    { label:'Doença pré-existente',   value:'Hipertensão',      type:'warn' },
        alergia:   { label:'Alergias',               value:'Não',             type:'ok'   },
        sintomas:  { label:'Sintoma relatado',        value:'Sensibilidade nos dentes ao frio', type:'warn' },
        ultima:    { label:'Última consulta',         value:'Há 1 ano',        type:'ok'   },
        fumante:   { label:'Fumante',                 value:'Não',            type:'ok'   },
        alcool:    { label:'Consumo de álcool',       value:'Não consome',    type:'ok'   },
        obs:       { label:'Observações',             value:'Faz uso de medicação para pressão, verificar interação', type:'alert' },
    },
    historico: [
        { spec:'Odontologia',  date:'12/10/2024 • 10:00', icon:'🦷', status:'Realizado' },
        { spec:'Cardiologia',  date:'05/03/2024 • 14:00', icon:'❤️', status:'Realizado' },
    ],
    chat: [
        { from:'them', text:'Dr. Cenizo, tenho uma dúvida sobre o clareamento. Posso fazer mesmo com pressão alta?', time:'07:50' },
        { from:'me',   text:'Ana, boa pergunta! Vamos conversar sobre isso na consulta. Esteja despreocupada. 👍', time:'08:05' },
    ],
    },
    {
    id: 'carlos',
    name: 'Carlos Eduardo M.',
    age: 45,
    unit: 'Unidade Alphaville',
    spec: 'Odontologia',
    apptTime: '14:00',
    apptDate: 'Hoje, 17/10/2025',
    status: 'today',
    prontuario: {
        medicacao: { label:'Medicação uso contínuo', value:'Metformina 500mg',  type:'warn' },
        doenca:    { label:'Doença pré-existente',   value:'Diabetes tipo 2',   type:'alert'},
        alergia:   { label:'Alergias',               value:'Penicilina',        type:'alert'},
        sintomas:  { label:'Sintoma relatado',        value:'Gengiva sangrando ao escovar', type:'warn' },
        ultima:    { label:'Última consulta',         value:'Há 2 anos',        type:'warn' },
        fumante:   { label:'Fumante',                 value:'Ex-fumante',       type:'warn' },
        alcool:    { label:'Consumo de álcool',       value:'Não consome',      type:'ok'   },
        obs:       { label:'Observações',             value:'Diabético — verificar glicemia antes do procedimento, ALÉRGICO À PENICILINA', type:'alert' },
    },
    historico: [
        { spec:'Odontologia',  date:'08/08/2023 • 09:00', icon:'🦷', status:'Realizado' },
        { spec:'Endocrinologia',date:'15/01/2025 • 11:00',icon:'⚗️', status:'Realizado' },
    ],
    chat: [],
    },
    {
    id: 'patricia',
    name: 'Patrícia Alves',
    age: 29,
    unit: 'Unidade Alphaville',
    spec: 'Odontologia',
    apptTime: '15:30',
    apptDate: 'Hoje, 17/10/2025',
    status: 'today',
    prontuario: {
        medicacao: { label:'Medicação uso contínuo', value:'Não',             type:'ok'   },
        doenca:    { label:'Doença pré-existente',   value:'Não',             type:'ok'   },
        alergia:   { label:'Alergias',               value:'Não',            type:'ok'   },
        sintomas:  { label:'Sintoma relatado',        value:'Dente do siso doendo', type:'warn' },
        ultima:    { label:'Última consulta',         value:'Há 8 meses',     type:'ok'   },
        fumante:   { label:'Fumante',                 value:'Não',            type:'ok'   },
        alcool:    { label:'Consumo de álcool',       value:'Fim de semana',  type:'ok'   },
        obs:       { label:'Observações',             value:'Nenhuma',        type:'ok'   },
    },
    historico: [
        { spec:'Odontologia', date:'12/02/2025 • 15:00', icon:'🦷', status:'Realizado' },
    ],
    chat: [
        { from:'them', text:'Oi doutor, vou chegar uns 5 minutinhos atrasada, pode ser?', time:'14:50' },
        { from:'me',   text:'Claro Patrícia, sem problema! Te esperamos. 🙂', time:'14:55' },
    ],
    },
];

let activePatientId = null;

function buildPatientList(filter='') {
    const list = document.getElementById('patientsList');
    list.querySelectorAll('.patient-item').forEach(el=>el.remove());

    const q = filter.toLowerCase();
    const filtered = PATIENTS.filter(p =>
    p.name.toLowerCase().includes(q) || p.spec.toLowerCase().includes(q)
    );

    filtered.forEach((p,i) => {
        const item = document.createElement('div');
        item.className = 'patient-item' + (p.id === activePatientId ? ' active' : '');
        item.id = `pitem-${p.id}`;
        item.style.animation = `fadeUp .4s ${.05+i*.07}s cubic-bezier(.22,1,.36,1) both`;
        item.innerHTML = `
        <div class="p-avatar">
            <i class="bi bi-person-fill"></i>
            <div class="status-dot dot-${p.status}"></div>
        </div>
        <div class="p-info">
            <div class="p-name">${p.name}</div>
            <div class="p-age">${p.age} anos</div>
            <div class="p-unit">${p.unit}</div>
        </div>
    <div class="appt-time">${p.apptTime}</div>`;
    item.addEventListener('click', () => selectPatient(p.id));
    list.appendChild(item);
    });
}

function selectPatient(id) {
    activePatientId = id;
    document.querySelectorAll('.patient-item').forEach(el=>el.classList.remove('active'));
    const el = document.getElementById(`pitem-${id}`);
    if (el) el.classList.add('active');

    const p = PATIENTS.find(x=>x.id===id);
    const panel = document.getElementById('detailPanel');
    panel.innerHTML = '';

    const header = document.createElement('div');
    header.className = 'detail-header';
    header.innerHTML = `
        <div class="detail-av" style="overflow: hidden; padding: 0; border: 2px solid rgba(255,255,255,0.1);">
            <!-- Imagem do painel central -->
            <img src="${_resolveRoot('/assets/images/fotousuario.png')}" alt="Foto de ${p.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">
        </div>
        <div class="detail-info">
            <div class="detail-name">${p.name}</div>
            <div class="detail-sub">${p.age} anos &nbsp;•&nbsp; ${p.unit}</div>
        </div>
        <div class="detail-actions">
        <button class="btn-action btn-chat" onclick="openChat('${p.id}')">
            <i class="bi bi-chat-dots-fill"></i> Chat
        </button>
        <button class="btn-action btn-hist" onclick="openHist('${p.id}')">
            <i class="bi bi-clock-history"></i> HISTÓRICO
            </button>
        </div>`;
    panel.appendChild(header);

    const strip = document.createElement('div');
    strip.className = 'appt-strip';
    strip.innerHTML = `
        <div class="appt-chip"><i class="bi bi-calendar3"></i><span>${p.apptDate}</span></div>
        <div class="appt-chip"><i class="bi bi-clock-fill"></i><span><strong>${p.apptTime}</strong></span></div>
        <div class="appt-chip"><i class="bi bi-bandaid-fill"></i><span>${p.spec}</span></div>`;
    panel.appendChild(strip);

    const secTitle = document.createElement('div');
    secTitle.className = 'sec-title';
    secTitle.innerHTML = `Resumo do paciente <span class="sec-badge"><i class="bi bi-robot"></i> IA</span>`;
    panel.appendChild(secTitle);

    const grid = document.createElement('div');
    grid.className = 'prontuario-grid';
    Object.values(p.prontuario).forEach(field => {
        const card = document.createElement('div');
        card.className = 'pron-card';
        const alertIcon = field.type==='alert' ? '⚠️ ' : field.type==='warn' ? '⚡ ' : '✅ ';
        card.innerHTML = `
        <div class="pron-label">${field.label}</div>
        <div class="pron-value-wrap value-${field.type}">
            <span class="pron-icon">${alertIcon}</span>${field.value}
            </div>`;
        grid.appendChild(card);
    });
    panel.appendChild(grid);

    if (p.historico.length) {
        const tlTitle = document.createElement('div');
        tlTitle.className = 'sec-title';
        tlTitle.style.fontSize = '18px';
        tlTitle.textContent = 'Histórico de Consultas';
        panel.appendChild(tlTitle);

        const tl = document.createElement('div');
        tl.className = 'timeline';
        p.historico.forEach(h => {
        const item = document.createElement('div');
        item.className = 'tl-item';
        item.innerHTML = `
            <div class="tl-dot dot-ok">${h.icon}</div>
            <div class="tl-info">
                <div class="tl-title">${h.spec}</div>
                <div class="tl-date"><i class="bi bi-calendar3" style="font-size:10px;"></i> ${h.date}</div>
            </div>
            <span class="hist-status s-ok">${h.status}</span>`;
        tl.appendChild(item);
        });
        panel.appendChild(tl);
    }

    const stamp = document.createElement('div');
    stamp.className = 'auto-stamp';
    stamp.innerHTML = `Gerado Automaticamente pelo sistema <strong>Care Plus Smart Health</strong>`;
    panel.appendChild(stamp);
}

function openChat(patientId) {
    const p = PATIENTS.find(x=>x.id===patientId);
    document.getElementById('chatModalTitle').innerHTML =
    `<i class="bi bi-chat-dots-fill" style="color:#7DD3FC;margin-right:8px;"></i>Chat com ${p.name.split(' ')[0]}`;
    const msgs = document.getElementById('chatMsgs');
    msgs.innerHTML = '';
    p.chat.forEach(m => appendMsg(msgs, m.from, m.text, m.time));
    if (!p.chat.length) msgs.innerHTML = '<div style="color:rgba(255,255,255,.3);font-size:13px;text-align:center;padding:20px;">Sem mensagens ainda.</div>';
    document.getElementById('chatModal').classList.add('open');
    document.body.style.overflow = 'hidden';

    const input = document.getElementById('chatMsgInput');
    const send  = document.getElementById('chatSend');
    const doSend = () => {
    const txt = input.value.trim(); if (!txt) return;
    const now = new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
    p.chat.push({from:'me',text:txt,time:now});
    appendMsg(msgs, 'me', txt, now);
    input.value = '';
    msgs.scrollTop = msgs.scrollHeight;
    };
    send.onclick = doSend;
    input.onkeydown = e => { if(e.key==='Enter') doSend(); };
}

function appendMsg(container, from, text, time) {
    const row = document.createElement('div');
    row.className = `msg-row from-${from}`;
    const av = from==='me' ?
    `<div class="msg-av"><i class="bi bi-person-fill" style="font-size:12px;"></i></div>` :
    `<div class="msg-av"><i class="bi bi-person-fill" style="font-size:12px;"></i></div>`;
    row.innerHTML = `${from==='them'?av:''}<div style="display:flex;flex-direction:column;gap:3px;max-width:75%;${from==='me'?'align-items:flex-end;':''}"><div class="bubble">${text}</div><div class="msg-time">${from==='me'?'Você':'Paciente'} • ${time}</div></div>${from==='me'?av:''}`;
    container.appendChild(row);
    container.scrollTop = container.scrollHeight;
}

function openHist(patientId) {
    const p = PATIENTS.find(x=>x.id===patientId);
    document.getElementById('histModalTitle').innerHTML =
        `<i class="bi bi-clock-history" style="color:#7DD3FC;margin-right:8px;"></i>Histórico – ${p.name.split(' ')[0]}`;
    const content = document.getElementById('histContent');
    content.innerHTML = p.historico.map(h =>
    `<div class="hist-item">
        <div class="hist-icon">${h.icon}</div>
        <div class="hist-info">
        <div class="hist-spec">${h.spec}</div>
        <div class="hist-date"><i class="bi bi-calendar3" style="font-size:10px;"></i> ${h.date}</div>
        </div>
        <span class="hist-status s-ok">${h.status}</span>
    </div>`
    ).join('') || '<div style="color:rgba(255,255,255,.3);font-size:13px;">Sem histórico.</div>';
    document.getElementById('histModal').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal(key) {
    const ids = { chat:'chatModal', hist:'histModal' };
    document.getElementById(ids[key]).classList.remove('open');
    document.body.style.overflow = '';
}
['chatModal','histModal'].forEach(id => {
    document.getElementById(id).addEventListener('click', e => {
    if(e.target===document.getElementById(id)) { document.getElementById(id).classList.remove('open'); document.body.style.overflow=''; }
    });
});
document.addEventListener('keydown', e => {
    if(e.key==='Escape') { ['chatModal','histModal'].forEach(id=>{ document.getElementById(id).classList.remove('open'); }); document.body.style.overflow=''; }
});

document.getElementById('patientSearch').addEventListener('input', function() {
    buildPatientList(this.value);
});

buildPatientList();
selectPatient(PATIENTS[0].id);