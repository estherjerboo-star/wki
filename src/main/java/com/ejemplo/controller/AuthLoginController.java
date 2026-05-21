package com.ejemplo.controller;

import com.ejemplo.model.UsuarioLoginModel;
import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringReader;

@WebServlet("/auth/login")
public class AuthLoginController extends HttpServlet {

    private final UsuarioLoginModel model = new UsuarioLoginModel();

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response) {
        setCorsHeaders(response);
        response.setStatus(HttpServletResponse.SC_NO_CONTENT);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        setCorsHeaders(response);
        request.setCharacterEncoding("UTF-8");
        response.setContentType("application/json; charset=UTF-8");

        JsonObject body;
        try {
            body = readJson(request);
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            writeError(response, "Solicitud no valida");
            return;
        }

        String login = body.getString("login", "").trim();
        String password = body.getString("password", "").trim();

        if (login.isBlank() || password.isBlank()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            writeError(response, "Completa usuario y contrasena");
            return;
        }

        if (model.estaBloqueado(login)) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            writeError(response, "Cuenta bloqueada. Contacta con el administrador");
            return;
        }

        int idUsuario = model.validar(login, password);
        if (idUsuario == -1) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            writeError(response, "Credenciales incorrectas");
            return;
        }

        String rol = model.obtenerRol(login);
        String username = model.obtenerUsername(login);
        String email = model.obtenerEmail(login);

        HttpSession sesion = request.getSession();
        sesion.setAttribute("idUsuario", idUsuario);
        sesion.setAttribute("rol", rol);

        PrintWriter out = response.getWriter();
        out.print(Json.createObjectBuilder()
                .add("ok", true)
                .add("rol", rol)
                .add("username", username)
                .add("email", email)
                .build()
                .toString());
    }

    private JsonObject readJson(HttpServletRequest request) throws IOException {
        BufferedReader reader = request.getReader();
        StringBuilder sb = new StringBuilder();
        String line;

        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }

        return Json.createReader(new StringReader(sb.toString())).readObject();
    }

    private void writeError(HttpServletResponse response, String mensaje) throws IOException {
        response.getWriter().print(Json.createObjectBuilder()
                .add("ok", false)
                .add("mensaje", mensaje)
                .build()
                .toString());
    }

    private void setCorsHeaders(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }
}
