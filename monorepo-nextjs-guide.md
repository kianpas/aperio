# 모노레포 구조와 Next.js 설정 가이드

## 목적
- 모노레포 구조로 프론트엔드(Next.js)와 백엔드(Spring Boot) 통합 관리
- 실무에서 사용되는 베스트 프랙티스 적용

## 모노레포 구조 - 실무 현황

### ✅ **매우 일반적이고 권장되는 구조입니다**

## 실제 기업 사용 사례

### 대기업 사용 현황
- **Google**: 전체 코드베이스를 하나의 모노레포로 관리
- **Facebook/Meta**: React, React Native 등 모노레포 구조
- **Microsoft**: TypeScript, VS Code 등 모노레포
- **Netflix**: 마이크로서비스들을 모노레포로 관리
- **Uber**: 수백 개의 서비스를 모노레포로 관리

### 국내 기업
- **네이버**: 대부분의 서비스가 모노레포 구조
- **카카오**: 카카오톡, 카카오페이 등 모노레포
- **쿠팡**: 프론트엔드/백엔드 통합 관리
- **토스**: 금융 서비스들을 모노레포로 관리

## 모노레포 구조의 장점

### 1. **코드 공유 및 재사용**
```
project/
├── backend/           # Spring Boot
├── frontend/          # Next.js
├── shared/            # 공통 타입, 유틸리티
│   ├── types/         # TypeScript 타입 정의
│   ├── constants/     # 공통 상수
│   └── utils/         # 공통 유틸리티
└── docs/              # 공통 문서
```

### 2. **일관된 개발 환경**
```json
// 루트 package.json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:backend": "cd backend && ./gradlew bootRun",
    "dev:frontend": "cd frontend && npm run dev",
    "build": "npm run build:backend && npm run build:frontend",
    "test": "npm run test:backend && npm run test:frontend"
  }
}
```

### 3. **배포 및 CI/CD 통합**
```yaml
# GitHub Actions 예시
name: Deploy
on: [push]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Build Backend
        run: cd backend && ./gradlew build
      - name: Build Frontend  
        run: cd frontend && npm run build
      - name: Deploy Both
        run: ./deploy.sh
```

## 권장 모노레포 구조

### 📁 **프로젝트 루트 구조**
```
your-project/
├── README.md                    # 전체 프로젝트 설명
├── package.json                 # 루트 패키지 (스크립트 관리)
├── .gitignore                   # 통합 gitignore
├── docker-compose.yml           # 개발 환경 통합
├── docs/                        # 프로젝트 문서
│   ├── api/                     # API 문서
│   ├── deployment/              # 배포 가이드
│   └── development/             # 개발 가이드
├── scripts/                     # 공통 스크립트
│   ├── setup.sh                 # 초기 설정
│   ├── dev.sh                   # 개발 서버 실행
│   └── deploy.sh                # 배포 스크립트
├── backend/                     # Spring Boot (현재 구조 유지)
│   ├── src/
│   ├── build.gradle
│   └── ...
├── frontend/                    # Next.js
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── next.config.js
│   └── ...
├── shared/                      # 공통 리소스
│   ├── types/                   # TypeScript 타입
│   ├── constants/               # 공통 상수
│   ├── schemas/                 # API 스키마
│   └── utils/                   # 공통 유틸리티
└── tools/                       # 개발 도구
    ├── eslint-config/           # ESLint 설정
    ├── prettier-config/         # Prettier 설정
    └── tsconfig/                # TypeScript 설정
```

## Next.js 설치 방법

### 1. **기본 설치 (권장)**
```bash
# 프로젝트 루트에서
npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

### 2. **상세 옵션 설명**
```bash
npx create-next-app@latest frontend \
  --typescript          # TypeScript 사용
  --tailwind           # Tailwind CSS 포함
  --eslint             # ESLint 설정
  --app                # App Router 사용 (최신 방식)
  --src-dir            # src 디렉토리 구조
  --import-alias "@/*" # 절대 경로 import 설정
