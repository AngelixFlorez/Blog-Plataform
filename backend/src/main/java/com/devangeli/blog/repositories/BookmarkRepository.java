package com.devangeli.blog.repositories;

import com.devangeli.blog.domain.entities.Bookmark;
import com.devangeli.blog.domain.entities.Post;
import com.devangeli.blog.domain.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, UUID> {
    Optional<Bookmark> findByUserAndPost(User user, Post post);
    List<Bookmark> findAllByPost(Post post);
    List<Bookmark> findAllByUserOrderByCreatedAtDesc(User user);
    boolean existsByUserAndPost(User user, Post post);
    long countByPost(Post post);
    void deleteByUserAndPost(User user, Post post);
}