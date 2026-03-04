package com.Commerce.e_commerceSite.controller;

import com.Commerce.e_commerceSite.dto.CreateCategoryRequest;
import com.Commerce.e_commerceSite.model.entity.Category;
import com.Commerce.e_commerceSite.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminCategoryController {

    private final CategoryService categoryService;

    @PostMapping("/category")
    public ResponseEntity<Category> createCategory(@RequestBody CreateCategoryRequest request, Authentication auth)
    {
        return new ResponseEntity<>(categoryService.createCategory(request, auth), HttpStatus.OK);
    }

    @GetMapping("/category")
    public ResponseEntity<Page<Category>> getAllCategories(Pageable pageable)
    {
        return new ResponseEntity<>(categoryService.getAllCategories(pageable), HttpStatus.OK);
    }

    @DeleteMapping("/category/{name}")
    public ResponseEntity<Void> deleteCategory(@PathVariable String name, Authentication auth)
    {
        categoryService.deleteCategory(name, auth);
        return ResponseEntity.noContent().build();
    }


}
