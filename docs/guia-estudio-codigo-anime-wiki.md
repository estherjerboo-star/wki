Guia de estudio del codigo del proyecto Jakarta EE + MySQL + HTML/CSS/JS
Este PDF esta pensado para estudiar el proyecto para un examen: explica que hace cada parte, que archivo llama a cual, como viajan los datos desde la pagina del usuario hasta Java y MySQL, y donde mirar si algo falla.
Nota importante: el proyecto tiene muchas paginas HTML parecidas. Para que sea estudiable, la explicacion es linea a linea por bloques reales y por lineas importantes: cabecera, formularios, scripts, funciones, endpoints, SQL y llamadas entre archivos.

# 1. Vista general del proyecto

El proyecto es una wiki fan llamada Los tres grandes del anime. La parte visual esta hecha con HTML, CSS y JavaScript. La parte de servidor esta hecha con Java Jakarta Servlet. La base de datos es MySQL y guarda usuarios, contenido publicado y solicitudes enviadas por usuarios.

# 2. Mapa de carpetas


# 3. Que llama a que

Este es el flujo principal del proyecto. Memorizarlo ayuda mucho para explicar el examen.

# 4. Endpoints Java importantes


# 5. HTML explicado

Los HTML son la cara visible. Normalmente siguen esta estructura: DOCTYPE, html lang='es', head con titulo/CSS, body con cabecera, contenido principal y scripts al final. Los scripts al final son importantes porque asi JavaScript encuentra los elementos ya creados.

## src/main/webapp/login.html


## src/main/webapp/admin.html

Este archivo tiene mas lineas importantes (50). La idea se repite: clases para CSS, ids para JS y scripts al final.

## src/main/webapp/one-piece-arcos.html

Este archivo tiene mas lineas importantes (103). La idea se repite: clases para CSS, ids para JS y scripts al final.

## src/main/webapp/dashboard.html

Este archivo tiene mas lineas importantes (49). La idea se repite: clases para CSS, ids para JS y scripts al final.

# 6. CSS explicado

El CSS crea la estetica real del proyecto. La identidad visual se basa en fondo azul/negro, tarjetas con bordes suaves, botones dorados, radios grandes y tipografia de titulo tipo serif.

## src/main/webapp/Assets/css/dashboard.css

Hay 256 selectores en total. En el archivo real se repiten patrones: layout, tarjetas, botones, estados y responsive.

## src/main/webapp/Assets/css/admin.css

Hay 64 selectores en total. En el archivo real se repiten patrones: layout, tarjetas, botones, estados y responsive.

## src/main/webapp/Assets/css/login.css


## src/main/webapp/Assets/css/forgot-password.css


# 7. JavaScript explicado

JavaScript es el puente entre lo que ves en pantalla y el servidor. Lee formularios, guarda la sesion en localStorage, llama al backend con fetch y despues pinta la respuesta en el HTML.

## src/main/webapp/Assets/js/auth-helper.js


## src/main/webapp/Assets/js/login.js


## src/main/webapp/Assets/js/register.js


## src/main/webapp/Assets/js/forgot-password.js


## src/main/webapp/Assets/js/script.js

Este archivo tiene muchas funciones (150). Las principales ya estan listadas; el resto son auxiliares de renderizado, fechas, escape HTML y eventos.

## src/main/webapp/Assets/js/admin.js

Este archivo tiene muchas funciones (118). Las principales ya estan listadas; el resto son auxiliares de renderizado, fechas, escape HTML y eventos.

# 8. Java explicado

Java recibe las peticiones que envia fetch. Cada controlador tiene una URL con @WebServlet. Dentro de doGet/doPost/doDelete lee parametros o JSON, llama a un modelo y devuelve JSON con Gson.

## src/main/java/com/ejemplo/controller/AuthLoginController.java


## src/main/java/com/ejemplo/controller/AuthRegisterController.java


## src/main/java/com/ejemplo/controller/AuthRecoverController.java


## src/main/java/com/ejemplo/controller/ContenidoController.java


