const AUTH_STORAGE_KEY = "anime-wiki-authenticated";
const USERNAME_STORAGE_KEY = "anime-wiki-username";
const USER_EMAIL_STORAGE_KEY = "anime-wiki-user-email";
const USER_ROLE_STORAGE_KEY = "anime-wiki-user-role";
const CONTENT_STORAGE_KEY = "anime-page-content-v1";
const CONTENT_REQUESTS_STORAGE_KEY = "anime-page-requests-v1";
const SITE_FAVICON_PATH = "Assets/img/logo-circle.png?v=1";
const PAGE_AUDIO_CONFIGS = [
  {
    themeClass: "theme-one-piece",
    audioPath: "Assets/one-piece-theme.mp3?v=1",
    storageKey: "one-piece-audio-state-v1",
    audioId: "onePieceThemeAudio",
    buttonId: "onePieceAudioToggle",
    seriesName: "One Piece"
  },
  {
    themeClass: "theme-naruto",
    audioPath: "Assets/naruto-theme.mp3?v=1",
    storageKey: "naruto-audio-state-v1",
    audioId: "narutoThemeAudio",
    buttonId: "narutoAudioToggle",
    seriesName: "Naruto"
  },
  {
    themeClass: "theme-bleach",
    audioPath: "Assets/bleach-theme.mp3?v=1",
    storageKey: "bleach-audio-state-v1",
    audioId: "bleachThemeAudio",
    buttonId: "bleachAudioToggle",
    seriesName: "Bleach"
  }
];
const SERIES_ASIDE_VIDEO_CONFIGS = [
  {
    themeClass: "theme-one-piece",
    boxId: "onePieceVideoBox",
    heading: "Videos de One Piece",
    videos: [
      {
        title: "Hope Opening 20",
        path: "Assets/hope-opening-20.mp4"
      },
      {
        title: "El Sake de Binks",
        path: "Assets/el-sake-de-binks.mp4"
      },
      {
        title: "We Are! Opening 1",
        path: "Assets/we-are-opening-1.mp4"
      }
    ]
  },
  {
    themeClass: "theme-naruto",
    boxId: "narutoVideoBox",
    heading: "Videos de Naruto",
    videos: [
      {
        title: "Opening 16 Silhouette",
        path: "Assets/opening-16-silhouette.mp4"
      },
      {
        title: "Opening 6 Sign",
        path: "Assets/opening-6-sign.mp4"
      },
      {
        title: "Opening 3 Blue Bird",
        path: "Assets/opening-3-blue-bird.mp4"
      }
    ]
  },
  {
    themeClass: "theme-bleach",
    boxId: "bleachVideoBox",
    heading: "Videos de Bleach",
    videos: [
      {
        title: "NUMBER ONE",
        path: "Assets/number-one.mp4"
      },
      {
        title: "Opening 1 Asterisk",
        path: "Assets/opening-1-asterisk.mp4"
      },
      {
        title: "Opening 13 Ranbu no Melody",
        path: "Assets/opening-13-ranbu-no-melody.mp4"
      }
    ]
  }
];

function redirectToLogin() {
  window.location.href = "login.html";
}

function isAuthenticated() {
  return localStorage.getItem(AUTH_STORAGE_KEY) === "true";
}

function getCurrentRole() {
  return String(localStorage.getItem(USER_ROLE_STORAGE_KEY) || "user").toLowerCase();
}

function getCurrentUserName() {
  return localStorage.getItem(USERNAME_STORAGE_KEY) || "Invitado";
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

async function syncCommunityStateFromServer() {
  try {
    const [contentResponse, requestsResponse] = await Promise.all([
      fetch(`${getApiBase()}/api/content`),
      fetch(`${getApiBase()}/api/requests`)
    ]);

    if (contentResponse.ok) {
      const content = await safeJson(contentResponse);
      if (Array.isArray(content)) {
        saveContentEntries(content);
      }
    }

    if (requestsResponse.ok) {
      const requests = await safeJson(requestsResponse);
      if (Array.isArray(requests)) {
        saveContentRequests(requests);
      }
    }
  } catch (error) {
  }
}

async function persistContentEntry(entry) {
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
  }
  return entry;
}

async function removeContentEntryRemote(entryId) {
  try {
    await fetch(`${getApiBase()}/api/content?id=${encodeURIComponent(entryId)}`, {
      method: "DELETE"
    });
  } catch (error) {
  }
}

