package com.Commerce.e_commerceSite.service;

import com.Commerce.e_commerceSite.dto.OrderItemResponse;
import com.Commerce.e_commerceSite.dto.OrderResponse;
import com.Commerce.e_commerceSite.dto.UpdateOrderStatusRequest;
import com.Commerce.e_commerceSite.model.entity.Order;
import com.Commerce.e_commerceSite.model.entity.OrderItem;
import com.Commerce.e_commerceSite.model.entity.User;
import com.Commerce.e_commerceSite.repo.OrderRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepo orderRepo;
    private final UserService userService;

    public Page<OrderResponse> getMyOrders(Pageable pageable, Authentication auth)
    {
        User user = userService.getOrCreateUser(auth);

        Page<Order> orders = orderRepo.findByUser(user, pageable);

        return orders.map(this::convertToDTO);
    }

    public Page<OrderResponse> getAllOrders(Pageable pageable)
    {
        Page<Order> orders = orderRepo.findAll(pageable);
        return orders.map(this::convertToDTO);
    }

    @Transactional
    public OrderResponse updateStatus(UpdateOrderStatusRequest request) {
        Order order = orderRepo.findById(request.getOrderId()).orElseThrow(() -> new RuntimeException("Order does not exist!"));

        order.setStatus(request.getStatus());

        orderRepo.save(order);

        return convertToDTO(order);
    }

    private OrderResponse convertToDTO(Order order)
    {
        List<OrderItemResponse> items = order.getItems().stream()
                                     .map(item -> OrderItemResponse.builder()
                                             .productId(item.getProduct().getId())
                                             .productName(item.getProduct().getName())
                                             .quantity(item.getQuantity())
                                             .price(item.getPriceAtPurchase())
                                             .build()).toList();

        return OrderResponse.builder()
                            .orderId(order.getId())
                            .totalQuantity(order.getTotalQuantity())
                            .totalPrice(order.getTotalPrice())
                            .status(order.getStatus())
                            .items(items)
                            .createdAt(order.getCreatedAt())
                            .build();
    }
}