## src/main/java/com/ejemplo/controller/SolicitudesContenidoController.java


## src/main/java/com/ejemplo/model/ConexionBD.java


## src/main/java/com/ejemplo/model/DatabaseSchema.java


## src/main/java/com/ejemplo/model/UsuarioLoginModel.java


## src/main/java/com/ejemplo/model/UsuarioRegisterModel.java


## src/main/java/com/ejemplo/model/UsuarioRecoveryModel.java


## src/main/java/com/ejemplo/model/ContenidoWikiModel.java

Este archivo tiene 115 lineas importantes detectadas. Las restantes son setters/getters, cierres de bloques o conversiones repetidas.

## src/main/java/com/ejemplo/filter/NoCacheFilter.java


# 9. Base de datos

La base de datos es MySQL. DatabaseSchema.java puede crear tablas automaticamente al iniciar si no existen. El SQL inicial tambien esta en mysql/init/01-bd1.sql.

# 10. Flujos para explicar en un examen


## Login

? El usuario escribe email/usuario y contrasena en login.html.
- El usuario escribe email/usuario y contrasena en login.html.
? login.js escucha el submit, evita que el formulario recargue la pagina y hace fetch a /auth/login.
- login.js escucha el submit, evita que el formulario recargue la pagina y hace fetch a /auth/login.
? AuthLoginController recibe JSON, llama a UsuarioLoginModel y comprueba en MySQL.
- AuthLoginController recibe JSON, llama a UsuarioLoginModel y comprueba en MySQL.
? Si es correcto, Java devuelve datos del usuario y JS los guarda en localStorage.
- Si es correcto, Java devuelve datos del usuario y JS los guarda en localStorage.
? Despues se redirige segun rol: usuario normal a dashboard, admin/editor a admin o pagina correspondiente.
- Despues se redirige segun rol: usuario normal a dashboard, admin/editor a admin o pagina correspondiente.

## Solicitudes de usuario

? En una pagina interna, script.js detecta data-page para saber en que seccion estas.
- En una pagina interna, script.js detecta data-page para saber en que seccion estas.
? El usuario escribe titulo y mensaje. JS crea una solicitud con pageKey y datos del usuario.
- El usuario escribe titulo y mensaje. JS crea una solicitud con pageKey y datos del usuario.
? Se envia por POST a /api/requests.
- Se envia por POST a /api/requests.
? SolicitudesContenidoController llama a ContenidoWikiModel.crearSolicitud y guarda en solicitudes_contenido.
- SolicitudesContenidoController llama a ContenidoWikiModel.crearSolicitud y guarda en solicitudes_contenido.
? El panel admin lee /api/requests y muestra esas solicitudes.
- El panel admin lee /api/requests y muestra esas solicitudes.

## Contenido publicado por admin

? El admin escribe titulo y cuerpo en admin.html.
- El admin escribe titulo y cuerpo en admin.html.
? admin.js envia POST a /api/content.
- admin.js envia POST a /api/content.
? ContenidoController llama a ContenidoWikiModel.guardarContenido.
- ContenidoController llama a ContenidoWikiModel.guardarContenido.
? Se guarda en contenido_wiki con page_key.
- Se guarda en contenido_wiki con page_key.
? Cuando el usuario abre esa pagina, script.js hace GET /api/content y filtra por page_key para mostrarlo debajo del bloque correspondiente.
- Cuando el usuario abre esa pagina, script.js hace GET /api/content y filtra por page_key para mostrarlo debajo del bloque correspondiente.

# 11. Chuleta rapida


# 12. Conteo de archivos principales


# 13. Fragmentos de codigo con numeros de linea

Estos fragmentos sirven para ubicarte rapido cuando estudies. En el proyecto real tienes el archivo completo.

## src/main/webapp/Assets/js/login.js

