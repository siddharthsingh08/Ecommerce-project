package com.Commerce.e_commerceSite.service;

import com.Commerce.e_commerceSite.dto.CreateCategoryRequest;
import com.Commerce.e_commerceSite.exception.CategoryNotFound;
import com.Commerce.e_commerceSite.model.entity.Category;
import com.Commerce.e_commerceSite.model.entity.Product;
import com.Commerce.e_commerceSite.repo.CategoryRepo;
import com.Commerce.e_commerceSite.repo.ProductRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepo categoryRepo;
    private final UserService userService;
    private final ProductRepo productRepo;

    public Category createCategory(CreateCategoryRequest request, Authentication auth)
    {
        userService.getOrCreateUser(auth);

        categoryRepo.findByName(request.getName()).ifPresent(c -> {
            throw new RuntimeException("Category Already Exists!");
        });

        Category category = new Category();
        category.setName(request.getName());

        return categoryRepo.save(category);
    }

    public Page<Category> getAllCategories(Pageable pageable)
    {
        return categoryRepo.findByIsActive(true, pageable);
    }

    @Transactional
    public void deleteCategory(String name, Authentication auth)
    {
        userService.getOrCreateUser(auth);
        Category category = categoryRepo.findByName(name)
                                        .orElseThrow(() -> new CategoryNotFound("No such Category!"));

        List<Product> products = productRepo.findByCategory(category);

        products.forEach(p -> p.setIsActive(false));
        productRepo.saveAll(products);

        category.setIsActive(false);
        categoryRepo.save(category);
    }
}
