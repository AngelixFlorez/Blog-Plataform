package com.devangeli.blog.controllers;

import com.devangeli.blog.domain.dtos.LikeDto;
import com.devangeli.blog.domain.entities.Post;
import com.devangeli.blog.domain.entities.User;
import com.devangeli.blog.services.LikeService;
import com.devangeli.blog.services.PostService;
import com.devangeli.blog.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class LikeController {

    private final LikeService likeService;
    private final PostService postService;
    private final UserService userService;

    @PostMapping("/api/v1/posts/{postId}/like")
    public ResponseEntity<LikeDto> toggleLike(
            @PathVariable UUID postId,
            @RequestAttribute UUID userId) {
        User user = userService.getUserById(userId);
        Post post = postService.getPost(postId);
        return ResponseEntity.ok(likeService.toggleLike(user, post));
    }

    @GetMapping("/api/v1/posts/{postId}/like")
    public ResponseEntity<LikeDto> getLikeStatus(
            @PathVariable UUID postId,
            @RequestAttribute(required = false) UUID userId) {
        Post post = postService.getPost(postId);
        long count = likeService.getLikeCount(post);
        boolean liked = userId != null && likeService.isLiked(userService.getUserById(userId), post);
        return ResponseEntity.ok(LikeDto.builder()
                .postId(postId)
                .likeCount(count)
                .liked(liked)
                .build());
    }

    @GetMapping("/api/v1/likes")
    public ResponseEntity<List<LikeDto>> getUserLikes(@RequestAttribute UUID userId) {
        User user = userService.getUserById(userId);
        return ResponseEntity.ok(likeService.getUserLikes(user));
    }
}