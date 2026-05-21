(function () {
  const LOCAL_USERS_STORAGE_KEY = "anime-local-users-v1";
  const AUTH_STORAGE_KEY = "anime-wiki-authenticated";
  const USERNAME_STORAGE_KEY = "anime-wiki-username";
  const USER_EMAIL_STORAGE_KEY = "anime-wiki-user-email";
  const USER_ROLE_STORAGE_KEY = "anime-wiki-user-role";
  const SITE_FAVICON_PATH = "Assets/img/logo-circle.png?v=1";

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
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

  function readUsers() {
    try {
      const raw = localStorage.getItem(LOCAL_USERS_STORAGE_KEY);
      const users = raw ? JSON.parse(raw) : [];
      return Array.isArray(users) ? users : [];
    } catch (error) {
      return [];
    }
  }

  function writeUsers(users) {
    localStorage.setItem(LOCAL_USERS_STORAGE_KEY, JSON.stringify(users));
  }

  function ensureSeedUsers() {
    const users = readUsers();
    const seeds = [
      {
        id: "seed-admin",
        username: "Administrador",
        email: "admin@anime.local",
        password: "admin123",
        role: "admin",
        createdAt: "2026-05-07T00:00:00.000Z"
      },
      {
        id: "seed-editor",
        username: "Editor",
        email: "editor@anime.local",
        password: "editor123",
        role: "editor",
        createdAt: "2026-05-07T00:00:00.000Z"
      }
    ];

    let changed = false;

    seeds.forEach((seed) => {
      const exists = users.some((user) => normalize(user.email) === normalize(seed.email));
      if (!exists) {
        users.push(seed);
        changed = true;
      }
    });

    if (changed) {
      writeUsers(users);
    }
  }

  function getCurrentUser() {
    const email = localStorage.getItem(USER_EMAIL_STORAGE_KEY);
    if (!email) return null;
    return findByEmail(email);
  }

  function findByLogin(login) {
    const key = normalize(login);
    return readUsers().find((user) =>
      normalize(user.username) === key || normalize(user.email) === key
    ) || null;
  }

  function findByEmail(email) {
    const key = normalize(email);
    return readUsers().find((user) => normalize(user.email) === key) || null;
  }

  function saveSession(user) {
    localStorage.setItem(AUTH_STORAGE_KEY, "true");
    localStorage.setItem(USERNAME_STORAGE_KEY, user.username || "Usuario");
    localStorage.setItem(USER_EMAIL_STORAGE_KEY, user.email || "");
    localStorage.setItem(USER_ROLE_STORAGE_KEY, String(user.role || "user").toLowerCase());
  }

  function clearSession() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(USERNAME_STORAGE_KEY);
    localStorage.removeItem(USER_EMAIL_STORAGE_KEY);
    localStorage.removeItem(USER_ROLE_STORAGE_KEY);
  }

  function upsertUser(data) {
    const users = readUsers();
    const index = users.findIndex((user) => normalize(user.email) === normalize(data.email));
    const nextUser = {
      id: data.id || (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now())),
      username: String(data.username || "").trim(),
      email: String(data.email || "").trim().toLowerCase(),
      password: String(data.password || ""),
      role: String(data.role || "user").toLowerCase(),
      createdAt: data.createdAt || new Date().toISOString()
    };

    if (index >= 0) {
      users[index] = { ...users[index], ...nextUser };
    } else {
      users.push(nextUser);
    }

    writeUsers(users);
    return nextUser;
  }

  function registerLocalUser(data) {
    const username = String(data.username || "").trim();
    const email = String(data.email || "").trim().toLowerCase();
    const password = String(data.password || "");

    if (!username || !email || !password) {
      return { ok: false, mensaje: "Completa todos los campos." };
    }

    const users = readUsers();
    const duplicate = users.find((user) =>
      normalize(user.email) === normalize(email) ||
      normalize(user.username) === normalize(username)
    );

    if (duplicate) {
      return { ok: false, mensaje: "Ese usuario o correo ya existe." };
    }

    const user = upsertUser({ username, email, password, role: "user" });
    return { ok: true, user };
  }

  function verifyLocalUser(login, password) {
    const user = findByLogin(login);

    if (!user || user.password !== String(password || "")) {
      return { ok: false, mensaje: "Usuario o contrasena incorrectos." };
    }

    return { ok: true, user };
  }

  function updatePassword(email, password) {
    const user = findByEmail(email);

    if (!user) {
      return { ok: false, mensaje: "No se encontro una cuenta con ese correo." };
    }

    const updatedUser = upsertUser({ ...user, password });
    return { ok: true, user: updatedUser };
  }

  function listUsers() {
    ensureSeedUsers();
    return readUsers()
      .slice()
      .sort((a, b) => String(a.username).localeCompare(String(b.username), "es"));
  }

  function updateUserRole(userId, role) {
    const safeRole = String(role || "user").toLowerCase();
    const users = readUsers();
    const index = users.findIndex((user) => String(user.id) === String(userId));

    if (index < 0) {
      return { ok: false, mensaje: "Usuario no encontrado." };
    }

    users[index] = { ...users[index], role: safeRole };
    writeUsers(users);

    const currentUser = getCurrentUser();
    if (currentUser && String(currentUser.id) === String(userId)) {
      saveSession(users[index]);
    }

    return { ok: true, user: users[index] };
  }

  function deleteUser(userId) {
    const users = readUsers();
    const target = users.find((user) => String(user.id) === String(userId));
    const currentUser = getCurrentUser();

    if (!target) {
      return { ok: false, mensaje: "Usuario no encontrado." };
    }

    if (currentUser && String(currentUser.id) === String(userId)) {
      return { ok: false, mensaje: "No puedes borrarte a ti mismo." };
    }

    const adminCount = users.filter((user) => String(user.role).toLowerCase() === "admin").length;

    if (String(target.role).toLowerCase() === "admin" && adminCount <= 1) {
      return { ok: false, mensaje: "Debe existir al menos un administrador." };
    }

    writeUsers(users.filter((user) => String(user.id) !== String(userId)));
    return { ok: true };
  }

  ensureSeedUsers();
  setSiteFavicon();

  window.AuthHelper = {
    clearSession,
    deleteUser,
    findByEmail,
    getCurrentUser,
    listUsers,
    registerLocalUser,
    saveSession,
    updatePassword,
    updateUserRole,
    upsertUser,
    verifyLocalUser
  };
})();
