// =============================================
// detail.js — 과제 상세 페이지 (조회 + 완료 처리 + 수정/삭제)
// =============================================

const id = Number(new URLSearchParams(location.search).get('id'));

function render() {
  const task = getTask(id);
  if (!task) {
    document.getElementById('detail').innerHTML =
      '<p class="empty">과제를 찾을 수 없어요. 삭제되었거나 주소가 잘못됐어요.</p>';
    return;
  }
  const done = task.status === '완료';

  document.getElementById('dSubject').textContent = task.subject;
  document.getElementById('dSubject2').textContent = task.subject;
  document.getElementById('dTag').innerHTML = statusTag(task.status);
  document.getElementById('dTitle').textContent = task.title;
  document.getElementById('dDue').innerHTML = formatDate(task.due) +
    (done ? '' : ` · <span class="dday">${dDay(task.due)}</span>`);
  document.getElementById('dCreated').textContent = formatDate(task.createdAt);
  document.getElementById('dStatus').textContent = task.status;
  document.getElementById('dMemo').textContent = task.memo || '설명이 없어요.';

  // 완료 상태에 따라 버튼 모양 바꾸기 (페이지 안에서 바로 변함)
  const doneBtn = document.getElementById('doneBtn');
  doneBtn.textContent = done ? '완료됨 ✓' : '완료 처리';
  doneBtn.disabled = done;
  document.getElementById('doneNote').textContent = done
    ? '수고했어요! 🎉'
    : '다 끝냈으면 완료 처리를 눌러주세요';
  document.title = task.title + ' | StudyFlow';
}

document.getElementById('doneBtn').addEventListener('click', () => {
  updateTask(id, { status: '완료' });
  render();
  showToast('과제를 완료했어요');
});

document.getElementById('editBtn').addEventListener('click', () => {
  openTaskDialog(getTask(id), data => {
    updateTask(id, data);
    render();
    showToast('과제를 수정했어요');
  });
});

document.getElementById('deleteBtn').addEventListener('click', () => {
  openDeleteDialog(getTask(id), () => {
    deleteTask(id);
    toastAfterMove('과제를 삭제했어요');
    location.href = 'tasks.html';
  });
});

render();
