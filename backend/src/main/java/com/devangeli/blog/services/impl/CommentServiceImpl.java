package com.devangeli.blog.services.impl;

import com.devangeli.blog.domain.dtos.CommentDto;
import com.devangeli.blog.domain.entities.Comment;
import com.devangeli.blog.domain.entities.Post;
import com.devangeli.blog.domain.entities.User;
import com.devangeli.blog.repositories.CommentRepository;
import com.devangeli.blog.services.CommentService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;

    @Override
    @Transactional
    public CommentDto createComment(User user, Post post, String content) {
        Comment comment = Comment.builder()
                .user(user)
                .post(post)
                .content(content)
                .build();
        Comment saved = commentRepository.save(comment);

        return CommentDto.builder()
                .id(saved.getId())
                .content(saved.getContent())
                .userId(user.getId())
                .userName(user.getName())
                .createdAt(saved.getCreatedAt())
                .updatedAt(saved.getUpdatedAt())
                .build();
    }

    @Override
    @Transactional
    public void deleteComment(UUID commentId, User user) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("Comment not found"));
        if (!comment.getUser().getId().equals(user.getId())) {
            throw new IllegalStateException("You can only delete your own comments");
        }
        commentRepository.delete(comment);
    }

    @Override
    public List<CommentDto> getCommentsByPost(Post post) {
        return commentRepository.findAllByPostOrderByCreatedAtAsc(post).stream()
                .map(comment -> CommentDto.builder()
                        .id(comment.getId())
                        .content(comment.getContent())
                        .userId(comment.getUser().getId())
                        .userName(comment.getUser().getName())
                        .createdAt(comment.getCreatedAt())
                        .updatedAt(comment.getUpdatedAt())
                        .build())
                .toList();
    }

    @Override
    public long getCommentCount(Post post) {
        return commentRepository.countByPost(post);
    }
}