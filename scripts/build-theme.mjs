import { readFileSync, writeFileSync } from 'node:fs'
const source = readFileSync(new URL('../DESIGN.md', import.meta.url), 'utf8').replace(/^\uFEFF/, '')
const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)
if (!frontmatter) throw new Error('DESIGN.md frontmatter missing')
let group = ''
const variables = new Map()
const groups = new Set(['colors', 'rounded', 'runtime', 'motion', 'receipt'])
for (const line of frontmatter[1].split(/\r?\n/)) {
  const section = line.match(/^([\w-]+):\s*$/)
  if (section) { group = section[1]; continue }
  if (/^\S/.test(line)) { group = ''; continue }
  if (!groups.has(group) || !line.trim()) continue
  const entry = line.match(/^  ([\w-]+):\s*(["'])(.+)\2\s*$/)
  if (!entry) throw new Error(`Unsupported token syntax: ${line}`)
  const prefix = group === 'receipt' ? 'receipt' : group === 'motion' ? 'ds-motion' : 'ds'
  const key = `--${prefix}-${entry[1]}`
  if (variables.has(key)) throw new Error(`Duplicate token ${key}`)
  variables.set(key, entry[3])
}
if (!variables.has('--ds-primary') || !variables.has('--receipt-font')) throw new Error('Required theme blocks missing')
const output = `/* Generated from DESIGN.md by scripts/build-theme.mjs. */\n:root {\n${[...variables].map(([key, value]) => `  ${key}: ${value};`).join('\n')}\n}\n`
const path = new URL('../src/styles/tokens.css', import.meta.url)
if (process.argv.includes('--check')) {
  if (readFileSync(path, 'utf8') !== output) throw new Error('Theme drift: run npm run theme:build')
  console.log(`Theme matches DESIGN.md (${variables.size} tokens)`)
} else { writeFileSync(path, output); console.log(`Generated ${variables.size} tokens from DESIGN.md`) }
