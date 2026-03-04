package com.Commerce.e_commerceSite.controller;

import com.Commerce.e_commerceSite.dto.ProductResponse;
import com.Commerce.e_commerceSite.service.PublicProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class PublicProductController {

    private final PublicProductService publicProductService;

    @GetMapping
    public ResponseEntity<Page<ProductResponse>> getProducts(
            @RequestParam(required = false) String tenant,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            Pageable pageable,
            Authentication auth) {

        return ResponseEntity.ok(
                publicProductService.getProducts(
                        tenant,
                        search,
                        category,
                        pageable,
                        auth
                )
        );
    }
}