package com.Commerce.e_commerceSite.dto;

import com.Commerce.e_commerceSite.model.entity.Category;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdateProductRequest {
    private String name;
    private String description;
    private BigDecimal price;
    private Integer quantity;
    private String categoryName;
    private byte[] image;
    private Boolean isActive;
}
