CREATE DATABASE IF NOT EXISTS anime_wiki
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE anime_wiki;

DROP TABLE IF EXISTS solicitudes_contenido;
DROP TABLE IF EXISTS contenido_wiki;
DROP TABLE IF EXISTS usuarios_bloqueados;
DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  rol ENUM('USER', 'EDITOR', 'ADMIN') NOT NULL DEFAULT 'USER',
  bloqueado BOOLEAN NOT NULL DEFAULT FALSE,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE usuarios_bloqueados (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  motivo VARCHAR(255),
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE contenido_wiki (
  id INT AUTO_INCREMENT PRIMARY KEY,
  page_key VARCHAR(100) NOT NULL,
  titulo VARCHAR(150) NOT NULL,
  cuerpo TEXT NOT NULL,
  autor_id INT NULL,
  autor_nombre VARCHAR(50) NOT NULL,
  autor_email VARCHAR(100) NOT NULL,
  autor_rol ENUM('USER', 'EDITOR', 'ADMIN') NOT NULL DEFAULT 'USER',
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_contenido_autor
    FOREIGN KEY (autor_id) REFERENCES usuarios(id)
    ON DELETE SET NULL,
  INDEX idx_contenido_page_key (page_key),
  INDEX idx_contenido_actualizado_en (actualizado_en)
);

CREATE TABLE solicitudes_contenido (
  id INT AUTO_INCREMENT PRIMARY KEY,
  page_key VARCHAR(100) NOT NULL,
  titulo VARCHAR(150) NOT NULL,
  mensaje TEXT NOT NULL,
  remitente_id INT NULL,
  remitente_nombre VARCHAR(50) NOT NULL,
  remitente_email VARCHAR(100) NOT NULL,
  remitente_rol ENUM('USER', 'EDITOR', 'ADMIN') NOT NULL DEFAULT 'USER',
  estado ENUM('PENDIENTE', 'REVISADA') NOT NULL DEFAULT 'PENDIENTE',
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_solicitud_remitente
    FOREIGN KEY (remitente_id) REFERENCES usuarios(id)
    ON DELETE SET NULL,
  INDEX idx_solicitudes_page_key (page_key),
  INDEX idx_solicitudes_estado (estado)
);

INSERT INTO usuarios (username, email, password, rol)
VALUES
  ('Administrador', 'admin@anime.local', 'admin123', 'ADMIN'),
  ('Editor', 'editor@anime.local', 'editor123', 'EDITOR');
