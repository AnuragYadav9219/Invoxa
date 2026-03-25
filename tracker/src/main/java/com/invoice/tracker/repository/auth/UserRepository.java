package com.invoice.tracker.repository.auth;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.invoice.tracker.entity.auth.User;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u JOIN FETCH u.shop WHERE u.email = :email")
    Optional<User> findByEmailWithShop(@Param("email") String email);

    boolean existsByEmail(String email);
}
