package com.devangeli.blog.controllers;

import com.devangeli.blog.domain.dtos.AuthResponse;
import com.devangeli.blog.domain.dtos.LoginRequest;
import com.devangeli.blog.domain.dtos.RegisterRequest;
import com.devangeli.blog.domain.dtos.UserProfileDto;
import com.devangeli.blog.services.AuthenticationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping(path = "/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService authenticationService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        UserDetails userDetails = authenticationService.authenticate(
                loginRequest.getEmail(),
                loginRequest.getPassword());
        String tokenValue = authenticationService.generateToken(userDetails);
        AuthResponse authResponse = AuthResponse.builder()
                .token(tokenValue)
                .expiresIn(86400)
                .build();
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest registerRequest) {
        UserDetails userDetails = authenticationService.register(
                registerRequest.getEmail(),
                registerRequest.getPassword(),
                registerRequest.getName());
        String tokenValue = authenticationService.generateToken(userDetails);
        AuthResponse authResponse = AuthResponse.builder()
                .token(tokenValue)
                .expiresIn(86400)
                .build();
        return new ResponseEntity<>(authResponse, HttpStatus.CREATED);
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfileDto> profile(@RequestAttribute UUID userId) {
        return ResponseEntity.ok(authenticationService.getProfile(userId));
    }
}
