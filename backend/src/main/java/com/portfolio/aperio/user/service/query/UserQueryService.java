package com.portfolio.aperio.user.service.query;

import com.portfolio.aperio.common.exception.CustomException;
import com.portfolio.aperio.common.exception.ErrorCode;
import com.portfolio.aperio.coupon.service.CouponService;
import com.portfolio.aperio.mypage.dto.MypageCouponResDto;
import com.portfolio.aperio.reservation.service.ReservationService;
import com.portfolio.aperio.user.domain.User;
import com.portfolio.aperio.user.dto.response.user.UserProfileResponse;
import com.portfolio.aperio.user.repository.UserRepository;
import com.portfolio.aperio.usercoupon.domain.UserCoupon;
import com.portfolio.aperio.usercoupon.repository.UserCouponRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserQueryService {

    private final UserRepository userRepository;

    private final ReservationService reservationService;

    private final CouponService couponService;

    private final UserCouponRepository userCouponRepository;

    private final PasswordEncoder passwordEncoder;

    public User findByEmail(String email) {

        User user = userRepository.findByUsernameWithRolesAndPermissions(email)
                .orElseThrow(() -> {
                    log.warn("존재하지 않는 사용자 로그인 시도: {}", email);
                    return new UsernameNotFoundException("사용자를 찾을 수 없습니다. - " + email);
                });

        return user;
    }


    /**
     * 유저 프로필 조회
     */
    public UserProfileResponse getUserProfile(Long userId) {

        User user = userRepository.findById(userId).orElseThrow(()-> new CustomException(ErrorCode.USER_NOT_FOUND));

        return UserProfileResponse.from(user);
    }

    /**
     * 유저 조회
     */
    public UserProfileResponse findUserbyId(Long userNo) {

        User user = userRepository.findById(userNo).orElseThrow(()-> new CustomException(ErrorCode.USER_NOT_FOUND));
        log.debug("findUserbyId|user = {}", user);
        return UserProfileResponse.from(user);
    }


    /**
     * 마이페이지 > 쿠폰목록
     * @param userNo
     * @return
     */
    public  List<MypageCouponResDto> findCouponListById(Long userNo,
                                                        String tab,
                                                        LocalDate startDate,
                                                        LocalDate endDate) {

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startDateTime = (startDate != null) ? startDate.atStartOfDay() : null;
        LocalDateTime endDateTimePlusOne = (endDate != null) ? endDate.plusDays(1).atStartOfDay() : null;

        //1. 회원정보 조회
        User user = userRepository.findById(userNo).orElseThrow(()-> new CustomException(ErrorCode.USER_NOT_FOUND));
        log.debug("MypageService|findCouponListById => {}", user);

        //사용 가능 쿠폰, 기간만료 쿠폰 조회 처리
        //추후에 queryDsl 변경 고려
        List<UserCoupon> userCouponList;

        //사용 가능
        if ("available".equalsIgnoreCase(tab)) {
            //2. 회원의 쿠폰 목록 조회
            userCouponList = userCouponRepository.findByUserCoupon(user.getUserId(),
                    "N",
                    startDateTime,
                    endDateTimePlusOne);

        } else if ("expired".equalsIgnoreCase(tab)) {
            //만료
            userCouponList = userCouponRepository.findExpiredCouponsWithDateFilter(user.getUserId(),
                    "Y",
                    startDateTime,
                    endDateTimePlusOne);
        } else {
            userCouponList = Collections.emptyList();
        }

        return userCouponList.stream().map(MypageCouponResDto::from).toList();
    }

    /**
     * 마이페이지 > 쿠폰목록
     * @param userNo
     * @return
     */
    public  Page<MypageCouponResDto> findCouponListByIdPage(Long userNo,
                                                            String tab,
                                                            LocalDate startDate,
                                                            LocalDate endDate,
                                                            Pageable pageable) {

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startDateTime = (startDate != null) ? startDate.atStartOfDay() : null;
        LocalDateTime endDateTimePlusOne = (endDate != null) ? endDate.plusDays(1).atStartOfDay() : null;

        //1. 회원정보 조회
        User user = userRepository.findById(userNo).orElseThrow(()-> new CustomException(ErrorCode.USER_NOT_FOUND));
        log.debug("MypageService|findCouponListByIdPage => {}", user);
        log.debug("MypageService|findCouponListByIdPage|tab => {}", tab);
        //사용 가능 쿠폰, 기간만료 쿠폰 조회 처리
        //추후에 queryDsl 변경 고려
        Page<UserCoupon> userCouponList;

        //사용 가능
        if ("available".equalsIgnoreCase(tab)) {
            //2. 회원의 쿠폰 목록 조회
            userCouponList = userCouponRepository.findByUserCouponPage(user.getUserId(),
                    "N",
                    now,
                    startDateTime,
                    endDateTimePlusOne,
                    pageable);

        } else if ("expired".equalsIgnoreCase(tab)) {
            //만료
            userCouponList = userCouponRepository.findExpiredCouponsWithDateFilterPage(user.getUserId(),
                    now,
                    startDateTime,
                    endDateTimePlusOne,
                    pageable);
        } else {
            userCouponList = Page.empty();
        }

        return userCouponList.map(MypageCouponResDto::from);
    }

    /**
     * 비밀번호 일치 여부 확인 (기존과 유사)
     */
    public boolean verifyPassword(Long userNo, String rawPassword) {
        User user = userRepository.findById(userNo)
                .orElseThrow(() -> new CustomException(ErrorCode.INVALID_INPUT));
        return passwordEncoder.matches(rawPassword, user.getPassword());
    }
}