```
0001: document.addEventListener("DOMContentLoaded", () => {
0002:   injectSiteFooter();
0003: 
0004:   const form = document.getElementById("loginForm");
0005:   const error = document.getElementById("error");
0006: 
0007:   form?.addEventListener("submit", async (event) => {
0008:     event.preventDefault();
0009: 
0010:     const login = document.getElementById("login").value.trim();
0011:     const password = document.getElementById("password").value.trim();
0012: 
0013:     if (!login || !password) {
0014:       error.textContent = "Completa usuario y contrasena.";
0015:       return;
0016:     }
0017: 
0018:     const remoteResult = await tryRemoteLogin(login, password);
0019: 
0020:     if (remoteResult.ok) {
0021:       const remoteUser = {
0022:         username: remoteResult.username || login,
0023:         email: remoteResult.email || login,
0024:         password,
0025:         role: remoteResult.role || "user"
0026:       };
0027: 
0028:       if (window.AuthHelper) {
0029:         window.AuthHelper.upsertUser(remoteUser);
0030:         window.AuthHelper.saveSession(remoteUser);
0031:       }
0032: 
0033:       redirectAfterLogin();
0034:       return;
0035:     }
0036: 
0037:     const localResult = window.AuthHelper
0038:       ? window.AuthHelper.verifyLocalUser(login, password)
0039:       : { ok: false };
0040: 
0049: });
0050: 
0051: function getApiBase() {
0052:   return window.location.protocol === "file:"
0053:     ? "http://localhost:8080"
0054:     : window.location.origin;
0055: }
0056: 
0057: async function tryRemoteLogin(login, password) {
0058:   try {
0059:     const res = await fetch(`${getApiBase()}/auth/login`, {
0060:       method: "POST",
0061:       headers: {
0062:         "Content-Type": "application/json"
0088: }
0089: 
0090: async function safeJson(response) {
0091:   try {
0092:     return await response.json();
0093:   } catch (error) {
0096: }
0097: 
0098: function redirectAfterLogin() {
0099:   window.location.href = "dashboard.html";
0100: }
0101: 
0102: function injectSiteFooter() {
0103:   if (document.querySelector(".site-footer")) {
0104:     return;
0105:   }
```

## src/main/webapp/Assets/js/script.js

```
0001: const AUTH_STORAGE_KEY = "anime-wiki-authenticated";
0002: const USERNAME_STORAGE_KEY = "anime-wiki-username";
0003: const USER_EMAIL_STORAGE_KEY = "anime-wiki-user-email";
0004: const USER_ROLE_STORAGE_KEY = "anime-wiki-user-role";
0005: const CONTENT_STORAGE_KEY = "anime-page-content-v1";
0006: const CONTENT_REQUESTS_STORAGE_KEY = "anime-page-requests-v1";
0007: const SITE_FAVICON_PATH = "Assets/img/logo-circle.png?v=1";
0008: const PAGE_AUDIO_CONFIGS = [
0009:   {
0010:     themeClass: "theme-one-piece",
0011:     audioPath: "Assets/one-piece-theme.mp3?v=1",
0012:     storageKey: "one-piece-audio-state-v1",
0013:     audioId: "onePieceThemeAudio",
0014:     buttonId: "onePieceAudioToggle",
0015:     seriesName: "One Piece"
0016:   },
0017:   {
0018:     themeClass: "theme-naruto",
0019:     audioPath: "Assets/naruto-theme.mp3?v=1",
0020:     storageKey: "naruto-audio-state-v1",
0021:     audioId: "narutoThemeAudio",
0022:     buttonId: "narutoAudioToggle",
0023:     seriesName: "Naruto"
0024:   },
0025:   {
0026:     themeClass: "theme-bleach",
0027:     audioPath: "Assets/bleach-theme.mp3?v=1",
0028:     storageKey: "bleach-audio-state-v1",
0029:     audioId: "bleachThemeAudio",
0030:     buttonId: "bleachAudioToggle",
0031:     seriesName: "Bleach"
0032:   }
0033: ];
0034: const SERIES_ASIDE_VIDEO_CONFIGS = [
0035:   {
0036:     themeClass: "theme-one-piece",
0037:     boxId: "onePieceVideoBox",
0038:     heading: "Videos de One Piece",
0039:     videos: [
0040:       {
0092: ];
0093: 
0094: function redirectToLogin() {
0095:   window.location.href = "login.html";
0096: }
0097: 
0098: function isAuthenticated() {
0099:   return localStorage.getItem(AUTH_STORAGE_KEY) === "true";
0100: }
0101: 
0102: function getCurrentRole() {
0103:   return String(localStorage.getItem(USER_ROLE_STORAGE_KEY) || "user").toLowerCase();
0104: }
0105: 
0106: function getCurrentUserName() {
0107:   return localStorage.getItem(USERNAME_STORAGE_KEY) || "Invitado";
0108: }
0109: 
0110: function getCurrentUserEmail() {
0111:   return localStorage.getItem(USER_EMAIL_STORAGE_KEY) || "";
0112: }
0113: 
0114: function getApiBase() {
0115:   return window.location.protocol === "file:"
0116:     ? "http://localhost:8080"
0117:     : window.location.origin;
0118: }
0119: 
0120: async function safeJson(response) {
0121:   try {
0122:     return await response.json();
0123:   } catch (error) {
0126: }
0127: 
0128: async function syncCommunityStateFromServer() {
0129:   try {
0130:     const [contentResponse, requestsResponse] = await Promise.all([
0131:       fetch(`${getApiBase()}/api/content`),
0132:       fetch(`${getApiBase()}/api/requests`)
0133:     ]);
0134: 
0135:     if (contentResponse.ok) {
0151: }
0152: 
0153: async function persistContentEntry(entry) {
0154:   try {
0155:     const response = await fetch(`${getApiBase()}/api/content`, {
0156:       method: "POST",
0157:       headers: { "Content-Type": "application/json" },
0158:       body: JSON.stringify(entry)
0163:     }
0164:   } catch (error) {
0165:     // El localStorage queda como respaldo si el servidor no responde.
0166:   }
0167:   return entry;
```

