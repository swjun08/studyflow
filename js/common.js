// =============================================
// common.js — 여러 페이지에서 같이 쓰는 함수
// =============================================

const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

// '2026-10-16' → '10월 16일 (금)'
function formatDate(str) {
  const [y, m, d] = str.split('-').map(Number);
  const day = new Date(y, m - 1, d).getDay();
  return `${m}월 ${d}일 (${DAYS[day]})`;
}

// 마감까지 남은 날 → 'D-3', 'D-day', '3일 지남'
function dDay(str) {
  const [y, m, d] = str.split('-').map(Number);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((new Date(y, m - 1, d) - today) / 86400000);
  if (diff === 0) return 'D-day';
  if (diff > 0) return 'D-' + diff;
  return -diff + '일 지남';
}

// 상태 → 태그 HTML
function statusTag(status) {
  const cls = { '시작 전': 'todo', '진행 중': 'doing', '완료': 'done' }[status];
  return `<span class="tag ${cls}">${status}</span>`;
}

// 사용자가 입력한 글자를 HTML에 넣을 때 태그가 실행되지 않게 바꿔준다
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 화면 아래에 잠깐 뜨는 알림
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => toast.classList.remove('show'), 2500);
}

// 다른 페이지로 이동한 뒤 알림을 띄우고 싶을 때 (예: 삭제 후 목록으로)
function toastAfterMove(message) {
  sessionStorage.setItem('toast', message);
}
window.addEventListener('DOMContentLoaded', () => {
  const message = sessionStorage.getItem('toast');
  if (message) {
    sessionStorage.removeItem('toast');
    showToast(message);
  }
});

// 상단 검색창: 엔터를 누르면 과제 페이지에서 검색
const topSearch = document.querySelector('.topbar .search');
if (topSearch) {
  topSearch.addEventListener('keydown', e => {
    if (e.key === 'Enter' && topSearch.value.trim()) {
      location.href = 'tasks.html?q=' + encodeURIComponent(topSearch.value.trim());
    }
  });
}

// ---------- 모달 공통 ----------
// data-close 버튼을 누르면 자기를 감싸는 모달을 닫는다
document.querySelectorAll('[data-close]').forEach(btn => {
  btn.addEventListener('click', () => btn.closest('dialog').close());
});

// 과제 추가/수정 모달 열기
// task가 없으면 '추가', 있으면 기존 값을 채워서 '수정' 모드로 연다
function openTaskDialog(task, onSave) {
  const dialog = document.getElementById('taskDialog');
  const form = document.getElementById('taskForm');
  const isEdit = Boolean(task);

  document.getElementById('taskDialogTitle').textContent = isEdit ? '과제 수정' : '새 과제 추가';
  document.getElementById('taskDialogDesc').textContent = isEdit
    ? '바꿀 내용만 고치고 저장을 눌러주세요.'
    : '해야 할 과제를 적어두면 마감 전에 챙기기 쉬워요.';
  document.getElementById('taskSubmit').textContent = isEdit ? '저장' : '추가';
  document.getElementById('statusField').hidden = !isEdit;

  form.reset();
  document.getElementById('fTitle').value = isEdit ? task.title : '';
  document.getElementById('fSubject').value = isEdit ? task.subject : '';
  document.getElementById('fDue').value = isEdit ? task.due : dayFromToday(7);
  document.getElementById('fStatus').value = isEdit ? task.status : '시작 전';
  document.getElementById('fMemo').value = isEdit ? task.memo : '';

  form.onsubmit = () => {
    const data = {
      title: document.getElementById('fTitle').value.trim(),
      subject: document.getElementById('fSubject').value.trim(),
      due: document.getElementById('fDue').value,
      memo: document.getElementById('fMemo').value.trim(),
    };
    if (isEdit) data.status = document.getElementById('fStatus').value;
    onSave(data);
  };
  dialog.showModal();
}

// 삭제 확인 모달 열기
function openDeleteDialog(task, onDelete) {
  const dialog = document.getElementById('deleteDialog');
  document.getElementById('deleteDesc').textContent =
    `‘${task.title}’ 과제를 삭제하면 다시 되돌릴 수 없어요.`;
  document.getElementById('deleteConfirm').onclick = () => {
    dialog.close();
    onDelete();
  };
  dialog.showModal();
}
