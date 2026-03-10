package com.Commerce.e_commerceSite.service;

import com.Commerce.e_commerceSite.exception.DuplicateTenantException;
import jakarta.ws.rs.core.Response;
import lombok.RequiredArgsConstructor;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class KeycloakUserService {

    private final Keycloak keycloak;

    @Value("${keycloak.realm}")
    private String realm;

    public void createUser(String username,
                           String email,
                           String firstName,
                           String lastName,
                           String password,
                           String role,
                           String tenantName) {

        RealmResource realmResource = keycloak.realm(realm);

        List<UserRepresentation> existing =
                realmResource.users().search(username);

        if (!existing.isEmpty()) {
            throw new DuplicateTenantException("User already exists in Keycloak");
        }

        UserRepresentation user = new UserRepresentation();
        user.setUsername(username);
        user.setEmail(email);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEnabled(true);

        if (tenantName != null) {
            user.setAttributes(Map.of(
                    "tenant", List.of(tenantName)
            ));
        }

        Response response = realmResource.users().create(user);

        if (response.getStatus() != 201) {
            throw new RuntimeException("Failed to create user: " + response.getStatus());
        }

        String location = response.getLocation().getPath();
        String userId = location.substring(location.lastIndexOf("/") + 1);

        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setTemporary(false);
        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue(password);

        realmResource.users()
                .get(userId)
                .resetPassword(credential);

        realmResource.users()
                .get(userId)
                .roles()
                .realmLevel()
                .add(Collections.singletonList(
                        realmResource.roles().get(role).toRepresentation()
                ));
    }

    public void deleteUser(String userId) {

        RealmResource realmResource = keycloak.realm(realm);

        Response response = realmResource
                .users()
                .delete(userId);

        if (response.getStatus() != 204) {
            throw new RuntimeException("Failed to delete user from Keycloak: " + response.getStatus());
        }
    }
}