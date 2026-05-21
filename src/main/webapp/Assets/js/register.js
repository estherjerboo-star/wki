document.addEventListener("DOMContentLoaded", () => {
  injectSiteFooter();

  const error = document.getElementById("error");
  const form = document.getElementById("registroForm");

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value.trim();
    const confirm = document.getElementById("confirm").value.trim();

    if (password !== confirm) {
      error.textContent = "Las contrasenas no coinciden.";
      return;
    }

    if (password.length < 6) {
      error.textContent = "La contrasena debe tener al menos 6 caracteres.";
      return;
    }

    const remoteResult = await tryRemoteRegister({ username, email, password });

    if (remoteResult.ok) {
      finishRegistration({ username, email, password });
      return;
    }

    const localResult = window.AuthHelper
      ? window.AuthHelper.registerLocalUser({ username, email, password })
      : { ok: false, mensaje: "No se pudo crear la cuenta." };

    if (!localResult.ok) {
      error.textContent = remoteResult.remoteError && remoteResult.mensaje
        ? remoteResult.mensaje
        : localResult.mensaje;
      return;
    }

    finishRegistration({ username, email, password });
  });
});

function getApiBase() {
  return window.location.protocol === "file:"
    ? "http://localhost:8080"
    : window.location.origin;
}

async function tryRemoteRegister(payload) {
  try {
    const response = await fetch(`${getApiBase()}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await safeJson(response);

    if (!response.ok || !data.ok) {
      return {
        ok: false,
        remoteError: true,
        mensaje: data.mensaje || "No se pudo registrar la cuenta."
      };
    }

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      remoteError: false,
      mensaje: "Servidor no disponible. Se creara la cuenta en modo local."
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

function finishRegistration(user) {
  if (window.AuthHelper) {
    const savedUser = window.AuthHelper.upsertUser({ ...user, role: "user" });
    window.AuthHelper.saveSession(savedUser);
  }

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
