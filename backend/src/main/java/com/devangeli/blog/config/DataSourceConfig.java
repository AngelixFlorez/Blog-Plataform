package com.devangeli.blog.config;

import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;

@Configuration
@Profile("prod")
public class DataSourceConfig {

    @Bean
    public DataSource dataSource() {
        String rawUrl = System.getenv("DATABASE_URL");
        if (rawUrl == null || rawUrl.isBlank()) {
            rawUrl = System.getProperty("DATABASE_URL", "");
        }
        if (rawUrl.isBlank()) {
            throw new IllegalStateException("DATABASE_URL environment variable is not set");
        }

        String cleanedUrl = rawUrl.replaceAll("&?channel_binding=[^&]+", "");
        String jdbcUrl = "jdbc:" + cleanedUrl;

        return DataSourceBuilder.create()
                .url(jdbcUrl)
                .driverClassName("org.postgresql.Driver")
                .build();
    }
}