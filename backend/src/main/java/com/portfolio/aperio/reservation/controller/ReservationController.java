package com.portfolio.aperio.reservation.controller;

import com.portfolio.aperio.reservation.domain.Reservation;
import com.portfolio.aperio.reservation.dto.request.user.CreateReservationRequest;
import com.portfolio.aperio.reservation.repository.ReservationRepository;
import com.portfolio.aperio.reservation.service.command.ReservationCommandService;
import com.portfolio.aperio.seat.domain.Seat;
import com.portfolio.aperio.seat.repository.SeatRepository;
import com.portfolio.aperio.user.domain.User;
import com.portfolio.aperio.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/reservations")
public class ReservationController {

    private final ReservationCommandService reservationCommandService;

    private final ReservationRepository reservationRepository;

    private final UserRepository userRepository;

    private final SeatRepository seatRepository;

    @PostMapping
    public ResponseEntity<?> createReservation(
            @Valid @RequestBody CreateReservationRequest request, @AuthenticationPrincipal UserDetails userDetails) {
        // 예약 생성 로직 구현

        log.debug("Received reservation request: {}", request);
        log.debug("Authenticated user: {}", userDetails != null ? userDetails.getUsername() : "null");
        reservationCommandService.createReservationWithLock(request, userDetails.getUsername());

        return ResponseEntity.ok("예약 생성 요청 처리 중...");
    }

    /**
     * 좌석 예약 페이지를 보여주는 메소드.
     * 예약 변경 모드 파라미터가 있으면 기존 예약 정보를 조회하여 모델에 추가합니다.
     */
    @GetMapping
    public String showReservationPage(
            @RequestParam(required = false) String mode,
            @RequestParam(required = false) Long id,
            @AuthenticationPrincipal UserDetails userDetails,
            Model model) {
        boolean isModificationMode = false;
        Map<String, Object> originalReservationData = null;

        if (userDetails == null) {
            System.out.println("로그인되지 않은 사용자 접근 시도 -> 로그인 페이지로 리다이렉트");
            return "redirect:/login";
        }

        Long currentUserId;
        String currentUserAuth = null;
        try {
            String username = userDetails.getUsername();
            User user = userRepository.findByEmail(username)
                    .orElseThrow(() -> new UsernameNotFoundException("DB 사용자 정보 없음: " + username));
            currentUserId = user.getId();
            if (currentUserId == null)
                throw new IllegalStateException("userNo 없음");

        } catch (Exception e) {
            System.err.println("사용자 ID 처리 실패: " + e.getMessage());
            model.addAttribute("errorMessage", "사용자 정보 처리 오류");
            return "error/custom-error";
        }

        if ("modify".equalsIgnoreCase(mode) && id != null) {
            System.out.println("[Controller] 예약 변경 모드 진입 시도: resNo=" + id);
            try {
                Reservation reservation = reservationRepository.findById(id)
                        .orElseThrow(() -> new EntityNotFoundException("원본 예약 정보 없음: " + id));

                if (!reservation.getUser().equals(currentUserId)) {
                    System.err.println("예약 변경 권한 없음: 요청자=" + currentUserId + ", 예약자=" + reservation.getUser().getId());
                    model.addAttribute("errorMessage", "본인의 예약만 변경할 수 있습니다.");
                    return "error/custom-error";
                }

                String seatName = "좌석 이름";
                try {
                    seatName = seatRepository.findById(reservation.getSeat().getId())
                            .map(Seat::getName)
                            .orElse("삭제된 좌석?");
                } catch (Exception seatEx) {
                    System.err.println("좌석 이름 조회 중 오류: " + seatEx.getMessage());
                }

                isModificationMode = true;
                originalReservationData = new HashMap<>();
                originalReservationData.put("resNo", reservation.getId());
                originalReservationData.put("itemId", reservation.getSeat().getId());
                originalReservationData.put("seatName", seatName);

                String planType = reservation.getPlanType();
                if (planType == null || planType.isBlank()) {
                    System.err.println(
                            "!!! CRITICAL: Reservation resNo=" + id + " has missing or blank planType! !!!");
                    throw new IllegalStateException("DB에 저장된 예약 정보(planType)가 올바르지 않습니다.");
                }
                originalReservationData.put("planType", planType);
                System.out.println("DB에서 가져온 planType: " + planType);

                originalReservationData.put("reservationDate", reservation.getStartAt().toLocalDate().toString());

                if ("HOURLY".equals(planType)) {
                    originalReservationData.put("selectedTimes", extractOriginalTimes(reservation));
                } else {
                    originalReservationData.put("selectedTimes", List.of());
                }
                System.out.println("[Controller] 원본 예약 정보 준비 완료: " + originalReservationData);

            } catch (Exception e) {
                System.err.println("예약 변경 모드 진입 중 오류: " + e.getMessage());
                e.printStackTrace();
                model.addAttribute("errorMessage", "예약 정보를 불러오는 중 오류가 발생했습니다.");
                isModificationMode = false;
                originalReservationData = null;
            }
        }

        model.addAttribute("isModificationMode", isModificationMode);
        model.addAttribute("originalReservation", originalReservationData);
        model.addAttribute("currentUserId", currentUserId);
        model.addAttribute("currentUserAuth", currentUserAuth);

        System.out.println("isModificationMode = " + model.getAttribute("isModificationMode"));
        System.out.println("originalReservation = " + model.getAttribute("originalReservation"));

        return "reservation/reservation";
    }

    private List<String> extractOriginalTimes(Reservation reservation) {
        List<String> originalTimes = new ArrayList<>();
        if (reservation.getStartAt() == null || reservation.getEndAt() == null) {
            System.err.println("Warning: Reservation resNo=" + reservation.getId() + " has null start or end time.");
            return originalTimes;
        }
        LocalDateTime current = reservation.getStartAt();
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
        while (current.isBefore(reservation.getEndAt())) {
            originalTimes.add(current.toLocalTime().format(timeFormatter));
            current = current.plusHours(1);
        }
        return originalTimes;
    }
}