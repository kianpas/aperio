package com.wb.between.seat.service;

import com.wb.between.seat.domain.Seat;
import com.wb.between.seat.dto.request.SeatCreateRequest;
import com.wb.between.seat.dto.request.SeatUpdateRequest;
import com.wb.between.seat.dto.response.SeatResponse;
import com.wb.between.seat.repository.SeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 좌석 Command 서비스
 * CQRS 패턴에서 Command(생성, 수정, 삭제) 작업을 담당
 */
@Service
@RequiredArgsConstructor
@Transactional
public class SeatService {

    private final SeatRepository seatRepository;

    /**
     * 새로운 좌석 생성
     * @param request 좌석 생성 요청 정보
     * @return 생성된 좌석 정보
     * @throws IllegalArgumentException 중복된 좌석 번호인 경우
     */
    public SeatResponse createSeat(SeatCreateRequest request) {
        // 좌석 번호 중복 확인
        if (seatRepository.existsBySeatNumber(request.getSeatNumber())) {
            throw new IllegalArgumentException("이미 존재하는 좌석 번호입니다.");
        }

        Seat seat = Seat.builder()
                .seatNumber(request.getSeatNumber())
                .seatType(request.getSeatType())
                .description(request.getDescription())
                .build();

        Seat savedSeat = seatRepository.save(seat);
        return SeatResponse.from(savedSeat);
    }

    /**
     * 기존 좌석 정보 수정
     * @param seatId 좌석 ID
     * @param request 수정할 좌석 정보
     * @return 수정된 좌석 정보
     * @throws IllegalArgumentException 존재하지 않는 좌석인 경우
     */
    public SeatResponse updateSeat(Long seatId, SeatUpdateRequest request) {
        Seat seat = seatRepository.findById(seatId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 좌석입니다."));

        seat.updateSeat(request.getSeatType(), request.getDescription());
        
        return SeatResponse.from(seat);
    }

    /**
     * 좌석 비활성화
     * @param seatId 비활성화할 좌석 ID
     * @throws IllegalArgumentException 존재하지 않는 좌석인 경우
     */
    public void deactivateSeat(Long seatId) {
        Seat seat = seatRepository.findById(seatId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 좌석입니다."));

        seat.deactivate();
    }

    /**
     * 좌석 활성화
     * @param seatId 활성화할 좌석 ID
     * @throws IllegalArgumentException 존재하지 않는 좌석인 경우
     */
    public void activateSeat(Long seatId) {
        Seat seat = seatRepository.findById(seatId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 좌석입니다."));

        seat.activate();
    }

    /**
     * 좌석 완전 삭제 (관리자용)
     * @param seatId 삭제할 좌석 ID
     * @throws IllegalArgumentException 존재하지 않는 좌석인 경우
     */
    public void deleteSeat(Long seatId) {
        if (!seatRepository.existsById(seatId)) {
            throw new IllegalArgumentException("존재하지 않는 좌석입니다.");
        }

        seatRepository.deleteById(seatId);
    }

    public boolean isAvailableForReservation(Long seatId) {
        return true;
    }
}