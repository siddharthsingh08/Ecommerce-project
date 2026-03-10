# Multi-Tenant E-Commerce Platform

A full stack **multi-tenant e-commerce platform** built with:

- Spring Boot
- Keycloak Authentication
- React + TypeScript
- PostgreSQL

The system allows multiple **brands (tenants)** to manage their own products while users can browse, purchase, and manage orders.

Project Features

1. Users can sign up, login and purchase available products.
2. Username is unique for each user.
3. Platform admin can add or remove tenants (brands) and manage tenant.
4. Tenants can login to their own domain and manage their products.
5. Products can be categorized and filtered by category.
6. Products can be searched by name.
7. Users can create orders consisting of multiple order items.
8. Order items must respect available product quantity.
9. Orders include total quantity and total amount.
10. Users can view their order history.
11. Users can mark or unmark products as favourites.
12. Tenants can create, edit, or delete product.
13. Admin can create or delete categories to control what products can be added to the platform.
14. Admin can change the status of an order like SHIPPED, CANCELLED, etc

Architecture

1. Frontend: React + TypeScript
2. Backend: Spring Boot REST API
3. Authentication: Keycloak
4. Database: PostgreSQL

Backend

- Spring Boot
- Spring Security
- Spring Data JPA
- Keycloak
- Lombok
- JUnit

Frontend

- React
- TypeScript
- Tailwind CSS
- Axios
- React Router
- Toast

Database

- PostgreSQL

---


Database Models

1. Tenant
2. User
3. Product
4. Category
5. Order
6. OrderItem
7. Cart
8. CartItem
9. Favourite

## User Features

Users can:

- Sign up and login
- Browse products from different brands
- Search products by name
- Filter products by category
- Add, remove, update items in cart
- Create orders
- View order history
- Mark/unmark favourite products

---

## Tenant Features

Each **tenant (brand)** can:

- Login to their tenant domain
- Create products
- Update products
- Delete products
- Manage inventory quantity
- Can also do everything a normal user can do

Tenants **cannot modify another tenant's data**.

---

## Platform Admin Features

Admins can:

- Create tenants
- Remove tenants
- Manage tenant users (deactivate them)
- Add category
- Remove category

---

# Multi-Tenancy Design

All tenant specific endpoints follow:
/tenant/{tenantName}/endpoint
Like:

1. /tenant/apple/products
2. /tenant/nike/products

All admin specific endpoints follow:
/admin/endpoint
Like:

1. /admin/tenant
2. /admin/category

All other protected endpoints(which are common for users) follow:
/endpoint
Like:

1. /cart
2. /orders

Public endpoints(which non-logged in users can also see) follow:
/public/endpoint
Like:

1. /public/products

Authentication and Authorization

Authentication is handled using Keycloak. Role-based access control is implemented with the following roles:

ROLE_ADMIN
ROLE_TENANT
ROLE_USER

# Running Locally

-Clone repo (git clone)


Running the Backend

1. Navigate to the backend directory.
2. Run: mvn spring-boot:run
3. Backend server starts at http://localhost:8080

Running the Frontend

1. Navigate to the frontend directory.
2. Run: npm install
3. Run: npm run dev
4. Frontend starts at http://localhost:5173

Testing

Unit tests are implemented using JUnit to validate service logic, including product creation, product deletion, and error handling.
