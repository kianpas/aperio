package com.portfolio.aperio.menu.domain;

public enum MenuType {
    MAIN_MENU("메인 메뉴"),
    SUB_MENU("서브 메뉴"), 
    EXTERNAL_LINK("외부 링크"),
    DIVIDER("구분선");

    private final String description;

    MenuType(String description) {
        this.description = description;
    }

}