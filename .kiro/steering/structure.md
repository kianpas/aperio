# 프로젝트 구조 및 조직

## 모노레포 레이아웃

```
aperio/
├── backend/                 # Spring Boot 애플리케이션
├── frontend/                # Next.js 애플리케이션
├── .kiro/                   # Kiro IDE 설정
└── *.md                     # 프로젝트 문서
```

## 백엔드 구조 (도메인 주도 설계)

### 권장 패키지 구조 (도메인별 분리)

```
backend/src/main/java/com/portfolio/aperio/
├── user/                    # 사용자 도메인
│   ├── controller/
│   │   ├── UserApiController.java      # 일반 사용자용 API
│   │   └── UserAdminController.java    # 관리자용 사용자 관리 API
│   ├── service/
│   │   └── UserService.java            # 비즈니스 로직 (공유)
│   ├── repository/
│   │   └── UserRepository.java
│   ├── domain/
│   │   └── User.java                   # 도메인 엔티티
│   └── dto/
│       ├── request/                    # 요청 DTO
│       └── response/                   # 응답 DTO
├── reservation/             # 예약 도메인
│   ├── controller/
│   │   ├── ReservationApiController.java
│   │   └── ReservationAdminController.java
│   ├── service/
│   ├── repository/
│   ├── domain/
│   └── dto/
├── coupon/                  # 쿠폰 도메인
│   ├── controller/
│   │   ├── CouponApiController.java
│   │   └── CouponAdminController.java
│   ├── service/
│   ├── repository/
│   ├── domain/
│   └── dto/
├── seat/                    # 좌석 도메인
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── domain/
│   └── dto/
├── dashboard/               # 대시보드 (조합 서비스)
│   ├── controller/
│   │   ├── UserDashboardController.java    # 사용자 대시보드
│   │   └── AdminDashboardController.java   # 관리자 대시보드
│   ├── service/
│   └── dto/
├── common/                  # 공통 유틸리티 및 DTO
├── config/                  # Spring 설정 클래스
└── AperioApplication.java   # 메인 애플리케이션 클래스
```

### 현재 구조 (레거시)

```
backend/src/main/java/com/portfolio/aperio/
├── admin/                   # 관리자 기능 (통합)
├── banner/                  # 배너 관리
├── common/                  # 공통 유틸리티 및 DTO
├── config/                  # Spring 설정 클래스
├── coupon/                  # 쿠폰 시스템
├── faq/                     # FAQ 관리
├── main/                    # 메인 페이지 컨트롤러
├── menu/                    # 메뉴 관리
├── mypage/                  # 마이페이지 (UI 중심 - 제거 예정)
├── pay/                     # 결제 연동
├── permission/              # 권한 관리
├── reservation/             # 예약 시스템 핵심
├── role/                    # 역할 기반 접근 제어
├── seat/                    # 좌석 관리
├── user/                    # 사용자 관리 및 인증
├── usercoupon/              # 사용자-쿠폰 관계
└── AperioApplication.java   # 메인 애플리케이션 클래스
```

## 프론트엔드 구조 (Next.js App Router)

```
frontend/src/
├── app/                     # App Router 페이지 및 레이아웃
│   ├── (auth)/             # 인증 페이지 그룹
│   └── ...                 # 기타 라우트 그룹
├── components/              # 재사용 가능한 UI 컴포넌트
├── hooks/                   # 커스텀 React 훅
└── lib/                     # 유틸리티 함수 및 API 클라이언트
```

## 아키텍처 패턴

### 백엔드 규칙

#### 패키지 구조 원칙

- **도메인 우선 분리**: 각 비즈니스 도메인별로 최상위 패키지 분리
- **컨트롤러 역할별 분리**: 도메인 내에서 API/Admin 컨트롤러 분리
  - `XxxApiController.java`: 일반 사용자용 API (`/api/v1/xxx/**`)
  - `XxxAdminController.java`: 관리자용 API (`/admin/xxx/**`)
- **서비스 로직 공유**: 비즈니스 로직은 하나의 Service에서 공유
- **DTO 세분화**: request/response 패키지로 DTO 분리

