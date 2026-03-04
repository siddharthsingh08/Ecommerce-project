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

@RestController
public class TenantProductController {

    @Autowired
    private ProductService productService;

    @PostMapping("/{tenantName}/products")
    @PreAuthorize("hasAnyRole('TENANT', 'ADMIN')")
    public ResponseEntity<Product> createProduct(@PathVariable String tenantName, @RequestBody CreateProductRequest request, Authentication auth)
    {
        return new ResponseEntity<>(productService.createProduct(tenantName, request, auth), HttpStatus.OK);
    }

    @GetMapping("/{tenantName}/products")
    public ResponseEntity<Page<Product>> getTenantProduct(@PathVariable String tenantName, Pageable pageable)
    {
        return new ResponseEntity<>(productService.getProductsOfTenant(tenantName, pageable), HttpStatus.OK);
    }

    @DeleteMapping("/{tenantName}/products/{id}")
    @PreAuthorize("hasAnyRole('TENANT', 'ADMIN')")
    public ResponseEntity<Void> deleteTenantProductById(@PathVariable String tenantName, @PathVariable Long id, Authentication auth)
    {
        productService.deleteProduct(tenantName, id, auth);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("{tenantName}/products/{id}")
    @PreAuthorize("hasAnyRole('TENANT', 'ADMIN')")
    public ResponseEntity<Product> updateTenantProduct(@PathVariable String tenantName, @PathVariable Long id, @RequestBody UpdateProductRequest request, Authentication auth)
    {
        return new ResponseEntity<>(productService.updateProductById(tenantName, id, request, auth), HttpStatus.OK);
    }
}
