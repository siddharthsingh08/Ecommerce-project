package com.Commerce.e_commerceSite.service;

import com.Commerce.e_commerceSite.model.entity.Tenant;
import com.Commerce.e_commerceSite.model.entity.User;
import com.Commerce.e_commerceSite.repo.TenantRepo;
import com.Commerce.e_commerceSite.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepo userRepo;
    private final TenantRepo tenantRepo;

    public User getOrCreateUser(Authentication authentication) {

        Jwt jwt = (Jwt) authentication.getPrincipal();

        String keycloakId = jwt.getSubject();
        String username = jwt.getClaimAsString("preferred_username");
        String tenantName = jwt.getClaimAsString("tenant");
        String email = jwt.getClaimAsString("email");

        return userRepo.findByKeycloakUserId(keycloakId)
                .orElseGet(() -> createUserFromJwt(keycloakId, username, tenantName, email));
    }

    private User createUserFromJwt(String keycloakId,
                                   String username,
                                   String tenantName,
                                   String email) {

        User user = new User();
        user.setKeycloakUserId(keycloakId);
        user.setUsername(username);
        user.setEmail(email);

        if (tenantName != null) {
            Tenant tenant = tenantRepo.findByName(tenantName)
                    .orElseThrow(() -> new RuntimeException("Tenant from token not found"));
            user.setTenant(tenant);
        }

        return userRepo.save(user);
    }
}
