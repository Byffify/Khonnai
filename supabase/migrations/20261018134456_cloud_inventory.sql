-- All shop data remains behind the verified BFF and private-schema RLS.
-- Photos retain the existing data URL format (4.5 MB complete-state limit).
-- No existing account, local storage, shop, or bill is cleared by this migration.
alter table khonnai_app.shops add column phone text not null default '' check (char_length(phone)<=120);
-- Empty shops use the same initial form values as emptyState().
alter table khonnai_app.shops drop constraint shops_name_check;
alter table khonnai_app.shops add constraint shops_name_check check(char_length(name)<=160);

create table khonnai_app.products (
  shop_id uuid not null references khonnai_app.shops(id),
  id text not null check(char_length(id) between 1 and 160),
  position integer not null check(position>=0),
  code text not null check(char_length(btrim(code)) between 1 and 160),
  unit text not null check(char_length(btrim(unit)) between 1 and 120),
  photo text not null default '' check(octet_length(photo)<=4500000),
  primary key(shop_id,id)
);
create unique index products_code_unique on khonnai_app.products(shop_id,lower(code));
create table khonnai_app.variants (
  shop_id uuid not null,
  id text not null check(char_length(id) between 1 and 160),
  position integer not null check(position>=0),
  product_id text not null,
  size text not null check(char_length(btrim(size)) between 1 and 120),
  color text not null check(char_length(btrim(color)) between 1 and 120),
  contents text not null check(char_length(contents)<=1000),
  price bigint not null check(price between 0 and 9007199254740991),
  stock bigint not null check(stock between 0 and 9007199254740991),
  primary key(shop_id,id),
  foreign key(shop_id,product_id) references khonnai_app.products(shop_id,id)
);
create index variants_product_idx on khonnai_app.variants(shop_id,product_id);
create unique index variants_options_unique on khonnai_app.variants(shop_id,product_id,lower(size),lower(color));

create table khonnai_app.bills (
  shop_id uuid not null references khonnai_app.shops(id),
  id text not null check(char_length(id) between 1 and 170),
  position integer not null check(position>=0),
  number text not null,
  customer text not null check(char_length(customer)<=1000),
  date text not null,
  status text not null check(status in ('active','cancelled')),
  version bigint not null check(version between 0 and 9007199254740991),
  history text[] not null,
  primary key(shop_id,id), unique(shop_id,number)
);
create table khonnai_app.reservations (
  shop_id uuid not null references khonnai_app.shops(id),
  id text not null check(char_length(id) between 1 and 160),
  position integer not null check(position>=0),
  customer text not null check(char_length(customer)<=1000),
  status text not null check(status in ('active','cancelled','sold')),
  primary key(shop_id,id)
);
create table khonnai_app.returns (
  shop_id uuid not null references khonnai_app.shops(id),
  id text not null check(char_length(id) between 1 and 160),
  position integer not null check(position>=0),
  bill_id text,
  date text not null,
  replacement_bill_id text,
  primary key(shop_id,id),
  foreign key(shop_id,bill_id) references khonnai_app.bills(shop_id,id),
  foreign key(shop_id,replacement_bill_id) references khonnai_app.bills(shop_id,id)
);
create index returns_bill_idx on khonnai_app.returns(shop_id,bill_id);
create index returns_replacement_idx on khonnai_app.returns(shop_id,replacement_bill_id);

