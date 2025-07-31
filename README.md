# Aperio - 공유 오피스 플랫폼

![Aperio Logo](https://via.placeholder.com/200x80/3B82F6/FFFFFF?text=Aperio)

## 📖 프로젝트 소개

**Aperio**는 라틴어로 '열다, 드러내다, 공개하다'는 뜻으로, 아이디어와 가능성을 열어주는 공간, 투명한 협업이 이루어지는 공유 오피스 플랫폼입니다.

### 🎯 프로젝트 목표
- 유연하고 효율적인 공유 오피스 예약 시스템 구축
- 사용자 친화적인 UI/UX 제공
- 관리자를 위한 통합 관리 시스템 구현
- 확장 가능한 아키텍처 설계

## 🛠 기술 스택

### Backend
- **Java 17** - 최신 LTS 버전
- **Spring Boot 3.4.4** - 웹 애플리케이션 프레임워크
- **Spring Security** - 인증 및 보안
- **Spring Data JPA** - 데이터 접근 계층
- **MySQL** - 관계형 데이터베이스
- **Redis** - 캐싱 및 세션 관리
- **OAuth2** - 소셜 로그인 (네이버, 카카오)

### Frontend
- **Next.js 15** - React 기반 풀스택 프레임워크
- **React 19** - 사용자 인터페이스 라이브러리
- **TypeScript** - 정적 타입 검사
- **Tailwind CSS 4** - 유틸리티 기반 CSS 프레임워크
- **React Icons** - 아이콘 라이브러리

## 🏗 프로젝트 구조

```
aperio/
├── backend/                 # Spring Boot 백엔드
│   ├── src/main/java/com/portfolio/aperio/
│   │   ├── admin/          # 관리자 기능
│   │   ├── banner/         # 배너 관리
│   │   ├── config/         # 설정 파일
│   │   ├── reservation/    # 예약 시스템
│   │   ├── seat/           # 좌석 관리
│   │   ├── user/           # 사용자 관리
│   │   └── ...
│   └── src/main/resources/
│       ├── application.yml
│       └── static/
├── frontend/               # Next.js 프론트엔드
│   ├── src/
│   │   ├── app/           # App Router 페이지
│   │   ├── components/    # 재사용 가능한 컴포넌트
│   │   └── hooks/         # 커스텀 훅
│   ├── public/            # 정적 파일
│   └── package.json
└── README.md
```

## 🚀 시작하기

### 사전 요구사항
- Java 17 이상
- Node.js 18 이상
- MySQL 8.0 이상
- Redis (선택사항)

### 백엔드 실행

1. 데이터베이스 설정
```sql
CREATE DATABASE aperio_local;
```

2. 애플리케이션 실행
```bash
cd backend
./gradlew bootRun
```

### 프론트엔드 실행

1. 의존성 설치
```bash
cd frontend
npm install
```

2. 개발 서버 실행
```bash
npm run dev
```

3. 브라우저에서 `http://localhost:3000` 접속

## 🌟 주요 기능

### 사용자 기능
- 🔐 **회원가입/로그인** - 일반 로그인 및 소셜 로그인 (네이버, 카카오)
- 📅 **좌석 예약** - 실시간 좌석 현황 확인 및 예약
- 💳 **결제 시스템** - 카카오페이 연동
- 🎫 **쿠폰 시스템** - 할인 쿠폰 적용
- 👤 **마이페이지** - 예약 내역 및 프로필 관리

### 관리자 기능
- 📊 **대시보드** - 실시간 통계 및 현황 모니터링
- 👥 **사용자 관리** - 회원 정보 조회 및 관리
- 🪑 **좌석 관리** - 좌석 현황 및 설정 관리
- 📋 **예약 관리** - 예약 내역 조회 및 관리
- 🎨 **배너 관리** - 메인 페이지 배너 관리

## 🎨 디자인 철학

Aperio는 **"열림"**과 **"투명성"**을 핵심 가치로 하는 디자인을 추구합니다:

- **Clean & Modern**: 깔끔하고 현대적인 인터페이스
- **Accessible**: 모든 사용자가 쉽게 접근할 수 있는 UI
- **Responsive**: 다양한 디바이스에서 최적화된 경험
- **Intuitive**: 직관적이고 사용하기 쉬운 네비게이션

## 📝 라이선스

이 프로젝트는 개인 포트폴리오 목적으로 제작되었습니다.

## 👨‍💻 개발자

**Portfolio Project** - 개인 포트폴리오용 프로젝트

---

*"Aperio - 아이디어와 가능성을 열어주는 공간"*