package com.portfolio.aperio.reservation.controller;

import com.portfolio.aperio.reservation.domain.Reservation;
import com.portfolio.aperio.reservation.repository.ReservationRepository;
import com.portfolio.aperio.seat.domain.Seat;
import com.portfolio.aperio.seat.repository.SeatRepository;
import com.portfolio.aperio.user.domain.User;
import com.portfolio.aperio.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Controller
@RequiredArgsConstructor
public class ReservationController {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SeatRepository seatRepository;

    /**
     * 좌석 예약 페이지를 보여주는 메소드.
     * 예약 변경 모드 파라미터가 있으면 기존 예약 정보를 조회하여 모델에 추가합니다.
     */
    @GetMapping("/reservation")
    public String showReservationPage(
            @RequestParam(required = false) String mode,
            @RequestParam(required = false) Long resNo,
            @AuthenticationPrincipal UserDetails userDetails,
            Model model
    ) {
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
            currentUserId = user.getUserId();
            if (currentUserId == null) throw new IllegalStateException("userNo 없음");

        } catch (Exception e) {
            System.err.println("사용자 ID 처리 실패: " + e.getMessage());
            model.addAttribute("errorMessage", "사용자 정보 처리 오류");
            return "error/custom-error";
        }

        if ("modify".equalsIgnoreCase(mode) && resNo != null) {
            System.out.println("[Controller] 예약 변경 모드 진입 시도: resNo=" + resNo);
            try {
                Reservation reservation = reservationRepository.findById(resNo)
                        .orElseThrow(() -> new EntityNotFoundException("원본 예약 정보 없음: " + resNo));

                if (!reservation.getUserNo().equals(currentUserId)) {
                    System.err.println("예약 변경 권한 없음: 요청자=" + currentUserId + ", 예약자=" + reservation.getUserNo());
                    model.addAttribute("errorMessage", "본인의 예약만 변경할 수 있습니다.");
                    return "error/custom-error";
                }

                String seatName = "좌석 이름";
                try {
                    seatName = seatRepository.findById(reservation.getSeatNo())
                            .map(Seat::getName)
                            .orElse("삭제된 좌석?");
                } catch (Exception seatEx) {
                    System.err.println("좌석 이름 조회 중 오류: " + seatEx.getMessage());
                }

                isModificationMode = true;
                originalReservationData = new HashMap<>();
                originalReservationData.put("resNo", reservation.getResNo());
                originalReservationData.put("itemId", reservation.getSeatNo());
                originalReservationData.put("seatName", seatName);

                String planType = reservation.getPlanType();
                if (planType == null || planType.isBlank()) {
                    System.err.println("!!! CRITICAL: Reservation resNo=" + resNo + " has missing or blank planType! !!!");
                    throw new IllegalStateException("DB에 저장된 예약 정보(planType)가 올바르지 않습니다.");
                }
                originalReservationData.put("planType", planType);
                System.out.println("DB에서 가져온 planType: " + planType);

                originalReservationData.put("reservationDate", reservation.getResStart().toLocalDate().toString());

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

    private List<String> extractOriginalTimes(Reservation reservation){
        List<String> originalTimes = new ArrayList<>();
        if (reservation.getResStart() == null || reservation.getResEnd() == null) {
            System.err.println("Warning: Reservation resNo=" + reservation.getResNo() + " has null start or end time.");
            return originalTimes;
        }
        LocalDateTime current = reservation.getResStart();
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
        while (current.isBefore(reservation.getResEnd())) {
            originalTimes.add(current.toLocalTime().format(timeFormatter));
            current = current.plusHours(1);
        }
        return originalTimes;
    }
}