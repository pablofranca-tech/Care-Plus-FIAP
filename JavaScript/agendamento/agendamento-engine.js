function _resolveRoot(path) {
    const segs = window.location.pathname.split('/').filter(Boolean);
    const ups = Math.max(0, segs.length - 1);
    return '../'.repeat(ups) + path.replace(/^\//, '');
}
const specialties = [
    'Cardiologia','Cirurgia Geral','Cirurgia Plástica','Clínica Médica',
    'Dermatologia','Endocrinologia','Gastroenterologia','Geriatria','Ginecologia',
    'Hematologia','Infectologia','Mastologia','Nefrologia','Neurologia','Nutrologia',
    'Odontologia','Oftalmologia','Oncologia','Ortopedia e Traumatologia','Otorrinolaringologia',
    'Pediatria','Pneumologia','Psicologia','Psiquiatria','Reumatologia','Urologia',
];

const DOC_NAMES = [
    ['Miguel Paulo G. Cenizo', 500, 4.8, '/assets/images/fotodoutor1.png'],
    ['Carlos Henrique Almeida', 400, 4.9, '/assets/images/fotodoutor2.png'],
    ['Gabriel Tavarez da Silva', 500, 4.8, '/assets/images/fotodoutor3.png'],
];

let agendamentoState = {
    especialidade: null,
    medico: null,
    data: null,
    hora: null
};

function abrirAgendamentoHub() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('show'));
    const container = document.getElementById('agendamento-container');
    if (!container) return;
    container.innerHTML = injetarTemplateHub();
    container.classList.add('show');
}

function fecharAgendamentoHub() {
    const container = document.getElementById('agendamento-container');
    if (container) {
        container.classList.remove('show');
        
        container.style.display = 'none';
        container.style.opacity = '0';
        container.style.visibility = 'hidden';
        container.style.pointerEvents = 'none';
        container.classList.remove('open', 'show');
        document.body.style.overflow = '';
        container.removeAttribute('data-mode');

        setTimeout(() => {
            container.innerHTML = '';
        }, 300);
    }
    agendamentoState.especialidade = null;
}

function fecharEspecialidades() {
    fecharAgendamentoHub();
}

function irParaEspecialidades() {
    const container = document.getElementById('agendamento-container');
    if (!container) return;
    const url = new URL(window.location);
    if (url.searchParams.has('telemedicina')) {
        url.searchParams.delete('telemedicina');
        window.history.replaceState({}, document.title, url.pathname);
    }
    container.innerHTML = injetarTemplateEspecialidades();
    renderList();
    setTimeout(() => document.getElementById('searchInput')?.focus(), 350);
    document.getElementById('searchInput')?.addEventListener('input', (e) => renderList(e.target.value));
}

function irParaTelemedicina() {
    const container = document.getElementById('agendamento-container');
    if (!container) return;
    container.innerHTML = injetarTemplateEspecialidades();
    const titulo = container.querySelector('h3');
    if(titulo) titulo.innerText = "Telemedicina: Escolha a Especialidade";
    container.setAttribute('data-mode', 'telemedicina');
    renderList();
    container.classList.add('open', 'show');
    document.body.style.overflow = 'hidden';
    setTimeout(() => document.getElementById('searchInput')?.focus(), 350);
    document.getElementById('searchInput')?.addEventListener('input', (e) => renderList(e.target.value));
}

function voltarParaHub() {
    abrirAgendamentoHub();
}

function groupByLetter(list) {
    return list.reduce((acc, s) => {
        const l = s[0].toUpperCase();
        if (!acc[l]) acc[l] = [];
        acc[l].push(s); return acc;
    }, {});
}

