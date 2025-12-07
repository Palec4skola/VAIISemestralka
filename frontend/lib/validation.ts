// src/lib/validation.ts

export function validateEmail(email: string): string | null {
  const trimmed = email.trim();
  if (!trimmed) return "Email je povinný";

  const re = /^[\w-.]+@[\w-]+\.[a-zA-Z]{2,}$/;
  if (!re.test(trimmed)) return "Zadaj platný email";

  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return "Heslo je povinné";

  if (password.length < 6) return "Heslo musí mať aspoň 6 znakov";
  if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    return "Heslo musí obsahovať veľké písmeno a číslo";
  }

  return null;
}

export function validateConfirmPassword(
  password: string,
  confirmPassword: string
): string | null {
  if (!confirmPassword) return "Potvrdenie hesla je povinné";
  if (password !== confirmPassword) return "Heslá sa nezhodujú";
  return null;
}

export function validateRequiredName(name: string): string | null {
  if (!name.trim()) return "Meno je povinné";
  return null;
}
export function validateRequiredTeamName(name: string): string | null {
  if (!name.trim()) return "Názov tímu je povinný";
  return null;
}
export function validateRequiredDescription(description: string): string | null {
  if (!description.trim()) return "Popis tímu je povinný";
  return null;
}
export function validateRequiredCountry(country: string): string | null {
  if (!country.trim()) return "Krajina je povinná";
  return null;
}