-- Line snapshots retain existing historical descriptions and optional prices.
-- Generated references prevent a document from pointing to another shop's SKU.
create table khonnai_app.bill_lines (
  shop_id uuid not null,
  bill_id text not null,
  position integer not null check(position>=0),
  snapshot jsonb not null check(jsonb_typeof(snapshot)='object'),
  variant_id text generated always as (snapshot->>'variantId') stored not null,
  primary key(shop_id,bill_id,position),
  foreign key(shop_id,bill_id) references khonnai_app.bills(shop_id,id),
  foreign key(shop_id,variant_id) references khonnai_app.variants(shop_id,id),
  check(snapshot ? 'quantity' and jsonb_typeof(snapshot->'quantity')='number' and (snapshot->>'quantity')::numeric between 1 and 9007199254740991 and (snapshot->>'quantity')::numeric=trunc((snapshot->>'quantity')::numeric)),
  check(snapshot ? 'price' and jsonb_typeof(snapshot->'price')='number' and (snapshot->>'price')::numeric between 0 and 9007199254740991 and (snapshot->>'price')::numeric=trunc((snapshot->>'price')::numeric))
);
create index bill_lines_variant_idx on khonnai_app.bill_lines(shop_id,variant_id);
create table khonnai_app.reservation_lines (
  shop_id uuid not null,
  reservation_id text not null,
  position integer not null check(position>=0),
  snapshot jsonb not null check(jsonb_typeof(snapshot)='object'),
  variant_id text generated always as (snapshot->>'variantId') stored not null,
  primary key(shop_id,reservation_id,position),
  foreign key(shop_id,reservation_id) references khonnai_app.reservations(shop_id,id),
  foreign key(shop_id,variant_id) references khonnai_app.variants(shop_id,id),
  check(snapshot ? 'quantity' and jsonb_typeof(snapshot->'quantity')='number' and (snapshot->>'quantity')::numeric between 1 and 9007199254740991 and (snapshot->>'quantity')::numeric=trunc((snapshot->>'quantity')::numeric))
);
create index reservation_lines_variant_idx on khonnai_app.reservation_lines(shop_id,variant_id);
create table khonnai_app.return_lines (
  shop_id uuid not null,
  return_id text not null,
  position integer not null check(position>=0),
  snapshot jsonb not null check(jsonb_typeof(snapshot)='object'),
  variant_id text generated always as (snapshot->>'variantId') stored not null,
  primary key(shop_id,return_id,position),
  foreign key(shop_id,return_id) references khonnai_app.returns(shop_id,id),
  foreign key(shop_id,variant_id) references khonnai_app.variants(shop_id,id),
  check(snapshot ? 'quantity' and jsonb_typeof(snapshot->'quantity')='number' and (snapshot->>'quantity')::numeric between 1 and 9007199254740991 and (snapshot->>'quantity')::numeric=trunc((snapshot->>'quantity')::numeric)),
  check(snapshot ? 'sellable' and jsonb_typeof(snapshot->'sellable')='boolean')
);
create index return_lines_variant_idx on khonnai_app.return_lines(shop_id,variant_id);
create table khonnai_app.movements (
  shop_id uuid not null references khonnai_app.shops(id),
  id text not null,
  position integer not null check(position>=0),
  date text not null,
  text text not null,
  primary key(shop_id,id)
);
create table khonnai_app.command_receipts (
  shop_id uuid not null references khonnai_app.shops(id),
  command_id text not null check(char_length(command_id) between 1 and 160),
  digest text not null check(digest ~ '^[a-f0-9]{64}$'),
  revision bigint not null check(revision between 1 and 9007199254740991),
  committed_at timestamptz not null default now(),
  primary key(shop_id,command_id), unique(shop_id,revision)
);

do $migration$
declare tab text;
begin
  foreach tab in array array['products','variants','bills','bill_lines','reservations','reservation_lines','returns','return_lines','movements','command_receipts'] loop
    execute format('alter table khonnai_app.%I enable row level security',tab);
    execute format('alter table khonnai_app.%I force row level security',tab);
    execute format('revoke all on khonnai_app.%I from public, anon, authenticated, service_role',tab);
    execute format('create policy shop_owned on khonnai_app.%I for all to khonnai_app_runtime using (exists(select 1 from khonnai_app.shops s where s.id=shop_id and s.owner_user_id=nullif(current_setting(''khonnai.user_id'',true),'''')::uuid)) with check (exists(select 1 from khonnai_app.shops s where s.id=shop_id and s.owner_user_id=nullif(current_setting(''khonnai.user_id'',true),'''')::uuid))',tab);
    execute format('grant select,insert,update,delete on khonnai_app.%I to khonnai_app_runtime',tab);
  end loop;
end
$migration$;
revoke update,delete on khonnai_app.command_receipts from khonnai_app_runtime;
grant update(phone,revision) on khonnai_app.shops to khonnai_app_runtime;
