export function parseEmail(raw: unknown): string | null {
  if (typeof raw !== 'string') return null
  const email = raw.trim()
  if (email.length > 254 || [...email].some((character) => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127)
    || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null
  return email
}

export function passwordChecks(password: string, confirmation: string) {
  return {
    length: [...password].length >= 8 && new TextEncoder().encode(password).length <= 1024,
    letter: /[A-Za-z]/.test(password),
    number: /[0-9]/.test(password),
    match: password.length > 0 && password === confirmation,
  }
}
