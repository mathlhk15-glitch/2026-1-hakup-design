/**
 * 경일 학업설계 플랫폼 v3 — 공통 내비게이션 + 학교 상태 관리
 * ---------------------------------------------------------
 * 사용법:
 *   1) <html data-portal-page="major"> 처럼 현재 페이지 키를 지정
 *   2) <script src="../common/navigation.js"></script> 를 body 앞부분에 포함
 *
 * 제공 API (window.GyeongilPortal):
 *   getSchool()            → '창원경일고' | '창원경일여고' | null
 *   setSchool(name)        → 학교 저장(브라우저 localStorage)
 *   getSchoolCode()        → 'boys' | 'girls' | null   (choice 앱 연동용)
 *   setSchoolByCode(code)  → 'boys'/'girls' 코드로 저장
 *
 * localStorage 키: 'gyeongil.school' (기존 구조 유지)
 */
(function () {
  'use strict';

  // v3.3: 이 스크립트 위치 기준 이미지 경로 (포털/하위앱 어디서든 동일 동작)
  const SCRIPT_EL = document.currentScript;
  const IMG_BASE = (SCRIPT_EL && SCRIPT_EL.src ? SCRIPT_EL.src.replace(/navigation\.js.*$/, '') : '../common/') + 'img/';

  // ── 학교 상태 공통 모듈 (모든 앱이 동일 상태 공유) ──────────────
  const KEY = 'gyeongil.school';
  const NAME_TO_CODE = { '창원경일고': 'boys', '창원경일여고': 'girls' };
  const CODE_TO_NAME = { boys: '창원경일고', girls: '창원경일여고' };

  // 하위 호환: 구버전 d 포털의 'kyungil_school'('boys'/'girls') 키를 1회 마이그레이션
  const LEGACY_KEY = 'kyungil_school';
  function migrateLegacy() {
    try {
      if (localStorage.getItem(KEY)) return;
      const legacy = localStorage.getItem(LEGACY_KEY);
      if (legacy && CODE_TO_NAME[legacy]) localStorage.setItem(KEY, CODE_TO_NAME[legacy]);
    } catch (e) { /* 무시 */ }
  }
  migrateLegacy();

  function getSchool() {
    try { return localStorage.getItem(KEY) || null; } catch (e) { return null; }
  }
  function setSchool(name) {
    if (!NAME_TO_CODE[name]) return;
    try { localStorage.setItem(KEY, name); } catch (e) { /* 사생활 모드 등 */ }
    paintBadge();
    updateFavicon();
  }
  // ⑥ 동적 파비콘: 선택한 학교의 교표 (미선택 시 경일고 교표 기본)
  function updateFavicon() {
    const code = NAME_TO_CODE[getSchool()] || 'boys';
    let link = document.querySelector('link[rel="icon"][data-gyeongil]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      link.setAttribute('data-gyeongil', '');
      document.head.appendChild(link);
    }
    link.href = IMG_BASE + 'logo-' + code + '.webp';
  }

  window.GyeongilPortal = {
    getSchool: getSchool,
    setSchool: setSchool,
    getSchoolCode: function () { return NAME_TO_CODE[getSchool()] || null; },
    setSchoolByCode: function (code) { if (CODE_TO_NAME[code]) setSchool(CODE_TO_NAME[code]); }
  };
  updateFavicon();

  // ── 내비게이션 바 (중복 삽입 방지 · 포털(root)에서는 data-no-nav로 생략) ──
  if (document.currentScript && document.currentScript.hasAttribute('data-no-nav')) return;
  if (document.querySelector('[data-gyeongil-nav]')) return;

  const current = document.documentElement.dataset.portalPage || '';
  const root = '../';
  const items = [
    ['home', '처음으로', root + 'index.html'],
    ['major', '1 전공 탐색', root + 'major/index.html'],
    ['subjects', '2 과목 이해', root + 'subjects/index.html'],
    ['choice', '3 과목 선택', root + 'choice/index.html'],
    ['roadmap', '대입 로드맵', root + 'roadmap/index.html']
  ];

  const style = document.createElement('style');
  style.textContent = `
    .gyeongil-nav{position:sticky;top:0;z-index:9999;background:#173f4f;color:#fff;font-family:"Pretendard","Noto Sans KR","Malgun Gothic",sans-serif;letter-spacing:0;border-bottom:3px solid #e0a126}
    .gyeongil-nav__inner{max-width:1180px;margin:0 auto;display:flex;align-items:center;gap:6px;padding:8px 14px;overflow-x:auto;scrollbar-width:thin}
    .gyeongil-nav__brand{flex:0 0 auto;margin-right:10px;font-size:14px;font-weight:900;white-space:nowrap}
    .gyeongil-nav a{flex:0 0 auto;display:inline-flex;align-items:center;min-height:34px;padding:6px 10px;border-radius:6px;color:#e8f1f4;text-decoration:none;font-size:13px;font-weight:700;white-space:nowrap;transition:background .15s}
    .gyeongil-nav a:hover{background:#255769;color:#fff}
    .gyeongil-nav a:focus-visible{outline:3px solid #e0a126;outline-offset:2px}
    .gyeongil-nav a[aria-current="page"]{background:#e0a126;color:#17212a}
    .gyeongil-nav__meta{flex:0 0 auto;margin-left:auto;display:inline-flex;align-items:center;gap:8px;color:#cbdce2;font-size:11px;white-space:nowrap}
    .gyeongil-nav__school{display:none;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:800}
    .gyeongil-nav__school.boys{display:inline-flex;background:#d9f2e3;color:#0e6b33}
    .gyeongil-nav__school.girls{display:inline-flex;background:#fde5d9;color:#c23d12}
    .gyeongil-nav__school img{width:16px;height:16px;border-radius:50%;background:#fff;margin-right:5px}
    @media(max-width:700px){.gyeongil-nav__brand{font-size:13px}.gyeongil-nav__meta .gyeongil-nav__date{display:none}.gyeongil-nav__inner{padding-inline:10px}}
    @media print{.gyeongil-nav{display:none!important}}
  `;
  document.head.appendChild(style);

  const nav = document.createElement('nav');
  nav.className = 'gyeongil-nav';
  nav.dataset.gyeongilNav = '';
  nav.setAttribute('aria-label', '학업설계 단계');
  nav.innerHTML = '<div class="gyeongil-nav__inner"><span class="gyeongil-nav__brand">경일 학업설계</span>' +
    items.map(([key, label, href]) =>
      `<a href="${href}"${key === current ? ' aria-current="page"' : ''}>${label}</a>`).join('') +
    '<span class="gyeongil-nav__meta">' +
    '<span class="gyeongil-nav__school" data-school-badge aria-live="polite"></span>' +
    '<span class="gyeongil-nav__date">2026학년도 입학생 기준</span></span></div>';
  document.body.insertBefore(nav, document.body.firstChild);

  // ── 학교 배지: 학교별 색상 구분 (경일고=파랑, 경일여고=로즈) ──────
  function paintBadge() {
    const badge = document.querySelector('[data-school-badge]');
    if (!badge) return;
    const school = getSchool();
    const code = NAME_TO_CODE[school];
    badge.className = 'gyeongil-nav__school' + (code ? ' ' + code : '');
    badge.innerHTML = school
      ? '<img src="' + IMG_BASE + 'logo-' + code + '.webp" alt="" onerror="this.hidden=true">' + school
      : '';
  }
  paintBadge();
  // 다른 탭/앱에서 학교가 바뀌면 배지 동기화
  window.addEventListener('storage', function (e) { if (e.key === KEY) paintBadge(); });
})();
