package com.wb.between.seat.service;

import com.wb.between.seat.domain.Seat;
import com.wb.between.seat.domain.SeatType;
import com.wb.between.seat.dto.response.SeatResponse;
import com.wb.between.seat.dto.response.SeatListResponse;
import com.wb.between.seat.repository.SeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 좌석 Query 서비스
 * CQRS 패턴에서 Query(조회) 작업을 담당
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SeatQueryService {

    private final SeatRepository seatRepository;

    /**
     * 좌석 상세 정보 조회
     * @param seatId 좌석 ID
     * @return 좌석 상세 정보
     * @throws IllegalArgumentException 존재하지 않는 좌석인 경우
     */
    public SeatResponse getSeat(Long seatId) {
        Seat seat = seatRepository.findById(seatId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 좌석입니다."));
        
        return SeatResponse.from(seat);
    }

    /**
     * 모든 활성화된 좌석 조회
     * @return 활성화된 좌석 목록
     */
    public List<SeatListResponse> getActiveSeats() {
        return seatRepository.findByIsActiveTrue()
                .stream()
                .map(SeatListResponse::from)
                .collect(Collectors.toList());
    }

    /**
     * 특정 타입의 활성화된 좌석 조회
     * @param seatType 좌석 타입
     * @return 해당 타입의 활성화된 좌석 목록
     */
    public List<SeatListResponse> getSeatsByType(SeatType seatType) {
        return seatRepository.findBySeatTypeAndIsActiveTrue(seatType)
                .stream()
                .map(SeatListResponse::from)
                .collect(Collectors.toList());
    }

    /**
     * 좌석 번호로 좌석 조회
     * @param seatNumber 좌석 번호
     * @return 좌석 정보
     * @throws IllegalArgumentException 존재하지 않는 좌석인 경우
     */
    public SeatResponse getSeatByNumber(String seatNumber) {
        Seat seat = seatRepository.findBySeatNumber(seatNumber)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 좌석 번호입니다."));
        
        return SeatResponse.from(seat);
    }

    /**
     * 모든 좌석 조회 (관리자용)
     * @return 모든 좌석 목록
     */
    public List<SeatListResponse> getAllSeats() {
        return seatRepository.findAll()
                .stream()
                .map(SeatListResponse::from)
                .collect(Collectors.toList());
    }
}