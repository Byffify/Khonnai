import { readFile, readdir } from 'node:fs/promises'
import { parseEnv } from 'node:util'
import { extname, join } from 'node:path'

const env = parseEnv(await readFile('.env.staging.local','utf8'))
const secrets = []
for (const [name,value] of Object.entries(env)) {
  if (!value || !/KEY|DATABASE_URL/.test(name)) continue
  secrets.push({name,value})
  if (/DATABASE_URL/.test(name)) {
    try { const password=decodeURIComponent(new URL(value).password);if(password.length>=12)secrets.push({name,value:password}) } catch { /* Invalid URI is checked by the connection boundary. */ }
  }
}
const matches=[]
let filesChecked=0
async function scan(dir) {
  for(const entry of await readdir(dir,{withFileTypes:true}).catch(()=>[])) {
    const path=join(dir,entry.name)
    if(entry.isDirectory()) { if(!['node_modules','.git'].includes(entry.name))await scan(path);continue }
    if(!['.ts','.tsx','.mjs','.cjs','.js','.json','.md','.html','.css'].includes(extname(path)))continue
    const text=await readFile(path,'utf8');filesChecked++
    for(const secret of secrets)if(text.includes(secret.value))matches.push({path,field:secret.name})
  }
}
for(const dir of ['src','server','scripts','docs','outputs/auth-staging','.scratch/supabase-auth','dist'])await scan(dir)
console.log(JSON.stringify({filesChecked,exposedValues:matches.length,matches},null,2))
if(matches.length)process.exitCode=1
