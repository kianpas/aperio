# 기술 스택

## 백엔드

- **Java 17** - 최신 LTS 버전
- **Spring Boot 3.4.4** - 웹 애플리케이션 프레임워크
- **Spring Security** - 인증 및 권한 관리
- **Spring Data JPA** - Hibernate 기반 데이터 접근 계층
- **PostgreSQL** - 주 관계형 데이터베이스 (aperio_local DB 사용)
- **Redis** - 캐싱 및 세션 관리
- **MyBatis** - SQL 매핑 프레임워크 (JPA와 함께 사용)
- **OAuth2** - 소셜 로그인 연동 (네이버, 카카오)
  - CustomOAuth2UserService로 사용자 정보 처리
  - User 엔티티가 OAuth2User 인터페이스 구현
  - 소셜 로그인 시 자동 회원가입 지원
- **CoolSMS** - 휴대폰 본인인증 SMS 발송
- **카카오페이** - 결제 시스템 연동
- **Gmail SMTP** - 이메일 인증 발송
- **Resilience4j** - 서킷 브레이커 및 속도 제한
- **Lombok** - 보일러플레이트 코드 생성

## 프론트엔드

- **Next.js 15** - App Router 기반 React 풀스택 프레임워크
- **React 19** - 최신 기능을 포함한 UI 라이브러리
- **TypeScript 5** - 정적 타입 검사
- **Tailwind CSS 4** - 유틸리티 기반 CSS 프레임워크
- **React Icons** - 아이콘 라이브러리

## 빌드 도구 및 개발 환경

- **Gradle** - 백엔드 빌드 자동화
- **npm** - 프론트엔드 패키지 관리
- **Spring Boot DevTools** - 개발 시 핫 리로드

## 주요 명령어

### 백엔드 개발

```bash
# 백엔드 디렉토리로 이동
cd backend

# 개발 서버 실행
./gradlew bootRun

# 프로젝트 빌드
./gradlew build

# 테스트 실행
./gradlew test
```

### 프론트엔드 개발

```bash
# 프론트엔드 디렉토리로 이동
cd frontend

# 의존성 설치
npm install

# Turbopack으로 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 시작
npm start

# 린팅 실행
npm run lint
```

## 개발 환경 설정

1. Java 17 이상 필요
2. Node.js 18 이상 필요
3. PostgreSQL 8.0 이상 (데이터베이스)
4. Redis (선택사항, 캐싱용)

## 데이터베이스 설정

- **프로파일별 설정 구조**: application.yml (공통) + application-local.yml (로컬)
- **로컬 DB**: PostgreSQL `aperio_local` (localhost:5432)
- **실행 방식**: `spring.profiles.active: local` 설정으로 로컬 프로파일 활성화
- **추가 서비스**: Redis (예약 동시성 제어), CoolSMS (휴대폰 인증), 카카오페이 (결제)

## API 통신

- 백엔드 포트: 8080
- 프론트엔드 포트: 3000
- API 기본 URL: `http://localhost:8080`
- 세션 기반 인증, credentials 포함하여 통신
- Next.js에서 `/api/*` 경로를 백엔드로 프록시 설정됨

## 🔧 향후 개선점

### 보안 강화

- [ ] **HTTPS 적용**: 프로덕션 환경에서 SSL/TLS 인증서 적용
- [ ] **환경 변수 보안**: 민감한 정보 암호화 저장
- [ ] **API 키 관리**: 외부 서비스 API 키 보안 관리 체계 구축

### 성능 최적화

- [ ] **Redis 클러스터링**: 고가용성을 위한 Redis 클러스터 구성
- [ ] **데이터베이스 최적화**: 인덱스 최적화 및 쿼리 성능 개선
- [ ] **CDN 적용**: 정적 자원 배포를 위한 CDN 설정

### 모니터링 및 로깅

- [ ] **APM 도구 연동**: 애플리케이션 성능 모니터링 시스템 구축
- [ ] **로그 중앙화**: ELK 스택 또는 유사 도구로 로그 관리
- [ ] **헬스체크 API**: 시스템 상태 모니터링 엔드포인트 추가

### 개발 생산성

- [ ] **CI/CD 파이프라인**: GitHub Actions 또는 Jenkins를 통한 자동 배포
- [ ] **테스트 자동화**: 단위 테스트 및 통합 테스트 커버리지 향상
- [ ] **코드 품질 도구**: SonarQube 등 정적 분석 도구 도입
