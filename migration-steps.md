# 단계적 마이그레이션 가이드

## Phase 1: 즉시 해결 (Import 오류 수정)

### 1. UserRole import 수정
```java
// src/main/java/com/wb/between/common/domain/UserRole.java
// 변경 전
import com.wb.between.user.domain.User;

// 변경 후  
import com.wb.between.common.domain.User;  // User가 common에 있다면
// 또는
import com.wb.between.user.domain.User;    // User가 user 패키지에 있다면
```

### 2. MenuRole import 수정
```java
// src/main/java/com/wb/between/common/domain/MenuRole.java
// 변경 후
import com.wb.between.common.domain.Menu;  // Menu 위치에 따라 조정
```

## Phase 2: 보안 도메인 생성 (권장)

### 1. 디렉토리 구조 생성
```
src/main/java/com/wb/between/security/
├── domain/
├── service/
├── repository/
└── dto/
```

### 2. 엔티티 이동
```bash
# common/domain → security/domain 이동
Role.java
Permission.java  
RolePermission.java
UserRole.java
MenuRole.java
```

### 3. 패키지 선언 수정
```java
// 모든 이동된 파일의 패키지 선언 변경
package com.wb.between.security.domain;
```

### 4. Import 경로 수정
```java
// 다른 파일들에서 import 경로 변경
import com.wb.between.security.domain.Role;
import com.wb.between.security.domain.UserRole;
```

## Phase 3: 서비스 계층 구성

### 1. 역할 관리 서비스
```java
@Service
public class RoleService {
    private final RoleRepository roleRepository;
    
    public List<Role> findAll() { ... }
    public Role findByCode(String code) { ... }
}
```

### 2. 권한 관리 서비스  
```java
@Service
public class PermissionService {
    private final PermissionRepository permissionRepository;
    
    public List<Permission> findByRole(Role role) { ... }
}
```

### 3. 사용자 역할 관리 서비스
```java
@Service
public class UserRoleService {
    private final UserRoleRepository userRoleRepository;
    
    public void assignRole(User user, Role role) { ... }
    public List<Role> getUserRoles(User user) { ... }
}
```

## Phase 4: 기존 코드 정리

### 1. 중복 로직 제거
- 각 도메인 서비스에서 역할 관련 로직을 SecurityService로 위임

### 2. 의존성 정리
- 순환 참조 방지
- 단방향 의존성 유지

### 3. 테스트 코드 업데이트
- 패키지 변경에 따른 테스트 수정