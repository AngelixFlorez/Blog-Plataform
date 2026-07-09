package com.devangeli.blog.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;
import java.util.Map;

@Service
public class ImageKitService {

    private final RestTemplate restTemplate;
    private final String privateKey;
    private final String uploadUrl = "https://upload.imagekit.io/api/v1/files/upload";

    public ImageKitService() {
        this.restTemplate = new RestTemplate();
        this.privateKey = System.getenv("IMAGEKIT_PRIVATE_KEY");
    }

    public String upload(MultipartFile file) {
        if (privateKey == null || privateKey.isBlank()) {
            throw new IllegalStateException("IMAGEKIT_PRIVATE_KEY environment variable is not set");
        }

        try {
            String auth = privateKey + ":";
            String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            headers.set("Authorization", "Basic " + encodedAuth);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", file.getResource());
            body.add("fileName", file.getOriginalFilename() != null ? file.getOriginalFilename() : "image_" + System.currentTimeMillis());
            body.add("useUniqueFileName", "true");

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                    uploadUrl,
                    HttpMethod.POST,
                    requestEntity,
                    Map.class
            );

            Map<String, Object> responseBody = response.getBody();
            if (responseBody != null && responseBody.containsKey("url")) {
                return (String) responseBody.get("url");
            }

            throw new RuntimeException("Failed to upload image to ImageKit");
        } catch (Exception e) {
            throw new RuntimeException("Image upload failed: " + e.getMessage(), e);
        }
    }
}