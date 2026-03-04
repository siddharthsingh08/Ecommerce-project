package com.Commerce.e_commerceSite.dto;

import com.Commerce.e_commerceSite.model.enums.OrderStatus;
import lombok.Data;

@Data
public class UpdateOrderStatusRequest {
    private Long orderId;
    private OrderStatus status;
}
