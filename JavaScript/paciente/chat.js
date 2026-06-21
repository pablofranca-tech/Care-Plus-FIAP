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

const CONTACTS = [
    {
        id: 'miguel',
        name: 'Miguel Paulo G. Cenizo',
        sub: '+500 pacientes',
        loc: 'Em Barueri, unidade Alphaville.',
        rating: 4.8, online: true, unread: 1,
        type: 'preconsulta',
        spec: 'Odontologia', icon: '🦷',
        apptDate: 'amanhã, 17/10/2025 às 15:00',
    },
    {
        id: 'carlos',
        name: 'Carlos Henrique Almeida',
        sub: '+400 pacientes',
        loc: 'Em Barueri, unidade Alphaville.',
        rating: 4.9, online: true, unread: 0,
        type: 'preconsulta',
        spec: 'Cardiologia', icon: '❤️',
        apptDate: '25/10/2025 às 09:00',
    },
    {
        id: 'gabriel',
        name: 'Gabriel Tavarez da Silva',
        sub: '+500 pacientes',
        loc: 'Em Barueri, unidade Alphaville.',
        rating: 4.8, online: false, unread: 0,
        type: 'preconsulta',
        spec: 'Neurologia', icon: '🧠',
        apptDate: '02/11/2025 às 11:00',
    },
    {
        id: 'suporte',
        name: 'Suporte Care Plus',
        sub: 'Atendimento ao cliente',
        loc: 'Disponível 24h',
        rating: null, online: true, unread: 0,
        type: 'suporte',
        spec: null, icon: '🛟',
        apptDate: null,
    },
    {
        id: 'agendamento',
        name: 'Agendamento via Chat',
        sub: 'Marque sua consulta',
        loc: 'Resp. em até 5 min',
        rating: null, online: true, unread: 0,
        type: 'agendamento',
        spec: null, icon: '📅',
        apptDate: null,
    },
];  

const QUESTIONNAIRES = {
    preconsulta: [
        { key:'medicacao',   q:'Medicação uso contínuo?',          type:'yesno' },
        { key:'qual_med',    q:'Qual medicamento?',                  type:'text',  ifKey:'medicacao', ifVal:'Sim' },
        { key:'doenca_pre',  q:'Tem alguma doença pré existente?',  type:'yesno' },
        { key:'qual_doenca', q:'Qual doença?',                       type:'text',  ifKey:'doenca_pre', ifVal:'Sim' },
        { key:'alergias',    q:'Possui alergias?',                   type:'yesno' },
        { key:'qual_alergia',q:'A quê?',                             type:'text',  ifKey:'alergias', ifVal:'Sim' },
        { key:'sintomas',    q:'Tem algum sintoma específico hoje?', type:'text' },
        { key:'ultima_visita',q:'Quando foi sua última consulta?',  type:'text' },
    ],
};

const chatState = {};
CONTACTS.forEach(c => {
    chatState[c.id] = {
        messages: [],
        qIndex: 0,
        answers: {},
        questionnaireDone: false,
        pointsGiven: false,
    };
});

let activeId = null;

function buildContacts() {
    const el = document.getElementById('contactsList');
    CONTACTS.forEach(c => {
        const item = document.createElement('div');
        item.className = 'contact-item';
        item.id = `contact-${c.id}`;
        item.innerHTML = `
            <div class="contact-avatar">
                <i class="bi bi-person-fill"></i>
                ${c.online ? '<div class="online-dot"></div>' : ''}
            </div>
            <div class="contact-info">
                <div class="contact-name">${c.name}</div>
                <div class="contact-sub">${c.sub}</div>
                <div class="contact-loc">${c.loc}</div>
            </div>
            <div class="contact-meta">
                ${c.rating ? `<div class="rating-badge"><i class="bi bi-star-fill"></i>${c.rating}</div>` : ''}
                ${c.unread ? `<div class="unread-badge">${c.unread}</div>` : ''}
            </div>`;
        item.addEventListener('click', () => openChat(c.id));
        el.appendChild(item);
    });
}

