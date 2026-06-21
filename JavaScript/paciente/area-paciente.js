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
    
    // Adicionar classe ao body para overlay no mobile
    if (window.innerWidth <= 768) {
        document.body.classList.toggle('sidebar-open', exp);
    }
});
document.addEventListener('click', e => {
    if (window.innerWidth<=768 && sidebar.classList.contains('expanded') && !sidebar.contains(e.target))
        { 
            sidebar.classList.remove('expanded');
            document.body.classList.remove('sidebar-open');
            toggleBtn.querySelector('i').className='bi bi-list'; 
        }
});

document.getElementById('btnSettings').addEventListener('click', () => openModal('settings'));

const MODALS = { dados:'modalDados', plano:'modalPlano', settings:'modalSettings' };

function buildEmailFromName(fullName) {
    const firstName = (fullName || '').trim().split(' ')[0] || 'usuario';
    const normalized = firstName.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z]/g, '');
    const safeName = normalized || firstName.toLowerCase().replace(/[^a-z]/g, '');
    return `${safeName || 'usuario'}@gmail.com`;
}

function populateDadosModal() {
    const fullNameInput = document.getElementById('inputFullName');
    const emailInput = document.getElementById('inputEmail');
    const storedName = localStorage.getItem('nome') || 'William Souza';
    const storedEmail = localStorage.getItem('email') || buildEmailFromName(storedName);

    if (fullNameInput) fullNameInput.value = storedName;
    if (emailInput) emailInput.value = storedEmail;
}

function updateProfileDisplay() {
    const storedName = localStorage.getItem('nome') || 'William Souza';
    const profileName = document.querySelector('.profile-name');
    if (profileName) profileName.textContent = storedName;
}

function openModal(key) {
    const id = MODALS[key];
    const el = document.getElementById(id);
    if (el) {
        if (key === 'dados') populateDadosModal();
        el.classList.add('open'); 
        el.style.display = 'flex';
        document.body.style.overflow='hidden'; 
    }
}

function closeModal(key) {
    const id = MODALS[key] || key;
    const el = document.getElementById(id);
    if (el) {
        el.classList.remove('open'); 
        el.style.display = 'none'; 
        document.body.style.overflow=''; 
    }
}

document.querySelectorAll('.modal-box .modal-close').forEach(btn => {
    btn.onclick = function(e) {
        e.preventDefault();
        const modalId = this.closest('.modal-overlay').id;
        closeModal(modalId);
    };
});

Object.values(MODALS).forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener('click', e => { if (e.target === el) closeModal(Object.keys(MODALS).find(k=>MODALS[k]===id)); });
});
document.addEventListener('keydown', e => {
    if (e.key === 'Escape')
        Object.keys(MODALS).forEach(k => document.getElementById(MODALS[k]).classList.remove('open'));
    document.body.style.overflow = '';
});

const APPT_ANDAMENTO = [
    { icon:'🦷', spec:'Odontologia',     doc:'Dr. Miguel Paulo G. Cenizo',   date:'Amanhã, 17/10/2025 • 15:00',  status:'active',   label:'Confirmado' },
    { icon:'❤️', spec:'Cardiologia',     doc:'Dr. Carlos Henrique Almeida',  date:'25/10/2025 • 09:00',          status:'active',   label:'Confirmado' },
    { icon:'🧠', spec:'Neurologia',      doc:'Dra. Ana Beatriz Ferreira',    date:'02/11/2025 • 11:00',          status:'active',   label:'Aguardando' },
];
const APPT_HISTORICO = [
    { icon:'🩺', spec:'Clínica Médica',  doc:'Dr. Roberto Lima',             date:'10/09/2025 • 10:00',          status:'done',     label:'Realizado'  },
    { icon:'🧴', spec:'Dermatologia',    doc:'Dra. Juliana Matos',           date:'05/08/2025 • 14:00',          status:'done',     label:'Realizado'  },
    { icon:'🌸', spec:'Ginecologia',     doc:'Dra. Patrícia Alves',          date:'22/07/2025 • 09:30',          status:'canceled', label:'Cancelado'  },
];

let curTab = 'andamento';
let searchTerm = '';

