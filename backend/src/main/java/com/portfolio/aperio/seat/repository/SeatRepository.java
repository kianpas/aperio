package com.portfolio.aperio.seat.repository;

import com.portfolio.aperio.seat.domain.Seat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SeatRepository extends JpaRepository<Seat, Long> {

    List<Seat> findByActiveTrue();

    List<Seat> findAllByActiveTrue();

}