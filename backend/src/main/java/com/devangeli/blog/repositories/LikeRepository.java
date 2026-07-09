package com.devangeli.blog.repositories;

import com.devangeli.blog.domain.entities.Like;
import com.devangeli.blog.domain.entities.Post;
import com.devangeli.blog.domain.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface LikeRepository extends JpaRepository<Like, UUID> {
    Optional<Like> findByUserAndPost(User user, Post post);
    List<Like> findAllByPost(Post post);
    List<Like> findAllByUserOrderByCreatedAtDesc(User user);
    boolean existsByUserAndPost(User user, Post post);
    long countByPost(Post post);
    void deleteByUserAndPost(User user, Post post);
}