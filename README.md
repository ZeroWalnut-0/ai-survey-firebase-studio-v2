# AI Survey Firebase Studio (v2)

본 프로젝트는 **Next.js 15 (Turbopack)**, **Firebase**, 그리고 **Firebase Genkit**을 기반으로 구축된 AI 설문조사 스튜디오 플랫폼입니다. 

이 문서는 프로젝트 로컬 환경 설정, 실행 방법, 주요 스크립트 등 프로젝트 전반에 대한 가이드를 제공합니다.

> **Note:** 본 프로토타입은 `AI-Survey-app/ui-proto-plan/v0.3.1_firebase_studio_master_prompt.md` 파일의 마스터 프롬프트를 기반으로 구현되었습니다.

## 🛠 기술 스택 (Tech Stack)

- **Frontend:** Next.js 15, React 19, Tailwind CSS, shadcn/ui
- **Backend & AI:** Firebase (Firestore, App Hosting 등), Firebase Genkit (@genkit-ai/google-genai)
- **Language:** TypeScript

## 🚀 시작하기 (Getting Started)

프로젝트를 로컬 환경에서 실행하기 위한 단계별 안내입니다.

### 1. 사전 요구사항 (Prerequisites)

- Node.js (버전 20 이상 권장)
- npm, yarn, 또는 pnpm
- Google Gemini API Key (Genkit AI 기능 사용 시 필요)
- Firebase 프로젝트 설정 (Firebase 서비스 연동 시 필요)

### 2. 패키지 설치 (Installation)

저장소를 클론한 후, 프로젝트 루트 디렉토리에서 패키지를 설치합니다.

```bash
npm install
# 또는
yarn install
# 또는
pnpm install
```

### 3. 환경 변수 설정 (Environment Variables)

프로젝트 루트 디렉토리에 `.env.local` 파일을 생성하고 필요한 변수들을 설정합니다.

```env
# Genkit Gemini AI를 위한 API 키 (필수)
GOOGLE_GENAI_API_KEY=your_gemini_api_key_here

# 기타 Firebase 환경 변수 (필요 시 추가)
# NEXT_PUBLIC_FIREBASE_API_KEY=...
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
# NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
```

### 4. 로컬 개발 서버 실행 (Running for Development)

이 프로젝트는 크게 두 가지 환경을 실행해야 할 수 있습니다: **Next.js 웹 애플리케이션**과 **Genkit AI 개발 서버**. 터미널을 두 개 열어서 각각 실행하는 것을 권장합니다.

#### 🌍 웹 프론트엔드 서버 실행 (Next.js)

웹 애플리케이션 화면을 띄우는 메인 개발 서버입니다. (포트: `9002`에서 실행됩니다)

```bash
npm run dev
```
👉 실행 후 브라우저에서 [http://localhost:9002](http://localhost:9002) 로 접속합니다.

#### 🤖 Genkit AI 개발 도구 실행 (Firebase Genkit)

프롬프트 테스트 및 AI 플로우 디버깅을 위한 Genkit Developer UI를 실행합니다. 

```bash
npm run genkit:watch
# 또는 (watch 모드 없이 1회성 실행 시)
npm run genkit:dev
```
👉 터미널에 표시되는 로컬 Genkit UI 주소로 접속하여 AI 모델 및 프롬프트를 테스트할 수 있습니다.

## 📦 주요 스크립트 명령어 (Scripts)

`package.json`에 정의된 주요 스크립트입니다.

| 명령어 | 설명 |
|---|---|
| `npm run dev` | Next.js 개발 서버를 Turbopack을 사용하여 포트 9002에서 실행합니다. |
| `npm run genkit:dev` | Genkit AI 개발 도구를 실행합니다. |
| `npm run genkit:watch` | 코드가 변경될 때마다 자동 재시작되는 Genkit 개발 도구를 실행합니다. |
| `npm run build` | 프로덕션 환경을 위해 최적화된 Next.js 앱 빌드를 생성합니다. |
| `npm run start` | 빌드된 프로덕션 서버를 실행합니다. |
| `npm run lint` | 코드 린팅(ESLint)을 수행하여 잠재적인 오류를 찾습니다. |
| `npm run typecheck` | TypeScript 타입 검사를 수행합니다. |

## 📁 프로젝트 구조 (Project Structure)

```text
├── src/
│   ├── app/        # Next.js App Router (페이지 및 레이아웃)
│   ├── ai/         # Firebase Genkit AI 관련 플로우 및 로직
│   ├── components/ # 재사용 가능한 UI 컴포넌트 (shadcn/ui 등)
│   ├── firebase/   # Firebase 초기화 및 설정 코드
│   └── lib/        # 유틸리티 함수 및 기타 설정
├── docs/           # 프로젝트 관련 문서들
├── apphosting.yaml # Firebase App Hosting 설정 파일
├── firestore.rules # Firestore 보안 규칙 파일
├── tailwind.config.ts # Tailwind CSS 설정
└── package.json    # 패키지 및 스크립트 정보
```

## 🌐 배포 (Deployment)

이 프로젝트는 **Firebase App Hosting** 배포 설정(`apphosting.yaml`)이 포함되어 있습니다. Firebase CLI 및 Github 연동을 통해 Firebase App Hosting으로 간편하게 배포할 수 있습니다.
