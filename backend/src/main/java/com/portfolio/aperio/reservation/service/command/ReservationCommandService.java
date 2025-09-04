package com.portfolio.aperio.reservation.service.command;

import com.portfolio.aperio.common.exception.CustomException;
import com.portfolio.aperio.pay.domain.Payment;
import com.portfolio.aperio.pay.repository.PaymentRepository;
import com.portfolio.aperio.reservation.domain.Reservation;
import com.portfolio.aperio.reservation.domain.ReservationStatus;
import com.portfolio.aperio.reservation.dto.request.user.CreateReservationRequest;
import com.portfolio.aperio.reservation.dto.request.user.ReservationRequestDto;
import com.portfolio.aperio.reservation.dto.response.user.MyReservationDetailDto;
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
public class ReservationCommandService {

    private final StringRedisTemplate redisTemplate;

    private final ReservationRepository reservationRepository;

    private final UserRepository userRepository;

    private final PaymentRepository paymentRepository;

    private static final long LOCK_TIMEOUT_SECONDS = 10;
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");
    private static final LocalTime OPEN_TIME = LocalTime.of(9, 0);
    private static final LocalTime CLOSE_TIME = LocalTime.of(22, 0);

    /**
     * Redis 락을 사용하여 예약을 생성합니다.
     */
    @Transactional
    public Reservation createReservationWithLock(CreateReservationRequest request, String username) {
       
        log.debug("Creating reservation with request: {} for user: {}", request, username);
        log.debug("Request details - SeatId: {}, StartAt: {}, EndAt: {}",
                request.getSeatId(), request.getStartAt(), request.getEndAt());
       
        // Objects.requireNonNull(request.getSeatId(), "좌석 ID는 필수입니다.");
        // Objects.requireNonNull(request.getReservationDate(), "예약 날짜는 필수입니다.");
        // Objects.requireNonNull(request.getPlanType(), "요금제는 필수입니다.");
        // Objects.requireNonNull(username, "사용자 정보(username)는 필수입니다.");

        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("예약 서비스에서 사용자를 찾을 수 없습니다: " + username));
        Long userNo = user.getId();
        // TODO: 임시 코드
        String authCd = "임직원";
        if (userNo == null) {
            throw new IllegalStateException("사용자 번호(userNo)를 가져올 수 없습니다.");
        }

        // LocalDate reservationDate = LocalDate.parse(request.getReservationDate());
        LocalDateTime startDateTime = null;
        LocalDateTime endDateTime= null;

        // switch (request.getPlanType()) {
        //     case "HOURLY":
        //         if (request.getSelectedTimes() == null || request.getSelectedTimes().isEmpty()) {
        //             throw new IllegalArgumentException("시간제는 예약 시간을 선택해야 합니다.");
        //         }
        //         request.getSelectedTimes().sort(Comparator.naturalOrder());
        //         LocalTime startTime = LocalTime.parse(request.getSelectedTimes().get(0), TIME_FORMATTER);
        //         LocalTime lastTime = LocalTime.parse(
        //                 request.getSelectedTimes().get(request.getSelectedTimes().size() - 1), TIME_FORMATTER);
        //         startDateTime = reservationDate.atTime(startTime);
        //         endDateTime = reservationDate.atTime(lastTime.plusHours(1));
        //         break;
        //     case "DAILY":
        //         startDateTime = reservationDate.atTime(OPEN_TIME);
        //         endDateTime = reservationDate.atTime(CLOSE_TIME);
        //         break;
        //     case "MONTHLY":
        //         startDateTime = reservationDate.atTime(OPEN_TIME);
        //         endDateTime = reservationDate.plusMonths(1).atTime(CLOSE_TIME);
        //         break;
        //     default:
        //         throw new IllegalArgumentException("알 수 없는 요금제 타입입니다.");
        // }

