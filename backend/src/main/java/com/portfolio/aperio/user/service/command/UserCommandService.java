package com.portfolio.aperio.user.service.command;

import com.portfolio.aperio.common.exception.CustomException;
import com.portfolio.aperio.common.exception.ErrorCode;
import com.portfolio.aperio.mypage.dto.UserInfoEditReqDto;
import com.portfolio.aperio.mypage.dto.UserPasswordEditReqDto;
import com.portfolio.aperio.user.domain.User;
import com.portfolio.aperio.user.dto.response.user.UserInfoResponse;
import com.portfolio.aperio.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserCommandService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;
    
    /**
     * 유저 정보 수정
     */
    @Transactional
    public UserInfoResponse updateUserInfo(Long userNo, UserInfoEditReqDto userInfoEditReqDto) {

        //1. 회원정보 조회
        User user = userRepository.findById(userNo).orElseThrow(()-> new CustomException(ErrorCode.USER_NOT_FOUND));

        log.debug("user = {}", user);
        log.debug("userInfoEditReqDto = {}", userInfoEditReqDto);
        log.debug("userInfoEditReqDto.getName() = {}", userInfoEditReqDto.getName());
        //이름
        if(userInfoEditReqDto.getName() != null) {
            user.setName(userInfoEditReqDto.getName());
        }

        //전화번호
        if(userInfoEditReqDto.getPhoneNo() != null) {
            user.setPhoneNumber(userInfoEditReqDto.getPhoneNo());
        }

        return UserInfoResponse.from(user);
    }

    /**
     * 비밀번호 수정
     */
    @Transactional
    public void changePassword(Long userNo, UserPasswordEditReqDto userPasswordEditReqDto) {

        //1. 회원정보 조회
        User user = userRepository.findById(userNo).orElseThrow(()-> new CustomException(ErrorCode.USER_NOT_FOUND));

        log.debug("changePassword|user = {}", user);

        String currentPassword = userPasswordEditReqDto.getCurrentPassword();
        String newPassword = userPasswordEditReqDto.getNewPassword();
        String encodedPassword = user.getPassword();

        //2. 현재 비밀번호 검증
        //텍스트 존재 여부
        if(!StringUtils.hasText(currentPassword) || !StringUtils.hasText(newPassword)) {
            throw new CustomException(ErrorCode.INVALID_INPUT);
        }
        
        //현재 비밀번호 일치 여부
        if(!passwordEncoder.matches(currentPassword, encodedPassword)) {
            //TODO: 새 에러코드 생성 고려
            throw new CustomException(ErrorCode.INVALID_INPUT);
        }

        //새 비밀번호가 현재 비밀번호와 일치 여부
        if(passwordEncoder.matches(newPassword, encodedPassword)) {
            //TODO: 새 에러코드 생성 고려
            throw new CustomException(ErrorCode.INVALID_INPUT);
        }

        //3. 비밀번호 수정
        String encodedNewPassword = passwordEncoder.encode(newPassword);
        user.setPassword(encodedNewPassword);
    }
    
    /**
     * 회원 탈퇴
     * @param userNo
     */
    @Transactional
    public void accountDeletion(Long userNo) {
        userRepository.deleteById(userNo);
    }

}
