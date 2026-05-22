package com.ejemplo.model;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class ContenidoWikiModel {

    public List<ContenidoEntry> listarContenido(String pageKey) throws Exception {
        ensureTables();
        String sql = "SELECT id, page_key, titulo, cuerpo, autor_nombre, autor_email, autor_rol, creado_en, actualizado_en " +
                "FROM contenido_wiki " +
                (isBlank(pageKey) ? "" : "WHERE page_key = ? ") +
                "ORDER BY actualizado_en DESC, creado_en DESC";

        try (Connection con = ConexionBD.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            if (!isBlank(pageKey)) {
                ps.setString(1, pageKey.trim());
            }

            try (ResultSet rs = ps.executeQuery()) {
                List<ContenidoEntry> entries = new ArrayList<>();
                while (rs.next()) {
                    entries.add(mapContenido(rs));
                }
                return entries;
            }
        }
    }

    public ContenidoEntry guardarContenido(ContenidoEntry entry) throws Exception {
        ensureTables();
        Integer id = parseId(entry.id);
        String autorRol = normalizeRole(entry.authorRole);

        if (id != null && existeContenido(id)) {
            String sql = "UPDATE contenido_wiki SET page_key = ?, titulo = ?, cuerpo = ?, autor_nombre = ?, autor_email = ?, autor_rol = ? WHERE id = ?";
            try (Connection con = ConexionBD.getConnection();
                 PreparedStatement ps = con.prepareStatement(sql)) {
                ps.setString(1, clean(entry.pageKey));
                ps.setString(2, clean(entry.title));
                ps.setString(3, clean(entry.body));
                ps.setString(4, cleanOrDefault(entry.authorName, "Usuario"));
                ps.setString(5, clean(entry.authorEmail));
                ps.setString(6, autorRol);
                ps.setInt(7, id);
                ps.executeUpdate();
            }
            return buscarContenido(id);
        }

        String sql = "INSERT INTO contenido_wiki (page_key, titulo, cuerpo, autor_nombre, autor_email, autor_rol) VALUES (?, ?, ?, ?, ?, ?)";
        try (Connection con = ConexionBD.getConnection();
             PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, clean(entry.pageKey));
            ps.setString(2, clean(entry.title));
            ps.setString(3, clean(entry.body));
            ps.setString(4, cleanOrDefault(entry.authorName, "Usuario"));
            ps.setString(5, clean(entry.authorEmail));
            ps.setString(6, autorRol);
            ps.executeUpdate();

            try (ResultSet keys = ps.getGeneratedKeys()) {
                if (keys.next()) {
                    return buscarContenido(keys.getInt(1));
                }
            }
        }

        return entry;
    }

    public boolean borrarContenido(int id) throws Exception {
        ensureTables();
        try (Connection con = ConexionBD.getConnection();
             PreparedStatement ps = con.prepareStatement("DELETE FROM contenido_wiki WHERE id = ?")) {
            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        }
    }

    public List<ContenidoRequest> listarSolicitudes(String pageKey) throws Exception {
        ensureTables();
        String sql = "SELECT id, page_key, titulo, mensaje, remitente_nombre, remitente_email, remitente_rol, estado, creado_en " +
                "FROM solicitudes_contenido " +
                (isBlank(pageKey) ? "" : "WHERE page_key = ? ") +
                "ORDER BY FIELD(estado, 'PENDIENTE', 'REVISADA'), creado_en DESC";

        try (Connection con = ConexionBD.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            if (!isBlank(pageKey)) {
                ps.setString(1, pageKey.trim());
            }

            try (ResultSet rs = ps.executeQuery()) {
                List<ContenidoRequest> requests = new ArrayList<>();
                while (rs.next()) {
                    requests.add(mapSolicitud(rs));
                }
                return requests;
            }
        }
    }

    public ContenidoRequest crearSolicitud(ContenidoRequest request) throws Exception {
        ensureTables();
        String sql = "INSERT INTO solicitudes_contenido (page_key, titulo, mensaje, remitente_nombre, remitente_email, remitente_rol, estado) VALUES (?, ?, ?, ?, ?, ?, ?)";
        try (Connection con = ConexionBD.getConnection();
             PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, clean(request.pageKey));
            ps.setString(2, clean(request.title));
            ps.setString(3, clean(request.body));
            ps.setString(4, cleanOrDefault(request.senderName, "Usuario"));
            ps.setString(5, clean(request.senderEmail));
            ps.setString(6, normalizeRole(request.senderRole));
            ps.setString(7, normalizeStatus(request.status));
            ps.executeUpdate();

            try (ResultSet keys = ps.getGeneratedKeys()) {
                if (keys.next()) {
                    return buscarSolicitud(keys.getInt(1));
                }
            }
        }
        return request;
    }

    public boolean actualizarEstadoSolicitud(int id, String status) throws Exception {
        ensureTables();
        try (Connection con = ConexionBD.getConnection();
             PreparedStatement ps = con.prepareStatement("UPDATE solicitudes_contenido SET estado = ? WHERE id = ?")) {
            ps.setString(1, normalizeStatus(status));
            ps.setInt(2, id);
            return ps.executeUpdate() > 0;
        }
    }

    public boolean borrarSolicitud(int id) throws Exception {
        ensureTables();
        try (Connection con = ConexionBD.getConnection();
             PreparedStatement ps = con.prepareStatement("DELETE FROM solicitudes_contenido WHERE id = ?")) {
            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        }
    }

    private ContenidoEntry buscarContenido(int id) throws Exception {
        try (Connection con = ConexionBD.getConnection();
             PreparedStatement ps = con.prepareStatement("SELECT id, page_key, titulo, cuerpo, autor_nombre, autor_email, autor_rol, creado_en, actualizado_en FROM contenido_wiki WHERE id = ?")) {
            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? mapContenido(rs) : null;
            }
        }
    }

    private ContenidoRequest buscarSolicitud(int id) throws Exception {
        try (Connection con = ConexionBD.getConnection();
             PreparedStatement ps = con.prepareStatement("SELECT id, page_key, titulo, mensaje, remitente_nombre, remitente_email, remitente_rol, estado, creado_en FROM solicitudes_contenido WHERE id = ?")) {
            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? mapSolicitud(rs) : null;
            }
        }
    }

    private boolean existeContenido(int id) throws Exception {
        try (Connection con = ConexionBD.getConnection();
             PreparedStatement ps = con.prepareStatement("SELECT 1 FROM contenido_wiki WHERE id = ?")) {
            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }
        }
    }

    private ContenidoEntry mapContenido(ResultSet rs) throws Exception {
        ContenidoEntry entry = new ContenidoEntry();
        entry.id = String.valueOf(rs.getInt("id"));
        entry.pageKey = rs.getString("page_key");
        entry.title = rs.getString("titulo");
        entry.body = rs.getString("cuerpo");
        entry.authorName = rs.getString("autor_nombre");
        entry.authorEmail = rs.getString("autor_email");
        entry.authorRole = roleToClient(rs.getString("autor_rol"));
        entry.authorRoleLabel = roleLabel(entry.authorRole);
        entry.createdAt = toIso(rs.getTimestamp("creado_en"));
        entry.updatedAt = toIso(rs.getTimestamp("actualizado_en"));
        return entry;
    }

    private ContenidoRequest mapSolicitud(ResultSet rs) throws Exception {
        ContenidoRequest request = new ContenidoRequest();
        request.id = String.valueOf(rs.getInt("id"));
        request.pageKey = rs.getString("page_key");
        request.title = rs.getString("titulo");
        request.body = rs.getString("mensaje");
        request.senderName = rs.getString("remitente_nombre");
        request.senderEmail = rs.getString("remitente_email");
        request.senderRole = roleToClient(rs.getString("remitente_rol"));
        request.senderRoleLabel = roleLabel(request.senderRole);
        request.status = statusToClient(rs.getString("estado"));
        request.createdAt = toIso(rs.getTimestamp("creado_en"));
        return request;
    }

    private void ensureTables() throws Exception {
        try (Connection con = ConexionBD.getConnection();
             Statement st = con.createStatement()) {
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
                    "actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)");
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
                    "creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)");
        }
    }

    private String toIso(Timestamp timestamp) {
        return timestamp == null ? Instant.now().toString() : timestamp.toInstant().toString();
    }

    private Integer parseId(String value) {
        try {
            return isBlank(value) ? null : Integer.parseInt(value.trim());
        } catch (NumberFormatException error) {
            return null;
        }
    }

    private String normalizeRole(String role) {
        String normalized = clean(role).toUpperCase();
        if ("ADMIN".equals(normalized) || "EDITOR".equals(normalized) || "USER".equals(normalized)) {
            return normalized;
        }
        return "USER";
    }

    private String roleToClient(String role) {
        return normalizeRole(role).toLowerCase();
    }

    private String roleLabel(String role) {
        return switch (roleToClient(role)) {
            case "admin" -> "Administrador";
            case "editor" -> "Usuario editor";
            default -> "Usuario";
        };
    }

    private String normalizeStatus(String status) {
        return "reviewed".equalsIgnoreCase(clean(status)) || "REVISADA".equalsIgnoreCase(clean(status))
                ? "REVISADA"
                : "PENDIENTE";
    }

    private String statusToClient(String status) {
        return "REVISADA".equalsIgnoreCase(clean(status)) ? "reviewed" : "pending";
    }

    private String cleanOrDefault(String value, String fallback) {
        String cleanValue = clean(value);
        return cleanValue.isBlank() ? fallback : cleanValue;
    }

    private String clean(String value) {
        return value == null ? "" : value.trim();
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    public static class ContenidoEntry {
        public String id;
        public String pageKey;
        public String title;
        public String body;
        public String authorName;
        public String authorEmail;
        public String authorRole;
        public String authorRoleLabel;
        public String createdAt;
        public String updatedAt;
    }

    public static class ContenidoRequest {
        public String id;
        public String pageKey;
        public String title;
        public String body;
        public String senderName;
        public String senderEmail;
        public String senderRole;
        public String senderRoleLabel;
        public String createdAt;
        public String status;
    }
}
