# 패키지 구조 가이드라인

## 도메인 중심 패키지 구조

### 기본 원칙
1. **도메인 우선**: 비즈니스 도메인별로 최상위 패키지 분리
2. **역할별 컨트롤러**: 도메인 내에서 사용자/관리자 컨트롤러 분리
3. **서비스 통합**: 비즈니스 로직은 하나의 Service에서 관리
4. **DTO 세분화**: 요청/응답 DTO를 명확히 분리

### 표준 도메인 패키지 구조

```
{domain}/
├── controller/
│   ├── {Domain}Controller.java      # 일반 사용자용 API
│   └── {Domain}AdminController.java    # 관리자용 API
├── service/
│   └── {Domain}Service.java            # 비즈니스 로직 (공유)
├── repository/
│   └── {Domain}Repository.java         # 데이터 접근 계층
├── domain/ (또는 entity/)
│   └── {Domain}.java                   # 도메인 엔티티
└── dto/
    ├── request/                        # 요청 DTO
    │   ├── {Domain}CreateRequest.java
    │   ├── {Domain}UpdateRequest.java
    │   └── {Domain}SearchRequest.java
    └── response/                       # 응답 DTO
        ├── {Domain}Response.java
        ├── {Domain}DetailResponse.java
        └── {Domain}ListResponse.java
```

### 컨트롤러 명명 규칙

#### ApiController (일반 사용자용)
```java
@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    @GetMapping("/profile")              // GET /api/v1/users/profile
    @PutMapping("/profile")              // PUT /api/v1/users/profile
    @PostMapping("/change-password")     // POST /api/v1/users/change-password
}
```

#### AdminController (관리자용)
```java
@RestController
@RequestMapping("/admin/users")
public class UserAdminController {
    @GetMapping                          // GET /admin/users
    @GetMapping("/{id}")                 // GET /admin/users/{id}
    @PostMapping                         // POST /admin/users
    @PutMapping("/{id}")                 // PUT /admin/users/{id}
    @DeleteMapping("/{id}")              // DELETE /admin/users/{id}
}
```

### URL 매핑 표준

| 사용자 타입 | URL 패턴 | 예시 |
|------------|----------|------|
| 일반 사용자 | `/api/v1/{domain}/**` | `/api/v1/users/profile` |
| 관리자 | `/admin/{domain}/**` | `/admin/users` |
| 대시보드 | `/dashboard`, `/admin/dashboard` | `/dashboard`, `/admin/dashboard` |
| 시스템 | `/system/**` | `/system/health` |

### DTO 네이밍 규칙

#### Request DTO
- `{Domain}CreateRequest.java` - 생성 요청
- `{Domain}UpdateRequest.java` - 수정 요청
- `{Domain}SearchRequest.java` - 검색 요청
- `{Domain}FilterRequest.java` - 필터링 요청

#### Response DTO
- `{Domain}Response.java` - 기본 응답
- `{Domain}DetailResponse.java` - 상세 응답
- `{Domain}ListResponse.java` - 목록 응답
- `{Domain}SummaryResponse.java` - 요약 응답

### 서비스 계층 설계

```java
@Service
@Transactional(readOnly = true)
public class UserService {
    
    // 일반 사용자용 메서드
    public UserResponse getUserProfile(Long userId) { }
    public UserResponse updateUserProfile(Long userId, UserUpdateRequest request) { }
    
    // 관리자용 메서드
    public Page<UserListResponse> getAllUsers(UserSearchRequest request, Pageable pageable) { }
    public UserDetailResponse getUserDetail(Long userId) { }
    public UserResponse createUser(UserCreateRequest request) { }
    
    // 공통 메서드
    private User findUserById(Long userId) { }
    private void validateUser(User user) { }
}
```

### 특수 패키지

#### Dashboard 패키지
```
dashboard/
├── controller/
│   ├── UserDashboardController.java    # GET /dashboard
│   └── AdminDashboardController.java   # GET /admin/dashboard
├── service/
│   ├── UserDashboardService.java       # 사용자 대시보드 데이터 조합
│   └── AdminDashboardService.java      # 관리자 대시보드 데이터 조합
└── dto/
    ├── UserDashboardResponse.java
    └── AdminDashboardResponse.java
```

#### Common 패키지
```
common/
├── dto/
│   ├── ApiResponse.java                # 공통 API 응답 래퍼
│   ├── PageResponse.java               # 페이징 응답
│   └── ErrorResponse.java              # 에러 응답
├── exception/
│   ├── CustomException.java
│   └── GlobalExceptionHandler.java
└── util/
    ├── DateUtil.java
    └── ValidationUtil.java
```

### 마이그레이션 가이드

#### 1단계: 새로운 구조로 컨트롤러 분리
```java
// 기존
@Controller
@RequestMapping("/mypage")
public class MypageController {
    // 모든 기능이 하나에
}

// 개선
@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    // 사용자 프로필 관련만
}

@RestController
@RequestMapping("/admin/users")
public class UserAdminController {
    // 사용자 관리 관련만
}
```

#### 2단계: DTO 재구성
```java
// 기존
public class MypageUserInfoResDto { }

// 개선
public class UserProfileResponse { }      // response/
public class UserUpdateRequest { }       // request/
```

#### 3단계: 서비스 통합
```java
// 기존
public class MypageService { }
public class MyReservationService { }

// 개선
public class UserService { }              // 사용자 관련 통합
public class ReservationService { }       // 예약 관련 통합
```

### 검증 체크리스트

- [ ] 도메인별로 패키지가 분리되어 있는가?
- [ ] 컨트롤러가 Api/Admin으로 역할별 분리되어 있는가?
- [ ] URL 매핑이 표준을 따르고 있는가?
- [ ] DTO가 request/response로 분리되어 있는가?
- [ ] 서비스 로직이 중복되지 않고 공유되고 있는가?
- [ ] 네이밍 규칙을 일관성 있게 따르고 있는가?