```

### 3. **생성될 frontend 구조**
```
frontend/
├── src/
│   ├── app/                     # App Router (Next.js 13+)
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── admin/               # 관리자 페이지
│   │   │   ├── coupons/
│   │   │   └── layout.tsx
│   │   └── api/                 # API Routes (선택적)
│   ├── components/              # 재사용 컴포넌트
│   │   ├── ui/                  # 기본 UI 컴포넌트
│   │   ├── admin/               # 관리자 전용 컴포넌트
│   │   └── common/              # 공통 컴포넌트
│   ├── lib/                     # 유틸리티, 설정
│   │   ├── api.ts               # API 클라이언트
│   │   ├── auth.ts              # 인증 관련
│   │   └── utils.ts             # 공통 유틸리티
│   └── types/                   # TypeScript 타입
├── public/                      # 정적 파일
├── package.json
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

## 백엔드와 프론트엔드 연동 구조

### 1. **API 통신 설정**
```typescript
// frontend/src/lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const api = {
  // 쿠폰 관련 API
  coupons: {
    getList: (params: CouponListParams) => 
      fetch(`${API_BASE_URL}/admin/coupons?${new URLSearchParams(params)}`),
    getDetail: (id: number) => 
      fetch(`${API_BASE_URL}/admin/coupons/${id}`),
    create: (data: CouponCreateRequest) =>
      fetch(`${API_BASE_URL}/admin/coupons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
  }
};
```

### 2. **타입 공유 구조**
```typescript
// shared/types/coupon.ts
export interface Coupon {
  cpNo: number;
  cpnNm: string;
  discount: number;
  discountAt: string;
  cpnDsc: string;
  activeYn: string;
  cpnStartDt: string;
  cpnEndDt: string;
}

export interface AdminCouponResponse extends Coupon {
  createDate: string;
  updateDate: string;
}

export interface CouponCreateRequest {
  cpnNm: string;
  discount: number;
  discountAt: string;
  cpnDsc: string;
  cpnStartDt: string;
  cpnEndDt: string;
  activeYn?: string;
}
```

## 개발 환경 통합

### 1. **루트 package.json**
```json
{
  "name": "your-project",
  "private": true,
  "scripts": {
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:backend": "cd backend && ./gradlew bootRun",
    "dev:frontend": "cd frontend && npm run dev",
    "build": "npm run build:backend && npm run build:frontend",
    "build:backend": "cd backend && ./gradlew build",
    "build:frontend": "cd frontend && npm run build",
    "test": "npm run test:backend && npm run test:frontend",
    "test:backend": "cd backend && ./gradlew test",
    "test:frontend": "cd frontend && npm run test"
  },
  "devDependencies": {
    "concurrently": "^8.2.0"
  }
}
```

### 2. **Docker 통합 개발 환경**
```yaml
# docker-compose.dev.yml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=dev
    volumes:
      - ./backend:/app
      
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8080
    volumes:
      - ./frontend:/app
      - /app/node_modules
```

## 모노레포 도구 선택

### 1. **간단한 프로젝트 (현재 권장)**
- **npm workspaces** 또는 **yarn workspaces**
- 별도 도구 없이 package.json 스크립트로 관리

### 2. **복잡한 프로젝트**
- **Nx**: 대규모 모노레포 관리 도구
- **Lerna**: 패키지 버전 관리 특화
- **Rush**: Microsoft에서 개발한 모노레포 도구

## 🎯 **결론 및 권장사항**

### ✅ **모노레포 구조 강력 권장**

**이유:**
1. **실무 표준**: 대부분의 현대적 프로젝트가 사용
2. **개발 효율성**: 코드 공유, 일관된 개발 환경
3. **배포 편의성**: 통합 CI/CD, 버전 관리
4. **유지보수성**: 전체 프로젝트를 한눈에 파악

### 📋 **Next.js 설치 단계**

1. **프로젝트 루트에서 Next.js 설치**
2. **TypeScript + Tailwind CSS 설정**
3. **API 클라이언트 설정**
4. **공통 타입 정의**
5. **개발 스크립트 통합**

### 🚀 **추가 고려사항**

- **API 문서화**: OpenAPI/Swagger 활용
- **타입 안전성**: 백엔드 API 스키마에서 프론트엔드 타입 자동 생성
- **개발 서버 프록시**: Next.js에서 백엔드 API 프록시 설정
- **인증 통합**: JWT 토큰 기반 인증 시스템

**모노레포 구조는 현재 프로젝트에 매우 적합하고 권장되는 방식입니다!** 👏