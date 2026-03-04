package com.Commerce.e_commerceSite.controller;

import com.Commerce.e_commerceSite.dto.CreateTenantRequest;
import com.Commerce.e_commerceSite.model.entity.Tenant;
import com.Commerce.e_commerceSite.model.enums.TenantStatus;
import com.Commerce.e_commerceSite.service.TenantService;
import com.Commerce.e_commerceSite.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/tenant")
@PreAuthorize("hasRole('ADMIN')")
public class AdminTenantController {

    @Autowired
    private TenantService tenantService;

    @PostMapping
    public ResponseEntity<Tenant> createTenant(@RequestBody CreateTenantRequest request, Authentication auth)
    {
        //return ResponseEntity.ok(tenantService.createTenant(request));
        return new ResponseEntity<>(tenantService.createTenant(request, auth), HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<Page<Tenant>> getAllTenants(Pageable pageable)
    {
        return new ResponseEntity<>(tenantService.getAllTenants(pageable), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tenant> getTenantById(@PathVariable Long id)
    {
        return new ResponseEntity<>(tenantService.getTenantById(id), HttpStatus.OK);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Tenant> changeTenantStatus(@PathVariable Long id, @RequestParam TenantStatus status, Authentication auth)
    {
        return new ResponseEntity<>(tenantService.changeStatus(id, status, auth), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTenant(@PathVariable Long id, Authentication auth)
    {
        tenantService.deleteTenant(id, auth);
        return ResponseEntity.noContent().build();
    }
}
