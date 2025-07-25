package com.wb.between.reservation.repository;

import com.wb.between.reservation.domain.Reservation;
import com.wb.between.reservation.domain.ReservationStatus;
import com.wb.between.reservation.dto.response.ReservationListResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservationQueryRepository extends JpaRepository<Reservation, Long> {

    List<ReservationListResponse> findReservationsWithConditions(LocalDate date, Long userId);

   List<ReservationListResponse> findCalendarReservations(LocalDate startDate, LocalDate endDate);
}