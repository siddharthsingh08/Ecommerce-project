package com.Commerce.e_commerceSite.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class UnauthorizedTenantException extends RuntimeException{
    public UnauthorizedTenantException(String message) {
        super(message);
    }
}
