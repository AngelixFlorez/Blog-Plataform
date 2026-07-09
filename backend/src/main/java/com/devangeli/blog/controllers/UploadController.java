package com.devangeli.blog.controllers;

import com.devangeli.blog.services.ImageKitService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/upload")
@RequiredArgsConstructor
public class UploadController {

    private final ImageKitService imageKitService;

    @PostMapping
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "File is empty"));
        }
        String url = imageKitService.upload(file);
        return ResponseEntity.ok(Map.of("url", url));
    }
}