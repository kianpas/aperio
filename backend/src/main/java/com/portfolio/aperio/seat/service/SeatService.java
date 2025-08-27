package com.portfolio.aperio.seat.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.portfolio.aperio.reservation.service.ReservationService;
import com.portfolio.aperio.seat.domain.Seat;
import com.portfolio.aperio.seat.dto.request.user.SeatAvailabilityRequest;
import com.portfolio.aperio.seat.dto.response.user.SeatAvailabilityResponse;
import com.portfolio.aperio.seat.dto.response.user.SeatResponse;
import com.portfolio.aperio.seat.repository.SeatRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SeatService {

    private final SeatRepository seatRepository;

    private final ReservationService reservationService;

    /**
     * 사용가능한 전체 좌석 조회
     */
    public List<SeatResponse> getAllSeats() {
        // 단순히 seat 테이블에서 기본 정보만 조회
        // WHERE enabled = true (운영 중인 좌석만)
        List<Seat> seats = seatRepository.findAllByActiveTrue();
        return seats.stream().map(SeatResponse::from).toList();
    }

    /**
     * 선택좌석 예약가능여부 조회
     * @param seatId
     * @param request
     * @return
     */
    public SeatAvailabilityResponse getSeatAvailability(Long seatId, SeatAvailabilityRequest request) {
        // 1. 좌석 존재 확인
        Seat seat = seatRepository.findById(seatId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 좌석입니다."));

        if (!seat.getActive()) {
            throw new IllegalArgumentException("운영하지 않는 좌석입니다.");
        }

        // 2. 날짜 유효성 검사
        LocalDate requestDate = request.getDate();
        if (requestDate.isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("과거 날짜는 선택할 수 없습니다.");
        }

        return SeatAvailabilityResponse.builder()
                .id(seat.getId())
                .name(seat.getName())
                .date(requestDate.toString())
                // .timeSlots(timeSlots)
                // .isDailyAvailable(isDailyAvailable)
                // .isMonthlyAvailable(isMonthlyAvailable)
                .build();
    }

    // /**
    // * 모든 활성 좌석 목록과 기본 상태(STATIC/AVAILABLE) 정보를 조회합니다.
    // *
    // * @param date 조회 날짜 (참고용)
    // * @return 좌석 정보(SeatDto) 리스트
    // */
    // @Transactional(readOnly = true)
    // public List<SeatDto> getSeatStatus(LocalDate date) {
    // System.out.printf("DB 연동 좌석 정보 조회 요청 - 날짜: %s (기본 상태만 확인)%n", date);

    // // 1. DB에서 사용 중(useAt=true)인 모든 좌석 정보 조회
    // List<Seat> activeSeats = seatRepository.findByUseAtTrue();

    // if (activeSeats.isEmpty()) {
    // System.out.println("사용 가능한 좌석 정보 없음");
    // return List.of();
    // }

    // // 2. 좌석 목록을 DTO로 변환 (예약 상태 고려 없이 AVAILABLE/STATIC만 설정)
    // List<SeatDto> seatDtos = activeSeats.stream()
    // .map(seat -> {
    // String status;
    // String seatType = mapSeatSortToType(seat.getSeatSort());

    // // DB useAt=false ('N') 이거나 타입이 AREA면 STATIC
    // if (!seat.isUseAt() || "AREA".equals(seatType)) {
    // status = "STATIC";
    // } else {
    // // 예약 여부 확인 없이 무조건 AVAILABLE
    // status = "AVAILABLE";
    // }

    // // Entity -> DTO 변환
    // return new SeatDto(
    // String.valueOf(seat.getSeatNo()),
    // seat.getSeatNm(),
    // status, // AVAILABLE 또는 STATIC
    // seatType,
    // seat.getGridRow(),
    // seat.getGridColumn()
    // );
    // })
    // .collect(Collectors.toList());

    // System.out.println("반환될 좌석 DTO 목록 수 (기본 상태): " + seatDtos.size());
    // return seatDtos;
    // }

    // seatSort 값을 프론트엔드용 타입으로 변환하는 헬퍼 메소드
    private String mapSeatSortToType(String seatSort) {
        if (seatSort == null)
            return "SEAT";
        switch (seatSort) {
            case "개인":
                return "SEAT";
            case "회의실":
                return "ROOM";
            default:
                return "AREA";
        }
    }
}