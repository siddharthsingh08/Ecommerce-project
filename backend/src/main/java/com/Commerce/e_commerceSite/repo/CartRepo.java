package com.Commerce.e_commerceSite.repo;

import com.Commerce.e_commerceSite.model.entity.Cart;
import com.Commerce.e_commerceSite.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepo extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUser(User user);
}
