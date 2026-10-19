import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createServer, request as httpRequest } from 'node:http'
import { once } from 'node:events'
import { randomBytes } from 'node:crypto'
import { createAuthHandler } from '../server/auth-http.ts'

async function harness(t) {
  const sessionId=randomBytes(32).toString('base64url'), csrf=randomBytes(32).toString('base64url')
  let signedIn=false, logins=0, limited=false, broken=false, authOutage=false, authChecks=0
  const provider={signIn:async()=>{logins++;return {userId:'account-a',accessToken:'NEVER_SEND_PROVIDER_TOKEN'}},signUp:async()=>{},recover:async()=>{}}
  const sessions={create:async()=>{signedIn=true;return{sessionId,csrfToken:csrf}},authenticate:async id=>{authChecks++;if(!signedIn)return null;if(authOutage)throw Error('Provider unavailable');return id===sessionId?{userId:'account-a',email:'shop@example.com',csrfToken:csrf}:null},revoke:async()=>{signedIn=false},changePassword:async()=>{signedIn=false}}
  const server=createServer(createAuthHandler({origin:'http://127.0.0.1:5293',provider,sessions,accounts:{provision:async()=>{}},rateLimit:async()=>{if(broken)throw Error('secret-connection-string');return !limited}}))
  server.listen(0,'127.0.0.1');await once(server,'listening')
  t.after(()=>new Promise(resolve=>server.close(resolve)))
  const base=`http://127.0.0.1:${server.address().port}`
  async function request(path,options={}) {
    return new Promise((resolve,reject)=>{
      const req=httpRequest(base+path,{method:options.method??'GET',headers:{host:'127.0.0.1:5293',origin:'http://127.0.0.1:5293',...options.headers}},res=>{
        const chunks=[]
        res.on('data',chunk=>chunks.push(chunk))
        res.on('end',()=>{
          const headers=new Headers()
          for(let i=0;i<res.rawHeaders.length;i+=2)headers.append(res.rawHeaders[i],res.rawHeaders[i+1])
          resolve(new Response(Buffer.concat(chunks),{status:res.statusCode,headers}))
        })
        res.on('error',reject)
      })
      req.on('error',reject)
      req.end(options.body)
    })
  }
  const bootstrap=await request('/api/auth/csrf')
  const bootstrapCookie=bootstrap.headers.getSetCookie()[0].split(';')[0]
  const bootstrapCsrf=(await bootstrap.json()).csrfToken
  const post=(path,data,headers={})=>request(path,{method:'POST',headers:{'content-type':'application/json','x-khonnai-csrf':bootstrapCsrf,cookie:bootstrapCookie,...headers},body:JSON.stringify(data)})
  return{request,post,sessionId,csrf,bootstrapCookie,get logins(){return logins},get authChecks(){return authChecks},providerOutage(){authOutage=true},limit(){limited=true},breakLimiter(){broken=true}}
}

test('Auth HTTP rejects missing or cross-origin CSRF before provider login',async t=>{
  const h=await harness(t)
  for(const headers of [{'x-khonnai-csrf':''},{origin:'https://attacker.invalid'},{host:'attacker.invalid'},{'sec-fetch-site':'cross-site'}]){
    const r=await h.post('/api/auth/login',{email:'shop@example.com',password:'secret'},headers)
    assert.equal(r.status,403);assert.equal((await r.json()).error,'CSRF')
  }
  assert.equal(h.logins,0)
})

test('Auth HTTP returns only an opaque HttpOnly cookie, keeps session uncached, and rejects logout replay',async t=>{
  const h=await harness(t)
  const r=await h.post('/api/auth/login',{email:'shop@example.com',password:'secret'})
  assert.equal(r.status,200)
  assert.doesNotMatch(await r.text(),/NEVER_SEND_PROVIDER_TOKEN/)
  const cookie=r.headers.getSetCookie()[0]
  assert.match(cookie,/HttpOnly/);assert.match(cookie,/SameSite=Lax/);assert.match(cookie,/Path=\//)
  const authenticatedCookie=cookie.split(';')[0]
  const state=await h.request('/api/auth/session',{headers:{cookie:authenticatedCookie}})
  assert.match(state.headers.get('cache-control'),/no-store/)
  assert.deepEqual((await state.json()).user,{id:'account-a',email:'shop@example.com'})
  assert.equal((await h.post('/api/auth/logout',{}, {cookie:authenticatedCookie,'x-khonnai-csrf':'invalid'})).status,403)
  const logout=await h.post('/api/auth/logout',{}, {cookie:`${authenticatedCookie}; ${h.bootstrapCookie}`})
  assert.equal(logout.status,200)
  assert.match(logout.headers.getSetCookie()[0],/Max-Age=0/)
  assert.equal((await(await h.request('/api/auth/session',{headers:{cookie:authenticatedCookie}})).json()).user,null)
})

test('Auth HTTP validates all four new-password rules and requires JSON requests',async t=>{
  const h=await harness(t)
  for(const [password,confirmation] of [['short1','short1'],['12345678','12345678'],['abcdefgh','abcdefgh'],['Correct123','Different123']]){
    assert.equal((await h.post('/api/auth/signup',{email:'shop@example.com',password,confirmation})).status,400)
  }
  assert.equal((await h.post('/api/auth/signup',{email:'shop@example.com',password:'Correct123',confirmation:'Correct123'})).status,202)
  assert.equal((await h.post('/api/auth/recover',{email:'shop@example.com'},{'content-type':'text/plain'})).status,415)
})

test('Auth HTTP fails closed when durable rate storage fails and never echoes errors',async t=>{
  const h=await harness(t)
  h.breakLimiter()
  const r=await h.post('/api/auth/login',{email:'shop@example.com',password:'secret'})
  assert.equal(r.status,503);assert.deepEqual(await r.json(),{error:'UNAVAILABLE'});assert.equal(h.logins,0)
})

test('Auth HTTP returns rate limit response without reaching provider',async t=>{
  const h=await harness(t);h.limit()
  assert.equal((await h.post('/api/auth/login',{email:'shop@example.com',password:'secret'})).status,429)
  assert.equal(h.logins,0)
})

test('Auth HTTP rejects an oversized JSON body without reaching provider',async t=>{
  const h=await harness(t)
  const response=await h.post('/api/auth/login',{email:'shop@example.com',password:'x'.repeat(9000)})
  assert.equal(response.status,413)
  assert.equal(h.logins,0)
})

test('Auth HTTP logout revokes locally without remote authentication during provider outage',async t=>{
  const h=await harness(t)
  const login=await h.post('/api/auth/login',{email:'shop@example.com',password:'secret'})
  const sessionCookie=login.headers.getSetCookie()[0].split(';')[0]
  h.providerOutage()
  const before=h.authChecks
  const logout=await h.post('/api/auth/logout',{}, {cookie:`${sessionCookie}; ${h.bootstrapCookie}`})
  assert.equal(logout.status,200)
  assert.match(logout.headers.getSetCookie()[0],/Max-Age=0/)
  assert.equal(h.authChecks,before)
  const state=await h.request('/api/auth/session',{headers:{cookie:sessionCookie}})
  assert.deepEqual(await state.json(),{user:null})
})
