package com.portfolio.aperio.reservation.repository;

import com.portfolio.aperio.reservation.domain.Reservation;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    // AdminUserService에서 사용하는 메서드
    List<Reservation> findByUserNoOrderByResDtDesc(Long userNo, Pageable pageable);

    // ReservationService에서 사용하는 메서드
    @Query("SELECT COUNT(r) FROM Reservation r WHERE r.seatNo = :seatNo " +
           "AND r.resStatus = true " +
           "AND ((r.resStart < :endTime AND r.resEnd > :startTime))")
    long countOverlappingReservations(
            @Param("seatNo") Long seatNo,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime);

    // 자기 자신을 제외한 중복 예약 확인
    @Query("SELECT COUNT(r) FROM Reservation r WHERE r.seatNo = :seatNo " +
           "AND r.resStatus = true " +
           "AND r.resNo != :excludeResNo " +
           "AND ((r.resStart < :endTime AND r.resEnd > :startTime))")
    long countOverlappingReservationsExcludingSelf(
            @Param("seatNo") Long seatNo,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime,
            @Param("excludeResNo") Long excludeResNo);
}