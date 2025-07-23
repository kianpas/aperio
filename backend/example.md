# 복잡한 시스템을 위한 쿠폰 서비스 구조 예시

## 1. 핵심 도메인 서비스 (CouponCoreService)
```java
@Service
@Transactional
public class CouponCoreService {
    
    private final CouponRepository couponRepository;
    
    // 핵심 비즈니스 로직만 담당
    public Coupon createCoupon(CouponCreateCommand command) {
        validateCouponPolicy(command);
        return couponRepository.save(command.toEntity());
    }
    
    public void validateCouponPolicy(CouponCreateCommand command) {
        // 쿠폰 정책 검증 로직
    }
    
    public boolean isValidCoupon(Long couponId) {
        // 쿠폰 유효성 검증
    }
}
```

## 2. 사용자 서비스 (CouponUserService)
```java
@Service
public class CouponUserService {
    
    private final CouponCoreService couponCoreService;
    private final UserCouponRepository userCouponRepository;
    
    // 사용자 관점의 비즈니스 로직
    public void issueSignUpCoupon(User user) {
        Long couponId = determineCouponByUserType(user);
        Coupon coupon = couponCoreService.findById(couponId);
        
        UserCoupon userCoupon = UserCoupon.builder()
            .user(user)
            .coupon(coupon)
            .build();
            
        userCouponRepository.save(userCoupon);
    }
    
    public List<UserCoupon> getAvailableCoupons(Long userId) {
        // 사용 가능한 쿠폰 조회
    }
}
```

## 3. 관리자 서비스 (CouponAdminService)
```java
@Service
public class CouponAdminService {
    
    private final CouponCoreService couponCoreService;
    private final CouponQueryRepository couponQueryRepository;
    
    // 관리자 관점의 비즈니스 로직
    public Page<AdminCouponResDto> searchCoupons(CouponSearchCondition condition, Pageable pageable) {
        return couponQueryRepository.searchWithCondition(condition, pageable)
            .map(AdminCouponResDto::from);
    }
    
    public void createCouponWithValidation(AdminCouponRegistReqDto dto) {
        validateAdminPermission();
        CouponCreateCommand command = CouponCreateCommand.from(dto);
        couponCoreService.createCoupon(command);
    }
    
    public CouponStatistics getCouponStatistics() {
        // 쿠폰 통계 조회
    }
}
```

## 4. 통합 Repository
```java
@Repository
public interface CouponRepository extends JpaRepository<Coupon, Long> {
    // 기본 CRUD만
}

@Repository
public class CouponQueryRepository {
    
    private final JPAQueryFactory queryFactory;
    
    // 복잡한 조회 쿼리
    public Page<Coupon> searchWithCondition(CouponSearchCondition condition, Pageable pageable) {
        // QueryDSL을 이용한 복잡한 검색
    }
    
    public List<CouponStatistics> getCouponUsageStatistics() {
        // 통계 쿼리
    }
}
```