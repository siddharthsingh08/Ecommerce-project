package com.Commerce.e_commerceSite.exception;

public class InactiveProduct extends RuntimeException{
    public InactiveProduct(String message)
    {
        super(message);
    }
}
