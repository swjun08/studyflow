// =============================================
// data.js — 과제/일정 데이터 저장소 (CRUD)
// 서버 대신 브라우저의 localStorage에 JSON으로 저장한다.
// =============================================

const TASK_KEY = 'studyflow-tasks';
const EVENT_KEY = 'studyflow-events';

// 날짜를 'YYYY-MM-DD' 문자열로 바꾸기
function toDateStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// 오늘 기준으로 며칠 뒤 날짜 (예시 데이터 만들 때 사용)
function dayFromToday(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return toDateStr(d);
}

// 처음 접속했을 때 보여줄 예시 데이터
function sampleTasks() {
  return [
    { id: 1, title: '확률과 통계 탐구 보고서', subject: '수학', due: dayFromToday(1), status: '진행 중', createdAt: dayFromToday(-9),
      memo: '관심 있는 주제로 확률 실험을 설계하고 결과를 보고서로 정리하기.\n표와 그래프 1개 이상 넣기.' },
    { id: 2, title: '영어 에세이 - My Role Model', subject: '영어', due: dayFromToday(5), status: '진행 중', createdAt: dayFromToday(-9),
      memo: '롤모델 한 명을 정해서 영어로 에세이 쓰기 (250단어 이상).\n도입 - 본론 - 결론 구조를 지키고, 수업 시간에 배운 표현을 3개 이상 넣을 것.\n구글 클래스룸에 PDF로 제출!' },
    { id: 3, title: '물리 실험 결과 보고서', subject: '물리학Ⅰ', due: dayFromToday(7), status: '시작 전', createdAt: dayFromToday(-4),
      memo: '자유낙하 실험 측정값 정리하고 오차 원인 2가지 이상 쓰기.' },
    { id: 4, title: '독서 감상문 - 데미안', subject: '국어', due: dayFromToday(9), status: '진행 중', createdAt: dayFromToday(-12),
      memo: '인상 깊은 구절 2개를 골라 내 생각과 연결해서 쓰기. 1,500자 이상.' },
    { id: 5, title: '한국사 조별 발표 자료', subject: '한국사', due: dayFromToday(13), status: '시작 전', createdAt: dayFromToday(-2),
      memo: '조원: 4명. 나는 3·1 운동 파트 슬라이드 4장 담당.' },
    { id: 6, title: '파이썬 반복문 실습', subject: '정보', due: dayFromToday(-2), status: '완료', createdAt: dayFromToday(-10),
      memo: 'for문, while문 예제 5개 풀어서 제출.' },
  ];
}

function sampleEvents() {
  return [
    { id: 1, title: '수학 쪽지시험', date: dayFromToday(0), time: '11:00', memo: '3교시 · 교과서 2단원' },
    { id: 2, title: '방송부 회의', date: dayFromToday(0), time: '16:30', memo: '방송실' },
    { id: 3, title: '영어 학원', date: dayFromToday(0), time: '19:00', memo: '단어 시험 있음' },
    { id: 4, title: '영어 말하기 수행평가', date: dayFromToday(6), time: '10:00', memo: '2교시 · 발표 2분' },
    { id: 5, title: '스터디카페', date: dayFromToday(6), time: '18:00', memo: '수학 문제풀이 같이 하기' },
    { id: 6, title: '물리 실험', date: dayFromToday(8), time: '13:30', memo: '5교시 · 과학실' },
    { id: 7, title: '체육대회', date: dayFromToday(16), time: '09:00', memo: '체육복 챙기기' },
  ];
}

// ---------- 공통 읽기/쓰기 ----------
function load(key, makeSample) {
  const saved = localStorage.getItem(key);
  if (saved) return JSON.parse(saved);
  const sample = makeSample();
  localStorage.setItem(key, JSON.stringify(sample));
  return sample;
}

function save(key, list) {
  localStorage.setItem(key, JSON.stringify(list));
}

// ---------- 과제 CRUD ----------
function getTasks() {
  return load(TASK_KEY, sampleTasks);
}

function getTask(id) {
  return getTasks().find(task => task.id === id);
}

// Create
function addTask(data) {
  const tasks = getTasks();
  const task = { id: Date.now(), status: '시작 전', createdAt: dayFromToday(0), ...data };
  tasks.push(task);
  save(TASK_KEY, tasks);
  return task;
}

// Update
function updateTask(id, changes) {
  const tasks = getTasks();
  const task = tasks.find(t => t.id === id);
  Object.assign(task, changes);
  save(TASK_KEY, tasks);
}

// Delete
function deleteTask(id) {
  const tasks = getTasks().filter(t => t.id !== id);
  save(TASK_KEY, tasks);
}

// ---------- 일정 ----------
function getEvents() {
  return load(EVENT_KEY, sampleEvents);
}

function addEvent(data) {
  const events = getEvents();
  const event = { id: Date.now(), ...data };
  events.push(event);
  save(EVENT_KEY, events);
  return event;
}

function deleteEvent(id) {
  save(EVENT_KEY, getEvents().filter(e => e.id !== id));
}
