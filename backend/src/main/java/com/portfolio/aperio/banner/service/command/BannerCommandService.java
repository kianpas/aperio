package com.portfolio.aperio.banner.service.command;

import com.portfolio.aperio.banner.repository.BannerRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BannerCommandService {

    private final BannerRepository bannerRepository;

}
