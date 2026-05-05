<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="com.ejemplo.model.AnimeSeries" %>
<%@ page import="com.ejemplo.model.AnimeTopic" %>
<%
AnimeSeries serie = (AnimeSeries) request.getAttribute("serie");
%>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= serie.getTitle() %> | Galeria</title>
    <link rel="stylesheet" href="<%= request.getContextPath() %>/css/estilos.css">
</head>
<body class="portal-body">
    <main class="portal-shell">
        <header class="topbar">
            <div>
                <p class="eyebrow"><%= serie.getRealm() %></p>
                <h1><%= serie.getTitle() %></h1>
                <p class="topbar-copy"><%= serie.getDescription() %></p>
            </div>
            <div class="topbar-actions">
                <a class="ghost-link" href="<%= request.getContextPath() %>/menu">Volver al menu</a>
                <form action="<%= request.getContextPath() %>/logout" method="post">
                    <button type="submit" class="ghost-button">Cerrar sesion</button>
                </form>
            </div>
        </header>

        <section class="topic-grid">
            <% for (AnimeTopic tema : serie.getTopics()) { %>
                <a class="topic-card" href="<%= request.getContextPath() %>/detalle?serie=<%= serie.getSlug() %>&tema=<%= tema.getSlug() %>">
                    <img src="<%= request.getContextPath() %>/poster?serie=<%= serie.getSlug() %>&tema=<%= tema.getSlug() %>" alt="<%= tema.getTitle() %>">
                    <div class="topic-copy">
                        <h2><%= tema.getTitle() %></h2>
                        <p><%= tema.getTeaser() %></p>
                    </div>
                </a>
            <% } %>
        </section>
    </main>
</body>
</html>
