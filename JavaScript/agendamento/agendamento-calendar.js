const MONTHS_PT = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const DAYS_PT   = ['DOM','SEG','TER','QUA','QUI','SEX','SÁB'];
const ALL_SLOTS = ['07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00'];

function seededRand(seed) {
    let s = seed;
    return () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
}

function buildMonthData(year, month, docIdx) {
    const rand = seededRand(year * 100 + month + docIdx * 37);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const todayFlat = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const days = [];
    for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, month, d);
        const flat = new Date(year, month, d);
        const dow  = date.getDay();
        let status;
        if (flat < todayFlat)                    status = 'past';
        else if (dow === 0)                      status = 'holiday'; 
        else if (dow === 6 && rand() < .6)       status = 'holiday'; 
        else if (rand() < .30)                   status = 'unavail';
        else                                     status = 'avail';
        days.push({ day: d, status, dow });
    }
    return { daysInMonth, firstDow: new Date(year, month, 1).getDay(), days };
}

function buildSlots(year, month, day, docIdx) {
    const rand = seededRand(year*1000 + month*100 + day + docIdx*13);
    return ALL_SLOTS.map(t => ({ time: t, avail: rand() > .38 }));
}

window.buildMonthData = buildMonthData;
window.buildSlots = buildSlots;
window.MONTHS_PT = MONTHS_PT;
window.DAYS_PT = DAYS_PT;