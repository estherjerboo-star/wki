<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Anime World | Panel</title>
    <link rel="stylesheet" href="<%= request.getContextPath() %>/css/estilos.css">
</head>
<body class="pantalla-app">
    <main class="app-shell">
        <header class="hero">
            <div>
                <p class="eyebrow">Coleccion privada</p>
                <h1>Explora tres universos anime en una sola pagina</h1>
                <p class="hero-copy">
                    Cambia entre One Piece, Bleach y Naruto para navegar por sus apartados principales.
                </p>
            </div>

            <form action="<%= request.getContextPath() %>/logout" method="post">
                <button type="submit" class="logout-button">Cerrar sesion</button>
            </form>
        </header>

        <nav class="tabs" aria-label="Series anime">
            <button class="tab-link active" type="button" data-target="one-piece">One Piece</button>
            <button class="tab-link" type="button" data-target="bleach">Bleach</button>
            <button class="tab-link" type="button" data-target="naruto">Naruto</button>
        </nav>

        <section id="one-piece" class="tab-panel active">
            <div class="panel-heading">
                <span class="panel-kicker">Grand Line</span>
                <h2>One Piece</h2>
            </div>
            <div class="card-grid">
                <article class="info-card">
                    <h3>FRUTAS</h3>
                    <p>Poderes unicos que transforman combate, viaje y estrategias dentro del mar.</p>
                </article>
                <article class="info-card">
                    <h3>HAKI</h3>
                    <p>Manifestaciones de voluntad con variantes para defensa, presion y observacion.</p>
                </article>
                <article class="info-card">
                    <h3>REINOS</h3>
                    <p>Territorios con culturas propias, conflictos politicos y secretos del siglo vacio.</p>
                </article>
                <article class="info-card">
                    <h3>MARES</h3>
                    <p>East Blue, Grand Line y el Nuevo Mundo marcan rutas, riesgos y leyendas.</p>
                </article>
                <article class="info-card">
                    <h3>TRIPULACION</h3>
                    <p>Los Sombrero de Paja combinan talentos, suenos y lealtad en cada aventura.</p>
                </article>
            </div>
        </section>

        <section id="bleach" class="tab-panel">
            <div class="panel-heading">
                <span class="panel-kicker">Soul Society</span>
                <h2>Bleach</h2>
            </div>
            <div class="card-grid">
                <article class="info-card">
                    <h3>SHINIGAMIS</h3>
                    <p>Guerreros espirituales que purifican almas y protegen el equilibrio entre mundos.</p>
                </article>
                <article class="info-card">
                    <h3>HOLLOW</h3>
                    <p>Espiritus corrompidos por el vacio, con hambre, mascara y fuerza destructiva.</p>
                </article>
                <article class="info-card">
                    <h3>HISTORIA</h3>
                    <p>Ichigo queda unido al conflicto entre humanos, almas, hueco mundo y realeza.</p>
                </article>
                <article class="info-card">
                    <h3>QUINCYS</h3>
                    <p>Clan de arqueros espirituales con una guerra antigua contra los shinigamis.</p>
                </article>
            </div>
        </section>

        <section id="naruto" class="tab-panel">
            <div class="panel-heading">
                <span class="panel-kicker">Konoha</span>
                <h2>Naruto</h2>
            </div>
            <div class="card-grid">
                <article class="info-card">
                    <h3>EQUIPO 7</h3>
                    <p>Naruto, Sasuke y Sakura forman un grupo clave guiado por Kakashi.</p>
                </article>
                <article class="info-card">
                    <h3>OJOS</h3>
                    <p>Sharingan, Byakugan y Rinnegan cambian el combate y el destino de los clanes.</p>
                </article>
                <article class="info-card">
                    <h3>CHAKRA</h3>
                    <p>Energia base de las tecnicas ninja, usada en jutsus, sellos y control elemental.</p>
                </article>
                <article class="info-card">
                    <h3>AKATSUKI</h3>
                    <p>Organizacion que persigue a los bijus y desata uno de los mayores conflictos.</p>
                </article>
                <article class="info-card">
                    <h3>BIJUS</h3>
                    <p>Bestias de cola con poder inmenso, historia antigua y vinculo con los jinchuriki.</p>
                </article>
            </div>
        </section>
    </main>

    <script src="<%= request.getContextPath() %>/js/app.js"></script>
</body>
</html>