#### 아키텍처 패턴

- **계층형 아키텍처**: Controller → Service → Repository 패턴
- **DTO 패턴**: API 경계를 위한 별도의 요청/응답 DTO
- **Repository 패턴**: 커스텀 쿼리 메서드를 가진 JPA 리포지토리
- **Service 계층**: 비즈니스 로직 캡슐화
- **설정 클래스**: `config/` 패키지에 중앙화

#### URL 매핑 규칙

- **일반 사용자 API**: `/api/v1/{domain}/**`
- **관리자 API**: `/admin/{domain}/**`
- **대시보드**: `/dashboard` (사용자), `/admin/dashboard` (관리자)
- **시스템 API**: `/system/**`

### 프론트엔드 규칙

- **App Router**: Next.js 15 App Router 사용
- **컴포넌트 구성**: `components/`에 재사용 가능한 컴포넌트
- **커스텀 훅**: `hooks/` 디렉토리에 비즈니스 로직
- **API 계층**: `lib/api.ts`에 API 호출 중앙화
- **TypeScript**: 모든 컴포넌트와 함수에 엄격한 타입 적용

### 네이밍 규칙

- **백엔드**: 클래스는 PascalCase, 메서드/변수는 camelCase
- **프론트엔드**: 컴포넌트는 PascalCase, 함수/변수는 camelCase
- **API 엔드포인트**: `/api/v1/` 접두사를 가진 RESTful 네이밍
- **데이터베이스**: 테이블 및 컬럼명은 snake_case

### 인증 플로우

- Spring Security를 사용한 세션 기반 인증
- 프론트엔드는 API 호출 시 `credentials: "include"` 사용
- 사용자 로딩을 위한 커스텀 `UserDetailsService`
- 소셜 로그인을 위한 OAuth2 연동 (네이버, 카카오)

### Spring Security 주요 설정

- **CSRF 비활성화**: API 통신을 위해 비활성화됨
- **세션 관리**: IF_REQUIRED 정책, 최대 동시 세션 1개
- **권한 설정**: 대부분 경로가 permitAll()로 설정됨 (보안 검토 필요)
- **OAuth2 설정**: 네이버/카카오 소셜 로그인 지원

### 에러 처리

- 백엔드: 상태 코드와 함께 구조화된 에러 응답
- 프론트엔드: API 계층에서 중앙화된 에러 처리
- Resilience4j 어노테이션을 통한 속도 제한
- Bean Validation 어노테이션을 사용한 유효성 검사

### ⚠️ 보안 검토 필요 사항

- **과도한 permitAll()**: 현재 거의 모든 경로가 인증 없이 접근 가능 ("/\*\*" 포함)
- **CORS 설정 누락**: 프론트엔드-백엔드 간 CORS 설정이 명시적으로 없음
- **API 보안**: /api/\*\* 경로가 모두 permitAll()로 설정됨

## 🔧 향후 개선점

### Spring Security 보안 강화

- [ ] **CSRF SPA 모드 활성화**: `http.csrf((csrf) -> csrf.spa())` 적용
- [ ] **API 경로별 권한 설정**: `/api/v1/auth/**` 외 경로에 인증 요구
- [ ] **세션 고정 공격 방지**: `sessionFixation().newSession()` 설정
- [ ] **OAuth2 핸들러 개선**: 성공/실패 시 보안 로직 강화

### Next.js 보안 및 성능

- [ ] **CORS Middleware 구현**: 허용된 origin만 접근 가능하도록 설정
- [ ] **API 프록시 보안**: 인증 토큰 전달 및 검증 로직 추가
- [ ] **세션 쿠키 보안**: `httpOnly`, `secure`, `sameSite` 옵션 설정
- [ ] **Route Handler 보안**: 각 API 엔드포인트에 인증/권한 검증

### 아키텍처 개선

- [ ] **에러 처리 표준화**: 전역 예외 처리기 구현
- [ ] **로깅 시스템 강화**: 보안 이벤트 로깅 추가
- [ ] **테스트 커버리지**: 보안 관련 테스트 케이스 작성
