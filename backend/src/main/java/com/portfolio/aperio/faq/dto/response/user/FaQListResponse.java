package com.portfolio.aperio.faq.dto.response.user;

import com.portfolio.aperio.faq.domain.FaQ;
import lombok.Getter;

@Getter
public class FaQListResponse {

    private final int qNo;
    private final String question;
    private final String answer;

    public FaQListResponse(FaQ faQ){
        this.qNo = faQ.getQNo();
        this.question = faQ.getQuestion();
        this.answer = faQ.getAnswer();
    }


}
