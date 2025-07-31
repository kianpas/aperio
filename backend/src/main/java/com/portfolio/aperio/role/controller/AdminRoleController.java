package com.portfolio.aperio.role.controller;

import com.portfolio.aperio.permission.dto.AdminPermissionResDto;
import com.portfolio.aperio.role.dto.AdminRoleEditReqDto;
import com.portfolio.aperio.role.dto.AdminRoleRegistReqDto;
import com.portfolio.aperio.role.dto.AdminRoleResDto;
import com.portfolio.aperio.role.service.AdminRoleService;
import com.portfolio.aperio.common.exception.CustomException;
import com.portfolio.aperio.user.domain.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@Controller
@RequestMapping("/admin/roles")
@RequiredArgsConstructor
public class AdminRoleController {

    private final AdminRoleService adminRoleService;

    /**
     * 관리자 > 권한 그룹 관리
     * @param user
     * @param model
     * @return
     */
    @GetMapping
    public String getRoleManagementView(@AuthenticationPrincipal User user,
                                                      @RequestParam(required = false, defaultValue = "") String searchRoleName,
                                                      @RequestParam(defaultValue = "0") int page,
                                                      Model model){
        Pageable pageable = PageRequest.of(page, 10); // 예: 페이지당 10개


        Page<AdminRoleResDto> adminRoleList = adminRoleService.findAdminRoleList(pageable, searchRoleName);

        model.addAttribute("adminRoleList", adminRoleList);

        return "admin/role/role-manage";
    }

    /**
     * 관리자 > 권한목록 > 권한 등록 화면
     * @param model
     * @return
     */
    @GetMapping("/regist")
    public String getRoleRegistView(Model model) {

        List<AdminPermissionResDto> adminPermissionList = adminRoleService.findAdminPermissionList();

        model.addAttribute("roleInfo", new AdminRoleRegistReqDto());
        model.addAttribute("adminPermissionList", adminPermissionList);
        return "admin/role/role-regist";

    }

    /**
     * 관리자 > 권한목록 > 권한 등록
     * @param adminRoleRegistReqDto
     * @param bindingResult
     * @param model
     * @return
     */
    @PostMapping("/regist")
    public String roleRegist(@Valid @ModelAttribute("roleInfo") AdminRoleRegistReqDto adminRoleRegistReqDto,
                             BindingResult bindingResult,
                             Model model) {
        log.debug("AdminRoleController|roleRegist|adminRoleRegistReqDto {}", adminRoleRegistReqDto);

        if (bindingResult.hasErrors()) {
            // 유효성 검사 실패 시, 다시 등록 폼으로 이동 (오류 메시지 표시됨)
            List<AdminPermissionResDto> adminPermissionList = adminRoleService.findAdminPermissionList();
            model.addAttribute("adminPermissionList", adminPermissionList);
            return "admin/role/role-regist";
        }

        try {

            adminRoleService.roleRegist(adminRoleRegistReqDto);
            return "redirect:/admin/roles";
        } catch (CustomException ex) {
            return "admin/role/role-regist";
        } catch (RuntimeException e) {
            // 예상치 못한 다른 종류의 예외 처리
            log.error("예상치 못한 오류 발생", e);
            return "admin/role/role-regist";
        }

    }

    @GetMapping("/edit/{roleId}")
    public String getRoleEditView(@PathVariable("roleId") Long roleId, Model model) {

        AdminRoleResDto roleInfo = adminRoleService.findRoleById(roleId);

        model.addAttribute("roleInfo", roleInfo);

        return "admin/role/role-edit";
    }

    /**
     * 역할 수정
     * @param roleId
     * @param model
     * @return
     */
    @PutMapping("/edit/{roleId}")
    public String editRole(@PathVariable("roleId") Long roleId,
                           @Valid @ModelAttribute("roleInfo")AdminRoleEditReqDto adminRoleEditReqDto,
                           BindingResult bindingResult,
                           Model model) {

        if (bindingResult.hasErrors()) {
            // 유효성 검사 실패 시, 다시 등록 폼으로 이동 (오류 메시지 표시됨)
            return "admin/roles/role-edit";
        }

        try {

            adminRoleService.editRole(roleId, adminRoleEditReqDto);

            return "redirect:/admin/roles/edit/" + roleId;
        } catch (CustomException ex) {
            log.error("editRole|error = {}", ex.getMessage());
            return "admin/roles/role-edit";
        } catch (RuntimeException e) {
            // 예상치 못한 다른 종류의 예외 처리
            log.error("예상치 못한 오류 발생", e);
            return "admin/roles/role-edit";
        }

    }

    @ResponseBody
    @DeleteMapping("/delete/{roleId}")
    public void deleteRole(@PathVariable("roleId") Long roleId) {
        log.debug("deleteRole|roleId => {}", roleId);

        try {
            adminRoleService.deleteRole(roleId);

        } catch (CustomException ex) {
            log.error("editRole|error = {}", ex.getMessage());

        } catch (RuntimeException e) {
            // 예상치 못한 다른 종류의 예외 처리
            log.error("예상치 못한 오류 발생", e);

        }

    }
}
