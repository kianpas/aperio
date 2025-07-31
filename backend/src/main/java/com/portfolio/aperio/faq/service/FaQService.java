package com.portfolio.aperio.faq.service;

import com.portfolio.aperio.faq.domain.FaQ;
import com.portfolio.aperio.faq.dto.request.admin.AddFaQRequest;
import com.portfolio.aperio.faq.repository.FnQRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class FaQService {

    private final FnQRepository fnQRepository;

    public FaQ save(AddFaQRequest request){
        return fnQRepository.save(request.toEntity());
    }

    public List<FaQ> findAll(){
        return fnQRepository.findAll();
    }
}
