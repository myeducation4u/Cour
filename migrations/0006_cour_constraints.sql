-- Integrity constraints and indexes the business model relies on.
--
-- Everything here is written to be safe on an already-populated database:
-- constraints are added `not valid` then validated, so a pre-existing bad row
-- fails the migration loudly rather than being silently rewritten. Platform
-- auth tables (`migrations/auth/`) are not touched.

-- ── statuses ─────────────────────────────────────────────────────────────────

alter table products drop constraint if exists products_status_known;
alter table products add constraint products_status_known
  check (status in ('draft', 'published', 'archived'));

alter table product_variants drop constraint if exists variants_status_known;
alter table product_variants add constraint variants_status_known
  check (status in ('active', 'inactive'));

alter table orders drop constraint if exists orders_status_known;
alter table orders add constraint orders_status_known
  check (status in ('placed', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'));

alter table navigation drop constraint if exists navigation_location_known;
alter table navigation add constraint navigation_location_known
  check (location in ('header', 'footer'));

alter table media drop constraint if exists media_kind_known;
alter table media add constraint media_kind_known
  check (kind in ('image', 'video', 'poster'));

alter table user_profiles drop constraint if exists user_profiles_role_known;
alter table user_profiles add constraint user_profiles_role_known
  check (role in ('customer', 'owner', 'admin', 'editor'));

-- ── quantities and money ─────────────────────────────────────────────────────

alter table cart_items drop constraint if exists cart_items_qty_range;
alter table cart_items add constraint cart_items_qty_range
  check (quantity >= 1 and quantity <= 8);

alter table orders drop constraint if exists orders_total_consistent;
alter table orders add constraint orders_total_consistent
  check (total_cents >= shipping_cents);

-- ── valid colours, slugs, hrefs ──────────────────────────────────────────────

alter table products drop constraint if exists products_slug_format;
alter table products add constraint products_slug_format
  check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) between 2 and 80);

alter table products drop constraint if exists products_color_hex_format;
alter table products add constraint products_color_hex_format
  check (color_hex is null or color_hex ~ '^#[0-9A-Fa-f]{6}$');

alter table collections drop constraint if exists collections_slug_format;
alter table collections add constraint collections_slug_format
  check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) between 2 and 80);

alter table policies drop constraint if exists policies_slug_format;
alter table policies add constraint policies_slug_format
  check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) between 2 and 80);

-- Internal navigation only. External hrefs must carry an explicit scheme, so a
-- javascript:/data: value can never be stored as a same-origin route.
alter table navigation drop constraint if exists navigation_href_safe;
alter table navigation add constraint navigation_href_safe
  check (
    (href like '/%' and href not like '//%' and char_length(href) <= 180)
    or href ~ '^https://[^[:space:]]+$'
  );

-- ── media ────────────────────────────────────────────────────────────────────

alter table media drop constraint if exists media_url_safe;
alter table media add constraint media_url_safe
  check (
    (url like '/%' and url not like '//%' and char_length(url) <= 240)
    or url ~ '^https://[^[:space:]]+$'
  );

-- ── required relationships ───────────────────────────────────────────────────

alter table product_variants drop constraint if exists variants_size_bounded;
alter table product_variants add constraint variants_size_bounded
  check (char_length(size) between 1 and 12);

alter table faqs drop constraint if exists faqs_lengths;
alter table faqs add constraint faqs_lengths
  check (char_length(question) between 1 and 180 and char_length(answer) between 1 and 2000);

alter table orders drop constraint if exists orders_email_present;
alter table orders add constraint orders_email_present
  check (char_length(email) between 3 and 180);

alter table order_items drop constraint if exists order_items_qty_max;
alter table order_items add constraint order_items_qty_max
  check (quantity <= 8);

-- ── indexes for the reads the app actually performs ──────────────────────────

create index if not exists products_status_idx on products (status, featured desc, name);
create index if not exists product_variants_product_idx on product_variants (product_id, status);
create index if not exists order_items_order_idx on order_items (order_id);
create index if not exists orders_status_created_idx on orders (status, created_at desc);
create index if not exists orders_email_idx on orders (lower(email));
create index if not exists wishlist_user_idx on wishlist_items (user_id, created_at desc);
create index if not exists navigation_location_idx on navigation (location, sort_order);
create index if not exists faqs_published_idx on faqs (published, sort_order);
create index if not exists homepage_sections_order_idx on homepage_sections (enabled, sort_order);
create index if not exists inquiries_email_kind_idx on inquiries (email, kind, created_at desc);
create index if not exists audit_log_created_idx on audit_log (created_at desc);
