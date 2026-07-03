package com.devangeli.blog.services.impl;

import com.devangeli.blog.domain.entities.Category;
import com.devangeli.blog.repositories.CategoryRepository;
import com.devangeli.blog.services.CategoryService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public List<Category> listCategories() {
        return categoryRepository.findAllWithPostCount();
    }

    @Override
    @Transactional
    public Category createCategory(Category category) {
        String categoryName = category.getName();
        if(categoryRepository.existsByNameIgnoreCase(categoryName)) {
            throw new IllegalArgumentException("Category already exists with name: " + categoryName);
        }
        Category saved = categoryRepository.save(category);
        log.info("Category created: {}", categoryName);
        return saved;
    }

    @Override
    @Transactional
    public Category updateCategory(UUID id, String name) {
        Category category = getCategoryById(id);
        if (!category.getName().equalsIgnoreCase(name) && categoryRepository.existsByNameIgnoreCase(name)) {
            throw new IllegalArgumentException("Category already exists with name: " + name);
        }
        category.setName(name);
        Category saved = categoryRepository.save(category);
        log.info("Category updated: {} -> {}", id, name);
        return saved;
    }

    @Override
    @Transactional
    public void deleteCategory(UUID id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Category not found with id " + id));
        if(!category.getPosts().isEmpty()) {
            throw new IllegalStateException("Category has posts associated with it");
        }
        categoryRepository.deleteById(id);
        log.info("Category deleted: {}", id);
    }

    @Override
    public Category getCategoryById(UUID id) {
        if (id == null) {
            throw new IllegalArgumentException("Category ID must not be null");
        }
        return categoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Category not found with id " + id));
    }

}
