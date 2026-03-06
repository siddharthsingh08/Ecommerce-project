package com.Commerce.e_commerceSite.controller;

import com.Commerce.e_commerceSite.dto.FavouriteRequest;
import com.Commerce.e_commerceSite.dto.ProductResponse;
import com.Commerce.e_commerceSite.service.FavouriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/favourites")
public class FavouriteController {

    private final FavouriteService favouriteService;

    @PostMapping
    public ResponseEntity<String> addFavourite(@RequestBody FavouriteRequest request, Authentication auth)
    {
        favouriteService.addToFavourite(request, auth);
        return ResponseEntity.ok("Added to favourites!");
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<String> removeFromFavourites(@PathVariable Long productId, Authentication auth)
    {
        favouriteService.removeFromFavourites(productId, auth);
        return ResponseEntity.ok("Removed from favourites!");
    }

    @GetMapping
    public ResponseEntity<Page<ProductResponse>> getAllFavourites(Authentication auth, Pageable pageable)
    {
        return new ResponseEntity<>(favouriteService.getFavourites(pageable, auth), HttpStatus.OK);
    }
}
