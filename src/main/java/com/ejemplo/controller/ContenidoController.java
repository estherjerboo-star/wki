package com.ejemplo.controller;

import com.ejemplo.model.ContenidoWikiModel;
import com.ejemplo.model.ContenidoWikiModel.ContenidoEntry;
import com.google.gson.Gson;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebServlet("/api/content")
public class ContenidoController extends HttpServlet {
    private final ContenidoWikiModel model = new ContenidoWikiModel();
    private final Gson gson = new Gson();

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response) {
        setCorsHeaders(response);
        response.setStatus(HttpServletResponse.SC_NO_CONTENT);
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        setJsonHeaders(response);
        try {
            response.getWriter().print(gson.toJson(model.listarContenido(request.getParameter("pageKey"))));
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().print(gson.toJson(new ErrorResponse(false, e.getClass().getSimpleName(), e.getMessage())));
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        setJsonHeaders(response);
        try {
            ContenidoEntry entry = gson.fromJson(request.getReader(), ContenidoEntry.class);
            if (entry == null || isBlank(entry.pageKey) || isBlank(entry.title) || isBlank(entry.body)) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().print("{\"ok\":false,\"mensaje\":\"Contenido no valido\"}");
                return;
            }

            ContenidoEntry saved = model.guardarContenido(entry);
            response.getWriter().print(gson.toJson(saved));
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().print("{\"ok\":false,\"mensaje\":\"No se pudo guardar el contenido\"}");
        }
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
        setJsonHeaders(response);
        try {
            int id = Integer.parseInt(request.getParameter("id"));
            boolean ok = model.borrarContenido(id);
            response.getWriter().print("{\"ok\":" + ok + "}");
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().print("{\"ok\":false,\"mensaje\":\"No se pudo borrar el contenido\"}");
        }
    }

    private void setJsonHeaders(HttpServletResponse response) {
        setCorsHeaders(response);
        response.setContentType("application/json; charset=UTF-8");
    }

    private void setCorsHeaders(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private static class ErrorResponse {
        private final boolean ok;
        private final String error;
        private final String message;

        private ErrorResponse(boolean ok, String error, String message) {
            this.ok = ok;
            this.error = error;
            this.message = message;
        }
    }
}
