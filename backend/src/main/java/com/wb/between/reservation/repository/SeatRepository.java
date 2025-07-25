package com.wb.between.reservation.repository;

import com.wb.between.reservation.domain.Seat;
import com.wb.between.reservation.domain.SeatType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SeatRepository extends JpaRepository<Seat, Long> {

    Optional<Seat> findBySeatNumber(String seatNumber);

    List<Seat> findByIsActiveTrue();

    List<Seat> findBySeatTypeAndIsActiveTrue(SeatType seatType);

    boolean existsBySeatNumber(String seatNumber);
}