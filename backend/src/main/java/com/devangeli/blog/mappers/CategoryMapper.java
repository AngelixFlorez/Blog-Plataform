package com.devangeli.blog.mappers;

import com.devangeli.blog.domain.dtos.CategoryDto;
import com.devangeli.blog.domain.dtos.CreateCategoryRequest;
import com.devangeli.blog.domain.entities.Category;

public interface CategoryMapper {

    CategoryDto toDto(Category category);

    Category toEntity(CreateCategoryRequest createCategoryRequest);

}