## src/main/webapp/Assets/js/admin.js

```
0001: const AUTH_STORAGE_KEY = "anime-wiki-authenticated";
0002: const USERNAME_STORAGE_KEY = "anime-wiki-username";
0003: const USER_ROLE_STORAGE_KEY = "anime-wiki-user-role";
0004: const USER_EMAIL_STORAGE_KEY = "anime-wiki-user-email";
0005: const CONTENT_STORAGE_KEY = "anime-page-content-v1";
0006: const CONTENT_REQUESTS_STORAGE_KEY = "anime-page-requests-v1";
0007: 
0008: const PAGE_OPTIONS = [
0009:   { key: "one-piece-arcos", label: "One Piece - Arcos" },
0010:   { key: "one-piece-frutas-del-diablo", label: "One Piece - Frutas del diablo" },
0011:   { key: "one-piece-mares", label: "One Piece - Mares" },
0012:   { key: "one-piece-sichibukais", label: "One Piece - Sichibukais" },
0013:   { key: "one-piece-tripulacion", label: "One Piece - Tripulacion" },
0014:   { key: "one-piece-yonkos", label: "One Piece - Yonkos" },
0015:   { key: "naruto-equipo-7", label: "Naruto - Equipo 7" },
0016:   { key: "naruto-ojos", label: "Naruto - Ojos" },
0017:   { key: "naruto-akatsuki", label: "Naruto - Akatsuki" },
0018:   { key: "naruto-bijus", label: "Naruto - Bijus" },
0019:   { key: "naruto-hokages", label: "Naruto - Hokages" },
0020:   { key: "naruto-clanes", label: "Naruto - Clanes" },
0021:   { key: "bleach-shinigamis", label: "Bleach - Shinigamis" },
0022:   { key: "bleach-hollows", label: "Bleach - Hollows" },
0023:   { key: "bleach-vizards", label: "Bleach - Vizards" },
0024:   { key: "bleach-quincys", label: "Bleach - Quincys" },
0025:   { key: "bleach-zanpakutos", label: "Bleach - Zanpakutos" },
0026:   { key: "bleach-bankais", label: "Bleach - Bankais" }
0027: ];
0028: 
0029: function isAuthenticated() {
0030:   return localStorage.getItem(AUTH_STORAGE_KEY) === "true";
0031: }
0032: 
0033: function getCurrentRole() {
0034:   return String(localStorage.getItem(USER_ROLE_STORAGE_KEY) || "user").toLowerCase();
0035: }
0036: 
0037: function getCurrentUserName() {
0038:   return localStorage.getItem(USERNAME_STORAGE_KEY) || "Usuario";
0039: }
0040: 
0041: function getCurrentUserEmail() {
0042:   return localStorage.getItem(USER_EMAIL_STORAGE_KEY) || "";
0043: }
0044: 
0045: function getApiBase() {
0046:   return window.location.protocol === "file:"
0047:     ? "http://localhost:8080"
0048:     : window.location.origin;
0049: }
0050: 
0051: async function safeJson(response) {
0052:   try {
0053:     return await response.json();
0054:   } catch (error) {
0057: }
0058: 
0059: async function syncAdminStateFromServer() {
0060:   try {
0061:     const [contentResponse, requestsResponse] = await Promise.all([
0062:       fetch(`${getApiBase()}/api/content`),
0063:       fetch(`${getApiBase()}/api/requests`)
0064:     ]);
0065: 
0066:     if (contentResponse.ok) {
0082: }
0083: 
0084: async function persistEntry(entry) {
0085:   try {
0086:     const response = await fetch(`${getApiBase()}/api/content`, {
0087:       method: "POST",
0088:       headers: { "Content-Type": "application/json" },
0089:       body: JSON.stringify(entry)
0099: }
0100: 
0101: async function removeEntryRemote(entryId) {
0102:   try {
0103:     await fetch(`${getApiBase()}/api/content?id=${encodeURIComponent(entryId)}`, {
0104:       method: "DELETE"
0105:     });
0106:   } catch (error) {
0109: }
0110: 
0111: async function persistRequestStatus(requestId, status) {
0112:   try {
0113:     await fetch(`${getApiBase()}/api/requests`, {
0114:       method: "POST",
0115:       headers: { "Content-Type": "application/json" },
0116:       body: JSON.stringify({ action: "status", id: requestId, status })
0121: }
0122: 
0123: async function removeRequestRemote(requestId) {
0124:   try {
0125:     await fetch(`${getApiBase()}/api/requests?id=${encodeURIComponent(requestId)}`, {
0126:       method: "DELETE"
0127:     });
```

