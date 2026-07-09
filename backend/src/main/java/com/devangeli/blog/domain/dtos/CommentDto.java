package com.devangeli.blog.domain.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CommentDto {
    private UUID id;
    private String content;
    private UUID userId;
    private String userName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}