package com.wb.between.admin.main.controller;

import com.wb.between.admin.main.dto.AdminBannerResDto;
import com.wb.between.admin.main.service.AdminMainService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/admin/main")
@RequiredArgsConstructor
public class AdminMainController {

    private final AdminMainService adminMainService;

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
