document.addEventListener("DOMContentLoaded", () => {
  injectSiteFooter();

  const form = document.getElementById("loginForm");
  const error = document.getElementById("error");

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const login = document.getElementById("login").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!login || !password) {
      error.textContent = "Completa usuario y contrasena.";
      return;
    }

    const remoteResult = await tryRemoteLogin(login, password);

    if (remoteResult.ok) {
      const remoteUser = {
        username: remoteResult.username || login,
        email: remoteResult.email || login,
        password,
        role: remoteResult.role || "user"
      };

      if (window.AuthHelper) {
        window.AuthHelper.upsertUser(remoteUser);
        window.AuthHelper.saveSession(remoteUser);
      }

      redirectAfterLogin();
      return;
    }

    const localResult = window.AuthHelper
      ? window.AuthHelper.verifyLocalUser(login, password)
      : { ok: false };

    if (localResult.ok) {
      window.AuthHelper.saveSession(localResult.user);
      redirectAfterLogin();
      return;
    }

    error.textContent = remoteResult.mensaje || "No se pudo iniciar sesion.";
  });
});

function getApiBase() {
  return window.location.protocol === "file:"
    ? "http://localhost:8080"
    : window.location.origin;
}

async function tryRemoteLogin(login, password) {
  try {
    const res = await fetch(`${getApiBase()}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ login, password })
    });

    const data = await safeJson(res);

    if (!res.ok || !data.ok) {
      return {
        ok: false,
        mensaje: data.mensaje || "Inicio de sesion incorrecto."
      };
    }

    return {
      ok: true,
      username: data.username || login,
      email: data.email || login,
      role: String(data.rol || "user").toLowerCase()
    };
  } catch (error) {
    return {
      ok: false,
      mensaje: "Servidor no disponible. Usa tu cuenta local o crea una nueva."
    };
  }
}

async function safeJson(response) {
  try {
    return await response.json();
  } catch (error) {
    return {};
  }
}

function redirectAfterLogin() {
  window.location.href = "dashboard.html";
}

function injectSiteFooter() {
  if (document.querySelector(".site-footer")) {
    return;
  }

  const year = new Date().getFullYear();
  const footer = document.createElement("footer");
  footer.className = "site-footer site-footer-auth";
  footer.innerHTML = `
    <div class="site-footer-inner">
      <p class="site-footer-copy">© ${year} Los tres grandes del anime. Proyecto fan sin afiliacion oficial.</p>
      <p class="site-footer-note">One Piece, Naruto y Bleach, junto con sus nombres, personajes e imagenes, pertenecen a sus respectivos autores y titulares.</p>
    </div>
  `;

  document.body.appendChild(footer);
}
