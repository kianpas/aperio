# Import 문제 해결 및 베스트 프랙티스

## 1. 문제 원인
- 와일드카드 import(`*`)는 직접적인 하위 패키지만 포함
- `com.wb.between.coupon.dto.response.*`는 `admin` 하위 패키지를 포함하지 않음

## 2. 해결 방법

### A. 명시적 Import (권장)
```java
import com.wb.between.coupon.dto.request.admin.AdminCouponRegistReqDto;
import com.wb.between.coupon.dto.request.admin.AdminCouponEditReqDto;
import com.wb.between.coupon.dto.response.admin.AdminCouponResDto;
```

### B. 하위 패키지별 와일드카드
```java
import com.wb.between.coupon.dto.request.admin.*;
import com.wb.between.coupon.dto.response.admin.*;
```

## 3. IDE 설정 권장사항

### IntelliJ IDEA
```
Settings → Editor → Code Style → Java → Imports
- Class count to use import with '*': 10
- Names count to use static import with '*': 10
- Import layout 순서 설정
```

### Eclipse
```
Preferences → Java → Code Style → Organize Imports
- Number of imports needed for .*: 10
- Number of static imports needed for .*: 10
```

## 4. 패키지 구조 베스트 프랙티스

### 현재 구조 (권장)
```
coupon/
├── domain/Coupon.java
├── repository/CouponRepository.java
├── service/
│   ├── AdminCouponService.java
│   └── CouponService.java
├── dto/
│   ├── common/
│   ├── request/
│   │   ├── admin/
│   │   └── user/
│   └── response/
│       ├── admin/
│       └── user/
└── controller/
    ├── AdminCouponController.java
    └── CouponController.java
```

## 5. 향후 확장 고려사항

### A. 공통 DTO 추출
```java
// 공통 기본 정보
public class CouponBaseDto {
    protected Long cpNo;
    protected String cpnNm;
    protected String cpnDsc;
}

// 관리자용 확장
public class AdminCouponResDto extends CouponBaseDto {
    private String activeYn;
    private LocalDateTime createDt;
    // 관리자 전용 필드들
}
```

### B. 매퍼 클래스 도입
```java
@Component
public class CouponMapper {
    public AdminCouponResDto toAdminResponse(Coupon coupon) {
        return AdminCouponResDto.builder()
            .cpNo(coupon.getCpNo())
            .cpnNm(coupon.getCpnNm())
            // ... 매핑 로직
            .build();
    }
}
```