package com.Commerce.e_commerceSite.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(TenantNotFoundException.class)
    public ResponseEntity<String> handleTenantNotFound(TenantNotFoundException ex)
    {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                             .body(ex.getMessage());
    }

    @ExceptionHandler(DuplicateTenantException.class)
    public ResponseEntity<String> handleDuplicateTenant(DuplicateTenantException ex)
    {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                             .body(ex.getMessage());
    }

    @ExceptionHandler(ProductNotFoundException.class)
    public ResponseEntity<String> handleProductNotFound(ProductNotFoundException ex)
    {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                             .body(ex.getMessage());
    }

    @ExceptionHandler(UnauthorizedTenantException.class)
    public ResponseEntity<String> handleUnauthorizedTenant(UnauthorizedTenantException ex)
    {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                             .body(ex.getMessage());
    }

    @ExceptionHandler(CategoryNotFound.class)
    public ResponseEntity<String> handleCategoryNotFound(CategoryNotFound ex)
    {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                             .body(ex.getMessage());
    }

    @ExceptionHandler(InsufficientQuantityException.class)
    public ResponseEntity<String> handleInsufficientQuantity(InsufficientQuantityException ex)
    {
        return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE)
                             .body(ex.getMessage());
    }

    @ExceptionHandler(InactiveProduct.class)
    public ResponseEntity<String> handleInactiveProduct(InactiveProduct ex)
    {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                             .body(ex.getMessage());
    }

    @ExceptionHandler(InactiveTenant.class)
    public ResponseEntity<String> handleInactiveTenant(InactiveTenant ex)
    {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                             .body(ex.getMessage());
    }

    @ExceptionHandler(InsufficientStockExpection.class)
    public ResponseEntity<String> handleInsufficientStock(InsufficientQuantityException ex)
    {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                             .body(ex.getMessage());
    }

    @ExceptionHandler(ProductNotInCartException.class)
    public ResponseEntity<String> handleProductNotInCart(ProductNotInCartException ex)
    {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                             .body(ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGeneric(Exception ex)
    {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                             .body("Something Unexpected Happened!\n");
    }

}
