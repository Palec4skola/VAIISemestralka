const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  const data = await res.json();
  localStorage.setItem("token", data.token);
}


export async function register(name: string, email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Registrácia zlyhala");
  }

  return res.json();
}
export function logout() {
  localStorage.removeItem("token");
}
