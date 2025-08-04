package com.portfolio.aperio.faq.dto.response.user;

import com.portfolio.aperio.faq.domain.Faq;
import lombok.Getter;


@Getter
public class FaqListViewResponse {
    private final int qNo;
   private final String question;
   private final String answer;

   public FaqListViewResponse(Faq faq){
       this.qNo = faq.getQNo();
       this.question = faq.getQuestion();
       this.answer = faq.getAnswer();
   }


}
