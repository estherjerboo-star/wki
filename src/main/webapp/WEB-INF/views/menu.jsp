<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="com.ejemplo.model.AnimeSeries" %>
<%@ page import="java.util.Collection" %>
<%
Collection<AnimeSeries> series = (Collection<AnimeSeries>) request.getAttribute("series");
String nombreUsuario = session.getAttribute("nombreUsuario") != null ? (String) session.getAttribute("nombreUsuario") : "Invitado";
%>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Anime Portal | Menu</title>
    <link rel="stylesheet" href="<%= request.getContextPath() %>/css/estilos.css">
</head>
<body class="portal-body">
    <main class="portal-shell">
        <header class="topbar">
            <div>
                <p class="eyebrow">Zona privada</p>
                <h1>Bienvenido, <%= nombreUsuario %></h1>
                <p class="topbar-copy">Selecciona una serie en el menu desplegable y entra en su galeria.</p>
            </div>
            <form action="<%= request.getContextPath() %>/logout" method="post">
                <button type="submit" class="ghost-button">Cerrar sesion</button>
            </form>
        </header>

        <section class="menu-panel">
            <form action="<%= request.getContextPath() %>/serie" method="get" class="select-form">
                <label for="selectorSerie">Menu desplegable</label>
                <div class="select-row">
                    <select id="selectorSerie" name="slug" required>
                        <option value="" selected disabled>Elige una serie</option>
                        <% for (AnimeSeries serie : series) { %>
                            <option value="<%= serie.getSlug() %>"><%= serie.getTitle() %></option>
                        <% } %>
                    </select>
                    <button type="submit" class="primary-button">Abrir serie</button>
                </div>
            </form>
        </section>

        <section class="series-preview-grid">
            <% for (AnimeSeries serie : series) { %>
                <a class="series-preview-card" href="<%= request.getContextPath() %>/serie?slug=<%= serie.getSlug() %>">
                    <img src="<%= request.getContextPath() %>/poster?serie=<%= serie.getSlug() %>&tema=<%= serie.getTopics().get(0).getSlug() %>" alt="<%= serie.getTitle() %>">
                    <div class="series-preview-copy">
                        <span><%= serie.getRealm() %></span>
                        <h2><%= serie.getTitle() %></h2>
                        <p><%= serie.getDescription() %></p>
                    </div>
                </a>
            <% } %>
        </section>
    </main>
</body>
</html>
