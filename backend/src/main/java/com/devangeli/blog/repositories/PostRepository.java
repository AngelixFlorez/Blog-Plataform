package com.devangeli.blog.repositories;

import com.devangeli.blog.domain.PostStatus;
import com.devangeli.blog.domain.entities.Category;
import com.devangeli.blog.domain.entities.Post;
import com.devangeli.blog.domain.entities.Tag;
import com.devangeli.blog.domain.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PostRepository extends JpaRepository<Post, UUID> {
    List<Post> findAllByStatusAndCategoryAndTagsContaining(PostStatus status, Category category, Tag tag);

    List<Post> findAllByStatusAndCategory(PostStatus status, Category category);

    List<Post> findAllByStatusAndTagsContaining(PostStatus status, Tag tag);

    List<Post> findAllByStatus(PostStatus status);

    List<Post> findAllByAuthorAndStatus(User author, PostStatus status);

    Page<Post> findAllByStatus(PostStatus status, Pageable pageable);

    Page<Post> findAllByStatusAndCategory(PostStatus status, Category category, Pageable pageable);

    @Query("SELECT p FROM Post p LEFT JOIN p.tags t WHERE p.status = :status AND t = :tag")
    Page<Post> findAllByStatusAndTagsContaining(@Param("status") PostStatus status, @Param("tag") Tag tag, Pageable pageable);

    @Query("SELECT p FROM Post p LEFT JOIN p.tags t WHERE p.status = :status AND p.category = :category AND t = :tag")
    Page<Post> findAllByStatusAndCategoryAndTagsContaining(@Param("status") PostStatus status, @Param("category") Category category, @Param("tag") Tag tag, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.status = :status AND (LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(p.content) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Post> searchByKeyword(@Param("status") PostStatus status, @Param("keyword") String keyword, Pageable pageable);
}