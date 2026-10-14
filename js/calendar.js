// =============================================
// calendar.js — 월간 달력 + 날짜별 일정 + 일정 추가
// =============================================

const grid = document.getElementById('calGrid');
let viewYear = new Date().getFullYear();
let viewMonth = new Date().getMonth(); // 0 = 1월
let selected = dayFromToday(0);        // 선택한 날짜 'YYYY-MM-DD'
let newEventId = null;

function renderCalendar() {
  document.getElementById('monthTitle').textContent = `${viewYear}년 ${viewMonth + 1}월`;

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();      // 1일의 요일
  const lastDate = new Date(viewYear, viewMonth + 1, 0).getDate(); // 그 달의 마지막 날
  const events = getEvents();
  const today = dayFromToday(0);
  let html = '';

  // 1일 앞의 빈칸
  for (let i = 0; i < firstDay; i++) html += '<div class="cell blank"></div>';

  for (let d = 1; d <= lastDate; d++) {
    const date = toDateStr(new Date(viewYear, viewMonth, d));
    const dayEvents = events.filter(e => e.date === date).sort((a, b) => a.time.localeCompare(b.time));
    const classes = ['cell'];
    if ((firstDay + d - 1) % 7 === 0) classes.push('sun');
    if (date === today) classes.push('today');
    if (date === selected) classes.push('selected');

    // 일정이 있는 날은 최대 2개까지 표시하고 나머지는 '+n개 더'
    const chips = dayEvents.slice(0, 2).map(e => `<div class="chip">${escapeHtml(e.title)}</div>`).join('');
    const more = dayEvents.length > 2 ? `<div class="more">+${dayEvents.length - 2}개 더</div>` : '';

    html += `<div class="${classes.join(' ')}" data-date="${date}"><span class="num">${d}</span>${chips}${more}</div>`;
  }
  grid.innerHTML = html;
}

function renderDay() {
  const list = getEvents().filter(e => e.date === selected).sort((a, b) => a.time.localeCompare(b.time));
  document.getElementById('dayTitle').textContent =
    formatDate(selected) + (selected === dayFromToday(0) ? ' · 오늘' : '');
  document.getElementById('dayCount').textContent = `일정 ${list.length}개`;
  document.getElementById('dayEvents').innerHTML = list.map(e => `
    <div class="event ${e.id === newEventId ? 'new' : ''}">
      <div class="time">${e.time}</div>
      <div class="body"><b>${escapeHtml(e.title)}</b><span>${escapeHtml(e.memo)}</span></div>
      <button class="small-btn delete" data-delete="${e.id}">삭제</button>
    </div>`).join('') || '<p class="empty">일정이 없어요</p>';
}

// 날짜 클릭 → 그 날 일정 보여주기
grid.addEventListener('click', e => {
  const cell = e.target.closest('.cell[data-date]');
  if (!cell) return;
  selected = cell.dataset.date;
  renderCalendar();
  renderDay();
});

// 이전/다음 달
function moveMonth(step) {
  viewMonth += step;
  if (viewMonth < 0) { viewMonth = 11; viewYear--; }
  if (viewMonth > 11) { viewMonth = 0; viewYear++; }
  renderCalendar();
}
document.getElementById('prevMonth').addEventListener('click', () => moveMonth(-1));
document.getElementById('nextMonth').addEventListener('click', () => moveMonth(1));
document.getElementById('todayBtn').addEventListener('click', () => {
  viewYear = new Date().getFullYear();
  viewMonth = new Date().getMonth();
  selected = dayFromToday(0);
  renderCalendar();
  renderDay();
});

// 일정 삭제
document.getElementById('dayEvents').addEventListener('click', e => {
  const id = Number(e.target.dataset.delete);
  if (!id) return;
  deleteEvent(id);
  renderCalendar();
  renderDay();
  showToast('일정을 삭제했어요');
});

// 일정 추가 모달
const eventDialog = document.getElementById('eventDialog');
document.getElementById('addEventBtn').addEventListener('click', () => {
  document.getElementById('eventForm').reset();
  document.getElementById('eDate').value = selected; // 선택한 날짜를 기본값으로
  eventDialog.showModal();
});

document.getElementById('eventForm').addEventListener('submit', () => {
  const event = addEvent({
    title: document.getElementById('eTitle').value.trim(),
    date: document.getElementById('eDate').value,
    time: document.getElementById('eTime').value,
    memo: document.getElementById('eMemo').value.trim(),
  });
  // 추가한 날짜로 달력 이동 + 선택
  newEventId = event.id;
  selected = event.date;
  const [y, m] = event.date.split('-').map(Number);
  viewYear = y;
  viewMonth = m - 1;
  renderCalendar();
  renderDay();
  showToast('새 일정을 추가했어요');
});

renderCalendar();
renderDay();
