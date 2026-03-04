package com.Commerce.e_commerceSite.repo;

import com.Commerce.e_commerceSite.model.entity.Order;
import com.Commerce.e_commerceSite.model.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepo extends JpaRepository<Order, Long> {

    Page<Order> findByUser(User user, Pageable pageable);

}
