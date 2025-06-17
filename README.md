# 🇯🇵 sws-jlpt - Frontend

**sws-jlpt**는 JLPT 일본어 학습자를 위한 Vue 3 기반의 웹 프론트엔드 애플리케이션입니다. AI와의 대화 기능, 단어/문법/문장 퀴즈, 툴핑 기반 학습 기능 등을 지원하며, Laravel 기반 백역데인드와 연동되어 JWT 인증 및 사용자 맞춤 설정이 가능합니다.

---

## 💻 주요 기능

* 🤖 **Chat.vue** 기반 일본어 대화 인터페이스

  * GPT와 대화 (말푸엔 구조, 툴핑 표시, TTS, 즐겨찾기 포함)
  * 메시지 아래에서 위로 정렬 및 툴핑 내 아이콘 기능 구현
* 🧠 **문장/문법/단어 퀴즈** (`SentenceQuiz.vue`, `GrammarQuiz.vue`, `WordQuiz.vue`)

  * 객관식 보기, 정답 체크, 결과 출력
  * 반응형 UI와 신경을 꽉 중지
* 🛂 **Login.vue** 카카오 로그인 연동

  * JWT 기반 세션 저장 및 인증
* 🌐 **AI 설정 구성 (Aiset.vue)**

  * 아바타 이름/이미지, 말투, 성격, JLPT 레벨 설정
  * 설정값 sessionStorage에 저장 후 차트에 반영
* 🔍 **툴핑 정보 요청**

  * 단어/문법 정보 JSON으로 받아와 툴핑에 표시 (showTranslation, showInfo 등)

---

## 📁 폴더 구조 요약

```
src/
├── api/                  # 백역데인 API 호출 함수들 (auth.js, client.js 등)
├── components/           # 공통 UI 컨퍼닷 (Tooltip, Toast 등)
├── view/
│   ├── Chat.vue          # AI 대화 인터페이스
│   ├── Login.vue         # 카카오 로그인
│   └── quiz/
│       ├── WordQuiz.vue
│       ├── GrammarQuiz.vue
│       └── SentenceQuiz.vue
├── router/               # vue-router 설정
├── style/                # 전역 스타일 및 카스텀 CSS
└── App.vue / main.js     # 앱 진입점 및 기본 레이아웃
```

---

## 🔧 사용 기술

| 분류     | 기술                                      |
| ------ | --------------------------------------- |
| 프리임워크  | Vue 3 (Composition API)                 |
| 상태 관리  | sessionStorage, 자체 변수                   |
| UI 효과  | Framer Motion, CSS 애니메이션                |
| 인증     | JWT + 카카오 로그인                           |
| API 연동 | Axios                                   |
| 기타     | Iconify, vue3-toastify, lodash, Vite 사용 |

---

## ⚙️ 실행 방법

```bash
git clone https://github.com/사용자명/sws-jlpt-frontend.git
cd sws-jlpt-frontend
npm install
npm run dev       # 개발 서버 실행
npm run build     # 프로덕션 빌드
npm run preview   # 로컬 미리보기
```

> `.env` 파일에서 백엔드 주소(`VITE_API_URL`) 및 카카오 REST API 키 등을 설정해야 합니다.

---

## 🧪 테스트 가이드

* 로그인 후 JWT가 세션에 저장되는지 확인
* Chat.vue에서 메시지 전송 시 말풍선, 툴팁, TTS 정상 출력 확인
* 퀴즈 페이지 진입 후 문제/선택지/정답 로직 동작 확인

---

## 👨‍💻 개발자

* 손우성 ([@captain9802](https://github.com/captain9802))

---
