package com.Commerce.e_commerceSite.controller;

import com.Commerce.e_commerceSite.dto.SignupRequest;
import com.Commerce.e_commerceSite.service.KeycloakUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class SignupController {

    private final KeycloakUserService keycloakUserService;

    @PostMapping("/signup")
    public String signup(@RequestBody SignupRequest request) {

        keycloakUserService.createUser(
                request.getUsername(),
                request.getEmail(),
                request.getFirstName(),
                request.getLastName(),
                request.getPassword(),
                "ROLE_USER",
                null
        );

        return "User Created";
    }
}
