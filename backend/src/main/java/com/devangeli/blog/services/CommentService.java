package com.devangeli.blog.services;

import com.devangeli.blog.domain.dtos.CommentDto;
import com.devangeli.blog.domain.entities.Post;
import com.devangeli.blog.domain.entities.User;

import java.util.List;
import java.util.UUID;

public interface CommentService {
    CommentDto createComment(User user, Post post, String content);
    void deleteComment(UUID commentId, User user);
    List<CommentDto> getCommentsByPost(Post post);
    long getCommentCount(Post post);
}