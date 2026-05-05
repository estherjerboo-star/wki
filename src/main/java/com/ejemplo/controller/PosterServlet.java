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
import java.nio.charset.StandardCharsets;

@WebServlet("/poster")
public class PosterServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        if (!SessionHelper.isAuthenticated(request)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("text/plain;charset=UTF-8");
            response.getWriter().write("Necesitas iniciar sesion.");
            return;
        }

        AnimeSeries series = AnimeRepository.getSeries(safe(request.getParameter("serie")));
        AnimeTopic topic = series == null ? null : series.findTopic(safe(request.getParameter("tema")));

        if (series == null || topic == null) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            response.setContentType("text/plain;charset=UTF-8");
            response.getWriter().write("Imagen no encontrada.");
            return;
        }

        response.setContentType("image/svg+xml;charset=UTF-8");
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        response.getWriter().write(buildSvg(series, topic));
    }

    private String buildSvg(AnimeSeries series, AnimeTopic topic) {
        String title = escapeXml(topic.getTitle().toUpperCase());
        String subtitle = escapeXml(series.getTitle());
        String realm = escapeXml(series.getRealm());

        return "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 960 640'>"
            + "<defs>"
            + "<linearGradient id='bg' x1='0%' y1='0%' x2='100%' y2='100%'>"
            + "<stop offset='0%' stop-color='" + series.getAccentFrom() + "'/>"
            + "<stop offset='100%' stop-color='" + series.getAccentTo() + "'/>"
            + "</linearGradient>"
            + "</defs>"
            + "<rect width='960' height='640' rx='36' fill='url(#bg)'/>"
            + "<circle cx='170' cy='140' r='110' fill='rgba(255,255,255,0.10)'/>"
            + "<circle cx='820' cy='110' r='150' fill='rgba(15,23,42,0.18)'/>"
            + "<circle cx='790' cy='540' r='150' fill='rgba(255,255,255,0.10)'/>"
            + "<rect x='58' y='70' width='844' height='500' rx='28' fill='rgba(2,6,23,0.32)' stroke='rgba(255,255,255,0.18)'/>"
            + "<text x='88' y='138' fill='#f8fafc' font-size='26' font-family='Segoe UI, Arial, sans-serif' font-weight='700'>"
            + realm
            + "</text>"
            + "<text x='88' y='245' fill='white' font-size='64' font-family='Segoe UI, Arial, sans-serif' font-weight='800'>"
            + title
            + "</text>"
            + "<text x='88' y='318' fill='rgba(255,255,255,0.92)' font-size='34' font-family='Segoe UI, Arial, sans-serif' font-weight='600'>"
            + subtitle
            + "</text>"
            + "<text x='88' y='430' fill='rgba(255,255,255,0.90)' font-size='24' font-family='Segoe UI, Arial, sans-serif'>"
            + escapeXml(topic.getTeaser())
            + "</text>"
            + "<rect x='88' y='470' width='220' height='54' rx='27' fill='rgba(255,255,255,0.18)'/>"
            + "<text x='198' y='505' text-anchor='middle' fill='#f8fafc' font-size='22' font-family='Segoe UI, Arial, sans-serif' font-weight='700'>Anime Portal</text>"
            + "</svg>";
    }

    private String safe(String value) {
        return value == null ? "" : value.trim();
    }

    private String escapeXml(String value) {
        return value
            .replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace("\"", "&quot;")
            .replace("'", "&apos;");
    }
}
