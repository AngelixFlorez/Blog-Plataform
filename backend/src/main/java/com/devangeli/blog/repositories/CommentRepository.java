package com.devangeli.blog.repositories;

import com.devangeli.blog.domain.entities.Comment;
import com.devangeli.blog.domain.entities.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CommentRepository extends JpaRepository<Comment, UUID> {
    List<Comment> findAllByPostOrderByCreatedAtAsc(Post post);
    long countByPost(Post post);
}