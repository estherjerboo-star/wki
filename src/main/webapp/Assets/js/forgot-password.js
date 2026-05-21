document.addEventListener("DOMContentLoaded", () => {
  injectSiteFooter();

  const apiBase = getApiBase();
  const checkForm = document.getElementById("checkAccountForm");
  const resetForm = document.getElementById("resetPasswordForm");
  const emailInput = document.getElementById("recoverEmail");
  const newPasswordInput = document.getElementById("newPassword");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const accountFound = document.getElementById("accountFound");
  const message = document.getElementById("recoverMessage");

  let selectedEmail = "";

  checkForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    selectedEmail = emailInput.value.trim().toLowerCase();
    setMessage("", "");

    if (!selectedEmail) {
      setMessage("Introduce tu correo electronico.", "error");
      return;
    }

    const remoteResult = await tryRemoteCheck(apiBase, selectedEmail);

    if (remoteResult.ok) {
      showAccount(remoteResult.nombre || selectedEmail, remoteResult.email || selectedEmail);
      return;
    }

    const localUser = window.AuthHelper ? window.AuthHelper.findByEmail(selectedEmail) : null;

    if (localUser) {
      showAccount(localUser.username, localUser.email);
      setMessage("Cuenta local encontrada. Ya puedes cambiar la contrasena.", "success");
      return;
    }

    setMessage(remoteResult.mensaje || "No se pudo encontrar esa cuenta.", "error");
  });

  resetForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const password = newPasswordInput.value.trim();
    const confirm = confirmPasswordInput.value.trim();
    setMessage("", "");

    if (password.length < 6) {
      setMessage("La contrasena debe tener al menos 6 caracteres.", "error");
      return;
    }

    if (password !== confirm) {
      setMessage("Las contrasenas no coinciden.", "error");
      return;
    }

    const remoteResult = await tryRemoteReset(apiBase, selectedEmail, password);

    if (!remoteResult.ok && window.AuthHelper) {
      const localReset = window.AuthHelper.updatePassword(selectedEmail, password);

      if (!localReset.ok) {
        setMessage(remoteResult.mensaje || localReset.mensaje, "error");
        return;
      }
    }

    setMessage("Contrasena cambiada. Ya puedes iniciar sesion.", "success");
    resetForm.reset();

    setTimeout(() => {
      window.location.href = "login.html";
    }, 1400);
  });

  function showAccount(name, email) {
    selectedEmail = email;
    accountFound.innerHTML = `
      <strong>Cuenta encontrada</strong>
      ${escapeHtml(name)}<br>
      ${escapeHtml(email)}
    `;
    checkForm.classList.add("hidden");
    resetForm.classList.remove("hidden");
    newPasswordInput.focus();
  }

  function setMessage(text, type) {
    message.textContent = text;
    message.className = `error-text recover-message ${type || ""}`.trim();
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
});

function getApiBase() {
  return window.location.protocol === "file:"
    ? "http://localhost:8080"
    : window.location.origin;
}

async function tryRemoteCheck(apiBase, email) {
  try {
    const res = await fetch(`${apiBase}/auth/recover/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    const data = await safeJson(res);

    if (!res.ok || !data.ok) {
      return { ok: false, mensaje: data.mensaje || "No se pudo encontrar esa cuenta." };
    }

    return { ok: true, nombre: data.nombre, email: data.email || email };
  } catch (error) {
    return { ok: false, mensaje: "Servidor no disponible. Buscando en modo local..." };
  }
}

async function tryRemoteReset(apiBase, email, password) {
  try {
    const res = await fetch(`${apiBase}/auth/recover/reset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await safeJson(res);

    if (!res.ok || !data.ok) {
      return { ok: false, mensaje: data.mensaje || "No se pudo cambiar la contrasena." };
    }

    return { ok: true };
  } catch (error) {
    return { ok: false, mensaje: "Servidor no disponible. Cambiando en modo local..." };
  }
}

async function safeJson(response) {
  try {
    return await response.json();
  } catch (error) {
    return {};
  }
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
