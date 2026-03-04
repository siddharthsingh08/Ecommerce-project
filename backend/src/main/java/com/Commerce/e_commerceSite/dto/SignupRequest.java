package com.Commerce.e_commerceSite.dto;

import lombok.Data;

@Data
public class SignupRequest
{
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String password;
}
