package com.devangeli.blog.controllers;

import com.devangeli.blog.domain.dtos.CreateTagsRequest;
import com.devangeli.blog.domain.dtos.TagDto;
import com.devangeli.blog.domain.entities.Tag;
import com.devangeli.blog.mappers.TagMapper;
import com.devangeli.blog.services.TagService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(path = "/api/v1/tags")
@RequiredArgsConstructor
public class TagController {

    private final TagService tagService;
    private final TagMapper tagMapper;

    @GetMapping
    public ResponseEntity<List<TagDto>> getAllTags() {
        List<Tag> tags = tagService.getTags();
        List<TagDto> tagResponses = tags.stream().map(tagMapper::toTagResponse).toList();
        return ResponseEntity.ok(tagResponses);
    }

    @GetMapping(path = "/{id}")
    public ResponseEntity<TagDto> getTag(@PathVariable UUID id) {
        Tag tag = tagService.getTagById(id);
        return ResponseEntity.ok(tagMapper.toTagResponse(tag));
    }

    @PostMapping
    public ResponseEntity<List<TagDto>> createTags(@Valid @RequestBody CreateTagsRequest createTagsRequest) {
        List<Tag> savedTags = tagService.createTags(createTagsRequest.getNames());
        List<TagDto> createdTagResponses = savedTags.stream().map(tagMapper::toTagResponse).toList();
        return new ResponseEntity<>(
                createdTagResponses,
                HttpStatus.CREATED);
    }

    @DeleteMapping(path = "/{id}")
    public ResponseEntity<Void> deleteTag(@PathVariable UUID id) {
        tagService.deleteTag(id);
        return ResponseEntity.noContent().build();
    }

}