        String lockKey = String.format("lock:seat:%s:%s", request.getSeatId(), request.getStartAt().substring(0, 10));
        String lockValue = UUID.randomUUID().toString();
        Boolean lockAcquired = false;
        try {
            lockAcquired = redisTemplate.opsForValue().setIfAbsent(lockKey, lockValue,
                    Duration.ofSeconds(LOCK_TIMEOUT_SECONDS));

            if (lockAcquired == null || !lockAcquired) {
                System.out.println("락 획득 실패: " + lockKey);
                throw new RuntimeException("다른 사용자가 현재 좌석/날짜를 예약 중입니다. 잠시 후 다시 시도해주세요.");
            }
            System.out.println("락 획득 성공: " + lockKey);

            long overlappingCount = reservationRepository.countOverlappingReservations(
                    request.getSeatId(), startDateTime, endDateTime);

            if (overlappingCount > 0) {
                System.out.println("중복 예약 발견됨: " + lockKey);
                throw new RuntimeException("선택하신 시간에 이미 예약이 존재합니다.");
            }
            System.out.println("DB 예약 가능 확인 완료");

            String basePriceStr = calculateBasePrice(request.getPlanType(), request.getTimeSlots());
            String discountPriceStr = calculateDiscount(basePriceStr, request.getCouponCode());
            String finalPriceStr = calculateFinalPrice(basePriceStr, discountPriceStr);

            boolean isAuth = "임직원".equals(authCd);
            if (isAuth) {
                System.out.println("임직원 권한 유저 확인 0원으로 계산 처리 합시다.");
                finalPriceStr = "0";
                discountPriceStr = basePriceStr;
            }
            boolean isZeroPrice = "0".equals(finalPriceStr);
            boolean isConfirmedImmediately = isAuth && isZeroPrice;
            Boolean statusToSet = isConfirmedImmediately ? Boolean.TRUE : null;

            Reservation reservation = Reservation.create(
                    user,
                    Seat.builder().id(request.getSeatId()).build(),
                    startDateTime,
                    endDateTime,
                    request.getPlanType(),
                    new java.math.BigDecimal(basePriceStr),
                    new java.math.BigDecimal(discountPriceStr),
                    null // userCouponId는 추후 구현 예정
            );

            // Reservation reservation = new Reservation();
            // reservation.setUserNo(userNo);
            // reservation.setSeatNo(request.getItemId());
            // reservation.setTotalPrice(finalPriceStr);
            // reservation.setResPrice(basePriceStr);
            // reservation.setDcPrice(discountPriceStr);
            // reservation.setResStart(startDateTime);
            // reservation.setResEnd(endDateTime);
            // reservation.setPlanType(request.getPlanType());
            // reservation.setResStatus(statusToSet);
            System.out.println("[Service] DB 저장 직전 reservation 객체 상태: " + reservation.getStatus());

            Reservation savedReservation = reservationRepository.save(reservation);
            System.out.println("[Service] >>> DB Reservation 저장 완료! ResNo: " + savedReservation.getId()
                    + ", Status: " + savedReservation.getStatus());
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
            case "HOURLY":
                return String.valueOf((selectedTimes != null ? selectedTimes.size() : 0) * 2000);
            case "DAILY":
                return "10000";
            case "MONTHLY":
                return "99000";
            default:
                return "0";
        }
    }

    private String calculateDiscount(String basePriceStr, String couponId) {
        if (couponId == null || couponId.isEmpty())
            return "0";
        int basePrice = Integer.parseInt(basePriceStr);
        int discount = 0;
        if ("D1000".equals(couponId))
            discount = 1000;
        else if ("P10".equals(couponId))
            discount = (int) (basePrice * 0.1);
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

        if (!reservation.getUser().getId().equals(currentUserId)) {
            throw new SecurityException("해당 예약을 취소할 권한이 없습니다.");
        }

        if (Boolean.FALSE.equals(reservation.getStatus())) {
            throw new IllegalStateException("이미 취소 처리된 예약입니다.");
        }

        LocalDateTime now = LocalDateTime.now();
        if (reservation.getStartAt() != null && now.isAfter(reservation.getStartAt())) {
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

        reservation.setStatus(ReservationStatus.CANCELLED);
        reservation.setUpdatedAt(LocalDateTime.now());
        reservationRepository.save(reservation);
        System.out.println("Reservation 상태 업데이트 완료 (취소)");
    }

}