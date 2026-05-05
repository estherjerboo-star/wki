package com.ejemplo.model;

import jakarta.servlet.ServletContext;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public final class UsuarioStore {

    private static final String STORE_KEY = UsuarioStore.class.getName() + ".store";

    private UsuarioStore() {
    }

    public static void seed(ServletContext context) {
        store(context).putIfAbsent("admin", new Usuario("Administrador", "admin", "anime123"));
    }

    public static boolean register(ServletContext context, String nombreVisible, String usuario, String clave) {
        seed(context);
        String normalized = usuario.trim().toLowerCase();
        Usuario nuevo = new Usuario(nombreVisible.trim(), usuario.trim(), clave);
        return store(context).putIfAbsent(normalized, nuevo) == null;
    }

    public static Usuario validate(ServletContext context, String usuario, String clave) {
        seed(context);
        Usuario usuarioGuardado = store(context).get(usuario.trim().toLowerCase());
        if (usuarioGuardado == null) {
            return null;
        }
        return usuarioGuardado.getClave().equals(clave) ? usuarioGuardado : null;
    }

    @SuppressWarnings("unchecked")
    private static Map<String, Usuario> store(ServletContext context) {
        synchronized (context) {
            Object attribute = context.getAttribute(STORE_KEY);
            if (attribute == null) {
                Map<String, Usuario> usuarios = new ConcurrentHashMap<>();
                context.setAttribute(STORE_KEY, usuarios);
                return usuarios;
            }
            return (Map<String, Usuario>) attribute;
        }
    }
}
