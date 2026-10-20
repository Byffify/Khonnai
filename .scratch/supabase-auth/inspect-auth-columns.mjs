import { openStagingDatabase } from '../../scripts/staging-database.mjs'
const db = await openStagingDatabase()
try {
  const result = await db.query("select table_name,column_name,data_type,is_nullable,column_default from information_schema.columns where table_schema='auth' and table_name in ('users','identities') and (is_nullable='NO' or column_name in ('email_confirmed_at','encrypted_password','provider_id','provider','identity_data')) order by table_name,ordinal_position")
  console.log(JSON.stringify(result.rows))
} finally { await db.end() }