function renderList(filter = '') {
    const container = document.getElementById('specialtyList');
    const hubContainer = document.getElementById('agendamento-container');
    if(!container) return;

    const params = new URLSearchParams(window.location.search);
    const isTelemedicina = (params.get('telemedicina') === 'true') || (hubContainer?.getAttribute('data-mode') === 'telemedicina');
    
    const q = filter.toLowerCase().trim();
    const filtered = q ? specialties.filter(s => s.toLowerCase().includes(q)) : specialties;

    if (!filtered.length) {
        container.innerHTML = '<p class="no-results">Nenhuma especialidade encontrada.</p>';
        return;
    }

    const grouped = groupByLetter(filtered);
    const letters = Object.keys(grouped).sort();
    const half = Math.ceil(letters.length / 2);
    const left  = letters.slice(0, half);
    const right = letters.slice(half);

    function buildCol(keys) {
        return keys.map(l =>
            `<div>
                <span class="spec-letter">${l}</span>
                ${grouped[l].map(s => {
                    if (isTelemedicina) {
                        const msgWhatsApp = "Olá! Sou o William Silva e preciso iniciar uma teleconsulta de urgência na área de *" + s + "* pelo CarePlus.";
                        return `<a class="spec-item spec-telemedicina" href="https://wa.me/5511999999999?text=${encodeURIComponent(msgWhatsApp)}" target="_blank">
                                    <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                                        <span>${s}</span><i class="bi bi-whatsapp" style="color: #4ADE80; font-size: 16px;"></i>
                                    </div>
                                </a>`;
                    } else {
                        return `<a class="spec-item" onclick="selecionarEspecialidade('${s}')">${s}</a>`;
                    }
                }).join('')}
            </div>`
        ).join('');
    }

    container.innerHTML = `
        <div class="col-list">${buildCol(left)}</div>
        <div class="col-list">${buildCol(right)}</div>
    `;
}

function selecionarEspecialidade(especialidadeEscolhida) {
    agendamentoState.especialidade = especialidadeEscolhida;
    const container = document.getElementById('agendamento-container');
    if (!container) return;

    container.innerHTML = injetarTemplateMedicos(especialidadeEscolhida);

    const grid = document.getElementById('doctorsGridModal');
    grid.innerHTML = '';
    
    for (let i = 0; i < 3; i++) {
        grid.appendChild(makeCard(i, especialidadeEscolhida));
    }
}

function abrirFavoritos() {
    const container = document.getElementById('agendamento-container');
    if (!container) return;

    container.innerHTML = injetarTemplateFavoritos();

    const grid = document.getElementById('favoritosGridModal');
    grid.innerHTML = '';

    const meusFavoritos = [
        { idMedico: 0, especialidade: 'Odontologia' },
        { idMedico: 1, especialidade: 'Cardiologia' }
    ];

    meusFavoritos.forEach(fav => {
        grid.appendChild(makeCard(fav.idMedico, fav.especialidade));
    });
}

