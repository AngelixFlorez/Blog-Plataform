package com.devangeli.blog.controllers;

import com.devangeli.blog.domain.dtos.BookmarkDto;
import com.devangeli.blog.domain.entities.Post;
import com.devangeli.blog.domain.entities.User;
import com.devangeli.blog.services.BookmarkService;
import com.devangeli.blog.services.PostService;
import com.devangeli.blog.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class BookmarkController {

    private final BookmarkService bookmarkService;
    private final PostService postService;
    private final UserService userService;

    @PostMapping("/api/v1/posts/{postId}/bookmark")
    public ResponseEntity<BookmarkDto> toggleBookmark(
            @PathVariable UUID postId,
            @RequestAttribute UUID userId) {
        User user = userService.getUserById(userId);
        Post post = postService.getPost(postId);
        return ResponseEntity.ok(bookmarkService.toggleBookmark(user, post));
    }

    @GetMapping("/api/v1/posts/{postId}/bookmark")
    public ResponseEntity<BookmarkDto> getBookmarkStatus(
            @PathVariable UUID postId,
            @RequestAttribute(required = false) UUID userId) {
        Post post = postService.getPost(postId);
        long count = bookmarkService.getBookmarkCount(post);
        boolean bookmarked = userId != null && bookmarkService.isBookmarked(userService.getUserById(userId), post);
        return ResponseEntity.ok(BookmarkDto.builder()
                .postId(postId)
                .bookmarked(bookmarked)
                .bookmarkCount(count)
                .build());
    }

    @GetMapping("/api/v1/bookmarks")
    public ResponseEntity<List<BookmarkDto>> getUserBookmarks(@RequestAttribute UUID userId) {
        User user = userService.getUserById(userId);
        return ResponseEntity.ok(bookmarkService.getUserBookmarks(user));
    }
}