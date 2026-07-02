package com.devangeli.blog.mappers.impl;

import com.devangeli.blog.domain.dtos.CategoryDto;
import com.devangeli.blog.domain.dtos.CreateCategoryRequest;
import com.devangeli.blog.domain.entities.Category;
import com.devangeli.blog.mappers.CategoryMapper;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapperImpl implements CategoryMapper {

  @Override
  public CategoryDto toDto(Category category) {
    return CategoryDto.builder()
        .name(category.getName())
        // all values
        .build();
  }

  @Override
  public Category toEntity(CreateCategoryRequest createCategoryRequest) {
    return null;
  }
}
