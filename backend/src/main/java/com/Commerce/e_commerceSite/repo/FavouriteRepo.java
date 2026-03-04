package com.Commerce.e_commerceSite.repo;

import com.Commerce.e_commerceSite.model.entity.Favourite;
import com.Commerce.e_commerceSite.model.entity.Product;
import com.Commerce.e_commerceSite.model.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.util.Optional;

@Repository
public interface FavouriteRepo extends JpaRepository<Favourite, Long> {

    Optional<Favourite> findByUserAndProduct(User user, Product product);

    Page<Favourite> findByUser(User user, Pageable pageable);

    void deleteByUserAndProduct(User user, Product product);
}
