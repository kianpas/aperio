package com.portfolio.aperio.permission.controller;

import com.portfolio.aperio.permission.dto.AdminPermissionResDto;
import com.portfolio.aperio.permission.service.AdminPermissionService;
import com.portfolio.aperio.user.domain.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/admin/permissions")
@RequiredArgsConstructor
public class AdminPermissionController {

    private final AdminPermissionService adminPermissionService;

    /**
     * 관리자 > 권한그룹
     * @param user
     * @param model
     * @return
     */
    @GetMapping
    public String getPermissionManagementView(@AuthenticationPrincipal User user,
                                              @RequestParam(required = false, defaultValue = "") String searchPermissionName,
                                              @RequestParam(defaultValue = "0") int page,
                                              Model model){

        Pageable pageable = PageRequest.of(page, 10); // 예: 페이지당 10개

        Page<AdminPermissionResDto> adminPermissionList = adminPermissionService.findAdminPermissionList(pageable, searchPermissionName);

        model.addAttribute("adminPermissionList", adminPermissionList);

        return "admin/permission/permission-manage";
    }
}
