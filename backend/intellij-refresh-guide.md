# IntelliJ Import 문제 해결 가이드

## 1. 즉시 해결 방법

### A. 프로젝트 새로고침
```
1. Gradle/Maven 탭 열기
2. 새로고침 버튼 클릭 (🔄)
3. 또는 Ctrl + Shift + O (Reimport)
```

### B. 캐시 무효화
```
File → Invalidate Caches and Restart
→ Invalidate and Restart 클릭
```

### C. Import 최적화
```
1. AdminCouponService.java 파일 열기
2. Ctrl + Alt + O (Optimize Imports)
3. 또는 Code → Optimize Imports
```

## 2. 수동 Import 추가

만약 자동 import가 안 된다면:

```java
// AdminCouponService.java 상단에 직접 추가
import com.wb.between.coupon.domain.Coupon;
import com.wb.between.coupon.dto.request.admin.AdminCouponRegistReqDto;
import com.wb.between.coupon.dto.request.admin.AdminCouponEditReqDto;
import com.wb.between.coupon.dto.response.admin.AdminCouponResDto;
```

## 3. 프로젝트 구조 확인

### 현재 올바른 구조:
```
src/main/java/com/wb/between/coupon/
├── domain/
│   └── Coupon.java ✅
├── dto/
│   ├── request/
│   │   └── admin/
│   │       ├── AdminCouponRegistReqDto.java ✅
│   │       └── AdminCouponEditReqDto.java ✅
│   └── response/
│       └── admin/
│           └── AdminCouponResDto.java ✅
├── service/
│   └── AdminCouponService.java ✅
└── repository/
    └── CouponRepository.java ✅
```

## 4. 빌드 확인

### Gradle 프로젝트인 경우:
```bash
./gradlew clean build
```

### Maven 프로젝트인 경우:
```bash
mvn clean compile
```

## 5. IDE 설정 확인

### Project Structure 확인:
```
File → Project Structure → Modules
→ Sources 탭에서 src/main/java가 Sources로 설정되어 있는지 확인
```