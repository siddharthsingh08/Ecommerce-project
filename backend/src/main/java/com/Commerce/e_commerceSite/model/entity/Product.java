package com.Commerce.e_commerceSite.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;
    private String description;
    private BigDecimal price;
    private Integer quantity;

    @Column(nullable = false)
    private Boolean isActive = true;

    @Lob
    private byte[] image;

    @ManyToOne
    @JoinColumn(name= "tenant_id", nullable= false)
    private Tenant tenant;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
}
