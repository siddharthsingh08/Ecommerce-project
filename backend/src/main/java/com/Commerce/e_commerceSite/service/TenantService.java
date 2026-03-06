package com.Commerce.e_commerceSite.service;

import com.Commerce.e_commerceSite.dto.CreateTenantRequest;
import com.Commerce.e_commerceSite.exception.DuplicateTenantException;
import com.Commerce.e_commerceSite.exception.TenantNotFoundException;
import com.Commerce.e_commerceSite.model.entity.Product;
import com.Commerce.e_commerceSite.model.entity.Tenant;
import com.Commerce.e_commerceSite.model.entity.User;
import com.Commerce.e_commerceSite.model.enums.TenantStatus;
import com.Commerce.e_commerceSite.repo.ProductRepo;
import com.Commerce.e_commerceSite.repo.TenantRepo;
import com.Commerce.e_commerceSite.repo.UserRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TenantService {

    private final TenantRepo tenantRepo;
    private final UserService userService;
    private final KeycloakUserService keycloakUserService;
    private final ProductRepo productRepo;
    private final UserRepo userRepo;

    public Tenant createTenant(CreateTenantRequest request, Authentication auth)
    {
        userService.getOrCreateUser(auth);

        if(tenantRepo.existsByName(request.getName()))
        {
            throw new DuplicateTenantException("Tenant Already Exists!");
        }

        if(tenantRepo.existsByDomain(request.getDomain()))
        {
            throw new DuplicateTenantException(("Domain Already Exists!"));
        }

        Tenant tenant = new Tenant();
        tenant.setName(request.getName());
        tenant.setDomain(request.getDomain());
        tenant.setStatus(TenantStatus.ACTIVE);

        tenantRepo.save(tenant);

        keycloakUserService.createUser(
                request.getName(),
                request.getEmail(),
                request.getManagerFirstName(),
                request.getManagerLastName(),
                request.getPassword(),
                "ROLE_TENANT",
                tenant.getName()
        );

        return tenant;
    }

    public Page<Tenant> getAllTenants(Pageable pageable)
    {
        return tenantRepo.findAll(pageable);
    }

    public Tenant getTenantById(Long id)
    {
        return tenantRepo.findById(id)
                .orElseThrow(() -> new TenantNotFoundException("No such user exists!"));
    }

    public Tenant changeStatus(Long id, TenantStatus status, Authentication auth)
    {
        userService.getOrCreateUser(auth);
        Tenant tenant = tenantRepo.findById(id)
                .orElseThrow(() -> new TenantNotFoundException("No tenant exists with ID: " + id));
        tenant.setStatus(status);

        return tenantRepo.save(tenant);
    }

    @Transactional
    public void deleteTenant(Long id, Authentication auth)
    {
        userService.getOrCreateUser(auth);
        Tenant tenant = tenantRepo.findById(id).orElseThrow(() -> new TenantNotFoundException("Tenant does not exist!"));

        List<Product> products = productRepo.findByTenant(tenant);
        User user = userRepo.findByTenant(tenant);

        try {
            keycloakUserService.deleteUser(user.getKeycloakUserId());
        } catch(Exception ignored) {}

        productRepo.deleteAll(products);
        if(user != null)
            userRepo.delete(user);
        tenantRepo.deleteById(id);
    }
}
