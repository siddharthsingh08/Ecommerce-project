package com.Commerce.e_commerceSite.dto;

import com.Commerce.e_commerceSite.model.entity.Category;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdateProductRequest {
    private String name;
    private String description;
    @PositiveOrZero(message = "Price must be >= 0")
    private BigDecimal price;
    @PositiveOrZero(message = "Stock must be >= 0")
    private Integer quantity;
    private String categoryName;
    private byte[] image;
    private Boolean isActive;
}
