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

let userPoints = 40;
const GOAL = 60;

function updateUserProfile() {
    const storedName = localStorage.getItem('nome') || 'William Souza';
    const profileName = document.querySelector('.p-name-v3');
    const avatarImg = document.querySelector('.avatar-img-v3');

    if (profileName) profileName.textContent = storedName;
    if (avatarImg) avatarImg.alt = `Foto de ${storedName}`;
}

window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('pointsBarFill').style.width = ((userPoints/GOAL)*100)+'%';
    }, 500);
    updateUserProfile();
});

const MODAL_IDS = { quizes:'modalQuizes', recompensas:'modalRecompensas', ranking:'modalRanking' };
function openModal(key) {
    const el = document.getElementById(MODAL_IDS[key]);
    if (el) { el.classList.add('open'); document.body.style.overflow='hidden'; }
}
function closeModal(key) {
    const el = document.getElementById(MODAL_IDS[key]);
    if (el) { el.classList.remove('open'); document.body.style.overflow=''; }
}
Object.values(MODAL_IDS).forEach(id => {
    const el = document.getElementById(id);
    el?.addEventListener('click', e => {
        if (e.target === el) {
            el.classList.remove('open');
            document.body.style.overflow='';
        }
    });
});
document.addEventListener('keydown', e => {
    if (e.key==='Escape') { Object.values(MODAL_IDS).forEach(id=>document.getElementById(id)?.classList.remove('open')); document.getElementById('modalQuizQ')?.classList.remove('open'); document.body.style.overflow=''; }
});

function addPoints(n, label) {
    userPoints += n;
    document.getElementById('totalPoints').textContent = userPoints;
    document.getElementById('giftPoints').textContent  = userPoints;
    document.getElementById('barLabel').textContent    = `${userPoints} / ${GOAL} pts`;
    document.getElementById('pointsBarFill').style.width = Math.min((userPoints/GOAL)*100,100)+'%';
    showToast(`+${n} Care Points — ${label}! 🏆`);
}
function showToast(msg) {
    const t = document.createElement('div');
    t.style.cssText = 'position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(40px);background:linear-gradient(135deg,rgba(0,121,200,.92),rgba(0,59,98,.92));color:#fff;font-family:Montserrat,sans-serif;font-size:14px;font-weight:700;padding:13px 26px;border-radius:50px;box-shadow:0 8px 28px rgba(0,0,0,.4);border:1px solid rgba(255,255,255,.2);z-index:9999;transition:all .4s cubic-bezier(.22,1,.36,1);opacity:0;';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(()=>{ t.style.opacity='1'; t.style.transform='translateX(-50%) translateY(0)'; },50);
    setTimeout(()=>{ t.style.opacity='0'; t.style.transform='translateX(-50%) translateY(30px)'; setTimeout(()=>t.remove(),400); },2800);
}

