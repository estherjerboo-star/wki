package com.ejemplo.controller;

import com.ejemplo.model.UsuarioStore;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebServlet("/inicio")
public class InicioServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        UsuarioStore.seed(getServletContext());
        if (SessionHelper.isAuthenticated(request)) {
            response.sendRedirect(request.getContextPath() + "/menu");
            return;
        }

        request.setAttribute("modo", "login");
        request.getRequestDispatcher("/WEB-INF/views/login.jsp").forward(request, response);
    }
}
