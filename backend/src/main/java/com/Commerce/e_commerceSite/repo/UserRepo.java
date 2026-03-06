package com.Commerce.e_commerceSite.repo;

import com.Commerce.e_commerceSite.model.entity.Tenant;
import com.Commerce.e_commerceSite.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<User, Long> {

    Optional<User> findByKeycloakUserId(String keycloakUserId);

    User findByTenant(Tenant tenant);
}