function openChat(id) {
    activeId = id;
    const c = CONTACTS.find(x=>x.id===id);
    const st = chatState[id];

    document.querySelectorAll('.contact-item').forEach(el=>el.classList.remove('active'));
    document.getElementById(`contact-${id}`).classList.add('active');
    const badge = document.querySelector(`#contact-${id} .unread-badge`);
    if (badge) badge.remove();
    c.unread = 0;

    const panel = document.getElementById('chatPanel');
    panel.innerHTML = `
        <div class="chat-header">
            <div class="contact-avatar avatar">
                <i class="bi bi-person-fill"></i>
                ${c.online ? '<div class="online-dot"></div>' : ''}
            </div>
            <div class="info">
                <div class="name">${c.name}</div>
                <div class="sub">${c.sub}</div>
                <div class="loc">${c.loc}</div>
            </div>
            <div class="meta">
                <button class="btn-icon" title="Buscar"><i class="bi bi-search"></i></button>
                ${c.rating ? `<div class="rating-big"><i class="bi bi-star-fill"></i>${c.rating}</div>` : ''}
            </div>
        </div>
    
        <div class="messages-area" id="messagesArea"></div>
    
        <div class="input-bar">
            <input class="chat-input" id="chatInput" type="text" placeholder="Digite aqui…" autocomplete="off"/>
            <button class="btn-send" id="chatSendBtn"><i class="bi bi-send-fill"></i></button>
        </div>`;

    const area = document.getElementById('messagesArea');
    st.messages.forEach(m => renderMessage(m, area));

    if (c.type === 'preconsulta' && st.messages.length === 0) {
        setTimeout(() => startQuestionnaire(c, st, area), 400);
    } else if (c.type === 'suporte' && st.messages.length === 0) {
        setTimeout(() => addTheirMsg(st, area, 'Olá! Bem-vindo ao Suporte CarePlus. Como posso te ajudar hoje? 😊', true), 400);
    } else if (c.type === 'agendamento' && st.messages.length === 0) {
        setTimeout(() => addTheirMsg(st, area, 'Olá! Posso te ajudar a agendar uma consulta. Em qual especialidade você tem interesse?', true), 400);
    }

    const input   = document.getElementById('chatInput');
    const sendBtn = document.getElementById('chatSendBtn');
    const send = () => {
        const txt = input.value.trim(); if (!txt) return;
        input.value = '';
        addMyMsg(st, area, txt);
        handleTextAnswer(c, st, area, txt);
    };
    sendBtn.addEventListener('click', send);
    input.addEventListener('keydown', e => { if(e.key==='Enter') send(); });

    scrollBottom(area);
}

function startQuestionnaire(c, st, area) {
    const intro = `Olá! Sou o Dr. ${c.name.split(' ')[0]} 👨‍⚕️\n\nSua consulta de ${c.spec} está agendada para ${c.apptDate}.\n\nVou fazer algumas perguntas para preparar seu prontuário antecipado. Isso ajuda muito no atendimento e você ainda ganha **+5 Care Points**! 🏆`;
    addTheirMsg(st, area, intro, true);
    setTimeout(() => nextQuestion(c, st, area), 900);
}

function nextQuestion(c, st, area) {
    const qs = QUESTIONNAIRES.preconsulta;
    const idx = st.qIndex;

    let found = false;
    for (let i = idx; i < qs.length; i++) {
        const q = qs[i];
        // check conditional
        if (q.ifKey) {
            if (st.answers[q.ifKey] !== q.ifVal) {
                st.qIndex = i + 1; continue;
            }
        }
        st.qIndex = i;
        found = true;
        showQuestion(c, st, area, q);
        break;
    }

    if (!found && !st.questionnaireDone) {
        finishQuestionnaire(c, st, area);
    }
}

function showQuestion(c, st, area, q) {
    if (q.type === 'yesno') {
        showTyping(area, () => {
            const msg = buildQRMessage(c, st, area, q);
            renderMessage(msg, area);
            st.messages.push(msg);
            scrollBottom(area);
        });
    } else {
        addTheirMsg(st, area, q.q, true);
    }
}

function buildQRMessage(c, st, area, q) {
    return { type:'qr', from:'them', text:q.q, key:q.key, done:false, time:now() };
}

function handleTextAnswer(c, st, area, txt) {
    if (c.type !== 'preconsulta') {
        setTimeout(() => {
            addTheirMsg(st, area, 'Entendido! Nossa equipe já registrou sua solicitação. Em breve retornamos. 😊', true);
        }, 1000);
        return;
    }

    if (st.questionnaireDone) {
        setTimeout(() => addTheirMsg(st, area, 'Obrigado! Qualquer dúvida pode me enviar mensagem. Até logo! 👋', true), 1000);
        return;
    }

    const qs  = QUESTIONNAIRES.preconsulta;
    const idx = st.qIndex;
    if (idx >= qs.length) return;

    const q = qs[idx];
    if (q.type === 'text') {
        st.answers[q.key] = txt;
        st.qIndex++;
        setTimeout(() => nextQuestion(c, st, area), 500);
    }
}

