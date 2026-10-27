export type UserRole = "admin" | "student";

export interface PlacifyUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  department: string;
  registerNumber?: string;
  avatarLetter: string;
  token: string;
}

export const PRESET_ADMIN_USER: PlacifyUser = {
  id: 99,
  name: "Dr. K. Ramesh",
  email: "placement.officer@srishakthi.ac.in",
  role: "admin",
  title: "Head of Training & Placements",
  department: "Central Placement Cell",
  avatarLetter: "R",
  token: "placify_admin_token",
};

export const PRESET_STUDENT_USER: PlacifyUser = {
  id: 1,
  name: "Sindhuja Sankaramoorthy",
  email: "sindhujas24cs@srishakthi.ac.in",
  role: "student",
  title: "Final Year Student · CSE",
  department: "Computer Science & Engineering",
  registerNumber: "718122CS101",
  avatarLetter: "S",
  token: "placify_student_token",
};

const STORAGE_KEY = "placify_active_user";
const AUTH_EVENT = "placify_auth_changed";

export function getActiveUser(): PlacifyUser {
  if (typeof window === "undefined") {
    return PRESET_ADMIN_USER;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && (parsed.role === "admin" || parsed.role === "student")) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error reading active user:", e);
  }
  // Default to Admin for testing unless student is selected
  return PRESET_ADMIN_USER;
}

export function setActiveUser(user: PlacifyUser): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  localStorage.setItem("placify_auth_token", user.token);
  window.dispatchEvent(new CustomEvent(AUTH_EVENT, { detail: user }));
}

export function switchRole(role: UserRole): PlacifyUser {
  const newUser = role === "admin" ? PRESET_ADMIN_USER : PRESET_STUDENT_USER;
  setActiveUser(newUser);
  return newUser;
}

export function onAuthChange(callback: (user: PlacifyUser) => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (event: Event) => {
    const custom = event as CustomEvent<PlacifyUser>;
    callback(custom.detail || getActiveUser());
  };
  window.addEventListener(AUTH_EVENT, handler);
  window.addEventListener("storage", () => callback(getActiveUser()));
  return () => {
    window.removeEventListener(AUTH_EVENT, handler);
  };
}
