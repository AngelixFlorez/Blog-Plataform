package com.devangeli.blog.services;

import com.devangeli.blog.domain.entities.User;

import java.util.UUID;

public interface UserService {
    User getUserById(UUID id);
}