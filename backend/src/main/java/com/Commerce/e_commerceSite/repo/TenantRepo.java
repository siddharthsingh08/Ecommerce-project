package com.Commerce.e_commerceSite.repo;

import com.Commerce.e_commerceSite.model.entity.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TenantRepo extends JpaRepository<Tenant, Long> {

     Optional<Tenant> findByName(String name);

     boolean existsByName(String name);

     boolean existsByDomain(String domain);
}
