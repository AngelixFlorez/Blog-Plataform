package com.devangeli.blog.services.impl;

import com.devangeli.blog.domain.dtos.BookmarkDto;
import com.devangeli.blog.domain.entities.Bookmark;
import com.devangeli.blog.domain.entities.Post;
import com.devangeli.blog.domain.entities.User;
import com.devangeli.blog.repositories.BookmarkRepository;
import com.devangeli.blog.services.BookmarkService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BookmarkServiceImpl implements BookmarkService {

    private final BookmarkRepository bookmarkRepository;

    @Override
    @Transactional
    public BookmarkDto toggleBookmark(User user, Post post) {
        Optional<Bookmark> existing = bookmarkRepository.findByUserAndPost(user, post);

        if (existing.isPresent()) {
            bookmarkRepository.delete(existing.get());
        } else {
            Bookmark bookmark = Bookmark.builder()
                    .user(user)
                    .post(post)
                    .build();
            bookmarkRepository.save(bookmark);
        }

        long count = bookmarkRepository.countByPost(post);
        boolean bookmarked = !existing.isPresent();

        return BookmarkDto.builder()
                .postId(post.getId())
                .userId(user.getId())
                .bookmarked(bookmarked)
                .bookmarkCount(count)
                .build();
    }

    @Override
    public boolean isBookmarked(User user, Post post) {
        return bookmarkRepository.existsByUserAndPost(user, post);
    }

    @Override
    public long getBookmarkCount(Post post) {
        return bookmarkRepository.countByPost(post);
    }

    @Override
    public List<BookmarkDto> getUserBookmarks(User user) {
        return bookmarkRepository.findAllByUserOrderByCreatedAtDesc(user).stream()
                .map(bookmark -> BookmarkDto.builder()
                        .id(bookmark.getId())
                        .postId(bookmark.getPost().getId())
                        .userId(user.getId())
                        .bookmarked(true)
                        .bookmarkCount(bookmarkRepository.countByPost(bookmark.getPost()))
                        .build())
                .toList();
    }
}