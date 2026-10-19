export type ProviderTokens = {
  accessToken: string
  refreshToken: string
  expiresAt: number
  userId: string
  providerSessionId: string
}

export type VerifiedUser = { id: string; email: string }

export interface AuthProvider {
  signIn(email: string, password: string): Promise<ProviderTokens>
  signUp(email: string, password: string, redirectTo: string): Promise<void>
  verifyEmail(tokenHash: string, type: 'signup' | 'recovery'): Promise<ProviderTokens>
  refresh(refreshToken: string): Promise<ProviderTokens>
  verifyAccess(accessToken: string): Promise<VerifiedUser>
  recover(email: string, redirectTo: string): Promise<void>
  updatePassword(accessToken: string, password: string): Promise<void>
  revoke(accessToken: string): Promise<void>
}

export type AuthenticatedSession = {
  userId: string
  email: string
  csrfToken: string
}

export interface SessionStore {
  create(tokens: ProviderTokens): Promise<{ sessionId: string; csrfToken: string }>
  authenticate(sessionId: string): Promise<AuthenticatedSession | null>
  revoke(sessionId: string): Promise<void>
  changePassword(sessionId: string, password: string): Promise<void>
}