function answerYesNo(contactId, key, val, btnEl) {
    const c  = CONTACTS.find(x=>x.id===contactId);
    const st = chatState[contactId];
    const area = document.getElementById('messagesArea');
    if (!area || activeId !== contactId) return;

    btnEl.closest('.qr-card').querySelectorAll('.qr-btn').forEach(b=>{ b.disabled=true; b.classList.remove('chosen'); });
    btnEl.classList.add('chosen');

    st.answers[key] = val;
    addMyMsg(st, area, val);

    const msgIdx = st.messages.findIndex(m=>m.type==='qr' && m.key===key);
    if (msgIdx>=0) st.messages[msgIdx].done = true;

    st.qIndex++;
    setTimeout(() => nextQuestion(c, st, area), 500);
}

function finishQuestionnaire(c, st, area) {
    st.questionnaireDone = true;
    showTyping(area, () => {
        addTheirMsg(st, area, 'Perfeito! Todas as informações foram registradas no seu prontuário. O Dr. '+c.name.split(' ')[0]+' vai poder te atender com muito mais eficiência! 🙌', true);
    
        setTimeout(() => {
            if (!st.pointsGiven) {
                st.pointsGiven = true;
                const toast = { type:'points', from:'system', time:now() };
                st.messages.push(toast);
                renderMessage(toast, area);
                scrollBottom(area);
            }

            setTimeout(() => {
                const pr = { type:'prontuario', from:'system', time:now(), contact:c };
                st.messages.push(pr);
                renderMessage(pr, area);
                scrollBottom(area);
            }, 600);
        }, 800);
    });
}

function now() {
    return new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
}

function addTheirMsg(st, area, text, animate) {
    showTyping(area, () => {
        const msg = { type:'text', from:'them', text, time:now() };
        st.messages.push(msg);
        renderMessage(msg, area);
        scrollBottom(area);
    }, animate ? 700 : 0);
}

function addMyMsg(st, area, text) {
    const msg = { type:'text', from:'me', text, time:now() };
    st.messages.push(msg);
    renderMessage(msg, area);
    scrollBottom(area);
}

function showTyping(area, cb, delay=700) {
    if (!area) { setTimeout(cb,0); return; }
    const row = document.createElement('div');
    row.className = 'msg-row from-them';
    row.id = 'typingRow';
    row.innerHTML = `
        <div class="msg-avatar"><i class="bi bi-person-fill"></i></div>
        <div class="typing-ind"><span></span><span></span><span></span></div>`;
    area.appendChild(row);
    scrollBottom(area);
    setTimeout(() => {
        const existing = document.getElementById('typingRow');
        if (existing) existing.remove();
        cb();
    }, delay);
}

function renderMessage(msg, area) {
    if (!area) return;
    const el = document.createElement('div');
    el.style.animation = 'msgIn .3s cubic-bezier(.22,1,.36,1) both';

    if (msg.type === 'text') {
        el.className = `msg-row from-${msg.from}`;
        const avatarHTML = msg.from==='them'
            ? `<div class="msg-avatar"><i class="bi bi-person-fill"></i></div>`
            : `<div class="msg-avatar" style="background:linear-gradient(135deg,#0058a0,#001f3f);"><i class="bi bi-person-fill" style="font-size:14px;"></i></div>`;
        el.innerHTML = `
            ${msg.from==='them' ? avatarHTML : ''}
            <div class="msg-content">
                <div class="bubble">${msg.text.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br>')}</div>
                <div class="msg-time">${msg.from==='them'?'Doutor':'Você'} • ${msg.time}</div>
            </div>
            ${msg.from==='me' ? avatarHTML : ''}`;
    }

    else if (msg.type === 'qr') {
        el.className = 'msg-row from-them';
        const disabled = msg.done ? 'disabled' : '';
        const chosenSim = msg.done && chatState[activeId]?.answers[msg.key]==='Sim' ? 'chosen' : '';
        const chosenNao = msg.done && chatState[activeId]?.answers[msg.key]==='Não' ? 'chosen' : '';
        el.innerHTML = `
            <div class="msg-avatar"><i class="bi bi-person-fill"></i></div>
            <div class="msg-content">
                <div class="bubble">${msg.text}</div>
                <div class="qr-card">
                    <div class="qr-label">Selecione uma opção:</div>
                    <div class="qr-btns">
                        <button class="qr-btn ${chosenSim}" ${disabled} onclick="answerYesNo('${activeId}','${msg.key}','Sim',this)">Sim</button>
                        <button class="qr-btn ${chosenNao}" ${disabled} onclick="answerYesNo('${activeId}','${msg.key}','Não',this)">Não</button>
                    </div>
                </div>
                <div class="msg-time">Doutor • ${msg.time}</div>
            </div>`;
    }

    else if (msg.type === 'points') {
        el.className = 'msg-row from-them';
        el.innerHTML = `
            <div style="width:100%;display:flex;justify-content:center;">
                <div class="points-toast">
                    <i class="bi bi-star-fill"></i>
                    Você ganhou +5 Care Points por preencher o prontuário! 🎉
                </div>
            </div>`;
    }

    else if (msg.type === 'prontuario') {
        el.className = 'msg-row from-them';
        el.innerHTML = `
            <div class="msg-avatar"><i class="bi bi-person-fill"></i></div>
            <div class="msg-content">
                <div class="prontuario-ready" onclick="downloadProntuario('${msg.contact.id}')">
                    <i class="bi bi-file-earmark-medical-fill"></i>
                    <div>
                        <div style="font-size:14px;">Prontuário pré-consulta gerado!</div>
                        <div style="font-size:11px;color:rgba(255,255,255,.5);font-weight:400;margin-top:2px;">Clique para baixar o PDF</div>
                    </div>
                    <i class="bi bi-download" style="margin-left:auto;font-size:18px;"></i>
                </div>
                <div class="msg-time">Doutor • ${msg.time}</div>
            </div>`;
    }

    area.appendChild(el);
}

