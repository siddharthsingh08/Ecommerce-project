package com.Commerce.e_commerceSite.controller;

import com.Commerce.e_commerceSite.dto.CartResponse;
import com.Commerce.e_commerceSite.dto.CreateCartItem;
import com.Commerce.e_commerceSite.dto.UpdateCartItemRequest;
import com.Commerce.e_commerceSite.model.entity.Cart;
import com.Commerce.e_commerceSite.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/cart")
public class CartController {

    private final CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<Cart> addToCart(@RequestBody CreateCartItem item, Authentication auth)
    {
        return new ResponseEntity<>(cartService.addToCart(item, auth), HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<CartResponse> viewCart(Authentication auth)
    {
        return new ResponseEntity<>(cartService.viewCart(auth), HttpStatus.OK);
    }

    @PutMapping("/update")
    public ResponseEntity<CartResponse> updateCartItem(@RequestBody UpdateCartItemRequest request, Authentication auth)
    {
        return new ResponseEntity<>(cartService.updateCart(request, auth), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<CartResponse> deleteCartItem(@PathVariable Long id, Authentication auth)
    {
        return new ResponseEntity<>(cartService.deleteCartItem(id, auth), HttpStatus.OK);
    }

    @PostMapping("/checkout")
    public ResponseEntity<String> checkoutCart(Authentication auth)
    {
        cartService.checkout(auth);
        return ResponseEntity.ok("Order Placed Successfully!");
    }
}
