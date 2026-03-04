package com.Commerce.e_commerceSite.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name ="users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;
    private String email;
    @Column(nullable = false, unique = true)
    private String keycloakUserId;

    @ManyToOne
    @JoinColumn(name = "tenant_id")
    private Tenant tenant;


//    @ManyToMany(fetch = FetchType.EAGER)
//    @JoinTable(name = "user_roles",
//    joinColumns = @JoinColumn(name = "user_id"),
//    inverseJoinColumns = @JoinColumn(name = "role_id")
//    )
//    private Set<Role> role;
}
