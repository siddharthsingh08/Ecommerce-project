package com.Commerce.e_commerceSite.repo;

import com.Commerce.e_commerceSite.model.entity.Cart;
import com.Commerce.e_commerceSite.model.entity.CartItem;
import com.Commerce.e_commerceSite.model.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartItemRepo extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByCartAndProduct(Cart cart, Product product);
}
