package com.devangeli.blog.controllers;

import com.devangeli.blog.domain.dtos.CommentDto;
import com.devangeli.blog.domain.dtos.CreateCommentRequest;
import com.devangeli.blog.domain.entities.Post;
import com.devangeli.blog.domain.entities.User;
import com.devangeli.blog.services.CommentService;
import com.devangeli.blog.services.PostService;
import com.devangeli.blog.services.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;
    private final PostService postService;
    private final UserService userService;

    @GetMapping("/api/v1/posts/{postId}/comments")
    public ResponseEntity<List<CommentDto>> getComments(@PathVariable UUID postId) {
        Post post = postService.getPost(postId);
        return ResponseEntity.ok(commentService.getCommentsByPost(post));
    }

    @PostMapping("/api/v1/posts/{postId}/comments")
    public ResponseEntity<CommentDto> createComment(
            @PathVariable UUID postId,
            @Valid @RequestBody CreateCommentRequest request,
            @RequestAttribute UUID userId) {
        User user = userService.getUserById(userId);
        Post post = postService.getPost(postId);
        CommentDto comment = commentService.createComment(user, post, request.getContent());
        return new ResponseEntity<>(comment, HttpStatus.CREATED);
    }

    @DeleteMapping("/api/v1/posts/{postId}/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable UUID postId,
            @PathVariable UUID commentId,
            @RequestAttribute UUID userId) {
        User user = userService.getUserById(userId);
        commentService.deleteComment(commentId, user);
        return ResponseEntity.noContent().build();
    }
}