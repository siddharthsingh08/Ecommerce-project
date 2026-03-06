package com.Commerce.e_commerceSite.service;

import com.Commerce.e_commerceSite.dto.CreateProductRequest;
import com.Commerce.e_commerceSite.dto.UpdateProductRequest;
import com.Commerce.e_commerceSite.exception.*;
import com.Commerce.e_commerceSite.model.entity.Category;
import com.Commerce.e_commerceSite.model.entity.Product;
import com.Commerce.e_commerceSite.model.entity.Tenant;
import com.Commerce.e_commerceSite.model.entity.User;
import com.Commerce.e_commerceSite.model.enums.TenantStatus;
import com.Commerce.e_commerceSite.repo.CategoryRepo;
import com.Commerce.e_commerceSite.repo.ProductRepo;
import com.Commerce.e_commerceSite.repo.TenantRepo;
import com.Commerce.e_commerceSite.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepo productRepo;
    private final UserRepo userRepo;
    private final TenantRepo tenantRepo;
    private final CategoryRepo categoryRepo;
    private final UserService userService;

    private User getCurrentUser(Authentication authentication) {
        return userService.getOrCreateUser(authentication);
    }

    private void validateTenantAccess(String tenantName, Authentication auth)
    {
        User user = getCurrentUser(auth);

        boolean isAdmin = auth.getAuthorities().stream()
                              .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if(isAdmin) return;

        if (user.getTenant() == null ||
                !user.getTenant().getName().equals(tenantName)) {
            throw new UnauthorizedTenantException("Access denied for this tenant");
        }
    }

    public Product createProduct(String tenantName, CreateProductRequest request, MultipartFile image, Authentication auth)
    {

        Tenant tenant = tenantRepo.findByName(tenantName)
                                  .orElseThrow(() -> new TenantNotFoundException("Tenant does not exist!"));

        Category category = categoryRepo.findByName(request.getCategoryName())
                                        .orElseThrow(() -> new CategoryNotFound("Category does not exist!"));

        if(tenant.getStatus() == TenantStatus.INACTIVE)
        {
            throw new InactiveTenant("Tenant is not Active!");
        }

        validateTenantAccess(tenantName, auth);

        Product product = new Product();

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());
        product.setTenant(tenant);
        product.setCategory(category);
        //product.setImage(request.getImage());

        if(image != null && !image.isEmpty())
        {
            try {
                product.setImage(image.getBytes());
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }

        return productRepo.save(product);
    }

    public Page<Product> getProductsOfTenant(String tenantName, Pageable pageable)
    {
        //tenantName = tenantName.toLowerCase();
        Tenant tenant = tenantRepo.findByName(tenantName)
                                  .orElseThrow(() -> new TenantNotFoundException("No such Tenant exists!"));

        return productRepo.findByTenant(tenant, pageable);
    }

    public void deleteProduct(String tenantName, Long id, Authentication auth)
    {
        validateTenantAccess(tenantName, auth);

        Tenant tenant = tenantRepo.findByName(tenantName)
                .orElseThrow(() -> new TenantNotFoundException("Tenant not found"));

        Product product = productRepo.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found"));

        if(!product.getTenant().getName().equalsIgnoreCase(tenantName))
            throw new UnauthorizedTenantException("Invalid Tenant!");

        if(tenant.getStatus() == TenantStatus.INACTIVE)
            throw new RuntimeException("Tenant is Inactive!");

        productRepo.delete(product);
    }

    public Product updateProductById(String tenantName, Long id, UpdateProductRequest request, MultipartFile image, Authentication auth)
    {
        Tenant tenant = tenantRepo.findByName(tenantName)
                                  .orElseThrow(() -> new TenantNotFoundException("No such tenant exists!"));

        validateTenantAccess(tenantName, auth);

        Product updatedProduct = productRepo.findById(id)
                                            .orElseThrow(() -> new ProductNotFoundException("Product with given id does not exist!"));

        if(!updatedProduct.getTenant().getName().equalsIgnoreCase(tenantName))
        {
            throw new UnauthorizedTenantException("Invalid Tenant Access!");
        }

        if(request.getName() != null)
        {
            updatedProduct.setName(request.getName());
        }

        if(request.getDescription() != null)
        {
            updatedProduct.setDescription(request.getDescription());
        }

        if(request.getPrice() != null)
        {
            updatedProduct.setPrice(request.getPrice());
        }

        if(request.getQuantity() != null)
        {
            updatedProduct.setQuantity(request.getQuantity());
        }

        if(request.getImage() != null)
        {
            updatedProduct.setImage(request.getImage());
        }

        if(request.getCategoryName() != null) {
            Category category = categoryRepo.findByName(request.getCategoryName())
                    .orElseThrow(() -> new CategoryNotFound("No such category!"));
            updatedProduct.setCategory(category);
        }

        if(request.getIsActive() != null)
        {
            updatedProduct.setIsActive(request.getIsActive());
        }

        if(image != null && !image.isEmpty())
        {
            try {
                updatedProduct.setImage(image.getBytes());
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }

        return productRepo.save(updatedProduct);

    }
}
