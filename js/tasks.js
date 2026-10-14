// =============================================
// tasks.js — 과제 목록 페이지 (목록 + 검색/필터 + 추가/수정/삭제)
// =============================================

const listEl = document.getElementById('taskList');
const searchInput = document.getElementById('searchInput');
const subjectFilter = document.getElementById('subjectFilter');
const statusFilter = document.getElementById('statusFilter');
let highlightId = null; // 방금 추가/수정한 과제를 노란색으로 표시

// 과목 필터 옵션을 저장된 과제에서 뽑아서 채운다
function fillSubjects() {
  const current = subjectFilter.value;
  const subjects = [...new Set(getTasks().map(t => t.subject))];
  subjectFilter.innerHTML = '<option value="">전체 과목</option>' +
    subjects.map(s => `<option>${escapeHtml(s)}</option>`).join('');
  subjectFilter.value = subjects.includes(current) ? current : '';
}

// 목록 다시 그리기
function render() {
  const keyword = searchInput.value.trim().toLowerCase();
  const tasks = getTasks()
    .filter(t => t.title.toLowerCase().includes(keyword))
    .filter(t => !subjectFilter.value || t.subject === subjectFilter.value)
    .filter(t => !statusFilter.value || t.status === statusFilter.value)
    // 완료 안 한 과제가 위로, 그 안에서는 마감일 빠른 순
    .sort((a, b) => (a.status === '완료') - (b.status === '완료') || a.due.localeCompare(b.due));

  if (tasks.length === 0) {
    listEl.innerHTML = '<div class="empty">조건에 맞는 과제가 없어요.</div>';
  } else {
    listEl.innerHTML = tasks.map(t => `
      <div class="tr ${t.status === '완료' ? 'is-done' : ''} ${t.id === highlightId ? 'highlight' : ''}">
        <div class="title"><a href="detail.html?id=${t.id}">${escapeHtml(t.title)}</a></div>
        <div class="subj">${escapeHtml(t.subject)}</div>
        <div class="due">${formatDate(t.due)}</div>
        <div class="status">${statusTag(t.status)}</div>
        <div class="manage">
          <button class="small-btn" data-edit="${t.id}">수정</button>
          <button class="small-btn delete" data-delete="${t.id}">삭제</button>
        </div>
      </div>`).join('');
  }

  const all = getTasks();
  document.getElementById('countText').textContent =
    `총 ${all.length}개 · 완료 ${all.filter(t => t.status === '완료').length}개   |   과제명을 누르면 상세 페이지로 이동해요`;
}

// 수정/삭제 버튼은 목록이 계속 새로 그려지므로 부모(listEl)에서 한 번에 처리
listEl.addEventListener('click', e => {
  const editId = Number(e.target.dataset.edit);
  const deleteId = Number(e.target.dataset.delete);

  if (editId) {
    openTaskDialog(getTask(editId), data => {
      updateTask(editId, data);
      highlightId = editId;
      fillSubjects();
      render();
      showToast('과제를 수정했어요');
    });
  }
  if (deleteId) {
    openDeleteDialog(getTask(deleteId), () => {
      deleteTask(deleteId);
      fillSubjects();
      render();
      showToast('과제를 삭제했어요');
    });
  }
});

document.getElementById('addBtn').addEventListener('click', openAdd);

function openAdd() {
  openTaskDialog(null, data => {
    const task = addTask(data);
    highlightId = task.id;
    fillSubjects();
    render();
    showToast('새 과제를 추가했어요');
  });
}

searchInput.addEventListener('input', render);
subjectFilter.addEventListener('change', render);
statusFilter.addEventListener('change', render);

// 주소에 ?q=검색어 또는 ?add=1 이 있으면 바로 반영
const params = new URLSearchParams(location.search);
if (params.get('q')) searchInput.value = params.get('q');

fillSubjects();
render();
if (params.get('add')) openAdd();
