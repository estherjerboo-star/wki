package com.ejemplo.controller;

import com.ejemplo.model.UsuarioRegisterModel;
import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringReader;

@WebServlet("/auth/register")
public class AuthRegisterController extends HttpServlet {

    private final UsuarioRegisterModel model = new UsuarioRegisterModel();

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
            writeJson(response, false, "Solicitud no valida");
            return;
        }

        String username = body.getString("username", "").trim();
        String email = body.getString("email", "").trim().toLowerCase();
        String password = body.getString("password", "").trim();

        if (username.isBlank()) {
            writeJson(response, false, "El nombre de usuario es obligatorio");
            return;
        }

        if (!isValidEmail(email)) {
            writeJson(response, false, "Introduce un correo valido");
            return;
        }

        if (password.length() < 6) {
            writeJson(response, false, "La contrasena debe tener al menos 6 caracteres");
            return;
        }

        boolean ok = model.registrar(username, email, password);
        writeJson(response, ok, ok ? null : "El correo o usuario ya existe, esta bloqueado o no es valido");
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

    private void writeJson(HttpServletResponse response, boolean ok, String mensaje) throws IOException {
        PrintWriter out = response.getWriter();
        if (mensaje == null) {
            out.print(Json.createObjectBuilder().add("ok", true).build().toString());
            return;
        }

        out.print(Json.createObjectBuilder()
                .add("ok", ok)
                .add("mensaje", mensaje)
                .build()
                .toString());
    }

    private boolean isValidEmail(String email) {
        return email != null && email.matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$");
    }

    private void setCorsHeaders(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }
}
