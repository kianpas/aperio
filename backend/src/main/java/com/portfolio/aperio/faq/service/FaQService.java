package com.portfolio.aperio.faq.service;

import com.portfolio.aperio.faq.domain.Faq;
import com.portfolio.aperio.faq.dto.request.admin.AddFaqRequest;
import com.portfolio.aperio.faq.repository.FaqRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class FaqService {

    private final FaqRepository faqRepository;

    public Faq save(AddFaqRequest request){
        return faqRepository.save(request.toEntity());
    }

    public List<Faq> findAll(){
        return faqRepository.findAll();
    }
}