async function persistContentRequest(request) {
  try {
    const response = await fetch(`${getApiBase()}/api/requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request)
    });
    const saved = await safeJson(response);
    if (response.ok && saved && saved.id) {
      return saved;
    }
  } catch (error) {
  }
  return request;
}

function canManageContent() {
  return isAuthenticated() && ["admin", "editor"].includes(getCurrentRole());
}

function canDeleteContent() {
  return isAuthenticated() && getCurrentRole() === "admin";
}

function canSendContentRequests() {
  return isAuthenticated() && !canManageContent();
}

function ensurePageAccess() {
  if (document.body.dataset.page === "admin") {
    if (!isAuthenticated()) {
      redirectToLogin();
      return false;
    }

    if (!["admin", "editor"].includes(getCurrentRole())) {
      window.location.href = "dashboard.html";
      return false;
    }
  }

  return true;
}

function readContentEntries() {
  try {
    const raw = JSON.parse(localStorage.getItem(CONTENT_STORAGE_KEY) || "[]");
    return Array.isArray(raw) ? raw : [];
  } catch (error) {
    return [];
  }
}

function saveContentEntries(entries) {
  localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(entries));
}

function readContentRequests() {
  try {
    const raw = JSON.parse(localStorage.getItem(CONTENT_REQUESTS_STORAGE_KEY) || "[]");
    return Array.isArray(raw) ? raw : [];
  } catch (error) {
    return [];
  }
}

function saveContentRequests(requests) {
  localStorage.setItem(CONTENT_REQUESTS_STORAGE_KEY, JSON.stringify(requests));
}

function createContentRequest(request) {
  const requests = readContentRequests();
  requests.unshift(request);
  saveContentRequests(requests);
  return request;
}

function upsertContentEntry(entry) {
  const entries = readContentEntries();
  const index = entries.findIndex((item) => String(item.id) === String(entry.id));

  if (index >= 0) {
    entries[index] = entry;
  } else {
    entries.unshift(entry);
  }

  saveContentEntries(entries);
}

function deleteContentEntry(entryId) {
  saveContentEntries(readContentEntries().filter((entry) => String(entry.id) !== String(entryId)));
}

function replaceContentEntry(previousId, entry) {
  const entries = readContentEntries().filter((item) => String(item.id) !== String(previousId));
  const index = entries.findIndex((item) => String(item.id) === String(entry.id));

  if (index >= 0) {
    entries[index] = entry;
  } else {
    entries.unshift(entry);
  }

  saveContentEntries(entries);
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

function setSiteFavicon() {
  setFaviconLink("icon");
  setFaviconLink("shortcut icon");
}

function setFaviconLink(relValue) {
  let favicon = document.querySelector(`link[rel="${relValue}"]`);

  if (!favicon) {
    favicon = document.createElement("link");
    favicon.rel = relValue;
    document.head.appendChild(favicon);
  }

  favicon.type = "image/png";
  favicon.href = SITE_FAVICON_PATH;
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

function getActivePageAudioConfig() {
  return PAGE_AUDIO_CONFIGS.find((config) => document.body.classList.contains(config.themeClass)) || null;
}

function readPageAudioState(storageKey) {
  try {
    const raw = JSON.parse(localStorage.getItem(storageKey) || "{}");
    const currentTime = Number(raw.currentTime);

    return {
      isPlaying: raw.isPlaying === true,
      currentTime: Number.isFinite(currentTime) && currentTime > 0 ? currentTime : 0
    };
  } catch (error) {
    return { isPlaying: false, currentTime: 0 };
  }
}

function savePageAudioState(storageKey, state) {
  localStorage.setItem(storageKey, JSON.stringify({
    isPlaying: state.isPlaying === true,
    currentTime: Number.isFinite(state.currentTime) && state.currentTime > 0 ? state.currentTime : 0
  }));
}

function clearPageAudioState(storageKey) {
  localStorage.removeItem(storageKey);
}

function clearInactivePageAudioStates(activeConfig) {
  PAGE_AUDIO_CONFIGS.forEach((config) => {
    if (!activeConfig || config.storageKey !== activeConfig.storageKey) {
      clearPageAudioState(config.storageKey);
    }
  });
}

function injectSeriesAsideVideos() {
  if (document.body.dataset.page !== "detail") {
    return;
  }

  const activeConfig = SERIES_ASIDE_VIDEO_CONFIGS.find((config) => document.body.classList.contains(config.themeClass));
  const aside = document.querySelector(".detail-layout > aside.detail-stack");
  if (!activeConfig || !aside || document.getElementById(activeConfig.boxId)) {
    return;
  }

  const videoBox = document.createElement("div");
  videoBox.className = "note-box media-sidebar-box";
  videoBox.id = activeConfig.boxId;
  videoBox.innerHTML = `
    <strong>${escapeHTML(activeConfig.heading)}</strong>
    <div class="media-sidebar-list">
      ${activeConfig.videos.map((video) => `
        <figure class="media-sidebar-item">
          <video controls preload="metadata" playsinline>
            <source src="${video.path}" type="video/mp4">
            Tu navegador no puede reproducir este video.
          </video>
          <figcaption class="media-sidebar-caption">${escapeHTML(video.title)}</figcaption>
        </figure>
      `).join("")}
    </div>
  `;

  aside.prepend(videoBox);
}

function renderUserMenu() {
  const usernameDisplay = document.getElementById("usernameDisplay");
  const avatar = document.querySelector(".user-avatar");
  const dropdown = document.getElementById("userDropdown");
  const button = document.getElementById("userMenuButton");

  if (!usernameDisplay || !avatar || !dropdown || !button) {
    return;
  }

  if (isAuthenticated()) {
    const username = getCurrentUserName();
    usernameDisplay.textContent = username;
    avatar.textContent = username.charAt(0).toUpperCase();
    dropdown.innerHTML = `
      ${canManageContent() ? '<a class="dropdown-link" href="admin.html">Panel de contenido</a>' : ""}
      <button class="dropdown-item logout-item" id="logoutButton" type="button">Cerrar sesion</button>
    `;
  } else {
    usernameDisplay.textContent = "Invitado";
    avatar.textContent = "I";
    dropdown.innerHTML = `
      <a class="dropdown-link" href="login.html">Iniciar sesion</a>
      <a class="dropdown-link" href="register.html">Crear cuenta</a>
    `;
  }
}

function initUserMenu() {
  const userMenu = document.getElementById("userMenu");
  const button = document.getElementById("userMenuButton");
  const dropdown = document.getElementById("userDropdown");

  if (!userMenu || !button || !dropdown) {
    return;
  }

  button.addEventListener("click", () => {
    const expanded = dropdown.classList.toggle("show");
    button.setAttribute("aria-expanded", String(expanded));
  });

  document.addEventListener("click", (event) => {
    if (!userMenu.contains(event.target)) {
      dropdown.classList.remove("show");
      button.setAttribute("aria-expanded", "false");
    }
  });
}

function showOverlay(title, message, duration = 1800) {
  const overlay = document.createElement("div");
  overlay.className = "overlay-screen";
  overlay.innerHTML = `
    <div class="overlay-card">
      <strong>${escapeHTML(title)}</strong>
      <span>${escapeHTML(message)}</span>
    </div>
  `;

  document.body.appendChild(overlay);
  window.setTimeout(() => overlay.remove(), duration);
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

function initPageBackgroundParallax() {
  let isTicking = false;

  const updateBackgroundShift = () => {
    isTicking = false;
    const shift = Math.min(window.scrollY * 0.18, 120);
    document.documentElement.style.setProperty("--site-bg-shift", `${shift}px`);
  };

  const requestBackgroundUpdate = () => {
    if (isTicking) return;
    isTicking = true;
    window.requestAnimationFrame(updateBackgroundShift);
  };

  window.addEventListener("scroll", requestBackgroundUpdate, { passive: true });
  window.addEventListener("resize", requestBackgroundUpdate);
  requestBackgroundUpdate();
}

function initPageAudioToggle() {
  const activeConfig = getActivePageAudioConfig();

  if (!activeConfig) {
    clearInactivePageAudioStates(null);
    return;
  }

  clearInactivePageAudioStates(activeConfig);

  if (document.getElementById(activeConfig.buttonId)) {
    return;
  }

  const storedState = readPageAudioState(activeConfig.storageKey);
  const audio = document.createElement("audio");
  audio.id = activeConfig.audioId;
  audio.preload = "metadata";
  audio.loop = true;
  audio.src = activeConfig.audioPath;

  const button = document.createElement("button");
  button.type = "button";
  button.id = activeConfig.buttonId;
  button.className = "page-audio-toggle";
  button.setAttribute("aria-label", `Reproducir musica de ${activeConfig.seriesName}`);
  button.setAttribute("aria-pressed", "false");
  button.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 14a3 3 0 0 0 3-3V7a3 3 0 1 0-6 0v4a3 3 0 0 0 3 3Zm5-3a1 1 0 0 0-2 0 3 3 0 1 1-6 0 1 1 0 0 0-2 0 5 5 0 0 0 4 4.9V19H9a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2h-2v-3.1A5 5 0 0 0 17 11Z"></path>
    </svg>
    <span>Audio</span>
  `;

  const syncState = (isPlaying) => {
    button.classList.toggle("is-playing", isPlaying);
    button.setAttribute("aria-pressed", String(isPlaying));
    button.setAttribute("aria-label", isPlaying ? `Detener musica de ${activeConfig.seriesName}` : `Reproducir musica de ${activeConfig.seriesName}`);
  };

  const persistProgress = (isPlaying) => {
    savePageAudioState(activeConfig.storageKey, {
      isPlaying,
      currentTime: isPlaying ? audio.currentTime : 0
    });
  };

  const restorePlayback = async () => {
    if (!storedState.isPlaying) {
      return;
    }

    if (storedState.currentTime > 0) {
      const restoreTime = () => {
        audio.currentTime = storedState.currentTime;
      };

      if (audio.readyState >= 1) {
        restoreTime();
      } else {
        audio.addEventListener("loadedmetadata", restoreTime, { once: true });
      }
    }

    syncState(true);

    try {
      const playPromise = audio.play();
      if (playPromise) {
        await playPromise;
      }
    } catch (error) {
      syncState(false);
      persistProgress(false);
    }
  };

  button.addEventListener("click", async () => {
    if (!audio.paused) {
      audio.pause();
      audio.currentTime = 0;
      persistProgress(false);
      syncState(false);
      return;
    }

    syncState(true);

    try {
      const playPromise = audio.play();
      if (playPromise) {
        await playPromise;
      }
    } catch (error) {
      syncState(false);
      persistProgress(false);
      showOverlay("Audio no disponible", `No se pudo reproducir la musica de ${activeConfig.seriesName} en este momento.`, 1800);
    }
  });

  audio.addEventListener("play", () => {
    syncState(true);
    persistProgress(true);
  });

  audio.addEventListener("pause", () => {
    if (audio.currentTime === 0 || audio.ended) {
      syncState(false);
    }
  });

  audio.addEventListener("timeupdate", () => {
    if (!audio.paused) {
      persistProgress(true);
    }
  });

  window.addEventListener("pagehide", () => {
    if (!audio.paused) {
      persistProgress(true);
    }
  });

  document.body.append(audio, button);
  void restorePlayback();
}

function showWelcomeOnce() {
  if (!isAuthenticated() || document.body.dataset.page !== "home") {
    return;
  }

  if (sessionStorage.getItem("anime-welcome-shown") === "true") {
    return;
  }

  sessionStorage.setItem("anime-welcome-shown", "true");
  showOverlay("Bienvenido", `${getCurrentUserName()}, ya puedes explorar y participar en la wiki.`, 2200);
}

function initLogout() {
  document.addEventListener("click", (event) => {
    const logoutButton = event.target.closest("#logoutButton");
    if (!logoutButton) return;

    if (window.AuthHelper) {
      window.AuthHelper.clearSession();
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(USERNAME_STORAGE_KEY);
      localStorage.removeItem(USER_EMAIL_STORAGE_KEY);
      localStorage.removeItem(USER_ROLE_STORAGE_KEY);
    }

    sessionStorage.removeItem("anime-welcome-shown");
    showOverlay("Sesion cerrada", "Volviendo al inicio...", 1200);
    window.setTimeout(() => {
      window.location.href = "index.html";
    }, 1100);
  });
}

function getCommunityAnchor() {
  return (
    document.querySelector(".detail-layout") ||
    document.querySelector(".page-shell .section-block:last-of-type") ||
    document.querySelector(".series-hero") ||
    document.querySelector(".page-shell > *:last-child")
  );
}

function buildEditorMarkup() {
  return `
    <div class="content-editor" id="contentEditorBox">
      <form id="contentEntryForm" class="content-form">
        <input type="hidden" id="contentEntryId">
        <label class="field wide">
          <span>Titulo del contenido</span>
          <input id="contentEntryTitle" type="text" placeholder="Ejemplo: Curiosidades del apartado" required>
        </label>
        <label class="field wide">
          <span>Contenido</span>
          <textarea id="contentEntryBody" rows="6" placeholder="Escribe aqui el contenido que quieres publicar o modificar." required></textarea>
        </label>
        <div class="form-inline-actions">
          <button class="button-link primary" type="submit" id="contentSaveButton">Guardar contenido</button>
          <button class="button-link secondary" type="button" id="contentCancelButton" hidden>Cancelar edicion</button>
        </div>
      </form>
    </div>
  `;
}

function buildRequestMarkup(pageKey) {
  return `
    <div class="content-editor" id="requestEditorBox">
      <form id="contentRequestForm" class="content-form" data-page-key="${escapeHTML(pageKey)}">
        <label class="field wide">
          <span>Que te gustaria que se anadiera</span>
          <input id="contentRequestTitle" type="text" placeholder="Ejemplo: Personajes que faltan, curiosidades, tecnicas..." required>
        </label>
        <label class="field wide">
          <span>Mensaje para administrador y editor</span>
          <textarea id="contentRequestBody" rows="6" placeholder="Explica aqui tu idea o solicitud para esta pagina." required></textarea>
        </label>
        <div class="form-inline-actions">
          <button class="button-link primary" type="submit">Enviar solicitud</button>
        </div>
      </form>
    </div>
  `;
}

function buildContentManagerSection(pageKey) {
  const pageShell = document.querySelector(".page-shell");
  const anchor = getCommunityAnchor();

  if (!isAuthenticated() || !pageShell || !anchor || document.getElementById("communityContentSection")) {
    return;
  }

  const section = document.createElement("section");
  section.className = "detail-layout community-layout";
  section.id = "communityContentSection";
  if (canManageContent()) {
    section.innerHTML = `
      <article class="detail-panel community-panel">
        <div class="community-header">
          <div>
            <p class="eyebrow">Wiki abierta</p>
            <h2>Contenido de la comunidad</h2>
            <p class="community-copy">
              Esta pagina es publica. Todo el mundo puede leerla, y los usuarios con rol editor o administrador pueden anadir y modificar contenido.
            </p>
          </div>
        </div>
        ${buildEditorMarkup()}
        <div class="content-list" id="contentEntriesList"></div>
      </article>
      <aside class="detail-panel community-panel side-info">
        <div class="note-box">
          <strong>Permisos activos</strong>
          <ul>
            <li><strong>Administrador:</strong> puede meter, editar y borrar contenido, y tambien borrar usuarios desde el panel.</li>
            <li><strong>Usuario editor:</strong> puede meter y modificar contenido.</li>
            <li><strong>Solicitudes:</strong> las propuestas de usuarios registrados se revisan desde el panel de contenido.</li>
          </ul>
        </div>
        <ul class="meta-grid">
          <li>
            <strong>Visibilidad</strong>
            Este bloque solo aparece para editor y administrador.
          </li>
          <li>
            <strong>Autor</strong>
            Cada publicacion muestra quien la ha escrito y su fecha.
          </li>
          <li>
            <strong>Panel</strong>
            Puedes revisar tambien las solicitudes recibidas en el panel de contenido.
          </li>
        </ul>
      </aside>
    `;

    anchor.insertAdjacentElement("afterend", section);
    initContentEditor(pageKey);
    renderContentEntries(pageKey);
    return;
  }

  section.innerHTML = `
    <article class="detail-panel community-panel">
      <div class="community-header">
        <div>
          <p class="eyebrow">Contenido publicado</p>
          <h2>Aportes añadidos a esta pagina</h2>
          <p class="community-copy">
            Aqui aparece la informacion que el administrador o un usuario editor ya ha metido en esta seccion.
          </p>
        </div>
      </div>
      <div class="content-list" id="contentEntriesList"></div>
    </article>

    <article class="detail-panel community-panel">
      <div class="community-header">
        <div>
          <p class="eyebrow">Solicitudes</p>
          <h2>Enviar una idea para esta pagina</h2>
          <p class="community-copy">
            Como usuario registrado puedes mandar un mensaje al administrador y al editor con propuestas de contenido para esta pagina.
          </p>
        </div>
      </div>
      ${buildRequestMarkup(pageKey)}
      <div class="content-list" id="contentRequestsList"></div>
    </article>
    <aside class="detail-panel community-panel side-info">
      <div class="note-box">
        <strong>Como funciona</strong>
        <ul>
          <li><strong>Destino:</strong> tus mensajes van dirigidos al administrador y al usuario editor.</li>
          <li><strong>Uso:</strong> sirve para pedir personajes, curiosidades, secciones o correcciones.</li>
          <li><strong>Privacidad:</strong> este bloque solo aparece si has iniciado sesion.</li>
        </ul>
      </div>
      <ul class="meta-grid">
        <li>
          <strong>Pagina</strong>
          La solicitud queda vinculada a esta seccion concreta de la wiki.
        </li>
        <li>
          <strong>Estado</strong>
          Veras si sigue pendiente o si ya fue revisada.
        </li>
        <li>
          <strong>Cuenta</strong>
          Se envia con tu nombre de usuario y tu correo actual.
        </li>
      </ul>
    </aside>
  `;

  anchor.insertAdjacentElement("afterend", section);
  initContentRequestForm(pageKey);
  renderContentEntries(pageKey);
  renderContentRequests(pageKey);
}

function getPageKey() {
  return window.location.pathname.split("/").pop().replace(".html", "");
}

function renderContentEntries(pageKey) {
  const list = document.getElementById("contentEntriesList");
  if (!list) return;

  const entries = readContentEntries()
    .filter((entry) => entry.pageKey === pageKey)
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));

  if (!entries.length) {
    list.innerHTML = `
      <div class="empty-community">
        <strong>Aun no hay contenido extra en esta pagina</strong>
        <span>${canManageContent() ? "Puedes publicar el primer aporte desde el formulario superior." : "Cuando el administrador o un editor publique contenido para esta pagina, aparecera aqui."}</span>
      </div>
    `;
    return;
  }

  list.innerHTML = entries.map((entry) => `
    <article class="community-entry">
      <div class="community-entry-head">
        <div>
          <h3>${escapeHTML(entry.title)}</h3>
          <p class="entry-meta">Escrito por <strong>${escapeHTML(entry.authorName)}</strong> - ${escapeHTML(entry.authorRoleLabel)} - ${formatDateTime(entry.updatedAt || entry.createdAt)}</p>
        </div>
        ${canManageContent() ? `
          <div class="entry-actions">
            <button class="button-link secondary" type="button" data-edit-entry="${entry.id}">Editar</button>
            ${canDeleteContent() ? `<button class="button-link danger" type="button" data-delete-entry="${entry.id}">Borrar</button>` : ""}
          </div>
        ` : ""}
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

function renderContentRequests(pageKey) {
  const list = document.getElementById("contentRequestsList");
  if (!list || !canSendContentRequests()) return;

  const currentEmail = getCurrentUserEmail();
  const requests = readContentRequests()
    .filter((request) =>
      request.pageKey === pageKey &&
      String(request.senderEmail || "").toLowerCase() === String(currentEmail || "").toLowerCase()
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (!requests.length) {
    list.innerHTML = `
      <div class="empty-community">
        <strong>Aun no has enviado solicitudes en esta pagina</strong>
        <span>Usa el formulario superior para mandar una idea o una correccion al equipo editor.</span>
      </div>
    `;
    return;
  }

  list.innerHTML = requests.map((request) => `
    <article class="community-entry">
      <div class="community-entry-head">
        <div>
          <h3>${escapeHTML(request.title)}</h3>
          <p class="entry-meta">Enviado por <strong>${escapeHTML(request.senderName)}</strong> - ${formatDateTime(request.createdAt)}</p>
        </div>
        <span class="request-status request-status-${escapeHTML(request.status || "pending")}">${escapeHTML(requestStatusLabel(request.status))}</span>
      </div>
      <div class="entry-body">${escapeHTML(request.body).replaceAll("\n", "<br>")}</div>
    </article>
  `).join("");
}

function initContentEditor(pageKey) {
  const form = document.getElementById("contentEntryForm");
  const cancelButton = document.getElementById("contentCancelButton");
  const list = document.getElementById("contentEntriesList");

  if (!form || !list) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!canManageContent()) {
      return;
    }

    const id = document.getElementById("contentEntryId").value;
    const title = document.getElementById("contentEntryTitle").value.trim();
    const body = document.getElementById("contentEntryBody").value.trim();

    if (!title || !body) return;

    const role = getCurrentRole();
    const existing = readContentEntries().find((entry) => String(entry.id) === String(id));
    const entry = {
      id: id || (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now())),
      pageKey,
      title,
      body,
      authorName: existing ? existing.authorName : getCurrentUserName(),
      authorEmail: existing ? existing.authorEmail : getCurrentUserEmail(),
      authorRole: existing ? existing.authorRole : role,
      authorRoleLabel: existing ? existing.authorRoleLabel : roleLabel(role),
      createdAt: existing ? existing.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const savedEntry = await persistContentEntry(entry);
    replaceContentEntry(entry.id, savedEntry);
    resetContentForm();
    renderContentEntries(pageKey);
  });

  cancelButton?.addEventListener("click", resetContentForm);

  list.addEventListener("click", async (event) => {
    const editButton = event.target.closest("[data-edit-entry]");
    const deleteButton = event.target.closest("[data-delete-entry]");

    if (editButton && canManageContent()) {
      const entry = readContentEntries().find((item) => String(item.id) === String(editButton.dataset.editEntry));
      if (!entry) return;

      document.getElementById("contentEntryId").value = entry.id;
      document.getElementById("contentEntryTitle").value = entry.title;
      document.getElementById("contentEntryBody").value = entry.body;
      document.getElementById("contentCancelButton").hidden = false;
      document.getElementById("contentSaveButton").textContent = "Actualizar contenido";
      document.getElementById("contentEditorBox").scrollIntoView({ behavior: "smooth", block: "start" });
    }

    if (deleteButton && canDeleteContent()) {
      await removeContentEntryRemote(deleteButton.dataset.deleteEntry);
      deleteContentEntry(deleteButton.dataset.deleteEntry);
      renderContentEntries(pageKey);
      resetContentForm();
    }
  });
}

function initContentRequestForm(pageKey) {
  const form = document.getElementById("contentRequestForm");
  if (!form || !canSendContentRequests()) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = document.getElementById("contentRequestTitle").value.trim();
    const body = document.getElementById("contentRequestBody").value.trim();

    if (!title || !body) return;

    const request = createContentRequest({
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      pageKey,
      title,
      body,
      senderName: getCurrentUserName(),
      senderEmail: getCurrentUserEmail(),
      senderRole: getCurrentRole(),
      senderRoleLabel: roleLabel(getCurrentRole()),
      createdAt: new Date().toISOString(),
      status: "pending"
    });
    const savedRequest = await persistContentRequest(request);
    if (String(savedRequest.id) !== String(request.id)) {
      const requests = readContentRequests().filter((item) => String(item.id) !== String(request.id));
      requests.unshift(savedRequest);
      saveContentRequests(requests);
    }

    form.reset();
    renderContentRequests(pageKey);
    showOverlay("Solicitud enviada", "Tu mensaje ya esta disponible para administrador y editor.", 1800);
  });
}

function resetContentForm() {
  const form = document.getElementById("contentEntryForm");
  if (!form) return;
  form.reset();
  document.getElementById("contentEntryId").value = "";
  document.getElementById("contentCancelButton").hidden = true;
  document.getElementById("contentSaveButton").textContent = "Guardar contenido";
}

function roleLabel(role) {
  const labels = {
    admin: "Administrador",
    editor: "Usuario editor",
    user: "Usuario"
  };
  return labels[String(role || "user").toLowerCase()] || "Usuario";
}

document.addEventListener("DOMContentLoaded", async () => {
  if (!ensurePageAccess()) {
    return;
  }

  await syncCommunityStateFromServer();
  setSiteFavicon();
  injectSiteFooter();
  renderUserMenu();
  initUserMenu();
  initLogout();
  initPageBackgroundParallax();
  initScrollTopButton();
  injectSeriesAsideVideos();
  initPageAudioToggle();
  showWelcomeOnce();

  if (["detail", "series"].includes(document.body.dataset.page)) {
    buildContentManagerSection(getPageKey());
  }
});
