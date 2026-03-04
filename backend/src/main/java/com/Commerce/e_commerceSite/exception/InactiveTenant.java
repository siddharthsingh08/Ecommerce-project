package com.Commerce.e_commerceSite.exception;

public class InactiveTenant extends RuntimeException {
    public InactiveTenant(String message) {
        super(message);
    }
}
