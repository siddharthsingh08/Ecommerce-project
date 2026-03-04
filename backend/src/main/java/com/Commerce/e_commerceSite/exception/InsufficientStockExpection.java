package com.Commerce.e_commerceSite.exception;

public class InsufficientStockExpection extends RuntimeException {
    public InsufficientStockExpection(String message) {
        super(message);
    }
}
