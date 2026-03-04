package com.Commerce.e_commerceSite.service;

import com.Commerce.e_commerceSite.dto.FavouriteRequest;
import com.Commerce.e_commerceSite.dto.ProductResponse;
import com.Commerce.e_commerceSite.exception.InactiveProduct;
import com.Commerce.e_commerceSite.exception.InactiveTenant;
import com.Commerce.e_commerceSite.exception.ProductNotFoundException;
import com.Commerce.e_commerceSite.model.entity.Favourite;
import com.Commerce.e_commerceSite.model.entity.Product;
import com.Commerce.e_commerceSite.model.entity.User;
import com.Commerce.e_commerceSite.model.enums.TenantStatus;
import com.Commerce.e_commerceSite.repo.FavouriteRepo;
import com.Commerce.e_commerceSite.repo.ProductRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FavouriteService {

    private final FavouriteRepo favouriteRepo;
    private final ProductRepo productRepo;
    private final UserService userService;

    public void addToFavourite(FavouriteRequest request, Authentication auth)
    {
        User user = userService.getOrCreateUser(auth);

        Product product = productRepo.findById(request.getProductId())
                                     .orElseThrow(() -> new ProductNotFoundException("Product does not exist!"));

        if(!product.getIsActive())
        {
            throw new InactiveProduct("Product is no longer Available!");
        }

        if(product.getTenant().getStatus().equals(TenantStatus.INACTIVE))
        {
            throw new InactiveTenant("Tenant is no longer Active!");
        }

        boolean exists = favouriteRepo.findByUserAndProduct(user, product).isPresent();

        if(exists)
            return;

        Favourite favourite = Favourite.builder()
                                       .user(user)
                                       .product(product)
                                       .build();

        favouriteRepo.save(favourite);
    }

    @Transactional
    public void removeFromFavourites(FavouriteRequest request, Authentication auth)
    {
        User user = userService.getOrCreateUser(auth);

        Product product = productRepo.findById(request.getProductId())
                                     .orElseThrow(() -> new ProductNotFoundException("Product no longer available!"));

        favouriteRepo.deleteByUserAndProduct(user, product);

    }

    public Page<ProductResponse> getFavourites(Pageable pageable, Authentication auth)
    {
        User user = userService.getOrCreateUser(auth);

        Page<Favourite> favourites = favouriteRepo.findByUser(user, pageable);

        return favourites.map(fav -> {
            Product product = fav.getProduct();

            return ProductResponse.builder()
                                  .id(product.getId())
                    .name(product.getName())
                    .description(product.getDescription())
                    .quantity(product.getQuantity())
                    .price(product.getPrice())
                    .category(product.getCategory().getName())
                    .tenant(product.getTenant().getName()).build();
        });
    }
}
