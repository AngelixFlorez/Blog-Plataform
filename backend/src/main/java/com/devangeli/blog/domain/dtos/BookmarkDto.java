package com.devangeli.blog.domain.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BookmarkDto {
    private UUID id;
    private UUID postId;
    private UUID userId;
    private boolean bookmarked;
    private long bookmarkCount;
}