function renderAppts(tab, search = '') {
    let list = tab === 'andamento' ? APPT_ANDAMENTO : APPT_HISTORICO;
    const el = document.getElementById('apptList');

    if (search.trim() !== '') {
        const term = search.toLowerCase();
        list = list.filter(a => 
            a.spec.toLowerCase().includes(term) || 
            a.doc.toLowerCase().includes(term) ||
            a.date.toLowerCase().includes(term)
        );
    }

    if (!list.length) {
        el.innerHTML = `<div class="empty-state">
            <i class="bi bi-search" style="font-size: 32px; color: rgba(255,255,255,0.3); margin-bottom: 12px;"></i>
            <div>Nenhum resultado encontrado.</div>
        </div>`;
        return;
    }

el.innerHTML = list.map((a,i) => {
        const docIdx = a.doc.includes('Miguel') ? 0 : a.doc.includes('Carlos') ? 1 : 2;
        
        const urlParams = new URLSearchParams({
            paciente: "William Silva", 
            spec: a.spec,
            doc: docIdx,
            date: a.date.split('•')[0].trim(),
            hora: a.date.split('•')[1].trim()
        });

        return `
        <div class="appt-item" style="animation:fadeUp .4s ${.05+i*.08}s cubic-bezier(.22,1,.36,1) both;">
            <div class="appt-icon">${a.icon}</div>
            <div class="appt-info">
                <div class="appt-spec">${a.spec}</div>
                <div class="appt-doc">${a.doc}</div>
                <div class="appt-date"><i class="bi bi-calendar3" style="font-size:10px;margin-right:4px;"></i>${a.date}</div>
            </div>
            <span class="appt-status status-${a.status}">${a.label}</span>
            ${tab==='andamento' ? 
                `<button class="appt-btn" onclick="window.location.href=_resolveRoot('/pages/agendamento/confirmacao.html') + '?${urlParams.toString()}'">
                    <i class="bi bi-eye"></i> Ver
                </button>` : ''}
        </div>
    `;}).join('');
}

function switchTab(tab) {
    curTab = tab;
    document.getElementById('tabAndamento').className = 'tab-btn' + (tab==='andamento' ? ' active':'');
    document.getElementById('tabHistorico').className = 'tab-btn' + (tab==='historico' ? ' active':'');
    renderAppts(curTab, searchTerm); 
}

function initDashboard() {
    updateProfileDisplay();

    const countEl = document.getElementById('countAppts');
    if (countEl) countEl.textContent = APPT_ANDAMENTO.length;

    renderAppts('andamento');

    const searchInput = document.getElementById('searchAppt');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchTerm = e.target.value;
            renderAppts(curTab, searchTerm);
        });

        searchInput.addEventListener('focus', () => searchInput.style.borderColor = 'rgba(0,121,200,0.8)');
        searchInput.addEventListener('blur', () => searchInput.style.borderColor = 'rgba(255,255,255,0.15)');
    }
}

initDashboard();

const _origOpen = openModal;
window.openModal = function(key) {
    _origOpen(key);
    if (key === 'plano') {
        setTimeout(() => {
            const circle = document.getElementById('progressCircle');
            if (circle) {
                circle.style.strokeDashoffset = '188.5';
                setTimeout(() => { circle.style.strokeDashoffset = '37.7'; }, 80);
            }
        }, 100);
    }
};

function triggerUpgradeAnim() {
    const arrow = document.getElementById('upgradeArrow');
    if (arrow) { arrow.style.transform = 'translateY(-50%) scale(1.2)'; setTimeout(()=>{ arrow.style.transform='translateY(-50%)'; },200); }
    const ov = document.getElementById('upgradeOverlay');
    if (ov) { ov.style.display='flex'; }
}
function closeUpgrade() {
    const ov = document.getElementById('upgradeOverlay');
    if (ov) ov.style.display='none';
}

function tryResgatar() {
    const btn = document.getElementById('btnResgatar');
    if (!btn) return;
    btn.innerHTML = `<i class="bi bi-lock-fill"></i> Faltam 10 pts para resgatar`;
    btn.style.background = 'rgba(239,68,68,.15)';
    btn.style.color = '#FCA5A5';
    btn.style.borderColor = 'rgba(239,68,68,.3)';
    setTimeout(() => {
        btn.innerHTML = `<i class="bi bi-lock-fill"></i> Resgatar`;
        btn.style.background = 'rgba(255,255,255,.12)';
        btn.style.color = 'rgba(255,255,255,.5)';
        btn.style.borderColor = 'rgba(255,255,255,.18)';
    }, 2200);
}

const btnSaveDados = document.getElementById('btnSaveDados');
if (btnSaveDados) {
    btnSaveDados.addEventListener('click', (e) => {
        e.preventDefault();
        const fullNameInput = document.getElementById('inputFullName');
        const emailInput = document.getElementById('inputEmail');

        const fullName = (fullNameInput?.value || '').trim() || 'Usuário';
        const email = (emailInput?.value || '').trim() || buildEmailFromName(fullName);

        localStorage.setItem('nome', fullName);
        localStorage.setItem('email', email);
        updateProfileDisplay();
        closeModal('dados');
    });
}

document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const r = document.createElement('span');
        r.className = 'ripple-circle';
        r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px`;
        this.appendChild(r);
        setTimeout(()=>r.remove(),600);
    });
});

if (window.matchMedia('(hover:hover)').matches) {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const r = btn.getBoundingClientRect();
            const dx = (e.clientX - r.left - r.width/2)  / r.width  * 10;
            const dy = (e.clientY - r.top  - r.height/2) / r.height * 10;
            btn.style.transform = `translateY(-5px) scale(1.02) translate(${dx}px,${dy}px)`;
        });
        btn.addEventListener('mouseleave', () => { btn.style.transform=''; });
    });
}