const ALL_QUESTIONS = [
    {q:'Qual destes NÃO é um benefício principal da atividade física regular?',opts:['Melhora da qualidade do sono.','Aumento do risco de doenças crônicas.','Melhora da saúde mental.','Fortalecimento de ossos e músculos.'],correct:1},
    {q:'Quantas vezes por dia você deve escovar os dentes?',opts:['Uma vez, à noite.','Duas vezes ao dia.','Pelo menos 3 vezes ao dia.','Somente após as refeições.'],correct:2},
    {q:'Qual vitamina é produzida pelo nosso corpo com a exposição ao sol?',opts:['Vitamina A','Vitamina B12','Vitamina C','Vitamina D'],correct:3},
    {q:'O que é considerado pressão arterial normal para adultos?',opts:['80x60 mmHg','120x80 mmHg','150x100 mmHg','90x50 mmHg'],correct:1},
    {q:'Quantos litros de água são recomendados por dia para adultos?',opts:['0,5 a 1 litro','1 a 1,5 litros','2 a 3 litros','Mais de 5 litros'],correct:2},
    {q:'Qual hábito NÃO contribui para um sono de qualidade?',opts:['Dormir e acordar sempre no mesmo horário.','Usar celular antes de dormir.','Manter o quarto escuro e fresco.','Evitar cafeína à tarde.'],correct:1},
    {q:'O fio dental deve ser usado com qual frequência?',opts:['Uma vez por semana','Somente quando sentir dor','Pelo menos uma vez ao dia','Nunca é necessário'],correct:2},
    {q:'Qual dos alimentos abaixo é mais rico em proteínas?',opts:['Arroz branco','Frango grelhado','Batata frita','Refrigerante'],correct:1},
    {q:'Qual exame detecta problemas cardíacos?',opts:['Eletroencefalograma','Raio-X de tórax','Eletrocardiograma','Ressonância de joelho'],correct:2},
    {q:'Com qual frequência é recomendado trocar a escova de dentes?',opts:['A cada 6 meses','A cada 3 meses','Uma vez por ano','Somente quando as cerdas dobrarem'],correct:1},
    {q:'Qual órgão é responsável por filtrar o sangue?',opts:['Pulmão','Fígado','Rim','Estômago'],correct:2},
    {q:'O que é o IMC?',opts:['Índice de Massa Corporal','Índice Metabólico Cardíaco','Indicador Médico Clínico','Índice de Movimento Celular'],correct:0},
    {q:'Qual das opções é um sinal de alerta para AVC?',opts:['Dor de cabeça leve','Formigamento em um lado do rosto ou corpo','Tosse seca persistente','Falta de apetite'],correct:1},
    {q:'Quantas horas de sono são recomendadas para adultos?',opts:['4 a 5 horas','6 horas','7 a 9 horas','Mais de 10 horas'],correct:2},
    {q:'Qual alimento é mais rico em cálcio?',opts:['Leite e derivados','Carne vermelha','Arroz integral','Pão branco'],correct:0},
];
const LABELS=['A','B','C','D'];
let quizQueue=[],quizIndex=0,quizCorrects=0,quizAnswered=false;
function shuffle(a){return[...a].sort(()=>Math.random()-.5);}

function openQuizQuestion(){
    quizQueue=shuffle(ALL_QUESTIONS).slice(0,5);
    quizIndex=0; quizCorrects=0; quizAnswered=false;
    closeModal('quizes');
    setTimeout(()=>{
        document.getElementById('modalQuizQ').classList.add('open');
        document.body.style.overflow='hidden';
        renderQuizQuestion();
    },250);
}

function renderQuizQuestion(){
    const total=quizQueue.length, item=quizQueue[quizIndex];
    document.getElementById('quizProgress').style.width=((quizIndex/total)*100)+'%';
    document.getElementById('quizCounter').textContent='PERGUNTA '+(quizIndex+1)+' DE '+total;
    document.getElementById('quizQuestionText').textContent=item.q;
    document.getElementById('quizFeedback').style.display='none';
    document.getElementById('quizNextBtn').style.display='none';
    document.getElementById('quizNextBtn').onclick=nextQuizQuestion;
    quizAnswered=false;
    const opts=document.getElementById('quizOptions'); opts.innerHTML='';
    item.opts.forEach((opt,i)=>{
        const btn=document.createElement('button');
        btn.style.cssText='display:flex;align-items:center;gap:12px;width:100%;padding:12px 16px;border-radius:12px;border:1.5px solid transparent;background:rgba(0,121,200,.35);color:#fff;font-family:Montserrat,sans-serif;font-size:13px;font-weight:600;cursor:pointer;text-align:left;transition:background .18s;letter-spacing:.2px;';
        btn.innerHTML='<span style="width:26px;height:26px;border-radius:50%;background:rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;flex-shrink:0;">'+LABELS[i]+'</span>'+opt;
        btn.addEventListener('mouseenter',()=>{if(!quizAnswered)btn.style.background='rgba(0,121,200,.65)';});
        btn.addEventListener('mouseleave',()=>{if(!quizAnswered)btn.style.background='rgba(0,121,200,.35)';});
        btn.addEventListener('click',()=>answerQuiz(i));
        opts.appendChild(btn);
    });
}

