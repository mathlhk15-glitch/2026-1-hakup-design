# CHANGELOG

## v3.2 (2026-07-12) — 과목 설명 즉시 열람

### 추가
- choice 과목명 옆 ? 아이콘: 클릭(또는 키보드 Enter) 시 과목 팝업이 열리고, '과목 이해(subjects)'와 동일한 교육과정 안내서 이미지를 팝업 안에서 바로 표시(2단계로 되돌아갈 필요 제거). 모바일에서도 우클릭 없이 접근 가능
- common/subject-images.js: 과목명→안내서 이미지 공통 맵(123종) + 공백·제2외국어 정규화 조회. openPopup 래핑(비침습 패턴, 기존 코드 무수정)
- 포털 학교 선택 즉시 피드백: 선택 시 3단계 CTA가 "OO고 편제표로 설계 →"로 바뀌고 학교색 적용, 상태 문구에 효과 설명 추가

## v3.1 (2026-07-12) — 마감 보완

### 변경
- subjects 이미지 jpg 211개 → webp 전환(q82): 16.0MB → 8.3MB(−48%), assets 총 24MB → 17MB. JS 맵 경로 갱신 및 전수 무결성 검증
- teacher 파일명 공백 제거(`..._수업_설계안.docx`) — URL 깨짐 예방
- navigation.js: 구버전 d 포털 키(`kyungil_school`) 1회 마이그레이션 호환 계층 추가(공식 키 `gyeongil.school` 불변)

### 추가
- ARCHITECTURE.md: 데이터 흐름, localStorage 구조, 공통 컴포넌트, 확장 방법, 변경 원칙(호환성·최소 변경)
- teacher/교사용_안내.txt: 게시 시 제외 안내 + 학생 산출물 수거 흐름

## v3.0 (2026-07-12) — 통합 플랫폼 정식판

기반: 통합포털 t(아키텍처·데이터) + 참고: d(카드 UI·학생 UX). 두 프로젝트의 장점 결합.

### 추가
- 학교 선택 전 앱 자동 연동(`GyeongilPortal` API, `gyeongil.school` 양방향 동기화)
- 학교별 구분색(경일고 파랑 #185ca8 / 경일여고 로즈 #c2185b) — 포털 버튼·내비 배지
- 포털 카드 UI: 그라디언트 번호, 호버 애니메이션, 단계별 대상 안내, CTA
- subjects 예시 편제표 경고 배너 + choice 이동 링크(⑤·⑥ 화면)
- roadmap 12단계 완주 화면에 choice 이동 CTA
- choice A4 인쇄(@page) + 상담 요약 인쇄 모드(beforeprint/afterprint)
- 접근성: focus-visible, aria-pressed/current/live, 모바일 44px 탭 타깃
- 문서: README, CHANGELOG, 학과명-일치율-점검(재생성)

### 변경
- subjects base64 이미지 334개 → `subjects/assets/` 외부 파일 + lazy load (본문 34.5MB→2.1MB)
- 탭 라벨: ⑤ 편제표 → ⑤ 예시 편제표 / ⑥ 나의 설계 → ⑥ 나의 설계(예시)
- 포털 배경 밝은 테마 확정(다크 테마 폐기), 헤더 밝은 그라데이션
- navigation.js: 학교 배지·상태 API·storage 이벤트 동기화·포털용 data-no-nav 옵션 추가

### 복원
- 원자료 제작자(전남여고 김동석 선생님) 크레딧 — subjects 헤더·포털 푸터 (연구윤리)

### 유지
- t의 폴더 구조·localStorage 키·데이터(19개 대학)·공통 모듈 방식 전부
- choice의 검증 로직·실시간 달성률·학교별 편제표·상담 양식·클립보드·인쇄·PDF 저장

## v2 (2026-07-12) — 통합포털 t (Phase 1)
- 통합 포털·학교 선택 화면, 공통 내비게이션, 전남여고 표기 제거, 교사용 분리, 학과명 점검 보고서

## v1 (2026-06~07) — 개별 프로그램 3종
- 전공 탐색 사전(major) / 학과·과목 설명 시스템(subjects) / 선택과목 설계 도우미(choice) + 대입 로드맵
