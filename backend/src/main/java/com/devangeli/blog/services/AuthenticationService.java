package com.devangeli.blog.services;

import com.devangeli.blog.domain.dtos.UserProfileDto;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.UUID;

public interface AuthenticationService {
    UserDetails authenticate(String email, String password);

    String generateToken(UserDetails userDetails);

    UserDetails validateToken(String token);

    UserDetails register(String email, String password, String name);

    UserProfileDto getProfile(UUID userId);
}