package com.ejemplo.model;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

public class ConexionBD {

    private static final DatabaseConfig CONFIG = loadConfig();
    private static final String URL = "jdbc:mysql://" + CONFIG.host + ":" + CONFIG.port + "/" + CONFIG.database
            + "?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&useUnicode=true&characterEncoding=UTF-8";

    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            throw new RuntimeException("No se pudo cargar el driver de MySQL", e);
        }
    }

    public static Connection getConnection() throws SQLException {
        Connection connection = DriverManager.getConnection(URL, CONFIG.user, CONFIG.password);
        DatabaseSchema.ensure(connection);
        return connection;
    }

    private static DatabaseConfig loadConfig() {
        String railwayUrl = firstNonBlank(
                System.getenv("MYSQL_URL"),
                System.getenv("MYSQL_PRIVATE_URL"),
                System.getenv("DATABASE_URL"));

        if (!isBlank(railwayUrl)) {
            DatabaseConfig parsed = parseDatabaseUrl(railwayUrl);
            if (parsed != null) {
                return parsed;
            }
        }

        return new DatabaseConfig(
                firstNonBlank(System.getenv("DB_HOST"), System.getenv("MYSQLHOST"), "mysql"),
                firstNonBlank(System.getenv("DB_PORT"), System.getenv("MYSQLPORT"), "3306"),
                firstNonBlank(System.getenv("DB_NAME"), System.getenv("MYSQLDATABASE"), "anime_wiki"),
                firstNonBlank(System.getenv("DB_USER"), System.getenv("MYSQLUSER"), "root"),
                firstNonBlank(System.getenv("DB_PASSWORD"), System.getenv("MYSQLPASSWORD"), "root")
        );
    }

    private static DatabaseConfig parseDatabaseUrl(String databaseUrl) {
        try {
            URI uri = new URI(databaseUrl.replace("mysql://", "mysql-url://"));
            String userInfo = uri.getUserInfo();
            String user = "";
            String password = "";

            if (userInfo != null) {
                String[] parts = userInfo.split(":", 2);
                user = parts.length > 0 ? decode(parts[0]) : "";
                password = parts.length > 1 ? decode(parts[1]) : "";
            }

            String database = uri.getPath() == null ? "" : uri.getPath().replaceFirst("^/", "");
            return new DatabaseConfig(
                    uri.getHost(),
                    uri.getPort() > 0 ? String.valueOf(uri.getPort()) : "3306",
                    database,
                    user,
                    password
            );
        } catch (URISyntaxException e) {
            return null;
        }
    }

    private static String firstNonBlank(String... values) {
        for (String value : values) {
            if (value != null && !value.isBlank()) {
                return value;
            }
        }
        return null;
    }

    private static String decode(String value) {
        return URLDecoder.decode(value, StandardCharsets.UTF_8);
    }

    private static boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private static class DatabaseConfig {
        private final String host;
        private final String port;
        private final String database;
        private final String user;
        private final String password;

        private DatabaseConfig(String host, String port, String database, String user, String password) {
            this.host = host;
            this.port = port;
            this.database = database;
            this.user = user;
            this.password = password;
        }
    }
}
