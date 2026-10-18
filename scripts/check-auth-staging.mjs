import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { parseEnv } from 'node:util'

export function parseAuthConfig(rawEnvText) {
  let env
  try {
    env = parseEnv(rawEnvText)
  } catch {
    throw new Error('Invalid staging configuration file.')
  }
  const url = env.SUPABASE_URL
  const publishableKey = env.SUPABASE_PUBLISHABLE_KEY
  if (!/^https:\/\/[a-z0-9]{20}\.supabase\.co\/?$/.test(url ?? '')) {
    throw new Error('Staging requires an HTTPS Supabase project root URL.')
  }
  if (!/^sb_publishable_[A-Za-z0-9_-]+$/.test(publishableKey ?? '')) {
    throw new Error('Staging requires a publishable API key.')
  }
  return Object.freeze({ url: new URL(url).origin, publishableKey })
}

export async function checkAuthSettings(config, fetchImpl = fetch) {
  let response
  try {
    response = await fetchImpl(`${config.url}/auth/v1/settings`, {
      method: 'GET',
      headers: { apikey: config.publishableKey },
      redirect: 'error',
      signal: AbortSignal.timeout(15_000),
    })
  } catch {
    throw new Error('Unable to read staging Auth settings. Check network access.')
  }
  if (!response.ok) {
    throw new Error(`Staging Auth settings request failed (HTTP ${response.status}).`)
  }
  let settings
  try {
    settings = await response.json()
  } catch {
    throw new Error('Staging Auth settings returned invalid JSON.')
  }
  if (!settings || typeof settings !== 'object' || Array.isArray(settings)) {
    throw new Error('Staging Auth settings returned an unexpected response.')
  }
  const booleanOrUnknown = (value) => typeof value === 'boolean' ? value : null
  const invertOrUnknown = (value) => typeof value === 'boolean' ? !value : null
  return Object.freeze({
    url: config.url,
    httpStatus: response.status,
    emailEnabled: booleanOrUnknown(settings.external?.email),
    googleEnabled: booleanOrUnknown(settings.external?.google),
    signupEnabled: invertOrUnknown(settings.disable_signup),
    emailConfirmationRequired: invertOrUnknown(settings.mailer_autoconfirm),
  })
}

async function main() {
  if (process.argv.length !== 2) {
    throw new Error('This check accepts no arguments and reads .env.staging.local.')
  }
  let rawEnvText
  try {
    rawEnvText = await readFile('.env.staging.local', 'utf8')
  } catch {
    throw new Error('Unable to read .env.staging.local. Create the local staging configuration first.')
  }
  const report = await checkAuthSettings(parseAuthConfig(rawEnvText))
  console.log(JSON.stringify(report, null, 2))
  console.log('Read-only Auth settings check. Login, email delivery and database access policies have not been tested.')
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
}
