# 개선된 쿠폰 구조 제안

## 1. Repository 통합 방안

### 현재 문제점
```java
// 중복된 Repository
CouponRepository.java           // 기본 CRUD
CouponAdminRepository.java      // 관리자용 (같은 엔티티 사용)
```

### 개선 방안 A: 단일 Repository + Custom Interface
```java
// 기본 Repository
public interface CouponRepository extends JpaRepository<Coupon, Long> {
    // 공통 메서드
    List<Coupon> findByActiveYn(String activeYn);
}

// 관리자 전용 쿼리 인터페이스
public interface CouponAdminRepositoryCustom {
    Page<Coupon> findCouponsWithFilter(Pageable pageable, String searchName);
    List<CouponStatistics> getCouponStatistics();
}

// 구현체
@Repository
public class CouponAdminRepositoryImpl implements CouponAdminRepositoryCustom {
    // QueryDSL 또는 JPQL로 복잡한 쿼리 구현
}

// 통합 Repository
public interface CouponRepository extends JpaRepository<Coupon, Long>, CouponAdminRepositoryCustom {
}
```

### 개선 방안 B: Repository 역할 분리 (권장)
```java
// 기본 CRUD Repository
public interface CouponRepository extends JpaRepository<Coupon, Long> {
    List<Coupon> findByActiveYn(String activeYn);
    Optional<Coupon> findByCpnNm(String couponName);
}

// 복잡한 조회 전용 Repository
@Repository
public class CouponQueryRepository {
    private final JPAQueryFactory queryFactory;
    
    public Page<Coupon> searchCouponsForAdmin(CouponSearchCondition condition, Pageable pageable) {
        // 복잡한 검색 로직
    }
    
    public List<CouponUsageStatistics> getCouponUsageStats() {
        // 통계 쿼리
    }
}
```

## 2. 서비스 구조 개선

### 현재 구조
```java
CouponAdminService.java    # 관리자 전용
CouponUserService.java     # 사용자 전용
```

### 개선된 구조
```java
// 핵심 비즈니스 로직 (공통)
@Service
public class CouponCoreService {
    private final CouponRepository couponRepository;
    
    public Coupon findById(Long id) { ... }
    public Coupon save(Coupon coupon) { ... }
    public boolean isValidCoupon(Coupon coupon) { ... }
}

// 관리자 서비스
@Service
public class CouponAdminService {
    private final CouponCoreService couponCoreService;
    private final CouponQueryRepository couponQueryRepository;
    
    public Page<AdminCouponResDto> searchCoupons(CouponSearchCondition condition, Pageable pageable) {
        return couponQueryRepository.searchCouponsForAdmin(condition, pageable)
            .map(AdminCouponResDto::from);
    }
    
    public void createCoupon(AdminCouponRegistReqDto dto) {
        validateAdminPermission();
        Coupon coupon = dto.toEntity();
        couponCoreService.save(coupon);
    }
}

// 사용자 서비스
@Service
public class CouponUserService {
    private final CouponCoreService couponCoreService;
    private final UserCouponRepository userCouponRepository;
    
    public void issueSignUpCoupon(User user) {
        Long couponId = determineCouponByUserType(user);
        Coupon coupon = couponCoreService.findById(couponId);
        
        UserCoupon userCoupon = UserCoupon.builder()
            .user(user)
            .coupon(coupon)
            .build();
            
        userCouponRepository.save(userCoupon);
    }
}
```

## 3. DTO 구조 개선

### 현재
```
dto/
├── (모든 DTO가 섞여있음)
```

### 개선
```
dto/
├── common/
│   ├── CouponDto.java
│   └── CouponSummaryDto.java
├── admin/
│   ├── request/
│   │   ├── AdminCouponCreateReq.java
│   │   └── AdminCouponUpdateReq.java
│   └── response/
│       ├── AdminCouponRes.java
│       └── AdminCouponListRes.java
└── user/
    ├── request/
    │   └── CouponIssueReq.java
    └── response/
        └── UserCouponRes.java
```

## 4. 최종 권장 구조

```
coupon/
├── domain/
│   └── Coupon.java
├── repository/
│   ├── CouponRepository.java        # 기본 CRUD
│   └── CouponQueryRepository.java   # 복잡한 조회
├── service/
│   ├── CouponCoreService.java       # 핵심 비즈니스 로직
│   ├── CouponAdminService.java      # 관리자 전용
│   └── CouponUserService.java       # 사용자 전용
├── dto/
│   ├── common/
│   ├── admin/
│   └── user/
└── controller/
    ├── CouponController.java
    └── AdminCouponController.java
```