package com.Commerce.e_commerceSite.service;

import com.Commerce.e_commerceSite.dto.ProductResponse;
import com.Commerce.e_commerceSite.model.entity.Product;
import com.Commerce.e_commerceSite.repo.ProductRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import com.Commerce.e_commerceSite.model.enums.TenantStatus;

@Service
@RequiredArgsConstructor
public class PublicProductService {

    private final ProductRepo productRepo;
    private final UserService userService;

    public Page<ProductResponse> getProducts(String tenant, String search, String category, Pageable pageable, Authentication auth)
    {
        userService.getOrCreateUser(auth);
        Page<Product> products;

        if (tenant != null && search != null && category != null) {
            products = productRepo
                    .findByIsActiveTrueAndTenant_NameAndNameContainingIgnoreCaseAndCategory_NameAndTenant_Status(
                            tenant,
                            search,
                            category,
                            TenantStatus.ACTIVE,
                            pageable
                    );
        }


        else if (tenant != null && search != null) {
            products = productRepo
                    .findByIsActiveTrueAndTenant_NameAndNameContainingIgnoreCaseAndTenant_Status(
                            tenant,
                            search,
                            TenantStatus.ACTIVE,
                            pageable
                    );
        }

        else if (tenant != null && category != null) {
            products = productRepo
                    .findByIsActiveTrueAndTenant_NameAndCategory_NameAndTenant_Status(
                            tenant,
                            category,
                            TenantStatus.ACTIVE,
                            pageable
                    );
        }


        else if (search != null && category != null) {
            products = productRepo
                    .findByIsActiveTrueAndNameContainingIgnoreCaseAndCategory_NameAndTenant_Status(
                            search,
                            category,
                            TenantStatus.ACTIVE,
                            pageable
                    );
        }


        else if (tenant != null) {
            products = productRepo
                    .findByIsActiveTrueAndTenant_NameAndTenant_Status(
                            tenant,
                            TenantStatus.ACTIVE,
                            pageable
                    );
        }

        else if (search != null) {
            products = productRepo
                    .findByIsActiveTrueAndNameContainingIgnoreCaseAndTenant_Status(
                            search,
                            TenantStatus.ACTIVE,
                            pageable
                    );
        }


        else if (category != null) {
            products = productRepo
                    .findByIsActiveTrueAndCategory_NameAndTenant_Status(
                            category,
                            TenantStatus.ACTIVE,
                            pageable
                    );
        }

        else {
            products = productRepo
                    .findByIsActiveTrueAndTenant_Status(
                            TenantStatus.ACTIVE,
                            pageable
                    );
        }

        return products.map(this::convertToDto);
    }

    private ProductResponse convertToDto(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .quantity(product.getQuantity())
                .category(product.getCategory().getName())
                .tenant(product.getTenant().getName())
                .build();
    }
}
