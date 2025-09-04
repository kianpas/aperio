package com.portfolio.aperio.reservation.repository;

import com.portfolio.aperio.reservation.domain.Reservation;
import com.portfolio.aperio.reservation.dto.user.UserReservationResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    // AdminUserService: 사용자 최근 예약 조회 (연관 필드 기준)
    List<Reservation> findByUser_IdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    // 호환성: 기존 호출부 유지용 (도메인 변경 전/후 모두 동작)
    @Query("SELECT r FROM Reservation r WHERE r.user.id = :userId ORDER BY r.createdAt DESC")
    List<Reservation> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId, Pageable pageable);

    // ReservationService에서 사용하는 메서드
    @Query(
        "SELECT COUNT(r) FROM Reservation r " +
        "WHERE r.seat.id = :seatId " +
        "AND r.status = com.portfolio.aperio.reservation.domain.ReservationStatus.CONFIRMED " +
        "AND (r.startAt < :endTime AND r.endAt > :startTime)"
    )
    long countOverlappingReservations(
            @Param("seatId") Long seatId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime);

    // 자기 자신을 제외한 중복 예약 확인
    @Query(
        "SELECT COUNT(r) FROM Reservation r " +
        "WHERE r.seat.id = :seatId " +
        "AND r.status = com.portfolio.aperio.reservation.domain.ReservationStatus.CONFIRMED " +
        "AND r.id <> :excludeId " +
        "AND (r.startAt < :endTime AND r.endAt > :startTime)"
    )
    long countOverlappingReservationsExcludingSelf(
            @Param("seatId") Long seatId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime,
            @Param("excludeId") Long excludeId);


    @Query("SELECT r FROM Reservation r WHERE r.user.id = :userId")
    List<Reservation> findReservationsByUserId(@Param("userId") Long userId);

    Collection<Reservation> findBySeat_Id(Long id);

     /**
     * 사용자의 예약 내역을 조건에 맞게 조회하여 MyReservationDto 페이지로 반환합니다.
     *
     * @param userNo        사용자 번호
     * @param startDateTime 조회 시작 일시 (resDt 기준)
     * @param endDateTime   조회 종료 일시 (resDt 기준)
     * @param tabStatus     조회할 예약 상태 코드 ('1': 예정, '2': 지난, '3': 취소)
     * @param now           현재 시각 (예정/지난 예약 구분용)
     * @param pageable      페이징 정보
     * @return 페이징 처리된 MyReservationDto 리스트
     */
//     @Query(
//             "SELECT NEW com.portfolio.aperio.reservation.dto.user.UserReservationResponse(" +
//             "r.id, r.resDt, s.name, r.resStart, r.resEnd, r.totalPrice, r.resPrice, r.dcPrice, " +
//             "CASE " +
//             "  WHEN r.resStatus = true AND r.resEnd > :now THEN '1' " +     // 예약완료 & 종료시간 미래 -> '1' (예정)
//             "  WHEN r.resStatus = true AND r.resEnd <= :now THEN '2' " +    // 예약완료 & 종료시간 과거/현재 -> '2' (지난)
//             "  WHEN r.resStatus = false THEN '3' " +                        // 예약취소 -> '3' (취소)
//             "  ELSE 'UNKNOWN' " +                                           // 예외 케이스 처리
//             "END" +
//             ") " +
//             "FROM Reservation r JOIN Seat s ON r.seatNo = s.id " +      // Seat 테이블 조인 (좌석 이름 가져오기)
//             "WHERE r.userNo = :userNo " +                                   // 1. 로그인 사용자 필터링
//             "  AND r.resDt BETWEEN :startDateTime AND :endDateTime " +      // 2. 예약일(resDt) 기준 날짜 필터링
//             "  AND (CASE " +
//             "         WHEN r.resStatus = true AND r.resEnd > :now THEN '1' " +
//             "         WHEN r.resStatus = true AND r.resEnd <= :now THEN '2' " +
//             "         WHEN r.resStatus = false THEN '3' " +
//             "         ELSE 'UNKNOWN' " +
//             "       END) = :tabStatus"                                      // 3. 탭 상태 필터링
//     )
//     Page<UserReservationResponse> findUserReservationsWithStatus(
//             @Param("userNo") Long userNo,
//             @Param("startDateTime") LocalDateTime startDateTime,
//             @Param("endDateTime") LocalDateTime endDateTime,
//             @Param("tabStatus") String tabStatus,
//             @Param("now") LocalDateTime now,
//             Pageable pageable); // 페이징 및 정렬 정보

    /**
     * 마이페이지 예약 내역 조회 (JPQL @Query 사용)
     */
/*
    @Query("SELECT r FROM Reservation r, Seat s " +
            "WHERE r.userNo = :user.userNo " +
            "AND r.seatNo = s.seatNo " +
            "AND ( " +
            "  (:tab = 'upcoming' AND r.resStatus = true AND r.resEnd > :now) OR " +
            "  (:tab = 'past' AND r.resStatus = true AND r.resEnd <= :now) OR " +
            "  (:tab = 'cancelled' AND r.resStatus = false) " +
            ") " +
            "AND (:startDateTime IS NULL OR r.resDt >= :startDateTime) " +
            "AND (:endDateTime IS NULL OR r.resDt <= :endDateTime) ")
    Page<Reservation> findMyReservationsWithJpql(
            @Param("user") User user,
            @Param("tab") String tab,
            @Param("startDateTime") LocalDateTime startDateTime,
            @Param("endDateTime") LocalDateTime endDateTime,
            @Param("now") LocalDateTime now,
            Pageable pageable
    );
*/

}
