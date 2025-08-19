# 스프링 시큐리티 및 도메인 설계 리팩토링 논의

이 문서는 진행된 아키텍처 및 리팩토링 관련 질의응답 내용을 요약하여 기록합니다.

## 목차
1. [UserDetailsService와 CQRS 패턴](#1-userdetailsservice와-cqrs-패턴)
2. [UserDetailsService와 UserQueryService의 책임 분리](#2-userdetailsservice와-userqueryservice의-책임-분리)
3. [WebSecurityConfig의 패키지 위치](#3-websecurityconfig의-패키지-위치)
4. [User와 UserDetails의 관계](#4-user와-userdetails의-관계)
5. [User 엔티티와 OAuth 책임 분리](#5-user-엔티티와-oauth-책임-분리)
6. [OAuth 기능 구현을 위한 패키지 구조와 디자인 패턴](#6-oauth-기능-구현을-위한-패키지-구조와-디자인-패턴)
7. [최종 추천 패키지 구조도](#7-최종-추천-패키지-구조도-diagram)

---

### 1. UserDetailsService와 CQRS 패턴

- **질문 요약:** `UserDetailsService`는 CQRS(명령 조회 책임 분리) 패턴에서 Command, Query 중 어디에 속하는가?
- **답변 요약:** 명백한 **Query**입니다.
    - **이유:** `loadUserByUsername` 메소드는 시스템의 상태를 변경하지 않고, 사용자 정보를 **조회(Read)**하여 반환하는 역할만 수행하기 때문입니다.
    - **Command:** 사용자를 생성, 수정, 삭제하는 등 상태를 변경하는 작업.
    - **Query:** 사용자 정보를 조회하는 작업.

---

### 2. UserDetailsService와 UserQueryService의 책임 분리

- **질문 요약:** `security` 패키지의 `UserDetailService`가 `user` 패키지의 `UserQueryService`를 호출하는 구조는 어떤가?
- **답변 요약:** **매우 훌륭하고 권장되는 구조**입니다.
    - **`UserDetailServiceImpl` (in `security`):** Spring Security 프레임워크와의 **어댑터(Adapter)** 역할. 실제 데이터 조회 로직은 `UserQueryService`에 위임하고, 반환된 도메인 객체를 `UserDetails`로 변환하는 책임만 가집니다.
    - **`UserQueryService` (in `user`):** 순수한 **사용자 조회 비즈니스 로직**을 담당. Spring Security에 대한 의존성이 전혀 없습니다.
    - **장점:**
        - **관심사 분리 (SoC):** 보안과 비즈니스 로직이 명확하게 분리됩니다.
        - **재사용성:** `UserQueryService`는 다른 서비스에서도 쉽게 재사용 가능합니다.
        - **테스트 용이성:** 각 부분을 독립적으로 테스트하기 매우 편리합니다.

---

### 3. WebSecurityConfig의 패키지 위치

- **질문 요약:** `WebSecurityConfig.java`는 `config` 패키지와 `security` 패키지 중 어디에 위치하는 것이 좋은가?
- **답변 요약:** **`security` 패키지에 함께 위치시키는 것**이 현대적인 설계에서 더 권장됩니다.
    - **타입별 패키징 (`config`에 위치):** 모든 `@Configuration`을 한 곳에 모으는 전통적인 방식. 프로젝트가 작을 땐 단순하지만, 기능이 커지면 보안 관련 코드가 여러 곳에 흩어집니다.
    - **기능별 패키징 (`security`에 위치):** 보안과 관련된 모든 클래스(설정, 서비스, 필터, 핸들러 등)를 한 곳에 모으는 방식.
        - **장점:** 높은 응집도, 낮은 결합도, 뛰어난 확장성 및 유지보수성.

| 기준 | `config` 패키지 (타입별) | `security` 패키지 (기능별) |
| :--- | :--- | :--- |
| **응집도** | 낮음 (보안 코드 분산) | **높음** (보안 코드 집중) |
| **확장성** | 보통 | **우수** |
| **유지보수**| 보안 변경 시 여러 패키지 확인 | `security` 패키지만 확인 |
| **추천** | 간단한 프로젝트 | **대부분의 실무 프로젝트** |

---

### 4. User와 UserDetails의 관계

- **질문 요약:** `UserDetailsService`는 `UserDetails`를 반환해야 하는데, 실제로는 `User` 객체를 다루는 경우가 있다. 어떻게 가능한가?
- **답변 요약:** `User` 객체를 `UserDetails` 타입으로 변환하여 반환하며, 방법은 두 가지입니다.
    1.  **`User` 엔티티가 `UserDetails` 직접 구현:** `class User implements UserDetails { ... }`
        - **장점:** 간단하고 직관적.
        - **단점:** 도메인 모델이 특정 프레임워크(Spring Security)에 종속됨.
    2.  **별도의 래퍼(Wrapper) 클래스 사용 (권장):** `CustomUserDetails` 클래스가 `UserDetails`를 구현하고, 내부에 `User` 객체를 멤버로 가짐.
        - **장점:** 도메인 모델의 순수성 유지, 명확한 책임 분리.
        - **구현:** `loadUserByUsername`에서 `User` 조회 후 `new CustomUserDetails(user)`를 반환.

---

### 5. User 엔티티와 OAuth 책임 분리

- **질문 요약:** `User` 엔티티에 포함된 OAuth 관련 정보를 별도로 분리하는 것이 맞는가? 어떻게 분리하는가?
- **답변 요약:** **분리하는 것이 전적으로 옳은 결정**입니다.
    - **이유:** 확장성(다중 소셜 계정 연동), 단일 책임 원칙(User는 핵심 정보만 담당)을 위해 필요합니다.
    - **방법:** **`UserSocialAccount` 라는 별도의 엔티티를 생성**하여 `User`와 **1:N 관계**를 맺습니다.
        - **`UserSocialAccount` 엔티티:** `id`, `provider`, `providerId`, `user (FK)` 필드를 가집니다.
        - **`User` 엔티티:** 기존 OAuth 필드를 제거하고, `List<UserSocialAccount>` 컬렉션을 추가합니다.
        - 이 구조는 한 명의 유저가 여러 소셜 계정을 연동하는 기능을 자연스럽게 지원합니다.

---

### 6. OAuth 기능 구현을 위한 패키지 구조와 디자인 패턴

- **질문 요약:**
    1. OAuth 관련 클래스들을 위한 별도 `oauth` 패키지를 만드는가?
    2. 소셜 서비스별 로직 분리를 위해 전략 패턴(Strategy Pattern)을 사용하는 것이 좋은가?
- **답변 요약:**
    1. **네, `oauth` 패키지를 만드는 것이 좋습니다.** 기능별 패키징 원칙에 따라 OAuth 관련 모든 클래스(서비스, 핸들러, DTO 등)를 모아 응집도를 높입니다.
    2. **네, 전략 패턴은 이 시나리오에 아주 이상적인 디자인 패턴입니다.**
        - **문제점:** Google, Kakao, Naver 등 각 소셜 서비스마다 사용자 정보를 반환하는 데이터 구조가 다릅니다. 이를 `if/else`로 처리하면 코드가 지저분해지고 OCP 원칙에 위배됩니다.
        - **해결책 (전략 패턴):**
            - `OAuth2UserInfo` 라는 공통 **인터페이스(전략)**를 정의합니다.
            - `GoogleUserInfo`, `KakaoUserInfo` 등 각 서비스별 **구체적인 클래스(전략 구현체)**를 만듭니다.
            - `CustomOAuth2UserService`에서는 provider 이름에 맞는 전략 구현체를 선택하여, 표준화된 방식으로 사용자 정보를 파싱합니다.
        - **장점:** 새로운 소셜 로그인을 추가할 때, 새로운 전략 클래스만 추가하면 되므로 기존 코드 수정이 최소화됩니다.

---

### 7. 최종 추천 패키지 구조도 (Diagram)

지금까지 논의된 모든 내용을 종합하여, 기능별 패키징(Package-by-feature) 원칙에 따라 추천하는 최종 패키지 구조는 다음과 같습니다.

```
com/portfolio/aperio/
├── common/
│   └── util/
│       └── ... (공통 유틸리티)
├── config/
│   ├── JpaConfig.java
│   └── WebMvcConfig.java
│
├── user/
│   ├── controller/
│   │   └── UserController.java
│   ├── service/
│   │   ├── UserQueryService.java   // 순수 유저 조회 서비스
│   │   └── UserCommandService.java  // 순수 유저 변경 서비스
│   ├── repository/
│   │   └── UserRepository.java
│   └── entity/ (or model/)
│       └── User.java               // 핵심 도메인 엔티티
│
├── security/
│   ├── WebSecurityConfig.java      // 시큐리티 설정
│   ├── UserDetailServiceImpl.java  // UserDetailsService 구현체 (어댑터 역할)
│   └── dto/
│       └── CustomUserDetails.java    // UserDetails 래퍼 클래스
│
└── oauth/
    ├── service/
    │   └── CustomOAuth2UserService.java  // OAuth2 핵심 서비스
    ├── handler/
    │   └── OAuth2LoginSuccessHandler.java  // 로그인 성공 핸들러
    ├── provider/ (or dto/)
    │   ├── OAuth2UserInfo.java         // 전략 인터페이스
    │   ├── GoogleUserInfo.java         // 구글 처리 전략
    │   └── KakaoUserInfo.java          // 카카오 처리 전략
    ├── entity/
    │   └── UserSocialAccount.java      // 소셜 계정 엔티티
    └── repository/
        └── UserSocialAccountRepository.java // 소셜 계정 레포지토리
```

**핵심 아이디어:**
- **`user`:** 순수한 사용자 도메인의 책임만 가집니다.
- **`security`:** Spring Security와의 연동 및 일반적인 인증/인가 처리 책임을 가집니다.
- **`oauth`:** 소셜 로그인의 모든 책임(데이터 파싱, DB처리, 핸들러)을 독립적으로 가집니다.