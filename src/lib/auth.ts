const USERS_KEY = "pawkost_users";
const SESSION_KEY = "pawkost_session";

export type Role = "user" | "admin";

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: Role;
  avatar?: string; // dataURL (base64) atau path string
  createdAt: string;
};

export type Session = {
  userId: string;
  email: string;
  role: Role;
};

const AUTH_EVENT = "pawkost:auth";

function emitAuthChange() {
  // untuk update komponen di tab yang sama
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function onAuthChange(handler: () => void) {
  window.addEventListener(AUTH_EVENT, handler);
  return () => window.removeEventListener(AUTH_EVENT, handler);
}

function safeJsonParse<T>(raw: string | null, fallback: T): T {
  try {
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function getUsersRaw(): User[] {
  return safeJsonParse<User[]>(localStorage.getItem(USERS_KEY), []);
}

function saveUsersRaw(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function migrateUsers(users: any[]): User[] {
  // upgrade user lama yang belum punya phone/avatar/role
  return (users || []).map((u) => ({
    id: String(u.id ?? Date.now()),
    name: String(u.name ?? "User"),
    email: String(u.email ?? "").trim(),
    phone: String(u.phone ?? ""),
    password: String(u.password ?? ""),
    role: (u.role === "admin" ? "admin" : "user") as Role,
    avatar: typeof u.avatar === "string" ? u.avatar : undefined,
    createdAt: String(u.createdAt ?? new Date().toISOString()),
  }));
}

function seedDefaultUsersIfEmpty() {
  const existing = getUsersRaw();
  if (existing.length > 0) {
    // migrate kalau data lama ada
    const migrated = migrateUsers(existing as any[]);
    saveUsersRaw(migrated);
    return;
  }

  const defaultUser: User = {
    id: "user-default-1",
    name: "Meyar",
    email: "meyar@gmail.com",
    phone: "08xxxxxxxxxx",
    password: "user1234",
    role: "user",
    createdAt: new Date().toISOString(),
  };

  const defaultAdmin: User = {
    id: "admin-default-1",
    name: "Admin",
    email: "admin@paw.com",
    phone: "-",
    password: "admin1234",
    role: "admin",
    createdAt: new Date().toISOString(),
  };

  saveUsersRaw([defaultUser, defaultAdmin]);
}

export function getUsers(): User[] {
  seedDefaultUsersIfEmpty();
  return getUsersRaw();
}

export function saveUsers(users: User[]) {
  saveUsersRaw(users);
  emitAuthChange(); // <-- penting biar navbar update juga
}

export function getSession(): Session | null {
  return safeJsonParse<Session | null>(localStorage.getItem(SESSION_KEY), null);
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
  emitAuthChange();
}

export function isLoggedIn() {
  return !!getSession();
}

export function getCurrentUser(): User | null {
  const session = getSession();
  if (!session?.userId) return null;
  const users = getUsers();
  return users.find((u) => u.id === session.userId) || null;
}

export function updateCurrentUser(
  patch: Partial<Pick<User, "name" | "phone" | "avatar">>
) {
  const session = getSession();
  if (!session?.userId) throw new Error("Belum login.");

  const users = getUsers();
  const idx = users.findIndex((u) => u.id === session.userId);
  if (idx < 0) throw new Error("User tidak ditemukan.");

  users[idx] = { ...users[idx], ...patch };
  saveUsersRaw(users);

  // trigger update UI di tab yang sama
  emitAuthChange();

  return users[idx];
}

export function signup(args: {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: Role;
}): User {
  const { name, email, phone, password } = args;
  const role: Role = args.role || "user";

  const users = getUsers();
  const exists = users.some(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
  if (exists) throw new Error("Email sudah terdaftar.");

  const newUser: User = {
    id: String(Date.now()),
    name: name.trim(),
    email: email.trim(),
    phone: (phone || "").trim(),
    password,
    role,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsersRaw(users);

  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    })
  );

  emitAuthChange();
  return newUser;
}

export function login(args: { email: string; password: string }): User {
  const { email, password } = args;

  const users = getUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) throw new Error("Email tidak ditemukan.");
  if (user.password !== password) throw new Error("Password salah.");

  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ userId: user.id, email: user.email, role: user.role })
  );

  emitAuthChange();
  return user;
}