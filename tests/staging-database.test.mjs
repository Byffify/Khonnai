import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { X509Certificate } from 'node:crypto'
import { parseDatabaseConfig } from '../scripts/staging-database.mjs'

const pooler = 'postgresql://postgres.brwkigtdecywivcfijvq:p%40ss@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres'
const parse = uri => parseDatabaseConfig(`SUPABASE_MIGRATION_DATABASE_URL="${uri}"`)

test('database config accepts only approved staging routes and verifies TLS', () => {
  const config = parse(pooler)
  assert.equal(config.password, 'p@ss')
  assert.equal(config.ssl.rejectUnauthorized, true)
  assert.equal(config.connectionTimeoutMillis, 15_000)
  assert.equal(config.statement_timeout, 30_000)
  assert.equal(parse('postgres://postgres:example@db.brwkigtdecywivcfijvq.supabase.co:5432/postgres').database, 'postgres')
})

test('database config rejects unrelated projects, non-session pooling and TLS overrides', () => {
  for (const uri of [
    pooler.replace('brwkigtdecywivcfijvq', 'anotherproject'),
    pooler.replace('5432', '6543'),
    pooler.replace('pooler.supabase.com', 'pooler.supabase.com.attacker.invalid'),
    pooler + '?sslmode=disable',
    pooler + '#ignored',
    pooler.replace('/postgres', '/other_database'),
    pooler.replace('postgresql:', 'https:'),
    pooler.replace('p%40ss', ''),
  ]) assert.throws(() => parse(uri), /Expected the approved staging project/)
})

test('database config errors never echo the supplied URI or password', () => {
  const marker = 'TEST_PASSWORD_MUST_NOT_APPEAR'
  assert.throws(() => parse(`postgres://user:${marker}@host.invalid/db`), error => {
    assert.equal(error.message.includes(marker), false)
    assert.equal(error.message.includes('host.invalid'), false)
    return true
  })
  assert.throws(() => parse('invalid'), /Invalid staging database URI/)
})

test('bundled public Supabase trust anchor is a valid self-signed CA', async () => {
  const pem = await readFile(new URL('../supabase/certs/prod-ca-2021.crt', import.meta.url), 'utf8')
  const certificate = new X509Certificate(pem)
  assert.equal(certificate.ca, true)
  assert.equal(certificate.verify(certificate.publicKey), true)
  assert.match(certificate.subject, /Supabase Root 2021 CA/)
  assert.ok(Date.parse(certificate.validTo) > Date.now())
})
