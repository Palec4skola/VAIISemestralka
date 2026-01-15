export function getUserIdFromToken(): number | null {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));

    // ASP.NET často dáva id do "nameid" alebo do "sub"
    const raw = json.nameid ?? json.sub ?? json.id;
    const id = Number(raw);
    return Number.isFinite(id) ? id : null;
  } catch {
    return null;
  }
}
