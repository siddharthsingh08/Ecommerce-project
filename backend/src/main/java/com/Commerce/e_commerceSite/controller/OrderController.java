package com.Commerce.e_commerceSite.controller;

import com.Commerce.e_commerceSite.dto.OrderResponse;
import com.Commerce.e_commerceSite.dto.UpdateOrderStatusRequest;
import com.Commerce.e_commerceSite.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<Page<OrderResponse>> getMyOrder(Pageable pageable, Authentication auth)
    {
        return new ResponseEntity<>(orderService.getMyOrders(pageable, auth), HttpStatus.OK);
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<OrderResponse>> getAllOrders(Pageable pageable, Authentication auth)
    {
        return new ResponseEntity<>(orderService.getAllOrders(pageable), HttpStatus.OK);
    }

    @PutMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderResponse> updateOrders(@RequestBody UpdateOrderStatusRequest request)
    {
        return new ResponseEntity<>(orderService.updateStatus(request), HttpStatus.OK);
    }

}
