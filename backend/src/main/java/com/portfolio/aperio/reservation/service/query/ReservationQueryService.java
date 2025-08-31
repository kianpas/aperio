package com.portfolio.aperio.reservation.service.query;

import com.portfolio.aperio.reservation.domain.Reservation;
import com.portfolio.aperio.reservation.dto.user.UserReservationResponse;
import com.portfolio.aperio.reservation.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReservationQueryService {

    private final ReservationRepository reservationRepository;

    // public List<UserReservationResponse> findRecentReservationByUser(Long userId)
    // {
    //
    //
    // return reservationRepository.recentReservation(userId, 5)
    // .stream()
    // .map(UserReservationResponse::from)
    // .toList();
    // }

    /**
     * 좌석번호로 예약정보 조회
     * @param id
     * @param date
     * @return
     */
//    public List<ReservationInfo> getReservationsBySeatAndDate(Long id, LocalDateTime date) {
//        return reservationRepository.findBySeatIdAndDate(id, date)
//                .stream()
//                .map(ReservationInfo::from)
//                .collect(Collectors.toList());
//
//    }

}