## src/main/java/com/ejemplo/controller/ContenidoController.java

```
0001: package com.ejemplo.controller;
0002: 
0003: import com.ejemplo.model.ContenidoWikiModel;
0004: import com.ejemplo.model.ContenidoWikiModel.ContenidoEntry;
0005: import com.google.gson.Gson;
0006: import jakarta.servlet.annotation.WebServlet;
0007: import jakarta.servlet.http.HttpServlet;
0008: import jakarta.servlet.http.HttpServletRequest;
0009: import jakarta.servlet.http.HttpServletResponse;
0010: 
0011: import java.io.IOException;
0012: 
0013: @WebServlet("/api/content")
0014: public class ContenidoController extends HttpServlet {
0015:     private final ContenidoWikiModel model = new ContenidoWikiModel();
0016:     private final Gson gson = new Gson();
0017: 
0018:     @Override
0019:     protected void doOptions(HttpServletRequest request, HttpServletResponse response) {
0020:         setCorsHeaders(response);
0021:         response.setStatus(HttpServletResponse.SC_NO_CONTENT);
0022:     }
0023: 
0024:     @Override
0025:     protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
0026:         setJsonHeaders(response);
0027:         try {
0028:             response.getWriter().print(gson.toJson(model.listarContenido(request.getParameter("pageKey"))));
0029:         } catch (Exception e) {
0030:             e.printStackTrace();
0031:             response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
0032:             response.getWriter().print(gson.toJson(new ErrorResponse(false, e.getClass().getSimpleName(), e.getMessage())));
0033:         }
0034:     }
0035: 
0036:     @Override
0037:     protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
0038:         setJsonHeaders(response);
0039:         try {
0040:             ContenidoEntry entry = gson.fromJson(request.getReader(), ContenidoEntry.class);
0055: 
0056:     @Override
0057:     protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
0058:         setJsonHeaders(response);
0059:         try {
0060:             int id = Integer.parseInt(request.getParameter("id"));
```

