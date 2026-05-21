package com.ejemplo.model;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class UsuarioLoginModel {

    public int validar(String login, String password) {
        String cleanLogin = limpiar(login);
        String cleanPassword = password == null ? "" : password.trim();

        String sql = "SELECT id FROM usuarios WHERE (LOWER(email) = LOWER(?) OR LOWER(username) = LOWER(?)) AND password = ?";

        try (Connection con = ConexionBD.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, cleanLogin);
            ps.setString(2, cleanLogin);
            ps.setString(3, cleanPassword);

            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? rs.getInt("id") : -1;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return -1;
        }
    }

    public boolean estaBloqueado(String login) {
        try {
            return BloqueoUsuarioModel.estaBloqueado(limpiar(login));
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public String obtenerRol(String login) {
        return obtenerCampo(login, "rol", "USER");
    }

    public String obtenerUsername(String login) {
        return obtenerCampo(login, "username", "Usuario");
    }

    public String obtenerEmail(String login) {
        return obtenerCampo(login, "email", "");
    }

    private String obtenerCampo(String login, String campo, String porDefecto) {
        String sql = "SELECT " + campo + " FROM usuarios WHERE LOWER(email) = LOWER(?) OR LOWER(username) = LOWER(?) LIMIT 1";

        try (Connection con = ConexionBD.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            String cleanLogin = limpiar(login);
            ps.setString(1, cleanLogin);
            ps.setString(2, cleanLogin);

            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? rs.getString(campo) : porDefecto;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return porDefecto;
        }
    }

    private String limpiar(String value) {
        return value == null ? "" : value.trim();
    }
}
