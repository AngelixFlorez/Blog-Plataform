package com.devangeli.blog.services;

import com.devangeli.blog.domain.CreatePostRequest;
import com.devangeli.blog.domain.UpdatePostRequest;
import com.devangeli.blog.domain.entities.Post;
import com.devangeli.blog.domain.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface PostService {
    Post getPost(UUID id);

    List<Post> getAllPosts(UUID categoryId, UUID tagId);

    Page<Post> getAllPostsPaged(UUID categoryId, UUID tagId, String search, Pageable pageable);

    List<Post> getDraftPosts(User user);

    Post createPost(User user, CreatePostRequest createPostRequest);

    Post updatePost(UUID id, UpdatePostRequest updatePostRequest);

    Post publishPost(UUID id);

    void deletePost(UUID id);
}