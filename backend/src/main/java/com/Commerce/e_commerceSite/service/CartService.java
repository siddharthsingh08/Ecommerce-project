package com.Commerce.e_commerceSite.service;

import com.Commerce.e_commerceSite.dto.CartItemResponse;
import com.Commerce.e_commerceSite.dto.CartResponse;
import com.Commerce.e_commerceSite.dto.CreateCartItem;
import com.Commerce.e_commerceSite.dto.UpdateCartItemRequest;
import com.Commerce.e_commerceSite.exception.*;
import com.Commerce.e_commerceSite.model.entity.*;
import com.Commerce.e_commerceSite.model.enums.OrderStatus;
import com.Commerce.e_commerceSite.model.enums.TenantStatus;
import com.Commerce.e_commerceSite.repo.CartItemRepo;
import com.Commerce.e_commerceSite.repo.CartRepo;
import com.Commerce.e_commerceSite.repo.OrderRepo;
import com.Commerce.e_commerceSite.repo.ProductRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;


import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepo cartRepo;
    private final CartItemRepo cartItemRepo;
    private final ProductRepo productRepo;
    private final UserService userService;
    private final OrderRepo orderRepo;

    public Cart getOrCreateCart(Authentication auth)
    {
        User user = userService.getOrCreateUser(auth);
        return cartRepo.findByUser(user).orElseGet(() -> {
            Cart cart = new Cart();
           cart.setUser(user);
           cart.setCreatedAt(LocalDateTime.now());
           return cartRepo.save(cart);
        });
    }

    public Cart addToCart(CreateCartItem item, Authentication auth)
    {
        if(item.getQuantity() <= 0)
        {
            throw new InsufficientQuantityException("Quantity needs to be more than 0");
        }

        Cart cart = getOrCreateCart(auth);

        Product product = productRepo.findById(item.getId())
                                     .orElseThrow(() -> new ProductNotFoundException("No such product exists!"));

        if(!product.getIsActive())
        {
            throw new InactiveProduct("Product is not Active!");
        }

        if(product.getTenant().getStatus().equals(TenantStatus.INACTIVE))
        {
            throw new InactiveTenant("Tenant is Inactive!");
        }

        if(item.getQuantity() > product.getQuantity())
        {
            throw new InsufficientQuantityException("Stock is less than request!");
        }

        CartItem existingItem = cartItemRepo.findByCartAndProduct(cart, product)
                                            .orElse(null);


        if(existingItem != null)
        {
            int newQuantity = item.getQuantity() + existingItem.getQuantity();

            if(newQuantity > product.getQuantity())
            {
                throw new InsufficientStockExpection("Stock is less than request!");
            }

            existingItem.setQuantity(newQuantity);
            cartItemRepo.save(existingItem);
        }
        else
        {
            CartItem cartItem = new CartItem();

            cartItem.setCart(cart);
            cartItem.setProduct(product);
            cartItem.setQuantity(item.getQuantity());

            cart.getItems().add(cartItem);

            cartRepo.save(cart);


        }
        return cartRepo.findById(cart.getId()).get();
    }

    public CartResponse viewCart(Authentication auth)
    {
        Cart cart = getOrCreateCart(auth);

        List<CartItemResponse> items = cart.getItems().stream()
                                        .map(item -> CartItemResponse.builder()
                                                .productId(item.getProduct().getId())
                                                .productName(item.getProduct().getName())
                                                .quantity(item.getQuantity())
                                                .price(item.getProduct().getPrice())
                                                .totalPrice(item.getProduct().getPrice().multiply(new BigDecimal(item.getQuantity())))
                                                .build()
                                        ).toList();

        BigDecimal totalAmount = items.stream()
                                      .map(CartItemResponse::getTotalPrice)
                                      .reduce(BigDecimal.ZERO, BigDecimal::add);
        return CartResponse.builder()
                           .cartId(cart.getId())
                           .totalPrice(totalAmount)
                           .items(items).build();
    }

    public CartResponse updateCart(UpdateCartItemRequest request, Authentication auth)
    {
        if(request.getQuantity() <= 0)
        {
            throw new InsufficientQuantityException("Quantity must be above 0!");
        }

        Cart cart = getOrCreateCart(auth);

        CartItem cartItem = cart.getItems().stream()
                                .filter(item -> item.getProduct().getId().equals(request.getId()))
                                .findFirst()
                                .orElseThrow(() -> new ProductNotInCartException("No such product in cart!"));

        Product product = cartItem.getProduct();

        if(!product.getIsActive())
        {
            throw new InactiveProduct("Product is no longer active!");
        }

        if(product.getTenant().getStatus().equals(TenantStatus.INACTIVE))
        {
            throw new InactiveTenant("Product Tenant is no longer Active!");
        }

        if(request.getQuantity() > product.getQuantity())
        {
            throw new InsufficientStockExpection("Stock is less than desired quantity!");
        }

        cartItem.setQuantity(request.getQuantity());

        cartItemRepo.save(cartItem);

        return viewCart(auth);
    }

    public CartResponse deleteCartItem(Long id, Authentication auth)
    {
        Cart cart = getOrCreateCart(auth);

        CartItem cartItem = cart.getItems().stream()
                                .filter(item -> item.getProduct().getId().equals(id))
                                .findFirst()
                                .orElseThrow(() -> new ProductNotInCartException("The product is not in cart!"));

        cart.getItems().remove(cartItem);
        cartRepo.save(cart);

        return viewCart(auth);
    }

    @Transactional
    public void checkout(Authentication auth)
    {
        Cart cart = getOrCreateCart(auth);

        if(cart.getItems().isEmpty())
        {
            throw new RuntimeException("Cart is Empty!");
        }

        User user = cart.getUser();

         Order order = new Order();

         order.setUser(user);

         order.setCreatedAt(LocalDateTime.now());

         List<OrderItem> orderItems = new ArrayList<>();

         int totalQuantity = 0;
         BigDecimal totalPrice = BigDecimal.ZERO;

         for(CartItem cartItem: cart.getItems())
         {
             Product product = cartItem.getProduct();

             if(!product.getIsActive())
             {
                 throw new InactiveProduct("Product is no longer available!");
             }

             if(product.getTenant().getStatus().equals(TenantStatus.INACTIVE))
             {
                 throw new InactiveTenant("Tenant is no longer Active");
             }

             if(cartItem.getQuantity() > product.getQuantity())
             {
                 throw new InsufficientStockExpection("Stock has decreased and cannot cover the order!");
             }

             product.setQuantity(product.getQuantity() - cartItem.getQuantity());

             OrderItem orderItem = OrderItem.builder()
                     .order(order)
                     .product(product)
                     .quantity(cartItem.getQuantity())
                     .priceAtPurchase(cartItem.getProduct().getPrice())
                     .build();

             orderItems.add(orderItem);

             totalQuantity += cartItem.getQuantity();
             totalPrice = totalPrice.add(product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
         }

         order.setItems(orderItems);
         order.setTotalPrice(totalPrice);
         order.setTotalQuantity(totalQuantity);
         order.setStatus(OrderStatus.Created);

         orderRepo.save(order);
         cart.getItems().clear();
         cartRepo.save(cart);
    }
}
