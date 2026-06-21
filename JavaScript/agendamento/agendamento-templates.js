function _resolveRoot(path) {
    const segs = window.location.pathname.split('/').filter(Boolean);
    const ups = Math.max(0, segs.length - 1);
    return '../'.repeat(ups) + path.replace(/^\//, '');
}

const SPEC_META = {
    'Cardiologia':            { icon:'❤️',  label:'Cardiologia' },
    'Cirurgia Geral':         { icon:'🔪',  label:'Cirurgia Geral' },
    'Cirurgia Plástica':      { icon:'✨',  label:'Cirurgia Plástica' },
    'Clínica Médica':         { icon:'🩺',  label:'Clínica Médica' },
    'Dermatologia':           { icon:'🧴',  label:'Dermatologia' },
    'Endocrinologia':         { icon:'⚗️',  label:'Endocrinologia' },
    'Gastroenterologia':      { icon:'🫀',  label:'Gastroenterologia' },
    'Geriatria':              { icon:'🧓',  label:'Geriatria' },
    'Ginecologia':            { icon:'🌸',  label:'Ginecologia' },
    'Hematologia':            { icon:'🩸',  label:'Hematologia' },
    'Infectologia':           { icon:'🦠',  label:'Infectologia' },
    'Mastologia':             { icon:'🎗️',  label:'Mastologia' },
    'Nefrologia':             { icon:'💧',  label:'Nefrologia' },
    'Neurologia':             { icon:'🧠',  label:'Neurologia' },
    'Nutrologia':             { icon:'🥗',  label:'Nutrologia' },
    'Odontologia':            { icon:'🦷',  label:'Odontologia' },
    'Oftalmologia':           { icon:'👁️',  label:'Oftalmologia' },
    'Oncologia':              { icon:'🎗️',  label:'Oncologia' },
    'Ortopedia e Traumatologia':{ icon:'🦴', label:'Ortopedia' },
    'Otorrinolaringologia':   { icon:'👂',  label:'Otorrino' },
    'Pediatria':              { icon:'👶',  label:'Pediatria' },
    'Pneumologia':            { icon:'🫁',  label:'Pneumologia' },
    'Psicologia':             { icon:'🧩',  label:'Psicologia' },
    'Psiquiatria':            { icon:'💆',  label:'Psiquiatria' },
    'Reumatologia':           { icon:'🦵',  label:'Reumatologia' },
    'Urologia':               { icon:'🔬',  label:'Urologia' },
};

function injetarTemplateHub() {
    return `
        <button class="modal-close" onclick="fecharAgendamentoHub()">
            <i class="bi bi-x-lg"></i>
        </button>
        <div class="modal-box" style="max-width: 600px;">
            <div class="modal-head" style="border: none; padding-bottom: 0;">
                <h3 style="font-size: 24px;">Como deseja agendar hoje?</h3>
            </div>
            <div class="modal-body">
                <p style="color: rgba(255,255,255,0.6); font-size: 14px; margin-bottom: 24px;">
                    Escolha a forma mais prática para você:
                </p>
                <div class="agendamento-options-grid">
                    
                    <button class="hub-card primary" onclick="irParaEspecialidades()">
                        <div class="hub-icon"><i class="bi bi-calendar2-check"></i></div>
                        <div class="hub-info">
                            <strong>Escolher Especialidade</strong>
                            <span>Agendamento presencial ou clínico</span>
                        </div>
                        <i class="bi bi-chevron-right"></i>
                    </button>

                    <button class="hub-card" onclick="irParaTelemedicina()">
                        <div class="hub-icon" style="color: #7DD3FC;"><i class="bi bi-camera-video-fill"></i></div>
                        <div class="hub-info">
                            <strong>Telemedicina</strong>
                            <span>Fale com um clínico especializado</span>
                        </div>
                    </button>

                    <button class="hub-card" onclick="window.location.href=_resolveRoot('/pages/paciente/chat.html')">
                        <div class="hub-icon"><i class="bi bi-chat-dots"></i></div>
                        <div class="hub-info">
                            <strong>Agendar via Chat</strong>
                            <span>Fale com nossa central</span>
                        </div>
                    </button>

                    <a href="https://wa.me/551140040000" target="_blank" class="hub-card" style="text-decoration: none;">
                        <div class="hub-icon" style="color: #4ADE80;"><i class="bi bi-whatsapp"></i></div>
                        <div class="hub-info" style="color: #fff;">
                            <strong>Falar no WhatsApp</strong>
                            <span>Central de atendimento direta</span>
                        </div>
                    </a>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 8px;">
                        <a href="tel:08000000000" class="hub-card-mini" onclick="alert('Simulando abertura do discador: 0800-000-0000')">
                            <i class="bi bi-telephone"></i> Ligação Direta
                        </a>
                        <button class="hub-card-mini" onclick="abrirFavoritos()">
                            <i class="bi bi-star"></i> Meus Favoritos
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function injetarTemplateEspecialidades() {
    return `
        <div class="modal-box" style="max-width: 680px; height: 85vh; display: flex; flex-direction: column;">
            <div class="modal-head" style="padding: 24px 28px 16px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.12);">
                <div style="display: flex; align-items: center; gap: 16px;">
                    <button onclick="voltarParaHub()" style="background: transparent; border: none; color: var(--info); font-size: 20px; cursor: pointer; transition: 0.2s;" onmouseover="this.style.transform='translateX(-4px)'" onmouseout="this.style.transform='none'">
                        <i class="bi bi-arrow-left"></i>
                    </button>
                    <h3 style="font-size: 20px; color: #fff; margin: 0;">Especialidades</h3>
                </div>
                <button class="modal-close" onclick="fecharAgendamentoHub()" style="position: static; padding: 0;">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
            <div class="modal-search" style="padding: 16px 28px; flex-shrink: 0;">
                <div class="search-wrap" style="display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.92); border-radius: 40px; padding: 10px 18px; box-shadow: 0 2px 12px rgba(0,0,0,0.15);">
                    <i class="bi bi-list" style="color: var(--blue-dark); font-size: 18px;"></i>
                    <input type="text" id="searchInput" placeholder="Digite a especialidade" autocomplete="off" style="border: none; background: transparent; outline: none; flex: 1; font-family: 'Montserrat', sans-serif; font-size: 15px; color: var(--blue-dark);" />
                    <i class="bi bi-search" style="color: var(--blue-dark); font-size: 18px;"></i>
                </div>
            </div>
            <div class="modal-list-inner" id="specialtyList" style="flex: 1; overflow-y: auto; padding: 0 28px 24px; display: grid; grid-template-columns: 1fr 1fr; gap: 0 28px;">
                </div>
        </div>
    `;
}

function injetarTemplateMedicos(especialidade) {
    const meta = SPEC_META[especialidade] || { icon:'🩺', label: especialidade };

    return `
        <div class="modal-box" style="max-width: 900px; height: 85vh; display: flex; flex-direction: column;">
            
            <div class="modal-head" style="padding: 24px 28px 16px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.12);">
                <div style="display: flex; align-items: center; gap: 16px;">
                    <button onclick="irParaEspecialidades()" style="background: transparent; border: none; color: var(--info); font-size: 20px; cursor: pointer; transition: 0.2s;" onmouseover="this.style.transform='translateX(-4px)'" onmouseout="this.style.transform='none'">
                        <i class="bi bi-arrow-left"></i>
                    </button>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div class="spec-icon" style="width: 48px; height: 48px; font-size: 24px;">${meta.icon}</div>
                        <div>
                            <h3 style="font-size: 20px; color: #fff; margin: 0;">${especialidade}</h3>
                            <p style="font-size: 13px; color: rgba(255,255,255,0.7); margin: 0;">Escolha o profissional para o agendamento</p>
                        </div>
                    </div>
                </div>
                <button class="modal-close" onclick="fecharAgendamentoHub()" style="position: static; padding: 0;">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>

            <div class="modal-list-inner" style="flex: 1; overflow-y: auto; padding: 24px 28px;">
                <div class="doctors-grid" id="doctorsGridModal">
                    </div>
            </div>

        </div>
    `;
}

function injetarTemplateFavoritos() {
    return `
        <div class="modal-box" style="max-width: 900px; height: 85vh; display: flex; flex-direction: column;">
            
            <div class="modal-head" style="padding: 24px 28px 16px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.12);">
                <div style="display: flex; align-items: center; gap: 16px;">
                    <button onclick="voltarParaHub()" style="background: transparent; border: none; color: var(--info); font-size: 20px; cursor: pointer; transition: 0.2s;" onmouseover="this.style.transform='translateX(-4px)'" onmouseout="this.style.transform='none'">
                        <i class="bi bi-arrow-left"></i>
                    </button>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div class="spec-icon" style="width: 48px; height: 48px; font-size: 24px; color: #F59E0B; background: rgba(245, 158, 11, 0.15); border-color: rgba(245, 158, 11, 0.3);">
                            <i class="bi bi-star-fill"></i>
                        </div>
                        <div>
                            <h3 style="font-size: 20px; color: #fff; margin: 0;">Meus Favoritos</h3>
                            <p style="font-size: 13px; color: rgba(255,255,255,0.7); margin: 0;">Seus médicos acessados com mais frequência</p>
                        </div>
                    </div>
                </div>
                <button class="modal-close" onclick="fecharAgendamentoHub()" style="position: static; padding: 0;">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>

            <div class="modal-list-inner" style="flex: 1; overflow-y: auto; padding: 24px 28px;">
                <div class="doctors-grid" id="favoritosGridModal">
                    </div>
            </div>

        </div>
    `;
}

window.injetarTemplateHub = injetarTemplateHub;
window.injetarTemplateEspecialidades = injetarTemplateEspecialidades;
window.injetarTemplateMedicos = injetarTemplateMedicos;
window.injetarTemplateFavoritos = injetarTemplateFavoritos;