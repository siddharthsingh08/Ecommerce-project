package com.Commerce.e_commerceSite.controller;

import com.Commerce.e_commerceSite.dto.CreateProductRequest;
import com.Commerce.e_commerceSite.dto.UpdateProductRequest;
import com.Commerce.e_commerceSite.model.entity.Product;
import com.Commerce.e_commerceSite.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

@RestController
@RequestMapping("/tenant")
public class TenantProductController {

    @Autowired
    private ProductService productService;

    @PostMapping(value = "/{tenantName}/products", consumes="multipart/form-data")
    @PreAuthorize("hasAnyRole('TENANT', 'ADMIN')")
    public ResponseEntity<Product> createProduct(@PathVariable String tenantName,
                                                 @RequestParam String name,
                                                 @RequestParam String description,
                                                 @RequestParam BigDecimal price,
                                                 @RequestParam Integer quantity,
                                                 @RequestParam String categoryName,
                                                 @RequestParam(required=false) MultipartFile image,
                                                 Authentication auth)
    {
        CreateProductRequest request =  new CreateProductRequest();
        request.setName(name);
        request.setDescription(description);
        request.setPrice(price);
        request.setQuantity(quantity);
        request.setCategoryName(categoryName);

        return new ResponseEntity<>(productService.createProduct(tenantName, request, image, auth), HttpStatus.CREATED);
    }


    @GetMapping("/{tenantName}/products")
    public ResponseEntity<Page<Product>> getTenantProduct(@PathVariable String tenantName, Pageable pageable, Authentication auth)
    {
        return new ResponseEntity<>(productService.getProductsOfTenant(tenantName, pageable, auth), HttpStatus.OK);
    }

    @DeleteMapping("/{tenantName}/products/{id}")
    @PreAuthorize("hasAnyRole('TENANT', 'ADMIN')")
    public ResponseEntity<Void> deleteTenantProductById(@PathVariable String tenantName, @PathVariable Long id, Authentication auth)
    {
        productService.deleteProduct(tenantName, id, auth);
        return ResponseEntity.noContent().build();
    }

    @PutMapping(value = "/{tenantName}/products/{id}", consumes = "multipart/form-data")
    @PreAuthorize("hasAnyRole('TENANT', 'ADMIN')")
    public ResponseEntity<Product> updateTenantProduct(
            @PathVariable String tenantName,
            @PathVariable Long id,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) BigDecimal price,
            @RequestParam(required = false) Integer quantity,
            @RequestParam(required = false) String categoryName,
            @RequestParam(required = false) MultipartFile image,
            Authentication auth
    ) {
        UpdateProductRequest request = new UpdateProductRequest();
        request.setName(name);
        request.setDescription(description);
        request.setPrice(price);
        request.setQuantity(quantity);
        request.setCategoryName(categoryName);

        return ResponseEntity.ok(
                productService.updateProductById(tenantName, id, request, image, auth)
        );
    }
}
