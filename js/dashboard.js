// =============================================
// dashboard.js — 대시보드 (요약 숫자, 다가오는 과제, 오늘 일정)
// =============================================

const tasks = getTasks();
const events = getEvents();
const todayStr = dayFromToday(0);

document.getElementById('todayText').textContent =
  `${formatDate(todayStr).replace(/\((.)\)/, '$1요일')}이에요. 오늘도 하나씩 끝내봐요!`;
document.getElementById('todayLabel').textContent = formatDate(todayStr);

// 1) 남은 과제
const left = tasks.filter(t => t.status !== '완료').sort((a, b) => a.due.localeCompare(b.due));
document.getElementById('statLeft').innerHTML = `${left.length}<small>개</small>`;
document.getElementById('statLeftNote').textContent = left.length
  ? `가장 급한 과제: ${left[0].title} (${dDay(left[0].due)})`
  : '남은 과제가 없어요 🎉';

// 2) 오늘 일정
const todayEvents = events.filter(e => e.date === todayStr).sort((a, b) => a.time.localeCompare(b.time));
document.getElementById('statToday').innerHTML = `${todayEvents.length}<small>개</small>`;
document.getElementById('statTodayNote').textContent = todayEvents.length
  ? `첫 일정: ${todayEvents[0].time} ${todayEvents[0].title}`
  : '오늘은 일정이 없어요';

// 3) 이번 주(일~토) 마감 과제 중 완료한 비율
const now = new Date();
const sunday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
const saturday = new Date(sunday.getFullYear(), sunday.getMonth(), sunday.getDate() + 6);
const weekTasks = tasks.filter(t => t.due >= toDateStr(sunday) && t.due <= toDateStr(saturday));
const weekDone = weekTasks.filter(t => t.status === '완료').length;
const rate = weekTasks.length ? Math.round((weekDone / weekTasks.length) * 100) : 0;
document.getElementById('statRate').innerHTML = `${rate}<small>%</small>`;
document.getElementById('statRateNote').textContent = `이번 주 과제 ${weekTasks.length}개 중 ${weekDone}개 끝냄`;
setTimeout(() => (document.getElementById('rateBar').style.width = rate + '%'), 100);

// 다가오는 과제 5개
document.getElementById('upcomingList').innerHTML = left.slice(0, 5).map(t => `
  <div class="tr">
    <div class="title"><a href="detail.html?id=${t.id}">${escapeHtml(t.title)}</a></div>
    <div class="subj">${escapeHtml(t.subject)}</div>
    <div class="due">${formatDate(t.due)}</div>
    <div class="status">${statusTag(t.status)}</div>
  </div>`).join('') || '<div class="empty">남은 과제가 없어요 🎉</div>';

// 오늘의 일정
document.getElementById('todayEvents').innerHTML = todayEvents.map(e => `
  <div class="event">
    <div class="time">${e.time}</div>
    <div class="body"><b>${escapeHtml(e.title)}</b><span>${escapeHtml(e.memo)}</span></div>
  </div>`).join('') || '<p class="empty">오늘은 일정이 없어요</p>';