function scrollBottom(area) {
    if (area) setTimeout(()=>{ area.scrollTop = area.scrollHeight; }, 50);
}

function downloadProntuario(contactId) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' });
    const c   = CONTACTS.find(x=>x.id===contactId);
    const st  = chatState[contactId];
    const W   = 210;

    doc.setFillColor(0,121,200);
    doc.roundedRect(0,0,W,38,0,0,'F');
    doc.setTextColor(255,255,255);
    doc.setFontSize(20); doc.setFont('helvetica','bold');
    doc.text('CarePlus', 14, 20);
    doc.setFontSize(9); doc.setFont('helvetica','normal');
    doc.setTextColor(180,220,255);
    doc.text('Part of Bupa', 14, 28);
    doc.setFontSize(14); doc.setFont('helvetica','bolditalic');
    doc.setTextColor(255,255,255);
    doc.text('Prontuário Pré-Consulta', W-14, 22, {align:'right'});

    doc.setFillColor(0,30,60);
    doc.roundedRect(14,46,W-28,220,6,6,'F');

    doc.setFontSize(16); doc.setFont('helvetica','bold'); doc.setTextColor(255,255,255);
    doc.text('Dados do Paciente', 24, 62);
    doc.setDrawColor(0,121,200); doc.setLineWidth(.6);
    doc.line(24,66,W-24,66);

    const basics = [
        ['Paciente','William Souza'],
        ['Especialidade', c.spec || '—'],
        ['Médico', 'Dr. '+c.name],
        ['Consulta', c.apptDate || '—'],
        ['Data do prontuário', new Date().toLocaleDateString('pt-BR')],
    ];
    let y = 76;
    basics.forEach(([l,v])=>{
        doc.setFontSize(10); doc.setFont('helvetica','normal'); doc.setTextColor(150,200,240);
        doc.text(l+':', 24, y);
        doc.setTextColor(255,255,255); doc.setFont('helvetica','bold');
        doc.text(v, 80, y);
        y += 11;
    });

    y += 6;
    doc.setFontSize(14); doc.setFont('helvetica','bold'); doc.setTextColor(255,255,255);
    doc.text('Respostas do Questionário', 24, y); y+=8;
    doc.setDrawColor(0,121,200); doc.line(24,y,W-24,y); y+=10;

    const QS = QUESTIONNAIRES.preconsulta;
    QS.forEach(q=>{
        const ans = st.answers[q.key];
        if (!ans) return;
        doc.setFontSize(10); doc.setFont('helvetica','normal'); doc.setTextColor(150,200,240);
        doc.text(q.q, 24, y);
        doc.setTextColor(255,255,255); doc.setFont('helvetica','bold');
        doc.text(String(ans), 24, y+7);
        y += 18;
    });

    doc.setFillColor(0,59,98);
    doc.roundedRect(0,280,W,17,0,0,'F');
    doc.setFontSize(8); doc.setFont('helvetica','normal'); doc.setTextColor(150,200,240);
    doc.text(`Gerado em ${new Date().toLocaleDateString('pt-BR')} • CarePlus – Part of Bupa`, W/2, 290, {align:'center'});

    doc.save(`prontuario-preconsulta-${c.id}.pdf`);
}  

buildContacts();  