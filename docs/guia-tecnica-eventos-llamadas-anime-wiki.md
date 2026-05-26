Version pensada para responder preguntas tecnicas del profesor: que evento se dispara, que funcion se ejecuta, que endpoint se llama, que servlet lo recibe, que modelo usa, que tabla toca y que respuesta vuelve al navegador.

# 1. Vocabulario tecnico para contestar bien


# 2. Respuesta corta: si le das aqui, que pasa


# 3. Eventos reales detectados en JavaScript

Cuando el profesor pregunte 'que evento es', responde exactamente el de la columna Evento. Cuando pregunte 'donde esta', responde archivo y linea aproximada.

# 4. Peticiones fetch reales


# 5. Endpoints: Java recibe esto


# 6. Flujo explicado como se lo dirias al profesor


## Login

1. En login.html hay un formulario con id loginForm. login.js espera a DOMContentLoaded para asegurarse de que ese formulario ya existe en el DOM. Despues hace document.getElementById('loginForm') y registra el evento submit.
2. Cuando pulso el boton de entrar, el navegador intenta enviar el formulario. El listener ejecuta event.preventDefault(), por eso la pagina no se recarga. Entonces lee los inputs #login y #password.
3. La funcion tryRemoteLogin(login, password) hace fetch a getApiBase() + '/auth/login' con method POST, header Content-Type application/json y body JSON con login/password.
4. Java recibe esa URL porque AuthLoginController tiene @WebServlet('/auth/login'). El metodo que se ejecuta es doPost porque la peticion es POST.
5. doPost llama a readJson(), valida que no este vacio, pregunta a UsuarioLoginModel.estaBloqueado(login), luego a UsuarioLoginModel.validar(login,password). Ese modelo hace SELECT en usuarios.
6. Si todo esta bien, Java crea una sesion HttpSession con idUsuario y rol, y devuelve JSON con ok, rol, username y email. JS guarda esos datos en localStorage y redirige con redirectAfterLogin().

## Solicitud de informacion del usuario

1. En una pagina interna, script.js obtiene la pagina activa con getPageKey(). La clave suele venir de data-page del body, por ejemplo one-piece-arcos o bleach-bankais. Esa clave se guarda como pageKey.
2. buildContentManagerSection(pageKey) inserta en el DOM el bloque de comunidad. Si el usuario normal no puede editar, le muestra el formulario de solicitud #contentRequestForm.
3. initContentRequestForm(pageKey) registra submit sobre #contentRequestForm. Al enviar, lee #contentRequestTitle y #contentRequestBody.
4. JS construye un objeto: pageKey, title, body, senderName, senderEmail, senderRole, status='pending'. Luego llama persistContentRequest(request).
5. persistContentRequest hace POST /api/requests. Lo recibe SolicitudesContenidoController.doPost(). Como no trae action='status', lo interpreta como nueva solicitud y llama model.crearSolicitud().
6. ContenidoWikiModel.crearSolicitud() ejecuta INSERT INTO solicitudes_contenido. Despues devuelve la solicitud guardada y JS la pinta en la lista de solicitudes.

## Publicar contenido desde admin

1. En admin.html el formulario principal tiene id adminContentForm. admin.js llama initContentForm() y registra submit.
2. Al pulsar Guardar contenido, el evento submit lee #adminEntryId, #adminPageKey, #adminEntryTitle y #adminEntryBody.
3. Si adminEntryId esta vacio, se crea contenido nuevo. Si tiene id, se actualiza uno existente. En ambos casos admin.js llama persistEntry(entry).
4. persistEntry hace POST /api/content. Lo recibe ContenidoController.doPost(), que convierte el JSON a ContenidoEntry con Gson.
5. ContenidoController valida pageKey/title/body. Si falta algo, responde 400. Si esta bien, llama ContenidoWikiModel.guardarContenido(entry).
6. guardarContenido mira si existe id. Si existe hace UPDATE contenido_wiki. Si no existe hace INSERT contenido_wiki. Devuelve el objeto guardado y admin.js renderiza la lista otra vez.

# 7. IDs y selectores HTML que conectan con JS


# 8. Que guarda localStorage exactamente


# 9. Que debes responder si te preguntan por GET, POST y DELETE

GET se usa para pedir datos sin cambiar nada. En tu proyecto: GET /api/content lista contenido y GET /api/requests lista solicitudes.
POST se usa para enviar datos al servidor. En tu proyecto: login, registro, recuperar contrasena, crear/actualizar contenido y crear/marcar solicitudes.
DELETE se usa para borrar. En tu proyecto: DELETE /api/content?id=... borra una entrada y DELETE /api/requests?id=... borra una solicitud.
OPTIONS aparece por CORS. Es una peticion previa del navegador para comprobar si el backend permite llamadas desde otro origen. Tus controladores responden con Access-Control-Allow-Origin, Methods y Headers.

# 10. Lineas clave para ensenar en el codigo


## login.js


## register.js


## forgot-password.js


## script.js


## admin.js


## ContenidoController.java


## SolicitudesContenidoController.java


## ContenidoWikiModel.java


# 11. Frases preparadas para el examen

? El evento que se dispara al enviar el formulario es submit, no click, porque el boton esta dentro de un form.
? Uso event.preventDefault() para cancelar el envio normal del formulario y controlar yo la peticion con fetch.
? fetch envia una peticion HTTP al servlet. La URL decide el controlador y el metodo HTTP decide doGet, doPost o doDelete.
? @WebServlet('/api/content') registra la clase Java para que Tomcat la ejecute cuando llegue esa ruta.
? Gson convierte JSON de JavaScript a un objeto Java y tambien convierte objetos Java a JSON para responder.
? PreparedStatement mete parametros en SQL de forma segura y evita concatenar datos del usuario directamente.
? localStorage guarda la sesion en el navegador, pero la base de datos guarda lo persistente de verdad: usuarios, contenido y solicitudes.
? data-page/pageKey sirve para relacionar una pagina HTML concreta con sus filas en contenido_wiki o solicitudes_contenido.