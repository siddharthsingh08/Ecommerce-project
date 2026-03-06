package com.Commerce.e_commerceSite.controller;

import com.Commerce.e_commerceSite.model.entity.Category;
import com.Commerce.e_commerceSite.repo.CategoryRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/public/category")
@RequiredArgsConstructor
public class PublicCategoryController {

    private final CategoryRepo categoryRepo;

    @GetMapping
    public ResponseEntity<List<Category>> getCategories()
    {
        return new ResponseEntity<>(categoryRepo.findAll(), HttpStatus.OK);
    }
}