function answerQuiz(chosen){
    if(quizAnswered)return; quizAnswered=true;
    const item=quizQueue[quizIndex], correct=item.correct, isRight=chosen===correct;
    const btns=document.querySelectorAll('#quizOptions button');
    btns.forEach((b,i)=>{
        b.style.cursor='default';
        if(i===correct){b.style.background='rgba(34,197,94,.35)';b.style.borderColor='rgba(34,197,94,.6)';}
        else if(i===chosen&&!isRight){b.style.background='rgba(239,68,68,.3)';b.style.borderColor='rgba(239,68,68,.5)';}
        else b.style.opacity='.4';
    });
    if(isRight)quizCorrects++;
    const fb=document.getElementById('quizFeedback');
    fb.style.display='block';
    if(isRight){fb.style.background='rgba(34,197,94,.2)';fb.style.color='#4ADE80';fb.style.border='1px solid rgba(34,197,94,.35)';fb.innerHTML='✅ Correto! Muito bem!';}
    else{fb.style.background='rgba(239,68,68,.15)';fb.style.color='#FCA5A5';fb.style.border='1px solid rgba(239,68,68,.3)';fb.innerHTML='❌ Errou! A certa era <strong>'+LABELS[correct]+'. '+item.opts[correct]+'</strong>';}
    const nb=document.getElementById('quizNextBtn'); nb.style.display='block';
    nb.textContent=quizIndex===quizQueue.length-1?'Ver resultado →':'Próxima →';
}

function nextQuizQuestion(){
    quizIndex++;
    if(quizIndex<quizQueue.length){renderQuizQuestion();}
    else{
        document.getElementById('quizProgress').style.width='100%';
        document.getElementById('quizCounter').textContent='RESULTADO FINAL';
        const pct=Math.round((quizCorrects/quizQueue.length)*100);
        document.getElementById('quizQuestionText').innerHTML='Você acertou <strong style="color:#F5A623;font-size:22px;">'+quizCorrects+'/'+quizQueue.length+'</strong> perguntas ('+pct+'%)';
        document.getElementById('quizOptions').innerHTML='';
        document.getElementById('quizFeedback').style.display='none';
        const nb=document.getElementById('quizNextBtn'); nb.textContent='🏆 Concluir e ganhar pontos'; nb.onclick=finishQuiz;
    }
}

function finishQuiz(){
    closeQuizQ(); addPoints(5,'Quiz concluído');
    const q1=document.getElementById('q1PathItem');
    if(q1){q1.style.opacity='.5';q1.style.cursor='default';q1.onclick=null;q1.querySelector('.qpath-sub').textContent='✓ Concluído';q1.querySelector('.qpath-sub').style.color='#4ADE80';}
}
function closeQuizQ(){document.getElementById('modalQuizQ').classList.remove('open');document.body.style.overflow='';}
document.getElementById('modalQuizQ')?.addEventListener('click',e=>{if(e.target===document.getElementById('modalQuizQ'))closeQuizQ();});


function redeemReward(badge, name) {
    badge.textContent = '✓ Resgatado';
    badge.classList.remove('badge-unlocked');
    badge.classList.add('badge-locked');
    badge.onclick = null;
    showToast(`🎉 ${name} resgatada!`);
}

document.querySelectorAll('.menu-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const r = document.createElement('span');
        r.className = 'ripple-circle';
        r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px`;
        this.appendChild(r); setTimeout(()=>r.remove(),600);
    });
});
if (window.matchMedia('(hover:hover)').matches) {
    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const r = btn.getBoundingClientRect();
            const dx = (e.clientX-r.left-r.width/2)/r.width*10;
            const dy = (e.clientY-r.top-r.height/2)/r.height*10;
            btn.style.transform = `translateY(-7px) scale(1.03) translate(${dx}px,${dy}px)`;
        });
        btn.addEventListener('mouseleave', () => { btn.style.transform=''; });
    });
}