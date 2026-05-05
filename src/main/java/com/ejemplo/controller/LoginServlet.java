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

@WebServlet("/login")
public class LoginServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.sendRedirect(request.getContextPath() + "/inicio");
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding(StandardCharsets.UTF_8.name());
        UsuarioStore.seed(getServletContext());

        String usuario = valorSeguro(request.getParameter("usuario"));
        String clave = valorSeguro(request.getParameter("clave"));

        Usuario usuarioValidado = UsuarioStore.validate(getServletContext(), usuario, clave);
        if (usuarioValidado != null) {
            SessionHelper.signIn(request, usuarioValidado);
            response.sendRedirect(request.getContextPath() + "/menu");
            return;
        }

        request.setAttribute("modo", "login");
        request.setAttribute("authError", "Usuario o contrasena incorrectos.");
        request.setAttribute("usuarioPrevio", usuario);
        request.getRequestDispatcher("/WEB-INF/views/login.jsp").forward(request, response);
    }

    private String valorSeguro(String valor) {
        return valor == null ? "" : valor.trim();
    }
}
