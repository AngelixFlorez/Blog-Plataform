package com.devangeli.blog.mappers;

import com.devangeli.blog.domain.CreatePostRequest;
import com.devangeli.blog.domain.UpdatePostRequest;
import com.devangeli.blog.domain.dtos.AuthorDto;
import com.devangeli.blog.domain.dtos.CategoryDto;
import com.devangeli.blog.domain.dtos.CreatePostRequestDto;
import com.devangeli.blog.domain.dtos.PostDto;
import com.devangeli.blog.domain.dtos.TagDto;
import com.devangeli.blog.domain.dtos.UpdatePostRequestDto;
import com.devangeli.blog.domain.entities.Post;
import com.devangeli.blog.domain.entities.Tag;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class PostMapper {

    public PostDto toDto(Post post) {
        if (post == null) return null;

        return PostDto.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .status(post.getStatus())
                .readingTime(post.getReadingTime())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .author(AuthorDto.builder()
                        .id(post.getAuthor().getId())
                        .name(post.getAuthor().getName())
                        .build())
                .category(CategoryDto.builder()
                        .id(post.getCategory().getId())
                        .name(post.getCategory().getName())
                        .build())
                .tags(post.getTags().stream()
                        .map(tag -> TagDto.builder()
                                .id(tag.getId())
                                .name(tag.getName())
                                .build())
                        .collect(Collectors.toSet()))
                .build();
    }

    public CreatePostRequest toCreatePostRequest(CreatePostRequestDto dto) {
        if (dto == null) return null;
        return CreatePostRequest.builder()
                .title(dto.getTitle())
                .content(dto.getContent())
                .categoryId(dto.getCategoryId())
                .tagIds(dto.getTagIds())
                .status(dto.getStatus())
                .build();
    }

    public UpdatePostRequest toUpdatePostRequest(UpdatePostRequestDto dto) {
        if (dto == null) return null;
        return UpdatePostRequest.builder()
                .id(dto.getId())
                .title(dto.getTitle())
                .content(dto.getContent())
                .categoryId(dto.getCategoryId())
                .tagIds(dto.getTagIds())
                .status(dto.getStatus())
                .build();
    }
}