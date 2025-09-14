package com.portfolio.aperio.common.dto;

import java.util.List;

// 간단한 페이지 응답 래퍼 (PageImpl 직렬화 경고 회피)
public record PagedResponse<T>(
        List<T> content,
        int page,
        int size,
        long totalElements,
        int totalPages,
        boolean last
) {}

