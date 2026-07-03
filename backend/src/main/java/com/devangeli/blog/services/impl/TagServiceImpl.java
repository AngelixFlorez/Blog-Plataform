package com.devangeli.blog.services.impl;

import com.devangeli.blog.domain.entities.Tag;
import com.devangeli.blog.repositories.TagRepository;
import com.devangeli.blog.services.TagService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TagServiceImpl implements TagService {

    private final TagRepository tagRepository;

    @Override
    public List<Tag> getTags() {
        return tagRepository.findAllWithPostCount();
    }

    @Transactional
    @Override
    public List<Tag> createTags(Set<String> tagNames) {
        List<Tag> existingTags = tagRepository.findByNameIn(tagNames);

        Set<String> existingTagNames = existingTags.stream()
                .map(Tag::getName)
                .collect(Collectors.toSet());

        List<Tag> newTags = tagNames.stream()
                .filter(name -> !existingTagNames.contains(name))
                .map(name -> Tag.builder()
                        .name(name)
                        .posts(new HashSet<>())
                        .build())
                .toList();

        List<Tag> savedTags = new ArrayList<>();
        if(!newTags.isEmpty()) {
            savedTags = tagRepository.saveAll(newTags);
        }

        savedTags.addAll(existingTags);

        log.info("Tags created/retrieved: {}", tagNames);
        return savedTags;
    }

    @Transactional
    @Override
    public void deleteTag(UUID id) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Tag not found with ID " + id));
        if(!tag.getPosts().isEmpty()) {
            throw new IllegalStateException("Cannot delete tag with posts");
        }
        tagRepository.deleteById(id);
        log.info("Tag deleted: {}", id);
    }

    @Override
    public Tag getTagById(UUID id) {
        if (id == null) {
            throw new IllegalArgumentException("Tag ID must not be null");
        }
        return tagRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Tag not found with ID " + id));
    }

    @Override
    public List<Tag> getTagByIds(Set<UUID> ids) {
        if (ids == null || ids.isEmpty()) {
            return List.of();
        }
        List<Tag> foundTags = tagRepository.findAllById(ids);
        if(foundTags.size() != ids.size()) {
            throw new EntityNotFoundException("Not all specified tag IDs exist");
        }
        return foundTags;
    }

}
