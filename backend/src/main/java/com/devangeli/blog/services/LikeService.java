package com.devangeli.blog.services;

import com.devangeli.blog.domain.dtos.LikeDto;
import com.devangeli.blog.domain.entities.Post;
import com.devangeli.blog.domain.entities.User;

import java.util.List;

public interface LikeService {
    LikeDto toggleLike(User user, Post post);
    boolean isLiked(User user, Post post);
    long getLikeCount(Post post);
    List<LikeDto> getUserLikes(User user);
}