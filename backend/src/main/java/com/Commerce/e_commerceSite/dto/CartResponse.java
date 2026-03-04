package com.Commerce.e_commerceSite.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class CartResponse {
    private Long cartId;
    private BigDecimal totalPrice;
    private List<CartItemResponse> items;
}
