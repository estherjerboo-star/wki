package com.ejemplo.controller;

import com.ejemplo.model.AnimeRepository;
import com.ejemplo.model.AnimeSeries;
import com.ejemplo.model.AnimeTopic;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebServlet("/detalle")
public class DetalleServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        if (!SessionHelper.requireAuthentication(request, response)) {
            return;
        }

        String seriesSlug = safe(request.getParameter("serie"));
        String topicSlug = safe(request.getParameter("tema"));

        AnimeSeries series = AnimeRepository.getSeries(seriesSlug);
        AnimeTopic topic = AnimeRepository.getTopic(seriesSlug, topicSlug);

        if (series == null || topic == null) {
            response.sendRedirect(request.getContextPath() + "/menu");
            return;
        }

        request.setAttribute("serie", series);
        request.setAttribute("tema", topic);
        request.getRequestDispatcher("/WEB-INF/views/detalle.jsp").forward(request, response);
    }

    private String safe(String value) {
        return value == null ? "" : value.trim();
    }
}
