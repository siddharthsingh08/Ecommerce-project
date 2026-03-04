package com.Commerce.e_commerceSite.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateTenantRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String domain;

    @NotBlank
    private String managerFirstName;

    @NotBlank
    private String managerLastName;

    @NotBlank
    private String password;

    @NotBlank
    private String email;
}
