<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%
String modo = request.getAttribute("modo") != null ? (String) request.getAttribute("modo") : "login";
String authError = (String) request.getAttribute("authError");
String registroError = (String) request.getAttribute("registroError");
String usuarioPrevio = request.getAttribute("usuarioPrevio") != null ? (String) request.getAttribute("usuarioPrevio") : "";
String registroNombrePrevio = request.getAttribute("registroNombrePrevio") != null ? (String) request.getAttribute("registroNombrePrevio") : "";
String registroUsuarioPrevio = request.getAttribute("registroUsuarioPrevio") != null ? (String) request.getAttribute("registroUsuarioPrevio") : "";
%>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Anime Portal | Acceso</title>
    <link rel="stylesheet" href="<%= request.getContextPath() %>/css/estilos.css">
</head>
<body class="auth-body" data-auth-mode="<%= modo %>">
    <main class="auth-shell">
        <section class="auth-hero">
            <p class="eyebrow">Portal anime privado</p>
            <h1>Registro y acceso para explorar tus sagas favoritas</h1>
            <p class="hero-text">
                Entra al portal y abre el menu desplegable con One Piece, Naruto, Bleach y Jujutsu Kaisen.
                Despues podras entrar a cada serie, ver sus imagenes y abrir la informacion de cada tema.
            </p>

            <div class="hero-series">
                <article class="hero-pill">One Piece</article>
                <article class="hero-pill">Naruto</article>
                <article class="hero-pill">Bleach</article>
                <article class="hero-pill">Jujutsu Kaisen</article>
            </div>

            <div class="demo-card">
                <span>Acceso de prueba</span>
                <strong>Usuario: admin</strong>
                <strong>Clave: anime123</strong>
            </div>
        </section>

        <section class="auth-panel">
            <div class="auth-switch">
                <button type="button" class="auth-toggle <%= "login".equals(modo) ? "active" : "" %>" data-target="login-card">Acceso</button>
                <button type="button" class="auth-toggle <%= "registro".equals(modo) ? "active" : "" %>" data-target="registro-card">Registro</button>
            </div>

            <section id="login-card" class="auth-card <%= "login".equals(modo) ? "active" : "" %>">
                <h2>Inicia sesion</h2>
                <p class="card-copy">Accede con un usuario ya creado para entrar al portal principal.</p>

                <% if (authError != null) { %>
                    <div class="message-box error"><%= authError %></div>
                <% } %>

                <form action="<%= request.getContextPath() %>/login" method="post" class="auth-form">
                    <label for="usuarioLogin">Usuario</label>
                    <input type="text" id="usuarioLogin" name="usuario" value="<%= usuarioPrevio %>" placeholder="Tu usuario" required>

                    <label for="claveLogin">Contrasena</label>
                    <input type="password" id="claveLogin" name="clave" placeholder="Tu contrasena" required>

                    <button type="submit" class="primary-button">Entrar</button>
                </form>
            </section>

            <section id="registro-card" class="auth-card <%= "registro".equals(modo) ? "active" : "" %>">
                <h2>Crea tu cuenta</h2>
                <p class="card-copy">Registra un usuario nuevo y accede directamente a la zona privada.</p>

                <% if (registroError != null) { %>
                    <div class="message-box error"><%= registroError %></div>
                <% } %>

                <form action="<%= request.getContextPath() %>/registro" method="post" class="auth-form">
                    <label for="nombreRegistro">Nombre visible</label>
                    <input type="text" id="nombreRegistro" name="nombre" value="<%= registroNombrePrevio %>" placeholder="Como quieres aparecer" required>

                    <label for="usuarioRegistro">Usuario</label>
                    <input type="text" id="usuarioRegistro" name="usuario" value="<%= registroUsuarioPrevio %>" placeholder="Crea tu usuario" required>

                    <label for="claveRegistro">Contrasena</label>
                    <input type="password" id="claveRegistro" name="clave" placeholder="Crea tu contrasena" required>

                    <label for="confirmarClave">Confirmar contrasena</label>
                    <input type="password" id="confirmarClave" name="confirmarClave" placeholder="Repite tu contrasena" required>

                    <button type="submit" class="primary-button">Registrarme</button>
                </form>
            </section>
        </section>
    </main>

    <script src="<%= request.getContextPath() %>/js/app.js"></script>
</body>
</html>
