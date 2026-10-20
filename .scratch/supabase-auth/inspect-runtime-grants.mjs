import { openStagingDatabase } from '../../scripts/staging-database.mjs'
const db=await openStagingDatabase()
try{
  const r=await db.query("select has_schema_privilege('khonnai_vault_runtime','auth','usage') as vault_auth_usage,has_schema_privilege('postgres','auth','usage with grant option') as migration_can_grant_auth,has_column_privilege('khonnai_vault_runtime','auth.sessions','id','select') as vault_session_read,(select relrowsecurity from pg_class where oid='auth.sessions'::regclass) as provider_rls")
  console.log(JSON.stringify(r.rows))
}finally{await db.end()}
