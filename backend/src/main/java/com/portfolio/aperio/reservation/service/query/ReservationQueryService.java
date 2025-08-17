package com.portfolio.aperio.reservation.service.query;

import com.portfolio.aperio.reservation.domain.Reservation;
import com.portfolio.aperio.reservation.dto.user.UserReservationResponse;
import com.portfolio.aperio.reservation.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReservationQueryService {

    private final ReservationRepository reservationRepository;

//    public List<UserReservationResponse> findRecentReservationByUser(Long userId) {
//
//
//        return reservationRepository.recentReservation(userId, 5)
//                .stream()
//                .map(UserReservationResponse::from)
//                .toList();
//    }
}