## src/main/java/com/ejemplo/model/ContenidoWikiModel.java

```
0001: package com.ejemplo.model;
0002: 
0003: import java.sql.Connection;
0004: import java.sql.PreparedStatement;
0005: import java.sql.ResultSet;
0006: import java.sql.Statement;
0007: import java.sql.Timestamp;
0008: import java.time.Instant;
0009: import java.util.ArrayList;
0010: import java.util.List;
0011: 
0012: public class ContenidoWikiModel {
0013: 
0014:     public List<ContenidoEntry> listarContenido(String pageKey) throws Exception {
0015:         String sql = "SELECT id, page_key, titulo, cuerpo, autor_nombre, autor_email, autor_rol, creado_en, actualizado_en " +
0016:                 "FROM contenido_wiki " +
0017:                 (isBlank(pageKey) ? "" : "WHERE page_key = ? ") +
0018:                 "ORDER BY actualizado_en DESC, creado_en DESC";
0019: 
0020:         try (Connection con = ConexionBD.getConnection();
0021:              PreparedStatement ps = con.prepareStatement(sql)) {
0022:             if (!isBlank(pageKey)) {
0023:                 ps.setString(1, pageKey.trim());
0024:             }
0025: 
0026:             try (ResultSet rs = ps.executeQuery()) {
0027:                 List<ContenidoEntry> entries = new ArrayList<>();
0028:                 while (rs.next()) {
0029:                     entries.add(mapContenido(rs));
0030:                 }
0031:                 return entries;
0032:             }
0033:         }
0034:     }
0035: 
0036:     public ContenidoEntry guardarContenido(ContenidoEntry entry) throws Exception {
0037:         Integer id = parseId(entry.id);
0038:         String autorRol = normalizeRole(entry.authorRole);
0039: 
0040:         if (id != null && existeContenido(id)) {
0041:             String sql = "UPDATE contenido_wiki SET page_key = ?, titulo = ?, cuerpo = ?, autor_nombre = ?, autor_email = ?, autor_rol = ? WHERE id = ?";
0042:             try (Connection con = ConexionBD.getConnection();
0043:                  PreparedStatement ps = con.prepareStatement(sql)) {
0044:                 ps.setString(1, clean(entry.pageKey));
0054:         }
0055: 
0056:         String sql = "INSERT INTO contenido_wiki (page_key, titulo, cuerpo, autor_nombre, autor_email, autor_rol) VALUES (?, ?, ?, ?, ?, ?)";
0057:         try (Connection con = ConexionBD.getConnection();
0058:              PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
0059:             ps.setString(1, clean(entry.pageKey));
0084: 
0085:     public List<ContenidoRequest> listarSolicitudes(String pageKey) throws Exception {
0086:         String sql = "SELECT id, page_key, titulo, mensaje, remitente_nombre, remitente_email, remitente_rol, estado, creado_en " +
0087:                 "FROM solicitudes_contenido " +
0088:                 (isBlank(pageKey) ? "" : "WHERE page_key = ? ") +
0089:                 "ORDER BY FIELD(estado, 'PENDIENTE', 'REVISADA'), creado_en DESC";
0106: 
0107:     public ContenidoRequest crearSolicitud(ContenidoRequest request) throws Exception {
0108:         String sql = "INSERT INTO solicitudes_contenido (page_key, titulo, mensaje, remitente_nombre, remitente_email, remitente_rol, estado) VALUES (?, ?, ?, ?, ?, ?, ?)";
0109:         try (Connection con = ConexionBD.getConnection();
0110:              PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
0111:             ps.setString(1, clean(request.pageKey));
```