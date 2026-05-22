package com.ejemplo.controller;

import com.ejemplo.model.ContenidoWikiModel;
import com.ejemplo.model.ContenidoWikiModel.ContenidoRequest;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebServlet("/api/requests")
public class SolicitudesContenidoController extends HttpServlet {
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
            response.getWriter().print(gson.toJson(model.listarSolicitudes(request.getParameter("pageKey"))));
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().print("[]");
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        setJsonHeaders(response);
        try {
            JsonObject body = gson.fromJson(request.getReader(), JsonObject.class);
            String action = body != null && body.has("action") ? body.get("action").getAsString() : "";

            if ("status".equalsIgnoreCase(action)) {
                int id = body.get("id").getAsInt();
                String status = body.has("status") ? body.get("status").getAsString() : "reviewed";
                boolean ok = model.actualizarEstadoSolicitud(id, status);
                response.getWriter().print("{\"ok\":" + ok + "}");
                return;
            }

            ContenidoRequest contentRequest = gson.fromJson(body, ContenidoRequest.class);
            if (contentRequest == null || isBlank(contentRequest.pageKey) || isBlank(contentRequest.title) || isBlank(contentRequest.body)) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().print("{\"ok\":false,\"mensaje\":\"Solicitud no valida\"}");
                return;
            }

            ContenidoRequest saved = model.crearSolicitud(contentRequest);
            response.getWriter().print(gson.toJson(saved));
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().print("{\"ok\":false,\"mensaje\":\"No se pudo guardar la solicitud\"}");
        }
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
        setJsonHeaders(response);
        try {
            int id = Integer.parseInt(request.getParameter("id"));
            boolean ok = model.borrarSolicitud(id);
            response.getWriter().print("{\"ok\":" + ok + "}");
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().print("{\"ok\":false,\"mensaje\":\"No se pudo borrar la solicitud\"}");
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
}
