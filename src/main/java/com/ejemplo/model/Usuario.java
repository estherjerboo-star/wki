package com.ejemplo.model;

public class Usuario {

    private final String nombreVisible;
    private final String usuario;
    private final String clave;

    public Usuario(String nombreVisible, String usuario, String clave) {
        this.nombreVisible = nombreVisible;
        this.usuario = usuario;
        this.clave = clave;
    }

    public String getNombreVisible() {
        return nombreVisible;
    }

    public String getUsuario() {
        return usuario;
    }

    public String getClave() {
        return clave;
    }
}
