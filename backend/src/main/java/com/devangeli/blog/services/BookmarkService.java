package com.devangeli.blog.services;

import com.devangeli.blog.domain.dtos.BookmarkDto;
import com.devangeli.blog.domain.entities.Post;
import com.devangeli.blog.domain.entities.User;

import java.util.List;

public interface BookmarkService {
    BookmarkDto toggleBookmark(User user, Post post);
    boolean isBookmarked(User user, Post post);
    long getBookmarkCount(Post post);
    List<BookmarkDto> getUserBookmarks(User user);
}