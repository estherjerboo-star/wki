package com.ejemplo.controller;

import com.ejemplo.model.AnimeRepository;
import com.ejemplo.model.UsuarioStore;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebServlet("/menu")
public class MenuServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        UsuarioStore.seed(getServletContext());
        if (!SessionHelper.requireAuthentication(request, response)) {
            return;
        }

        request.setAttribute("series", AnimeRepository.getAllSeries());
        request.getRequestDispatcher("/WEB-INF/views/menu.jsp").forward(request, response);
    }
}
