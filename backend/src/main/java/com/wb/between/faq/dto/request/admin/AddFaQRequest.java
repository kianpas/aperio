package com.wb.between.faq.dto.request.admin;

import com.wb.between.faq.domain.FaQ;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class AddFaQRequest {

    private  String question;
    private  String answer;
    private LocalDateTime createDt;

    public FaQ toEntity(){
        return FaQ.builder()
                .question(question)
                .answer(answer)
                .createDt(createDt)
                .build();
    }
}
