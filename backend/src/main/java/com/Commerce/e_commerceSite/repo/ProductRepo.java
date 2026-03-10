package com.Commerce.e_commerceSite.repo;

import com.Commerce.e_commerceSite.model.entity.Category;
import com.Commerce.e_commerceSite.model.entity.Product;
import com.Commerce.e_commerceSite.model.entity.Tenant;
import com.Commerce.e_commerceSite.model.enums.TenantStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepo extends JpaRepository<Product, Long> {

    List<Product> findByTenant(Tenant tenant);

    Page<Product> findByTenant(Tenant tenant, Pageable pageable);

    Page<Product> findByIsActiveTrueAndTenant_Status(
            TenantStatus status,
            Pageable pageable
    );

    Page<Product> findByIsActiveTrueAndTenant_NameAndTenant_Status(
            String tenant,
            TenantStatus status,
            Pageable pageable
    );

    Page<Product> findByIsActiveTrueAndNameContainingIgnoreCaseAndTenant_Status(
            String name,
            TenantStatus status,
            Pageable pageable
    );

    Page<Product> findByIsActiveTrueAndCategory_NameAndTenant_Status(
            String category,
            TenantStatus status,
            Pageable pageable
    );

    Page<Product> findByIsActiveTrueAndTenant_NameAndNameContainingIgnoreCaseAndTenant_Status(
            String tenant,
            String name,
            TenantStatus status,
            Pageable pageable
    );

    Page<Product> findByIsActiveTrueAndTenant_NameAndCategory_NameAndTenant_Status(
            String tenant,
            String category,
            TenantStatus status,
            Pageable pageable
    );

    Page<Product> findByIsActiveTrueAndNameContainingIgnoreCaseAndCategory_NameAndTenant_Status(
            String name,
            String category,
            TenantStatus status,
            Pageable pageable
    );

    Page<Product> findByIsActiveTrueAndTenant_NameAndNameContainingIgnoreCaseAndCategory_NameAndTenant_Status(
            String tenant,
            String name,
            String category,
            TenantStatus status,
            Pageable pageable
    );

    List<Product> findByCategory(Category category);
}
