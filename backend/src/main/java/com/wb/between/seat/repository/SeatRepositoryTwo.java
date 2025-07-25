package com.wb.between.seat.repository;

import com.wb.between.seat.domain.Seat;
import com.wb.between.seat.domain.SeatType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

/**
 * 좌석 데이터 접근 레포지토리
 */
public interface SeatRepositoryTwo extends JpaRepository<Seat, Long> {

    /**
     * 좌석 번호로 좌석 조회
     * @param seatNumber 좌석 번호
     * @return 좌석 정보
     */
    Optional<Seat> findBySeatNumber(String seatNumber);

    /**
     * 활성화된 모든 좌석 조회
     * @return 활성화된 좌석 목록
     */
    List<Seat> findByIsActiveTrue();

    /**
     * 특정 타입의 활성화된 좌석 조회
     * @param seatType 좌석 타입
     * @return 해당 타입의 활성화된 좌석 목록
     */
    List<Seat> findBySeatTypeAndIsActiveTrue(SeatType seatType);

    /**
     * 좌석 번호 중복 확인
     * @param seatNumber 확인할 좌석 번호
     * @return 존재하면 true
     */
    boolean existsBySeatNumber(String seatNumber);

    /**
     * 좌석 타입별 개수 조회
     * @return 좌석 타입별 개수 목록
     */
    @Query("SELECT s.seatType, COUNT(s) FROM Seat s WHERE s.isActive = true GROUP BY s.seatType")
    List<Object[]> countBySeatTypeAndIsActiveTrue();
}