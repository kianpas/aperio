package com.portfolio.aperio.faq.dto.request.admin;

import com.portfolio.aperio.faq.domain.Faq;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class AddFaqRequest {

    private  String question;
    private  String answer;
    private LocalDateTime createDt;

    public Faq toEntity(){
        return Faq.builder()
                .question(question)
                .answer(answer)
                .createdAt(createDt)
                .build();
    }
}
