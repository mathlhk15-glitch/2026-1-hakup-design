# ARCHITECTURE — 경일 학업설계 플랫폼 v3.1

## 시스템 개요

정적 웹사이트(서버·DB 없음). 4개의 독립 SPA(major/subjects/choice/roadmap)를
포털(index.html)과 공통 모듈(common/)이 하나의 플랫폼으로 묶는다.
각 앱은 단독으로도 동작하며, 공통 모듈이 없어도 깨지지 않는다(점진적 향상 원칙).

```
[index.html 포털]──학교 선택──▶ localStorage('gyeongil.school')
      │                              ▲          │
      │ 링크                  양방향  │          │ 읽기
      ▼                              │          ▼
[major] ──▶ [subjects] ──▶ [choice(자동 편제표 로드)] ──▶ 인쇄/PDF/클립보드
                                                │
[roadmap 12단계 완주] ──────CTA──────────────────┘
[teacher/] ← 학생 메뉴 비노출, 게시 시 제외
```

## 앱 간 데이터 흐름

| 데이터 | 생산 | 소비 | 매체 |
|---|---|---|---|
| 학교 선택 | 포털·choice | 전 앱(내비 배지), choice(편제표) | localStorage |
| 설계 결과 | choice | 교사(상담) | 인쇄물/PDF/클립보드 — 의도적으로 브라우저 밖 산출물 |
| 관심 학과 | (Phase 2) | (Phase 2) | 표준 학과 ID 확정 후 |

개인정보(이름·학번)는 어떤 저장소에도 기록하지 않는다.

## localStorage 구조

| 키 | 값 | 소유 |
|---|---|---|
| `gyeongil.school` | `'창원경일고'` \| `'창원경일여고'` | 공식 키(v2부터). 변경 금지 |
| `kyungil_school` | `'boys'` \| `'girls'` | 구버전(d) 키. navigation.js가 1회 읽어 공식 키로 마이그레이션만 함. 신규 기록 금지 |

키·값 형식 변경 시 반드시 호환 계층을 두고 CHANGELOG에 기록한다.

## 공통 컴포넌트 (common/)

### navigation.js — 유일한 공유 런타임
1. `window.GyeongilPortal` API: `getSchool()` / `setSchool(name)` / `getSchoolCode()` / `setSchoolByCode(code)`.
   name↔code 매핑(boys/girls)을 이 파일 한 곳에서만 정의한다.
2. 상단 내비게이션 바 자동 삽입. 페이지 식별은 `<html data-portal-page="키">`.
   포털(root)은 `data-no-nav` 속성으로 바 삽입만 생략하고 API는 사용.
3. 학교 배지(학교별 색), `storage` 이벤트로 탭 간 동기화, 인쇄 시 자동 숨김.

### portal.css — 포털 전용 스타일
하위 앱에는 로드되지 않는다(앱 CSS와 충돌 방지). 학교 구분색 토큰:
`--boys #128a43(교표 초록)` / `--girls #e8501e(교표 오렌지레드)`. 교표 파일: `common/img/logo-boys.webp`, `logo-girls.webp`.

## Navigation 구조

모든 하위 앱: `<script src="../common/navigation.js"></script>` 한 줄 + `data-portal-page`.
메뉴 항목·순서·경로는 navigation.js의 `items` 배열 한 곳에서만 수정한다.

## choice 학교 연동 방식 (비침습 패턴)

choice 본체 코드는 수정하지 않았다. 문서 끝에 추가된 스크립트가
`selectSchool`을 래핑해 (1) 원본 실행 → (2) 포털 키에 역기록하고,
로드 시 저장된 학교가 있으면 자동 호출한다. 새 앱 연동 시 같은 패턴을 권장:
**기존 함수를 고치지 말고 래핑하라.**

## subjects 이미지 파이프라인

base64 내장 → 외부 파일 분리(v3) → webp 전환(v3.1). JS 맵 3종이 경로 관리:
`MAJOR_IMGS`(학과 121) / `PDF_IMGS`(과목 123) / `PP`(책자 페이지 89) + `PYIMG`(예시 편제표 1).
이미지 교체는 assets/ 파일 교체 또는 맵 값 수정으로 끝난다. 본문 로직과 무관.

## 향후 확장 방법

1. **새 기능 카드**: index.html의 `<li>` 복제(주석 가이드 있음). 4번째 카드부터 nth-child 그라디언트 추가.
2. **새 앱**: `newapp/index.html` 생성 → `<html data-portal-page="newapp">` → navigation.js 포함 → navigation.js `items` 배열에 1행 추가.
3. **데이터 교체**: major는 `data.js` 파일 교체(형식: MAJORS 배열, DATA_VERSION 갱신), choice 편제표는 SEMESTERS_* 상수 교체, subjects 이미지는 assets/ 교체.
4. **Phase 2 (관심 학과 연동)**: 표준 학과 ID + 별칭표 확정 후 `gyeongil.majors` 키(JSON 배열) 신설 예정. 기존 키는 건드리지 않는다.

## 변경 원칙 (유지보수자 필독)

- 기존 API·localStorage 키·데이터 구조·파일 경로·함수 인터페이스는 변경하지 않는다. 불가피하면 호환 계층을 유지한다.
- 동작하는 코드는 유지하고 문제 부분만 최소 범위로 수정한다. 재작성보다 래핑·확장을 우선한다.
- 프레임워크 도입, 대규모 파일 이동·리네이밍 금지. 현재 구조 안에서 리팩터링한다.

## 배포 체크리스트

□ 모든 상대경로 정상(빌드 스크립트 검증) □ 새로고침 후 학교 선택 유지
□ 뒤로가기 정상 □ 모바일 Safari/Chrome 실기기 확인 □ DevTools Console 무경고
□ teacher/ 제외 업로드 □ 인쇄 A4 1장 확인(choice 상담 요약)
