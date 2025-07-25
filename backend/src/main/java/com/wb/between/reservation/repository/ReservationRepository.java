package com.wb.between.reservation.repository;

import com.wb.between.reservation.domain.Reservation;
import com.wb.between.reservation.domain.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByUserIdAndStatus(Long userId, ReservationStatus status);

    List<Reservation> findBySeatIdAndStatus(Long seatId, ReservationStatus status);

    @Query("SELECT r FROM Reservation r WHERE r.seatId = :seatId " +
           "AND r.status = 'CONFIRMED' " +
           "AND ((r.reservationDateTime <= :endTime AND r.reservationDateTime >= :startTime) " +
           "OR (r.reservationDateTime <= :startTime AND r.reservationDateTime + INTERVAL r.duration MINUTE > :startTime))")
    List<Reservation> findConflictingReservations(
            @Param("seatId") Long seatId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime);

    @Query("SELECT r FROM Reservation r WHERE r.reservationDateTime BETWEEN :startDate AND :endDate " +
           "ORDER BY r.reservationDateTime")
    List<Reservation> findByDateRange(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);
}