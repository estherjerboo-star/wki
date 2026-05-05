package com.ejemplo.controller;

import com.ejemplo.model.AnimeRepository;
import com.ejemplo.model.AnimeSeries;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebServlet("/serie")
public class SerieServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        if (!SessionHelper.requireAuthentication(request, response)) {
            return;
        }

        String slug = safe(request.getParameter("slug"));
        AnimeSeries series = AnimeRepository.getSeries(slug);

        if (series == null) {
            response.sendRedirect(request.getContextPath() + "/menu");
            return;
        }

        request.setAttribute("serie", series);
        request.getRequestDispatcher("/WEB-INF/views/serie.jsp").forward(request, response);
    }

    private String safe(String value) {
        return value == null ? "" : value.trim();
    }
}
