# 예약 시스템 API 연동 개선 가이드

## 📋 개요

현재 예약 페이지(`frontend/src/app/(main)/reservation/page.tsx`)는 더미 데이터로 구성되어 있습니다. 실제 백엔드 API와 연동하여 완전한 예약 시스템을 구축하기 위한 개선 사항을 정리했습니다.

## 🔍 현재 상태 분석

### ✅ 잘 구현된 부분
- 3단계 예약 플로우 UI (좌석 선택 → 날짜/시간 선택 → 결제)
- 반응형 디자인 및 사용자 친화적 인터페이스
- 컴포넌트 구조 분리 (SeatSelectionStep, DateTimeSelectionStep, PaymentStep)

### ❌ 개선 필요 부분
- 하드코딩된 더미 데이터
- 실시간 좌석 상태 미반영
- 실제 예약 생성 로직 없음
- 에러 처리 및 로딩 상태 부재

## 🛠 주요 수정 포인트

### 1. 데이터 페칭 구조 변경

#### 현재 문제점
```typescript
// 하드코딩된 좌석 데이터
const seats = [
  { id: 1, name: "A-01", type: "individual", status: "available" },
  // ...
];
```

#### 개선 방안
```typescript
// API에서 실시간 데이터 가져오기
const { data: seats, loading, error, refetch } = useSeats(selectedDate);

// 로딩 상태 처리
if (loading) return <SeatSelectionSkeleton />;
if (error) return <ErrorMessage onRetry={refetch} />;
```

### 2. 좌석 상태 실시간 반영

#### 현재 문제점
- 좌석 상태가 정적
- 다른 사용자의 예약이 실시간 반영되지 않음

#### 개선 방안
```typescript
// 실시간 상태 업데이트
useEffect(() => {
  const interval = setInterval(() => {
    refetchSeats();
  }, 30000); // 30초마다 업데이트

  return () => clearInterval(interval);
}, []);

// 좌석 선택 시 임시 잠금
const handleSeatSelect = async (seatId) => {
  try {
    await seatAPI.holdSeat(seatId);
    setSelectedSeat(seatId);
  } catch (error) {
    // 이미 다른 사용자가 선택한 경우
    showErrorMessage("이미 선택된 좌석입니다.");
  }
};
```

### 3. 예약 가능 시간 동적 처리

#### 현재 문제점
```typescript
// 고정된 시간 슬롯
const timeSlots = ["09:00", "10:00", "11:00", ...];
```

#### 개선 방안
```typescript
// 좌석별 동적 시간 슬롯
const { data: availableSlots } = useAvailableSlots(selectedSeat?.id, selectedDate);

// 예약된 시간 제외
const filteredSlots = availableSlots?.filter(slot => 
  !slot.isReserved && !slot.isHeld
);
```

### 4. 예약 프로세스 상태 관리

#### 추가 필요한 상태
```typescript
const [reservationState, setReservationState] = useState({
  isLoading: false,
  error: null,
  reservationId: null,
  step: 1
});

const [seatHoldTimer, setSeatHoldTimer] = useState(null);
```

### 5. 인증 상태 확인

#### 개선 방안
```typescript
// 예약 시작 전 인증 확인
const { user, isAuthenticated } = useAuth();

useEffect(() => {
  if (!isAuthenticated) {
    router.push('/login?redirect=/reservation');
  }
}, [isAuthenticated]);
```

## 🔌 필요한 API 엔드포인트

### 좌석 관련 API
```http
# 좌석 목록 조회 (날짜별 상태 포함)
GET /api/v1/seats?date=2024-03-01
Response: {
  "seats": [
    {
      "id": 1,
      "name": "A-01",
      "type": "individual",
      "status": "available",
      "operatingHours": { "start": "09:00", "end": "18:00" },
      "reservedSlots": ["14:00", "15:00"],
      "heldBy": null,
      "heldUntil": null
    }
  ]
}

# 특정 좌석의 예약 가능 시간
GET /api/v1/seats/{seatId}/available-slots?date=2024-03-01
Response: {
  "slots": [
    { "time": "09:00", "isAvailable": true },
    { "time": "10:00", "isAvailable": false, "reason": "reserved" }
  ]
}

# 좌석 임시 예약 (5분간 홀드)
POST /api/v1/seats/{seatId}/hold
Response: {
  "heldUntil": "2024-03-01T10:05:00Z",
  "holdToken": "abc123"
}
```

### 예약 관련 API
```http
# 예약 생성
POST /api/v1/reservations
Request: {
  "seatId": 1,
  "date": "2024-03-01",
  "startTime": "14:00",
  "endTime": "16:00",
  "holdToken": "abc123"
}
Response: {
  "reservationId": "res_123",
  "status": "confirmed",
  "paymentRequired": true,
  "paymentUrl": "/payment/res_123"
}

# 예약 확인
GET /api/v1/reservations/{reservationId}
```

## 📊 데이터 구조 개선

### Seat 타입 확장
```typescript
interface Seat {
  id: number;
  name: string;
  type: 'individual' | 'meeting' | 'lounge' | 'phone';
  
  // 실시간 상태
  realTimeStatus: 'available' | 'occupied' | 'held' | 'maintenance';
  
  // 운영 시간
  operatingHours: {
    start: string;
    end: string;
  };
  
  // 예약 정보
  reservedSlots: string[];
  heldBy?: string;
  heldUntil?: Date;
  
  // 추가 정보
  capacity: number;
  hourlyRate: number;
  features: string[];
  floor: string;
  location: string;
}
```

