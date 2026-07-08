package com.devangeli.blog.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;
import java.net.URI;
import java.net.URISyntaxException;

@Configuration
@Profile("prod")
public class DataSourceConfig {

    @Bean
    public DataSource dataSource() throws URISyntaxException {
        String rawUrl = System.getenv("NEON_DATABASE_URL");
        if (rawUrl == null || rawUrl.isBlank()) {
            rawUrl = System.getProperty("NEON_DATABASE_URL", "");
        }
        if (rawUrl.isBlank()) {
            throw new IllegalStateException("NEON_DATABASE_URL environment variable is not set");
        }

        String cleanedUrl = rawUrl.replaceAll("&?channel_binding=[^&]+", "");

        URI dbUri = new URI(cleanedUrl);
        String host = dbUri.getHost();
        int port = dbUri.getPort();
        String path = dbUri.getPath().substring(1);
        String userInfo = dbUri.getUserInfo();

        if (userInfo == null) {
            throw new IllegalStateException("NEON_DATABASE_URL must contain user:password@host");
        }

        String[] userPass = userInfo.split(":");
        String username = userPass[0];
        String password = userPass.length > 1 ? userPass[1] : "";

        String query = dbUri.getQuery() == null ? "" : "?" + dbUri.getQuery();
        String jdbcUrl = "jdbc:postgresql://" + host + ":" + port + "/" + path + query;

        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(jdbcUrl);
        config.setUsername(username);
        config.setPassword(password);
        config.setDriverClassName("org.postgresql.Driver");

        return new HikariDataSource(config);
    }
}