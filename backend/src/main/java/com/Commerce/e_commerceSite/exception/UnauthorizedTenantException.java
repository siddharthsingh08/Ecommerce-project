package com.Commerce.e_commerceSite.exception;

public class UnauthorizedTenantException extends RuntimeException{
    public UnauthorizedTenantException(String message) {
        super(message);
    }
}