### Reservation 타입 정의
```typescript
interface Reservation {
  id: string;
  userId: string;
  seatId: number;
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}
```

## 🎯 사용자 경험 개선

### 1. 로딩 상태 처리
```typescript
// 스켈레톤 UI 컴포넌트
const SeatSelectionSkeleton = () => (
  <div className="grid grid-cols-4 gap-4">
    {Array.from({ length: 12 }).map((_, i) => (
      <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse" />
    ))}
  </div>
);

// 예약 처리 중 상태
const [isReserving, setIsReserving] = useState(false);

<button 
  disabled={isReserving}
  className={`${isReserving ? 'opacity-50 cursor-not-allowed' : ''}`}
>
  {isReserving ? '예약 처리 중...' : '예약하기'}
</button>
```

### 2. 에러 처리
```typescript
const ErrorMessage = ({ message, onRetry }) => (
  <div className="text-center py-8">
    <p className="text-red-600 mb-4">{message}</p>
    <button 
      onClick={onRetry}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg"
    >
      다시 시도
    </button>
  </div>
);

// 에러 타입별 처리
const handleReservationError = (error) => {
  switch (error.code) {
    case 'SEAT_ALREADY_RESERVED':
      showError('선택한 좌석이 이미 예약되었습니다.');
      refetchSeats();
      break;
    case 'SESSION_EXPIRED':
      router.push('/login');
      break;
    case 'PAYMENT_REQUIRED':
      router.push(`/payment/${error.reservationId}`);
      break;
    default:
      showError('예약 처리 중 오류가 발생했습니다.');
  }
};
```

### 3. 실시간 피드백
```typescript
// 좌석 홀드 타이머
const SeatHoldTimer = ({ heldUntil }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = new Date(heldUntil) - new Date();
      setTimeLeft(Math.max(0, remaining));
      
      if (remaining <= 0) {
        // 홀드 시간 만료
        handleHoldExpired();
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [heldUntil]);
  
  return (
    <div className="text-orange-600">
      좌석 선택 유지 시간: {Math.floor(timeLeft / 1000)}초
    </div>
  );
};
```

## 🚀 성능 최적화

### 1. 데이터 캐싱
```typescript
// React Query 활용
const useSeats = (date) => {
  return useQuery({
    queryKey: ['seats', date],
    queryFn: () => seatAPI.getSeats(date),
    staleTime: 30000, // 30초간 캐시 유지
    refetchInterval: 60000, // 1분마다 백그라운드 업데이트
  });
};
```

### 2. 불필요한 API 호출 방지
```typescript
// 디바운싱으로 날짜 변경 최적화
const debouncedDate = useDebounce(selectedDate, 500);

useEffect(() => {
  if (debouncedDate) {
    refetchSeats();
  }
}, [debouncedDate]);
```

## 🔒 보안 고려사항

### 1. 클라이언트 사이드 검증
```typescript
const validateReservation = (reservation) => {
  const errors = [];
  
  // 날짜 유효성 검사
  if (new Date(reservation.date) < new Date()) {
    errors.push('과거 날짜는 선택할 수 없습니다.');
  }
  
  // 시간 범위 검사
  if (reservation.startTime >= reservation.endTime) {
    errors.push('종료 시간은 시작 시간보다 늦어야 합니다.');
  }
  
  return errors;
};
```

### 2. 서버 사이드 검증
```java
// 백엔드에서 모든 검증 재수행
@PostMapping("/api/v1/reservations")
public ResponseEntity<ReservationResponse> createReservation(
    @RequestBody ReservationRequest request,
    Authentication auth) {
    
    // 1. 사용자 권한 확인
    // 2. 좌석 예약 가능 여부 확인
    // 3. 동시성 제어 (낙관적 락)
    // 4. 예약 생성
}
```

## 📅 구현 우선순위

### Phase 1: 기본 API 연동 (1-2일)
- [ ] 좌석 목록 API 연동
- [ ] 기본 예약 생성 API 연동
- [ ] 로딩 상태 및 에러 처리

### Phase 2: 실시간 기능 (2-3일)
- [ ] 좌석 상태 실시간 업데이트
- [ ] 좌석 홀드 기능
- [ ] 예약 가능 시간 동적 처리

### Phase 3: 사용자 경험 개선 (1-2일)
- [ ] 스켈레톤 UI 추가
- [ ] 상세한 에러 메시지
- [ ] 예약 진행 상황 표시

### Phase 4: 성능 최적화 (1일)
- [ ] 데이터 캐싱 구현
- [ ] 불필요한 API 호출 최적화
- [ ] 메모이제이션 적용

## 🧪 테스트 시나리오

### 기본 플로우 테스트
1. 좌석 목록 로딩 확인
2. 좌석 선택 → 날짜/시간 선택 → 예약 생성
3. 예약 완료 후 마이페이지에서 확인

### 에러 케이스 테스트
1. 네트워크 오류 시 재시도 기능
2. 이미 예약된 좌석 선택 시 처리
3. 세션 만료 시 로그인 페이지 리다이렉트
4. 좌석 홀드 시간 만료 처리

### 동시성 테스트
1. 여러 사용자가 같은 좌석 선택 시
2. 예약 처리 중 다른 사용자의 예약 완료 시

이 가이드를 참고하여 단계적으로 API 연동을 진행하시면 완전한 예약 시스템을 구축할 수 있습니다.