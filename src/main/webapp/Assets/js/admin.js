const AUTH_STORAGE_KEY = "anime-wiki-authenticated";
const USERNAME_STORAGE_KEY = "anime-wiki-username";
const USER_ROLE_STORAGE_KEY = "anime-wiki-user-role";
const USER_EMAIL_STORAGE_KEY = "anime-wiki-user-email";
const CONTENT_STORAGE_KEY = "anime-page-content-v1";
const CONTENT_REQUESTS_STORAGE_KEY = "anime-page-requests-v1";

const PAGE_OPTIONS = [
  { key: "one-piece-arcos", label: "One Piece - Arcos" },
  { key: "one-piece-frutas-del-diablo", label: "One Piece - Frutas del diablo" },
  { key: "one-piece-mares", label: "One Piece - Mares" },
  { key: "one-piece-sichibukais", label: "One Piece - Sichibukais" },
  { key: "one-piece-tripulacion", label: "One Piece - Tripulacion" },
  { key: "one-piece-yonkos", label: "One Piece - Yonkos" },
  { key: "naruto-equipo-7", label: "Naruto - Equipo 7" },
  { key: "naruto-ojos", label: "Naruto - Ojos" },
  { key: "naruto-akatsuki", label: "Naruto - Akatsuki" },
  { key: "naruto-bijus", label: "Naruto - Bijus" },
  { key: "naruto-hokages", label: "Naruto - Hokages" },
  { key: "naruto-clanes", label: "Naruto - Clanes" },
  { key: "bleach-shinigamis", label: "Bleach - Shinigamis" },
  { key: "bleach-hollows", label: "Bleach - Hollows" },
  { key: "bleach-vizards", label: "Bleach - Vizards" },
  { key: "bleach-quincys", label: "Bleach - Quincys" },
  { key: "bleach-zanpakutos", label: "Bleach - Zanpakutos" },
  { key: "bleach-bankais", label: "Bleach - Bankais" }
];

function isAuthenticated() {
  return localStorage.getItem(AUTH_STORAGE_KEY) === "true";
}

function getCurrentRole() {
  return String(localStorage.getItem(USER_ROLE_STORAGE_KEY) || "user").toLowerCase();
}

function getCurrentUserName() {
  return localStorage.getItem(USERNAME_STORAGE_KEY) || "Usuario";
}

function getCurrentUserEmail() {
  return localStorage.getItem(USER_EMAIL_STORAGE_KEY) || "";
}

function getApiBase() {
  return window.location.protocol === "file:"
    ? "http://localhost:8080"
    : window.location.origin;
}

async function safeJson(response) {
  try {
    return await response.json();
  } catch (error) {
    return null;
  }
}

async function syncAdminStateFromServer() {
  try {
    const [contentResponse, requestsResponse] = await Promise.all([
      fetch(`${getApiBase()}/api/content`),
      fetch(`${getApiBase()}/api/requests`)
    ]);

    if (contentResponse.ok) {
      const content = await safeJson(contentResponse);
      if (Array.isArray(content)) {
        saveEntries(content);
      }
    }

    if (requestsResponse.ok) {
      const requests = await safeJson(requestsResponse);
      if (Array.isArray(requests)) {
        saveRequests(requests);
      }
    }
  } catch (error) {
    // Si se abre sin servidor, el panel sigue usando el respaldo local.
  }
}

async function persistEntry(entry) {
  try {
    const response = await fetch(`${getApiBase()}/api/content`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry)
    });
    const saved = await safeJson(response);
    if (response.ok && saved && saved.id) {
      return saved;
    }
  } catch (error) {
    // Respaldo local si falla el servidor.
  }
  return entry;
}

async function removeEntryRemote(entryId) {
  try {
    await fetch(`${getApiBase()}/api/content?id=${encodeURIComponent(entryId)}`, {
      method: "DELETE"
    });
  } catch (error) {
    // Respaldo local si falla el servidor.
  }
}