function makeCard(docIdx, spec) {
    const [name, count, rating, photo] = DOC_NAMES[docIdx];
    const id = `modal-doc-${docIdx}`;

    const today = new Date();
    let curYear  = today.getFullYear();
    let curMonth = today.getMonth();

    const card = document.createElement('div');
    card.className = 'doctor-card';
    card.style.animationDelay = `${.1 + docIdx * .12}s`;

    function renderCard() {
        const { firstDow, days } = buildMonthData(curYear, curMonth, docIdx);
        const resolvedPhoto = photo && photo.startsWith('/') ? _resolveRoot(photo) : photo;
                const avatarHTML = resolvedPhoto 
            ? `<img src="${resolvedPhoto}" alt="${name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`
            : `<i class="bi bi-person-fill"></i>`;

        const emptyCells = Array(firstDow).fill('<div class="cal-day empty"></div>').join('');
        const dayCells   = days.map(({ day, status }) =>
            `<div class="cal-day ${status}" data-day="${day}" data-doc="${docIdx}" ${status==='avail' ? 'role="button" tabindex="0" aria-label="Dia '+day+', disponível"' : ''}>${day}</div>`
        ).join('');

        card.innerHTML = `
            <div class="doc-info">
                <div class="doc-avatar">${avatarHTML}</div>
                <div class="doc-details">
                    <div class="doc-name">${name}</div>
                    <div class="doc-count">+${count} pacientes</div>
                    <div class="doc-loc">Em Barueri, unidade Alphaville.</div>
                </div>
                <div class="doc-rating"><i class="bi bi-star-fill"></i>${rating}</div>
            </div>

            <div>
                <div class="cal-header">
                    <button class="cal-nav" id="prev-${id}" aria-label="Mês anterior"><i class="bi bi-arrow-left"></i></button>
                    <span class="cal-month">${MONTHS_PT[curMonth]} ${curYear}</span>
                    <button class="cal-nav" id="next-${id}" aria-label="Próximo mês"><i class="bi bi-arrow-right"></i></button>
                </div>
                <div class="cal-grid">
                    ${DAYS_PT.map(d=>`<div class="cal-dow">${d}</div>`).join('')}
                    ${emptyCells}${dayCells}
                </div>
            </div>

            <div class="hours-popup" id="popup-${id}">
                <div class="hours-title" id="popup-title-${id}">Horários Disponíveis</div>
                <div class="hours-grid" id="popup-grid-${id}"></div>
                <div class="confirm-bar" id="confirm-bar-${id}">
                    <button class="btn-confirm" id="btn-confirm-${id}">Confirmar Agendamento</button>
                </div>
            </div>

            <div class="cal-legend">
                <div class="legend-item"><div class="legend-dot" style="background:var(--avail);"></div>Disponível</div>
                <div class="legend-item"><div class="legend-dot" style="background:var(--unavail);"></div>Indisponível</div>
                <div class="legend-item"><div class="legend-dot" style="background:var(--holiday);"></div>Feriado</div>
            </div>
        `;

        attachCalEvents();
    }

    function attachCalEvents() {
        card.querySelector(`#prev-${id}`).addEventListener('click', () => {
            closePopup();
            if (curMonth === 0) { curMonth=11; curYear--; } else curMonth--;
            renderCard();
        });
        card.querySelector(`#next-${id}`).addEventListener('click', () => {
            closePopup();
            if (curMonth === 11) { curMonth=0; curYear++; } else curMonth++;
            renderCard();
        });

        card.querySelectorAll('.cal-day.avail').forEach(el => {
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                card.querySelectorAll('.cal-day.selected').forEach(d => d.classList.remove('selected'));
                el.classList.add('selected');
                openPopup(parseInt(el.dataset.day));
            });
        });
    }

    function openPopup(day) {
        const popup      = card.querySelector(`#popup-${id}`);
        const grid       = card.querySelector(`#popup-grid-${id}`);
        const title      = card.querySelector(`#popup-title-${id}`);
        const confirmBar = card.querySelector(`#confirm-bar-${id}`);
        const confirmBtn = card.querySelector(`#btn-confirm-${id}`);

        title.textContent = `Horários – ${day}/${curMonth+1}/${curYear}`;
        const slots = buildSlots(curYear, curMonth, day, docIdx);
        let selectedHour = null;

        grid.innerHTML = slots.map(s =>
            `<button class="hour-btn ${s.avail?'h-avail':'h-unavail'}" ${!s.avail?'disabled':''} data-time="${s.time}">${s.time}</button>`
        ).join('');

        confirmBar.classList.remove('show');

        grid.querySelectorAll('.hour-btn.h-avail').forEach(btn => {
            btn.addEventListener('click', () => {
                grid.querySelectorAll('.hour-btn').forEach(b=>b.classList.remove('selected'));
                btn.classList.add('selected');
                selectedHour = btn.dataset.time;
                confirmBar.classList.add('show');
                confirmBtn.onclick = () => confirmBooking(docIdx, day, curMonth, curYear, selectedHour, spec);
            });
        });

        popup.classList.add('show');
    }

    function closePopup() {
        const popup = card.querySelector(`#popup-${id}`);
        if (popup) popup.classList.remove('show');
        card.querySelectorAll('.cal-day.selected').forEach(d=>d.classList.remove('selected'));
    }

    const modalContainer = document.getElementById('agendamento-container');
    if(modalContainer) {
        modalContainer.addEventListener('click', e => {
            if (!card.contains(e.target)) closePopup();
        });
    }

    renderCard();
    return card;
}

function confirmBooking(docIdx, day, month, year, hour, spec) {
    const dataFormatada = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const paciente = "William Silva"; 
    
    const queryParams = new URLSearchParams({
        paciente: paciente,
        data: dataFormatada,
        hora: hour,
        doc: docIdx,
        spec: spec,
        status: 'success'
    });

    window.location.href = _resolveRoot('/pages/agendamento/confirmacao.html') + '?' + queryParams.toString();
}

window.abrirAgendamentoHub = abrirAgendamentoHub;
window.fecharAgendamentoHub = fecharAgendamentoHub;
window.irParaEspecialidades = irParaEspecialidades;
window.voltarParaHub = voltarParaHub;
window.selecionarEspecialidade = selecionarEspecialidade;
window.irParaTelemedicina = irParaTelemedicina;

window.abrirFavoritos = function() {
    console.log("Chamando abrirFavoritos...");
    const container = document.getElementById('agendamento-container');
    
    if (!container) {
        console.error("ERRO: agendamento-container não encontrado!");
        return;
    }

    container.style.display = 'flex';
    container.style.opacity = '1';
    container.style.visibility = 'visible';
    container.classList.add('show');

    container.innerHTML = injetarTemplateFavoritos();

    const grid = document.getElementById('favoritosGridModal');
    if (grid) {
        grid.innerHTML = '';
        grid.appendChild(makeCard(0, 'Odontologia'));
        grid.appendChild(makeCard(1, 'Cardiologia'));
    }
};