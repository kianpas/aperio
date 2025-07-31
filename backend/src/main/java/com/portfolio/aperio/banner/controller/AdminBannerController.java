package com.portfolio.aperio.banner.controller;

import com.portfolio.aperio.banner.dto.response.admin.AdminBannerResDto;
import com.portfolio.aperio.banner.service.AdminBannerService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/admin/banner")
@RequiredArgsConstructor
public class AdminBannerController {

    private final AdminBannerService adminMainService;

    /**
     * 관리자 > 메인관리
     * @return
     */
    @GetMapping
    public String getMainManagementView(Model model) {

        List<AdminBannerResDto> bannerList = adminMainService.findAll();

        model.addAttribute("bannerList", bannerList);

        return "admin/main/main-manage";
    }

    @GetMapping("/regist")
    public String getMainBannerRegistView() {
        return "admin/main/main-regist";
    }

    /**
     * 관리자 > 메인관리
     * @return
     */
    @GetMapping("/edit/{bNo}")
    public String getMainBannerEditView(@PathVariable Long bNo, Model model) {
        return "admin/main/main-edit";
    }

}