async function persistRequestStatus(requestId, status) {
  try {
    await fetch(`${getApiBase()}/api/requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "status", id: requestId, status })
    });
  } catch (error) {
    // Respaldo local si falla el servidor.
  }
}

async function removeRequestRemote(requestId) {
  try {
    await fetch(`${getApiBase()}/api/requests?id=${encodeURIComponent(requestId)}`, {
      method: "DELETE"
    });
  } catch (error) {
    // Respaldo local si falla el servidor.
  }
}

function canDeleteContent() {
  return getCurrentRole() === "admin";
}

function roleLabel(role) {
  const labels = {
    admin: "Administrador",
    editor: "Usuario editor",
    user: "Usuario"
  };
  return labels[String(role || "user").toLowerCase()] || "Usuario";
}

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Sin fecha";
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function injectSiteFooter() {
  if (document.querySelector(".site-footer")) {
    return;
  }

  const year = new Date().getFullYear();
  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = `
    <div class="site-footer-inner">
      <p class="site-footer-copy">© ${year} Los tres grandes del anime. Proyecto fan sin afiliacion oficial.</p>
      <p class="site-footer-note">One Piece, Naruto y Bleach, junto con sus nombres, personajes e imagenes, pertenecen a sus respectivos autores y titulares.</p>
    </div>
  `;

  document.body.appendChild(footer);
}

function readEntries() {
  try {
    const raw = JSON.parse(localStorage.getItem(CONTENT_STORAGE_KEY) || "[]");
    return Array.isArray(raw) ? raw : [];
  } catch (error) {
    return [];
  }
}

function saveEntries(entries) {
  localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(entries));
}

function readRequests() {
  try {
    const raw = JSON.parse(localStorage.getItem(CONTENT_REQUESTS_STORAGE_KEY) || "[]");
    return Array.isArray(raw) ? raw : [];
  } catch (error) {
    return [];
  }
}

function saveRequests(requests) {
  localStorage.setItem(CONTENT_REQUESTS_STORAGE_KEY, JSON.stringify(requests));
}

function updateRequestStatus(requestId, status) {
  const requests = readRequests();
  const index = requests.findIndex((request) => String(request.id) === String(requestId));

  if (index < 0) {
    return;
  }

  requests[index] = { ...requests[index], status };
  saveRequests(requests);
}

function deleteRequest(requestId) {
  saveRequests(readRequests().filter((request) => String(request.id) !== String(requestId)));
}

function upsertEntry(entry) {
  const entries = readEntries();
  const index = entries.findIndex((item) => String(item.id) === String(entry.id));
  if (index >= 0) {
    entries[index] = entry;
  } else {
    entries.unshift(entry);
  }
  saveEntries(entries);
}

function deleteEntry(entryId) {
  saveEntries(readEntries().filter((entry) => String(entry.id) !== String(entryId)));
}

function replaceEntry(previousId, entry) {
  const entries = readEntries().filter((item) => String(item.id) !== String(previousId));
  const index = entries.findIndex((item) => String(item.id) === String(entry.id));
  if (index >= 0) {
    entries[index] = entry;
  } else {
    entries.unshift(entry);
  }
  saveEntries(entries);
}

function ensureAccess() {
  if (!isAuthenticated()) {
    window.location.href = "login.html";
    return false;
  }

  if (!["admin", "editor"].includes(getCurrentRole())) {
    window.location.href = "dashboard.html";
    return false;
  }

  return true;
}

function renderHeader() {
  const usernameDisplay = document.getElementById("usernameDisplay");
  const avatar = document.querySelector(".user-avatar");
  const dropdown = document.getElementById("userDropdown");
  const button = document.getElementById("userMenuButton");

  if (usernameDisplay) usernameDisplay.textContent = getCurrentUserName();
  if (avatar) avatar.textContent = getCurrentUserName().charAt(0).toUpperCase();

  if (dropdown) {
    dropdown.innerHTML = `
      <a class="dropdown-link" href="dashboard.html">Volver a la portada</a>
      <button class="dropdown-item logout-item" id="logoutButton" type="button">Cerrar sesion</button>
    `;
  }

  if (button && dropdown) {
    button.addEventListener("click", () => {
      const expanded = dropdown.classList.toggle("show");
      button.setAttribute("aria-expanded", String(expanded));
    });

    document.addEventListener("click", (event) => {
      const userMenu = document.getElementById("userMenu");
      if (userMenu && !userMenu.contains(event.target)) {
        dropdown.classList.remove("show");
        button.setAttribute("aria-expanded", "false");
      }
    });
  }

  document.addEventListener("click", (event) => {
    const logoutButton = event.target.closest("#logoutButton");
    if (!logoutButton) return;
    window.AuthHelper?.clearSession();
    window.location.href = "index.html";
  });
}

function initScrollTopButton() {
  if (document.getElementById("scrollTopButton")) {
    return;
  }

  const button = document.createElement("button");
  button.type = "button";
  button.id = "scrollTopButton";
  button.className = "scroll-top-button";
  button.setAttribute("aria-label", "Volver arriba");

  const updateVisibility = () => {
    button.classList.toggle("show", window.scrollY > 420);
  };

  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", updateVisibility, { passive: true });
  updateVisibility();
  document.body.appendChild(button);
}

function renderStats() {
  const entries = readEntries();
  const pendingRequests = readRequests().filter((request) => String(request.status || "pending").toLowerCase() === "pending");
  const statsStrip = document.getElementById("statsStrip");
  if (!statsStrip) return;

  statsStrip.innerHTML = `
    <article>
      <strong>${entries.length}</strong>
      <span>Entradas publicadas</span>
    </article>
    <article>
      <strong>${pendingRequests.length}</strong>
      <span>Solicitudes pendientes</span>
    </article>
    <article>
      <strong>${roleLabel(getCurrentRole())}</strong>
      <span>Rol actual</span>
    </article>
  `;
}

function populatePageSelect() {
  const select = document.getElementById("adminPageKey");
  if (!select) return;
  select.innerHTML = PAGE_OPTIONS.map((page) => `<option value="${page.key}">${page.label}</option>`).join("");
}

function renderContentList() {
  const container = document.getElementById("adminContentList");
  if (!container) return;

  const entries = readEntries().sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));

  if (!entries.length) {
    container.innerHTML = `
      <div class="empty-community">
        <strong>No hay contenido adicional todavia</strong>
        <span>Usa el formulario superior para crear la primera entrada publica.</span>
      </div>
    `;
    return;
  }

  container.innerHTML = entries.map((entry) => `
    <article class="admin-item">
      <div class="admin-item-head">
        <div>
          <h3>${escapeHTML(entry.title)}</h3>
          <p class="admin-item-meta">${escapeHTML(pageLabel(entry.pageKey))} - escrito por ${escapeHTML(entry.authorName)} - ${escapeHTML(entry.authorRoleLabel)} - ${formatDateTime(entry.updatedAt || entry.createdAt)}</p>
        </div>
        <div class="admin-item-actions">
          <button class="button-link secondary" type="button" data-edit-entry="${entry.id}">Editar</button>
          ${canDeleteContent() ? `<button class="button-link danger" type="button" data-delete-entry="${entry.id}">Borrar</button>` : ""}
        </div>
      </div>
      <div class="entry-body">${escapeHTML(entry.body).replaceAll("\n", "<br>")}</div>
    </article>
  `).join("");
}

function requestStatusLabel(status) {
  const labels = {
    pending: "Pendiente",
    reviewed: "Revisada"
  };
  return labels[String(status || "pending").toLowerCase()] || "Pendiente";
}

function renderRequests() {
  const container = document.getElementById("adminRequestsList");
  if (!container) return;

  const requests = readRequests().sort((a, b) => {
    const statusOrder = String(a.status || "pending").localeCompare(String(b.status || "pending"));
    if (statusOrder !== 0) {
      return statusOrder;
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  if (!requests.length) {
    container.innerHTML = `
      <div class="empty-community">
        <strong>No hay solicitudes todavia</strong>
        <span>Cuando un usuario normal mande una propuesta desde una pagina, aparecera aqui para revisarla.</span>
      </div>
    `;
    return;
  }

  container.innerHTML = requests.map((request) => {
    const status = String(request.status || "pending").toLowerCase();
    const isPending = status !== "reviewed";
    return `
      <article class="admin-item">
        <div class="admin-item-head">
          <div>
            <h3>${escapeHTML(request.title)}</h3>
            <p class="admin-item-meta">${escapeHTML(pageLabel(request.pageKey))} - ${escapeHTML(request.senderName)} - ${escapeHTML(request.senderEmail)} - ${formatDateTime(request.createdAt)}</p>
          </div>
          <span class="request-status request-status-${escapeHTML(status)}">${escapeHTML(requestStatusLabel(status))}</span>
        </div>
        <div class="entry-body">${escapeHTML(request.body).replaceAll("\n", "<br>")}</div>
        <div class="admin-item-actions">
          <button class="button-link secondary" type="button" data-toggle-request="${request.id}" data-next-status="${isPending ? "reviewed" : "pending"}">${isPending ? "Marcar revisada" : "Volver a pendiente"}</button>
          <button class="button-link danger" type="button" data-delete-request="${request.id}">Borrar solicitud</button>
        </div>
      </article>
    `;
  }).join("");
}

function renderUsers() {
  const container = document.getElementById("adminUsersList");
  if (!container) return;

  const users = window.AuthHelper?.listUsers() || [];

  if (getCurrentRole() !== "admin") {
    container.innerHTML = `
      <div class="empty-community">
        <strong>Panel de usuarios restringido</strong>
        <span>El usuario editor puede trabajar el contenido, pero no puede borrar usuarios ni cambiar roles.</span>
      </div>
    `;
    return;
  }

  container.innerHTML = users.map((user) => `
    <article class="admin-item">
      <div class="admin-item-head">
        <div>
          <h3>${escapeHTML(user.username)}</h3>
          <p class="admin-item-meta">${escapeHTML(user.email)} - alta ${formatDateTime(user.createdAt)}</p>
        </div>
        <span class="admin-role-pill">${escapeHTML(roleLabel(user.role))}</span>
      </div>
      <div class="admin-item-actions">
        <select class="field-select" data-role-user="${user.id}">
          <option value="user" ${user.role === "user" ? "selected" : ""}>Usuario</option>
          <option value="editor" ${user.role === "editor" ? "selected" : ""}>Usuario editor</option>
          <option value="admin" ${user.role === "admin" ? "selected" : ""}>Administrador</option>
        </select>
        <button class="button-link secondary" type="button" data-save-role="${user.id}">Guardar rol</button>
        <button class="button-link danger" type="button" data-delete-user="${user.id}">Borrar usuario</button>
      </div>
    </article>
  `).join("");
}

function pageLabel(pageKey) {
  return PAGE_OPTIONS.find((page) => page.key === pageKey)?.label || pageKey;
}

function resetForm() {
  const form = document.getElementById("adminContentForm");
  if (!form) return;
  form.reset();
  document.getElementById("adminEntryId").value = "";
  document.getElementById("adminCancelButton").hidden = true;
  document.getElementById("adminSaveButton").textContent = "Guardar contenido";
  populatePageSelect();
}

function initContentForm() {
  const form = document.getElementById("adminContentForm");
  const cancelButton = document.getElementById("adminCancelButton");
  const contentList = document.getElementById("adminContentList");

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const id = document.getElementById("adminEntryId").value;
    const pageKey = document.getElementById("adminPageKey").value;
    const title = document.getElementById("adminEntryTitle").value.trim();
    const body = document.getElementById("adminEntryBody").value.trim();
    const existing = readEntries().find((entry) => String(entry.id) === String(id));

    if (!pageKey || !title || !body) return;

    const entry = {
      id: id || (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now())),
      pageKey,
      title,
      body,
      authorName: existing ? existing.authorName : getCurrentUserName(),
      authorEmail: existing ? existing.authorEmail : getCurrentUserEmail(),
      authorRole: existing ? existing.authorRole : getCurrentRole(),
      authorRoleLabel: existing ? existing.authorRoleLabel : roleLabel(getCurrentRole()),
      createdAt: existing ? existing.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const savedEntry = await persistEntry(entry);
    replaceEntry(entry.id, savedEntry);
    resetForm();
    renderStats();
    renderContentList();
  });

  cancelButton?.addEventListener("click", resetForm);

  contentList?.addEventListener("click", async (event) => {
    const editButton = event.target.closest("[data-edit-entry]");
    const deleteButton = event.target.closest("[data-delete-entry]");

    if (editButton) {
      const entry = readEntries().find((item) => String(item.id) === String(editButton.dataset.editEntry));
      if (!entry) return;

      document.getElementById("adminEntryId").value = entry.id;
      document.getElementById("adminPageKey").value = entry.pageKey;
      document.getElementById("adminEntryTitle").value = entry.title;
      document.getElementById("adminEntryBody").value = entry.body;
      document.getElementById("adminCancelButton").hidden = false;
      document.getElementById("adminSaveButton").textContent = "Actualizar contenido";
      form.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    if (deleteButton && canDeleteContent()) {
      await removeEntryRemote(deleteButton.dataset.deleteEntry);
      deleteEntry(deleteButton.dataset.deleteEntry);
      renderStats();
      renderContentList();
      resetForm();
    }
  });
}

function initUsersPanel() {
  const usersList = document.getElementById("adminUsersList");
  if (!usersList) return;

  usersList.addEventListener("click", (event) => {
    const saveRoleButton = event.target.closest("[data-save-role]");
    const deleteUserButton = event.target.closest("[data-delete-user]");

    if (saveRoleButton && getCurrentRole() === "admin") {
      const userId = saveRoleButton.dataset.saveRole;
      const roleSelect = usersList.querySelector(`[data-role-user="${userId}"]`);
      const result = window.AuthHelper?.updateUserRole(userId, roleSelect?.value || "user");
      if (!result?.ok) {
        alert(result?.mensaje || "No se pudo actualizar el rol.");
        return;
      }
      renderStats();
      renderUsers();
    }

    if (deleteUserButton && getCurrentRole() === "admin") {
      const result = window.AuthHelper?.deleteUser(deleteUserButton.dataset.deleteUser);
      if (!result?.ok) {
        alert(result?.mensaje || "No se pudo borrar el usuario.");
        return;
      }
      renderStats();
      renderUsers();
    }
  });
}

function initRequestsPanel() {
  const requestsList = document.getElementById("adminRequestsList");
  if (!requestsList) return;

  requestsList.addEventListener("click", async (event) => {
    const toggleButton = event.target.closest("[data-toggle-request]");
    const deleteButton = event.target.closest("[data-delete-request]");

    if (toggleButton) {
      await persistRequestStatus(toggleButton.dataset.toggleRequest, toggleButton.dataset.nextStatus || "reviewed");
      updateRequestStatus(toggleButton.dataset.toggleRequest, toggleButton.dataset.nextStatus || "reviewed");
      renderStats();
      renderRequests();
    }

    if (deleteButton) {
      await removeRequestRemote(deleteButton.dataset.deleteRequest);
      deleteRequest(deleteButton.dataset.deleteRequest);
      renderStats();
      renderRequests();
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  if (!ensureAccess()) {
    return;
  }

  await syncAdminStateFromServer();
  injectSiteFooter();
  renderHeader();
  initScrollTopButton();
  populatePageSelect();
  renderStats();
  renderContentList();
  renderRequests();
  renderUsers();
  initContentForm();
  initRequestsPanel();
  initUsersPanel();
});
