package com.Commerce.e_commerceSite.controller;

import com.Commerce.e_commerceSite.service.KeycloakUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
public class TestController {

    @GetMapping("/test")
    public String adminTest() {
        return "Admin Access Granted";
    }

    @Autowired
    private KeycloakUserService keycloakUserService;

//    @PostMapping("/test-create-user")
//    public String testUser() {
//        keycloakUserService.createUser(
//                "tenant3",
//                "tenant123@gmail.com",
//                "Tenant",
//                "User",
//                "password123",
//                "ROLE_TENANT"
//        );
//        return "Created";
//    }
}