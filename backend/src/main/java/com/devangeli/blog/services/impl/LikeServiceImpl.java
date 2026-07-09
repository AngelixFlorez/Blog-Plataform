package com.devangeli.blog.services.impl;

import com.devangeli.blog.domain.dtos.LikeDto;
import com.devangeli.blog.domain.entities.Like;
import com.devangeli.blog.domain.entities.Post;
import com.devangeli.blog.domain.entities.User;
import com.devangeli.blog.repositories.LikeRepository;
import com.devangeli.blog.services.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LikeServiceImpl implements LikeService {

    private final LikeRepository likeRepository;

    @Override
    @Transactional
    public LikeDto toggleLike(User user, Post post) {
        Optional<Like> existing = likeRepository.findByUserAndPost(user, post);

        if (existing.isPresent()) {
            likeRepository.delete(existing.get());
        } else {
            Like like = Like.builder()
                    .user(user)
                    .post(post)
                    .build();
            likeRepository.save(like);
        }

        long count = likeRepository.countByPost(post);
        boolean liked = !existing.isPresent();

        return LikeDto.builder()
                .postId(post.getId())
                .userId(user.getId())
                .userName(user.getName())
                .likeCount(count)
                .liked(liked)
                .build();
    }

    @Override
    public boolean isLiked(User user, Post post) {
        return likeRepository.existsByUserAndPost(user, post);
    }

    @Override
    public long getLikeCount(Post post) {
        return likeRepository.countByPost(post);
    }

    @Override
    public List<LikeDto> getUserLikes(User user) {
        return likeRepository.findAllByUserOrderByCreatedAtDesc(user).stream()
                .map(like -> LikeDto.builder()
                        .id(like.getId())
                        .postId(like.getPost().getId())
                        .userId(user.getId())
                        .userName(user.getName())
                        .likeCount(likeRepository.countByPost(like.getPost()))
                        .liked(true)
                        .build())
                .toList();
    }
}