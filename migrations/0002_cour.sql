create table if not exists site_settings (
  id text primary key default 'default',
  brand_name text not null,
  tagline text,
  contact_email text,
  currency text not null default 'USD',
  announcement text,
  announcement_enabled boolean not null default false,
  footer_note text,
  social_instagram text,
  social_x text,
  shipping_note text,
  maintenance_mode boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists navigation (
  id text primary key,
  label text not null,
  href text not null,
  location text not null default 'header',
  sort_order int not null default 0,
  visible boolean not null default true
);

create table if not exists homepage_sections (
  id text primary key,
  section_key text not null unique,
  title text,
  eyebrow text,
  body text,
  cta_label text,
  cta_href text,
  enabled boolean not null default true,
  sort_order int not null default 0,
  content text not null default '{}'
);

create table if not exists media (
  id text primary key,
  kind text not null default 'image',
  url text not null,
  alt_text text not null default '',
  poster_url text,
  created_at timestamptz not null default now()
);

create table if not exists collections (
  id text primary key,
  slug text not null unique,
  name text not null,
  description text,
  cover_media_id text references media(id),
  visible boolean not null default true,
  sort_order int not null default 0
);

create table if not exists products (
  id text primary key,
  slug text not null unique,
  name text not null,
  description text,
  story text,
  price_cents int not null,
  status text not null default 'published',
  featured boolean not null default false,
  primary_media_id text references media(id),
  color_name text,
  color_hex text,
  fit text,
  material text,
  care text,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists product_variants (
  id text primary key,
  product_id text not null references products(id) on delete cascade,
  sku text not null unique,
  size text not null,
  price_override_cents int,
  inventory_quantity int not null default 0,
  status text not null default 'active'
);

create table if not exists product_collections (
  product_id text not null references products(id) on delete cascade,
  collection_id text not null references collections(id) on delete cascade,
  primary key (product_id, collection_id)
);

create table if not exists faqs (
  id text primary key,
  question text not null,
  answer text not null,
  sort_order int not null default 0,
  published boolean not null default true
);

create table if not exists policies (
  id text primary key,
  slug text not null unique,
  title text not null,
  body text not null,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists seo_pages (
  id text primary key,
  title text,
  description text,
  indexable boolean not null default true
);

create table if not exists user_profiles (
  user_id text primary key,
  role text not null default 'customer',
  display_name text,
  created_at timestamptz not null default now()
);

create table if not exists addresses (
  id text primary key,
  user_id text not null,
  label text,
  line1 text not null,
  line2 text,
  city text not null,
  region text,
  postal_code text,
  country text not null default 'US',
  is_default boolean not null default false
);
create index if not exists addresses_user_idx on addresses (user_id);

create table if not exists cart_items (
  id text primary key,
  user_id text not null,
  product_id text not null references products(id),
  variant_id text not null references product_variants(id),
  quantity int not null default 1,
  created_at timestamptz not null default now(),
  unique (user_id, variant_id)
);
create index if not exists cart_user_idx on cart_items (user_id);

create table if not exists wishlist_items (
  user_id text not null,
  product_id text not null references products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

create table if not exists orders (
  id text primary key,
  user_id text,
  status text not null default 'placed',
  email text not null,
  total_cents int not null,
  shipping_cents int not null default 0,
  shipping_name text,
  shipping_line1 text,
  shipping_city text,
  shipping_region text,
  shipping_postal text,
  shipping_country text,
  created_at timestamptz not null default now()
);
create index if not exists orders_user_idx on orders (user_id);

create table if not exists order_items (
  id text primary key,
  order_id text not null references orders(id) on delete cascade,
  product_id text not null,
  variant_id text not null,
  name text not null,
  size text not null,
  unit_cents int not null,
  quantity int not null
);

create table if not exists inquiries (
  id text primary key,
  email text not null,
  kind text not null default 'newsletter',
  message text,
  created_at timestamptz not null default now()
);

create table if not exists audit_log (
  id text primary key,
  user_id text not null,
  action text not null,
  entity text not null,
  entity_id text,
  created_at timestamptz not null default now()
);
