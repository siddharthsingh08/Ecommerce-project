package com.Commerce.e_commerceSite.controller;

import com.Commerce.e_commerceSite.dto.ProductResponse;
import com.Commerce.e_commerceSite.exception.ProductNotFoundException;
import com.Commerce.e_commerceSite.model.entity.Product;
import com.Commerce.e_commerceSite.repo.ProductRepo;
import com.Commerce.e_commerceSite.service.PublicProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/public/products")
@RequiredArgsConstructor
public class PublicProductController {

    private final PublicProductService publicProductService;
    private final ProductRepo productRepo;

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

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductDetails(@PathVariable Long id)
    {
        return new ResponseEntity<>(publicProductService.getProductDetails(id), HttpStatus.OK);
    }

    @Transactional(readOnly = true)
    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getProductImage(@PathVariable Long id)
    {
        Product product = productRepo.findById(id)
                                     .orElseThrow(() -> new ProductNotFoundException("Product does not exist!"));

        if(product.getImage() == null)
        {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok().header("Content-Type", "image/jpeg").body(product.getImage());
    }
}