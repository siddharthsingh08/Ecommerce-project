package com.Commerce.e_commerceSite.dto;

import lombok.Data;

@Data
public class UpdateCartItemRequest {
    private Long id;
    private Integer quantity;
}
