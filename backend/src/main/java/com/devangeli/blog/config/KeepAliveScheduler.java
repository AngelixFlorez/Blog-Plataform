package com.devangeli.blog.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Component
@ConditionalOnProperty(value = "app.keepalive.enabled", havingValue = "true", matchIfMissing = false)
@Slf4j
public class KeepAliveScheduler {

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final String healthUrl;

    public KeepAliveScheduler(@Value("${server.port:8080}") int port) {
        this.healthUrl = "http://localhost:" + port + "/api/v1/posts";
    }

    @Scheduled(fixedRateString = "${app.keepalive.interval:840000}")
    public void keepAlive() {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(healthUrl))
                    .timeout(java.time.Duration.ofSeconds(10))
                    .GET()
                    .build();
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() == 200) {
                log.debug("Keepalive OK");
            } else {
                log.warn("Keepalive failed with status: {}", response.statusCode());
            }
        } catch (Exception e) {
            log.error("Keepalive error", e);
        }
    }
}
