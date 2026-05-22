package com.ejemplo.model;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.SQLSyntaxErrorException;
import java.sql.Statement;

public class DatabaseSchema {

    private static volatile boolean initialized = false;

    private DatabaseSchema() {
    }

    public static void ensure(Connection con) throws SQLException {
        if (initialized) {
            return;
        }

        synchronized (DatabaseSchema.class) {
            if (initialized) {
                return;
            }

            try (Statement st = con.createStatement()) {
                st.executeUpdate("CREATE TABLE IF NOT EXISTS usuarios (" +
                        "id INT AUTO_INCREMENT PRIMARY KEY, " +
                        "username VARCHAR(50) NOT NULL UNIQUE, " +
                        "email VARCHAR(100) NOT NULL UNIQUE, " +
                        "password VARCHAR(255) NOT NULL, " +
                        "rol ENUM('USER', 'EDITOR', 'ADMIN') NOT NULL DEFAULT 'USER', " +
                        "bloqueado BOOLEAN NOT NULL DEFAULT FALSE, " +
                        "creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)");

                addColumnIfMissing(st, "usuarios", "bloqueado", "BOOLEAN NOT NULL DEFAULT FALSE");

                st.executeUpdate("CREATE TABLE IF NOT EXISTS usuarios_bloqueados (" +
                        "id INT AUTO_INCREMENT PRIMARY KEY, " +
                        "email VARCHAR(100) NOT NULL UNIQUE, " +
                        "motivo VARCHAR(255), " +
                        "creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)");

                st.executeUpdate("CREATE TABLE IF NOT EXISTS contenido_wiki (" +
                        "id INT AUTO_INCREMENT PRIMARY KEY, " +
                        "page_key VARCHAR(100) NOT NULL, " +
                        "titulo VARCHAR(150) NOT NULL, " +
                        "cuerpo TEXT NOT NULL, " +
                        "autor_id INT NULL, " +
                        "autor_nombre VARCHAR(50) NOT NULL, " +
                        "autor_email VARCHAR(100) NOT NULL, " +
                        "autor_rol ENUM('USER', 'EDITOR', 'ADMIN') NOT NULL DEFAULT 'USER', " +
                        "creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, " +
                        "actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, " +
                        "INDEX idx_contenido_page_key (page_key), " +
                        "INDEX idx_contenido_actualizado_en (actualizado_en))");

                st.executeUpdate("CREATE TABLE IF NOT EXISTS solicitudes_contenido (" +
                        "id INT AUTO_INCREMENT PRIMARY KEY, " +
                        "page_key VARCHAR(100) NOT NULL, " +
                        "titulo VARCHAR(150) NOT NULL, " +
                        "mensaje TEXT NOT NULL, " +
                        "remitente_id INT NULL, " +
                        "remitente_nombre VARCHAR(50) NOT NULL, " +
                        "remitente_email VARCHAR(100) NOT NULL, " +
                        "remitente_rol ENUM('USER', 'EDITOR', 'ADMIN') NOT NULL DEFAULT 'USER', " +
                        "estado ENUM('PENDIENTE', 'REVISADA') NOT NULL DEFAULT 'PENDIENTE', " +
                        "creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, " +
                        "INDEX idx_solicitudes_page_key (page_key), " +
                        "INDEX idx_solicitudes_estado (estado))");

                st.executeUpdate("INSERT IGNORE INTO usuarios (username, email, password, rol) VALUES " +
                        "('Administrador', 'admin@anime.local', 'admin123', 'ADMIN'), " +
                        "('Editor', 'editor@anime.local', 'editor123', 'EDITOR')");
            }

            initialized = true;
        }
    }

    private static void addColumnIfMissing(Statement st, String table, String column, String definition) throws SQLException {
        try {
            st.executeUpdate("ALTER TABLE " + table + " ADD COLUMN " + column + " " + definition);
        } catch (SQLSyntaxErrorException e) {
            if (!e.getMessage().toLowerCase().contains("duplicate column")) {
                throw e;
            }
        }
    }
}
