package com.Commerce.e_commerceSite.exception;

public class TenantNotFoundException extends RuntimeException{
    public TenantNotFoundException(String message)
    {
        super(message);
    }
}
