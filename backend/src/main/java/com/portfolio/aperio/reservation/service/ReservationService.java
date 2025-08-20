package com.portfolio.aperio.reservation.service;

import com.portfolio.aperio.common.exception.CustomException;
import com.portfolio.aperio.mypage.dto.MyReservationDetailDto;
import com.portfolio.aperio.mypage.repository.MyReservationRepository;
import com.portfolio.aperio.pay.domain.Payment;
import com.portfolio.aperio.pay.repository.PaymentRepository;
import com.portfolio.aperio.reservation.domain.Reservation;
import com.portfolio.aperio.reservation.dto.ReservationRequestDto;
import com.portfolio.aperio.reservation.dto.user.UserReservationResponse;
import com.portfolio.aperio.reservation.repository.ReservationRepository;
import com.portfolio.aperio.seat.domain.Seat;
import com.portfolio.aperio.seat.repository.SeatRepository;
import com.portfolio.aperio.user.domain.User;
import com.portfolio.aperio.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReservationService {

    @Autowired
    private StringRedisTemplate redisTemplate;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    private final MyReservationRepository myReservationRepository; // 예약 리포지토리 주입
    private final SeatRepository seatRepository; // 좌석 리포지토리 주입

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");


    private static final long LOCK_TIMEOUT_SECONDS = 10;
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");
    private static final LocalTime OPEN_TIME = LocalTime.of(9, 0);
    private static final LocalTime CLOSE_TIME = LocalTime.of(22, 0);

    /**
     * Redis 락을 사용하여 예약을 생성합니다.
     */
    @Transactional
    public Reservation createReservationWithLock(ReservationRequestDto requestDto, String username) {
        Objects.requireNonNull(requestDto.getItemId(), "좌석 ID는 필수입니다.");
        Objects.requireNonNull(requestDto.getReservationDate(), "예약 날짜는 필수입니다.");
        Objects.requireNonNull(requestDto.getPlanType(), "요금제는 필수입니다.");
        Objects.requireNonNull(username, "사용자 정보(username)는 필수입니다.");

        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("예약 서비스에서 사용자를 찾을 수 없습니다: " + username));
        Long userNo = user.getUserId();
        //TODO: 임시 코드
        String authCd = "임직원";
        if (userNo == null) {
            throw new IllegalStateException("사용자 번호(userNo)를 가져올 수 없습니다.");
        }

        LocalDate reservationDate = LocalDate.parse(requestDto.getReservationDate());
        LocalDateTime startDateTime;
        LocalDateTime endDateTime;

        switch (requestDto.getPlanType()) {
            case "HOURLY":
                if (requestDto.getSelectedTimes() == null || requestDto.getSelectedTimes().isEmpty()) {
                    throw new IllegalArgumentException("시간제는 예약 시간을 선택해야 합니다.");
                }
                requestDto.getSelectedTimes().sort(Comparator.naturalOrder());
                LocalTime startTime = LocalTime.parse(requestDto.getSelectedTimes().get(0), TIME_FORMATTER);
                LocalTime lastTime = LocalTime.parse(requestDto.getSelectedTimes().get(requestDto.getSelectedTimes().size() - 1), TIME_FORMATTER);
                startDateTime = reservationDate.atTime(startTime);
                endDateTime = reservationDate.atTime(lastTime.plusHours(1));
                break;
            case "DAILY":
                startDateTime = reservationDate.atTime(OPEN_TIME);
                endDateTime = reservationDate.atTime(CLOSE_TIME);
                break;
            case "MONTHLY":
                startDateTime = reservationDate.atTime(OPEN_TIME);
                endDateTime = reservationDate.plusMonths(1).atTime(CLOSE_TIME);
                break;
            default:
                throw new IllegalArgumentException("알 수 없는 요금제 타입입니다.");
        }

        String lockKey = String.format("lock:seat:%s:%s", requestDto.getItemId(), requestDto.getReservationDate());
        String lockValue = UUID.randomUUID().toString();
        Boolean lockAcquired = false;
        try {
            lockAcquired = redisTemplate.opsForValue().setIfAbsent(lockKey, lockValue, Duration.ofSeconds(LOCK_TIMEOUT_SECONDS));

            if (lockAcquired == null || !lockAcquired) {
                System.out.println("락 획득 실패: " + lockKey);
                throw new RuntimeException("다른 사용자가 현재 좌석/날짜를 예약 중입니다. 잠시 후 다시 시도해주세요.");
            }
            System.out.println("락 획득 성공: " + lockKey);

            long overlappingCount = reservationRepository.countOverlappingReservations(
                    requestDto.getItemId(), startDateTime, endDateTime);

            if (overlappingCount > 0) {
                System.out.println("중복 예약 발견됨: " + lockKey);
                throw new RuntimeException("선택하신 시간에 이미 예약이 존재합니다.");
            }
            System.out.println("DB 예약 가능 확인 완료");

            String basePriceStr = calculateBasePrice(requestDto.getPlanType(), requestDto.getSelectedTimes());
            String discountPriceStr = calculateDiscount(basePriceStr, requestDto.getCouponId());
            String finalPriceStr = calculateFinalPrice(basePriceStr, discountPriceStr);

            boolean isAuth = "임직원".equals(authCd);
            if(isAuth){
                System.out.println("임직원 권한 유저 확인 0원으로 계산 처리 합시다.");
                finalPriceStr = "0";
                discountPriceStr = basePriceStr;
            }
            boolean isZeroPrice = "0".equals(finalPriceStr);
            boolean isConfirmedImmediately = isAuth && isZeroPrice;
            Boolean statusToSet = isConfirmedImmediately ? Boolean.TRUE : null;

            Reservation reservation = new Reservation();
            reservation.setUserNo(userNo);
            reservation.setSeatNo(requestDto.getItemId());
            reservation.setTotalPrice(finalPriceStr);
            reservation.setResPrice(basePriceStr);
            reservation.setDcPrice(discountPriceStr);
            reservation.setResStart(startDateTime);
            reservation.setResEnd(endDateTime);
            reservation.setPlanType(requestDto.getPlanType());
            reservation.setResStatus(statusToSet);
            System.out.println("[Service] DB 저장 직전 reservation 객체 상태: " + reservation.getResStatus());

            Reservation savedReservation = reservationRepository.save(reservation);
            System.out.println("[Service] >>> DB Reservation 저장 완료! ResNo: " + savedReservation.getResNo() + ", Status: " + savedReservation.getResStatus());
            return savedReservation;

        } finally {
            if (Boolean.TRUE.equals(lockAcquired)) {
                String redisValue = redisTemplate.opsForValue().get(lockKey);
                if (lockValue.equals(redisValue)) {
                    redisTemplate.delete(lockKey);
                    System.out.println("락 해제 성공: " + lockKey);
                } else {
                    System.out.println("락 해제 실패: 락 소유자가 다르거나 만료됨 - " + lockKey);
                }
            }
        }
    }

    private String calculateBasePrice(String planType, List<String> selectedTimes) {
        switch (planType) {
            case "HOURLY": return String.valueOf((selectedTimes != null ? selectedTimes.size() : 0) * 2000);
            case "DAILY": return "10000";
            case "MONTHLY": return "99000";
            default: return "0";
        }
    }
    
    private String calculateDiscount(String basePriceStr, String couponId) {
        if (couponId == null || couponId.isEmpty()) return "0";
        int basePrice = Integer.parseInt(basePriceStr);
        int discount = 0;
        if ("D1000".equals(couponId)) discount = 1000;
        else if ("P10".equals(couponId)) discount = (int) (basePrice * 0.1);
        return String.valueOf(Math.min(discount, basePrice));
    }
    
    private String calculateFinalPrice(String basePriceStr, String discountPriceStr) {
        return String.valueOf(Integer.parseInt(basePriceStr) - Integer.parseInt(discountPriceStr));
    }

    /**
     * 예약을 취소하고 관련된 카카오페이 결제를 취소합니다.
     */
    @Transactional
    public void cancelReservation(Long resNo, Long currentUserId) {
        System.out.printf("[Service] 예약 취소 요청 수신 - ResNo: %d, Username: %s%n", resNo, currentUserId);
        
        Reservation reservation = reservationRepository.findById(resNo)
                .orElseThrow(() -> new EntityNotFoundException("취소할 예약 정보를 찾을 수 없습니다: " + resNo));

        if (!reservation.getUserNo().equals(currentUserId)) {
            throw new SecurityException("해당 예약을 취소할 권한이 없습니다.");
        }

        if (Boolean.FALSE.equals(reservation.getResStatus())) {
            throw new IllegalStateException("이미 취소 처리된 예약입니다.");
        }
        
        LocalDateTime now = LocalDateTime.now();
        if (reservation.getResStart() != null && now.isAfter(reservation.getResStart())) {
            System.out.println("[Service] 경고: 이미 시작된 예약 취소 시도 (현재 로직 허용)");
        }

        Optional<Payment> paymentOpt = paymentRepository.findByResNo(resNo);
        if (paymentOpt.isPresent()) {
            Payment payment = paymentOpt.get();
            System.out.println("[Service] 관련 결제 정보 찾음: PaymentKey=" + payment.getPaymentKey());

            int paidAmount;
            try {
                paidAmount = Integer.parseInt(payment.getPayPrice());
            } catch (NumberFormatException | NullPointerException e) {
                System.err.println("결제 금액(payPrice) 파싱 오류 또는 없음: " + payment.getPayPrice());
                paidAmount = 0;
            }

            if (paidAmount > 0 && "KAKAO".equals(payment.getPayProvider())) {
                try {
                    System.out.println("카카오페이 결제 취소 API 호출 성공 (가정)");
                    payment.setPayStatus("CANCELED");
                    payment.setPayCanclDt(LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
                    paymentRepository.save(payment);

                } catch (Exception e) {
                    System.err.println("!!! 카카오페이 결제 취소 중 오류 발생 !!! - " + e.getMessage());
                    e.printStackTrace();
                    throw new RuntimeException("카카오페이 결제 취소 중 오류가 발생했습니다. 관리자에게 문의하세요.", e);
                }

            } else {
                System.out.println("[Service] 0원 예약 또는 카카오페이 결제 건이 아니므로 외부 API 취소 호출 생략.");
            }

            payment.setPayStatus("CANCELED");
            payment.setPayCanclDt(now.format(DateTimeFormatter.ISO_DATE_TIME));
            paymentRepository.save(payment);
            System.out.println("[Service] Payment 상태 'CANCELED' 업데이트 완료");

        } else {
            System.out.println("[Service] 해당 예약(" + resNo + ")에 대한 결제 정보 없음. Reservation 상태만 변경.");
        }

        reservation.setResStatus(false);
        reservation.setMoDt(LocalDateTime.now());
        reservationRepository.save(reservation);
        System.out.println("Reservation 상태 업데이트 완료 (취소)");
    }


    /**
     * 사용자의 예약 내역을 조건에 맞게 조회합니다. (Controller에서 호출됨)
     *
     * @param userNo       사용자 번호
     * @param tab          조회 탭 ("upcoming", "past", "cancelled")
     * @param startDateStr 조회 시작일 문자열 (YYYY-MM-DD)
     * @param endDateStr   조회 종료일 문자열 (YYYY-MM-DD)
     * @param pageable     페이징 정보 (정렬 포함)
     * @return 페이징된 예약 내역 DTO
     */
    public Page<UserReservationResponse> findMyReservations(Long userNo, String tab, String startDateStr, String endDateStr, Pageable pageable) {
        log.debug("findMyReservations Service - userNo: {}, tab: {}, startDate: {}, endDate: {}, pageable: {}",
                userNo, tab, startDateStr, endDateStr, pageable);

        // 1. 날짜 파싱 및 LocalDateTime 으로 변환
        LocalDateTime startDateTime;
        LocalDateTime endDateTime;

        try {

            // 시작일: YYYY-MM-DD 00:00:00
            startDateTime = LocalDate.parse(startDateStr, DATE_FORMATTER).atStartOfDay();
            // 종료일: YYYY-MM-DD 23:59:59.999999999 (해당 일자 전체 포함)
            endDateTime = LocalDate.parse(endDateStr, DATE_FORMATTER).atTime(LocalTime.MAX);

        } catch (DateTimeParseException e) {
            log.error("날짜 파싱 오류: startDate={}, endDate={}", startDateStr, endDateStr, e);
            // 오류 시 기본값 설정 또는 예외 처리 (컨트롤러에서 기본값 처리했으므로 여기선 로깅 위주)
            startDateTime = LocalDate.now().minusMonths(3).atStartOfDay();
            endDateTime = LocalDate.now().atTime(LocalTime.MAX);
            log.warn("날짜 파싱 오류로 기본 기간 사용: {} ~ {}", startDateTime, endDateTime);
            // throw new CustomException("날짜 형식이 올바르지 않습니다."); // 필요시 예외 발생
        }

        // 2. tab 파라미터 값을 status 코드로 변환 ('1', '2', '3')
        String tabStatus;
        switch (tab.toLowerCase()) {
            case "upcoming":
                tabStatus = "1"; // 예정
                break;
            case "past":
                tabStatus = "2"; // 지난
                break;
            case "cancelled":
                tabStatus = "3"; // 취소
                break;
            default:
                log.warn("알 수 없는 tab 값: {}, 기본값 'upcoming'('1') 사용", tab);
                tabStatus = "1"; // 기본값 설정 또는 예외 처리
                // throw new CustomException("유효하지 않은 탭입니다.");
        }

        // 3. 현재 시각 가져오기 (JPQL의 :now 파라미터에 전달)
        LocalDateTime now = LocalDateTime.now();

        // 4. Repository 호출하여 예약 내역 조회
        Page<UserReservationResponse> results = myReservationRepository.findUserReservationsWithStatus(
                userNo, startDateTime, endDateTime, tabStatus, now, pageable
        );

        log.debug("findMyReservations Service - Found {} reservations for tab '{}'", results.getTotalElements(), tab);

        return results; // 조회 결과(Page 객체) 반환
    }

    public List<UserReservationResponse> findReservationsById(Long userId) {

        // 1. 날짜 파싱 및 LocalDateTime 으로 변환
        LocalDateTime startDateTime;
        LocalDateTime endDateTime;

        // 3. 현재 시각 가져오기 (JPQL의 :now 파라미터에 전달)
        LocalDateTime now = LocalDateTime.now();

        // 4. Repository 호출하여 예약 내역 조회
        List<UserReservationResponse> results = reservationRepository.findReservationsById(
                userId
        );


        return results; // 조회 결과(Page 객체) 반환
    }




    /**
     * 마이페이지 > 예약 내역 > 예약 상세 조회
     * 특정 예약의 상세 정보를 조회합니다.
     * @param userNo 현재 로그인한 사용자
     * @param resNo 조회할 예약 번호
     * @return ReservationDetailDto
     * @throws CustomException 예약이 없거나 접근 권한이 없을 경우
     */
    @Transactional(readOnly = true) // 읽기 전용 트랜잭션
    public MyReservationDetailDto findMyReservationDetail(Long userNo, Long resNo) {
        log.debug("findMyReservationDetail Service - userNo: {}, resNo: {}", userNo, resNo);


        // 1. 예약 정보 조회 (findById 사용)
        Reservation reservation = myReservationRepository.findById(resNo)
                .orElseThrow(() -> {
                    log.warn("Reservation not found for resNo: {}", resNo);
//                    return new NotFoundException("예약 번호 " + resNo + "에 해당하는 예약 정보를 찾을 수 없습니다.");
                    return null;
                });

        // 2. 사용자 권한 확인
        if (!reservation.getUserNo().equals(userNo)) {
            log.warn("Authorization denied for userNo {} trying to access reservation resNo {}", userNo, resNo);
//            throw new AuthorizationDeniedException("해당 예약 정보에 접근할 권한이 없습니다.");
        }

        // 3. 좌석 정보 조회
        Seat seat = seatRepository.findById(reservation.getSeatNo())
                .orElseGet(() -> {
                    log.warn("Seat not found for seatNo: {} (referenced by resNo: {})", reservation.getSeatNo(), resNo);

                    // 좌석 정보가 없어도 예약을 보여줘야 할 수 있으므로, 기본 Seat 객체나 null 처리 고려
                    Seat unknownSeat = new Seat();
                    unknownSeat.setSeatNm("알 수 없는 좌석");
                    unknownSeat.setSeatSort("-");
                    return unknownSeat;
                    // 또는 return null; DTO 빌더에서 null 체크 필요
                });


        // 4. DTO 생성 및 반환
        LocalDateTime now = LocalDateTime.now();
        String statusCode = calculateStatusCode(reservation, now);
        String displayStatus = getDisplayStatus(statusCode);
        boolean canModify = calculateCanModify(reservation, now); // 예약 변경 가능 여부 로직
        boolean canCancel = calculateCanCancel(reservation, now); // 예약 취소 가능 여부 로직

        // MyReservationDetailDto 빌더 사용
        return MyReservationDetailDto.builder()
                .resNo(reservation.getResNo())
                .resDt(reservation.getResDt())
                .statusCode(statusCode)
                .displayStatus(displayStatus)
                .seatNm(seat.getSeatNm())
                .seatSort(seat.getSeatSort())               // SeatSort가 null일 수 있음에 유의
                .resStart(reservation.getResStart())
                .resEnd(reservation.getResEnd())
                .resPrice(reservation.getResPrice())        // 필요시 Long/BigDecimal 변환
                .dcPrice(reservation.getDcPrice())          // 필요시 Long/BigDecimal 변환 및 null 처리
                .totalPrice(reservation.getTotalPrice())    // 필요시 Long/BigDecimal 변환
                // --- 결제 정보 ---
                // 현재 Reservation 엔티티에 없으므로 임시로 null 또는 기본값 처리
                // TODO: Payment 테이블 연동 시 실제 값 조회 로직 추가 필요
                .paymentMethod(null) // 예: paymentService.getPaymentMethod(resNo)
                .paymentApproveDt(null) // 예: paymentService.getPaymentApproveDt(resNo)
                // --- 액션 플래그 ---
                .canModify(canModify)
                .canCancel(canCancel)
                .build();
    }


    private String calculateStatusCode(Reservation reservation, LocalDateTime now) {

        if (Boolean.FALSE.equals(reservation.getResStatus())) { // resStatus가 false (0) 이면 취소
            return "3"; // 취소됨
        } else if (Boolean.TRUE.equals(reservation.getResStatus())) { // resStatus가 true (1) 이면 예약완료 상태
            if (reservation.getResEnd() != null && reservation.getResEnd().isAfter(now)) {
                return "1"; // 이용예정
            } else {
                return "2"; // 이용완료
            }
        }

        // resStatus가 null이거나 예상치 못한 경우 (정책에 따라 처리)
        log.warn("Unknown reservation status for resNo: {}, resStatus: {}", reservation.getResNo(), reservation.getResStatus());
        return "UNKNOWN"; // 또는 기본 상태
    }

    // --- 표시용 상태 문자열 변환 ---
    private String getDisplayStatus(String statusCode) {
        switch (statusCode) {
            case "1": return "이용예정";
            case "2": return "이용완료";
            case "3": return "취소됨";
            default: return "상태확인필요";
        }
    }

    // --- 예약 변경 가능 여부 계산 로직 (예시) ---
    private boolean calculateCanModify(Reservation reservation, LocalDateTime now) {
        // 예시: 이용 시작 전이고, 취소되지 않은 예약만 변경 가능
        return "1".equals(calculateStatusCode(reservation, now)) && reservation.getResStart().isAfter(now);
        // TODO: 실제 비즈니스 규칙에 맞게 수정
    }

    // --- 예약 취소 가능 여부 계산 로직 (예시) ---
    private boolean calculateCanCancel(Reservation reservation, LocalDateTime now) {
        // 예시: 이용 시작 전이고, 취소되지 않은 예약만 취소 가능
        return "1".equals(calculateStatusCode(reservation, now)) && reservation.getResStart().isAfter(now);
        // TODO: 실제 비즈니스 규칙에 맞게 수정 (취소 정책 반영 - 예: 1시간 전까지만 가능)
    }



}