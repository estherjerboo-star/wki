package com.ejemplo.controller;

import com.ejemplo.model.Usuario;
import com.ejemplo.model.UsuarioStore;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@WebServlet("/registro")
public class RegistroServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.sendRedirect(request.getContextPath() + "/inicio");
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding(StandardCharsets.UTF_8.name());
        UsuarioStore.seed(getServletContext());

        String nombre = safe(request.getParameter("nombre"));
        String usuario = safe(request.getParameter("usuario"));
        String clave = safe(request.getParameter("clave"));
        String confirmarClave = safe(request.getParameter("confirmarClave"));

        request.setAttribute("modo", "registro");
        request.setAttribute("registroNombrePrevio", nombre);
        request.setAttribute("registroUsuarioPrevio", usuario);

        if (nombre.isBlank() || usuario.isBlank() || clave.isBlank() || confirmarClave.isBlank()) {
            request.setAttribute("registroError", "Completa todos los campos del registro.");
            request.getRequestDispatcher("/WEB-INF/views/login.jsp").forward(request, response);
            return;
        }

        if (!clave.equals(confirmarClave)) {
            request.setAttribute("registroError", "Las contrasenas no coinciden.");
            request.getRequestDispatcher("/WEB-INF/views/login.jsp").forward(request, response);
            return;
        }

        boolean creado = UsuarioStore.register(getServletContext(), nombre, usuario, clave);
        if (!creado) {
            request.setAttribute("registroError", "Ese usuario ya existe. Prueba con otro nombre.");
            request.getRequestDispatcher("/WEB-INF/views/login.jsp").forward(request, response);
            return;
        }

        Usuario usuarioCreado = UsuarioStore.validate(getServletContext(), usuario, clave);
        SessionHelper.signIn(request, usuarioCreado);
        response.sendRedirect(request.getContextPath() + "/menu");
    }

    private String safe(String value) {
        return value == null ? "" : value.trim();
    }
}
