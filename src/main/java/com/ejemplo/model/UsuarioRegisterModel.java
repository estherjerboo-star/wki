package com.ejemplo.model;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLIntegrityConstraintViolationException;

public class UsuarioRegisterModel {

    public boolean registrar(String username, String email, String password) {
        String cleanUsername = username == null ? "" : username.trim();
        String cleanEmail = email == null ? "" : email.trim().toLowerCase();
        String cleanPassword = password == null ? "" : password.trim();

        if (cleanUsername.isBlank() || cleanEmail.isBlank() || cleanPassword.length() < 6) {
            return false;
        }

        try {
            if (BloqueoUsuarioModel.estaBloqueado(cleanEmail)) {
                return false;
            }
        } catch (Exception e) {
            return false;
        }

        String sql = "INSERT INTO usuarios (username, email, password, rol) VALUES (?, ?, ?, 'USER')";

        try (Connection con = ConexionBD.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, cleanUsername);
            ps.setString(2, cleanEmail);
            ps.setString(3, cleanPassword);
            return ps.executeUpdate() > 0;
        } catch (SQLIntegrityConstraintViolationException e) {
            return false;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
