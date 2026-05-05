<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="com.ejemplo.model.AnimeSeries" %>
<%@ page import="com.ejemplo.model.AnimeTopic" %>
<%
AnimeSeries serie = (AnimeSeries) request.getAttribute("serie");
AnimeTopic tema = (AnimeTopic) request.getAttribute("tema");
%>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= tema.getTitle() %> | <%= serie.getTitle() %></title>
    <link rel="stylesheet" href="<%= request.getContextPath() %>/css/estilos.css">
</head>
<body class="portal-body">
    <main class="portal-shell">
        <header class="topbar">
            <div>
                <p class="eyebrow"><%= serie.getTitle() %></p>
                <h1><%= tema.getTitle() %></h1>
                <p class="topbar-copy"><%= tema.getTeaser() %></p>
            </div>
            <div class="topbar-actions">
                <a class="ghost-link" href="<%= request.getContextPath() %>/serie?slug=<%= serie.getSlug() %>">Volver a la serie</a>
                <form action="<%= request.getContextPath() %>/logout" method="post">
                    <button type="submit" class="ghost-button">Cerrar sesion</button>
                </form>
            </div>
        </header>

        <section class="detail-layout">
            <article class="detail-visual">
                <img src="<%= request.getContextPath() %>/poster?serie=<%= serie.getSlug() %>&tema=<%= tema.getSlug() %>" alt="<%= tema.getTitle() %>">
            </article>

            <article class="detail-content">
                <h2>Informacion</h2>
                <p><%= tema.getOverview() %></p>

                <h3>Puntos clave</h3>
                <ul class="highlight-list">
                    <% for (String punto : tema.getHighlights()) { %>
                        <li><%= punto %></li>
                    <% } %>
                </ul>
            </article>
        </section>
    </main>
</body>
</html>
