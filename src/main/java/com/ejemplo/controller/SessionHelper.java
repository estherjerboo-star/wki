package com.ejemplo.controller;

import com.ejemplo.model.Usuario;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

public final class SessionHelper {

    private SessionHelper() {
    }

    public static boolean isAuthenticated(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        return session != null && Boolean.TRUE.equals(session.getAttribute("usuarioAutenticado"));
    }

    public static boolean requireAuthentication(HttpServletRequest request, HttpServletResponse response) throws IOException {
        if (!isAuthenticated(request)) {
            response.sendRedirect(request.getContextPath() + "/inicio");
            return false;
        }
        return true;
    }

    public static void signIn(HttpServletRequest request, Usuario usuario) {
        HttpSession previous = request.getSession(false);
        if (previous != null) {
            previous.invalidate();
        }

        HttpSession session = request.getSession(true);
        session.setAttribute("usuarioAutenticado", true);
        session.setAttribute("nombreUsuario", usuario.getNombreVisible());
        session.setAttribute("usuarioLogin", usuario.getUsuario());
    }
}
