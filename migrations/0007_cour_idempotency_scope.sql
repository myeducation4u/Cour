-- Idempotency key scoping.
--
-- `orders_idempotency_idx` was unique on `idempotency_key` alone. A key is
-- generated client-side, so two unrelated visitors (or one visitor on a shared
-- machine) could collide: the second checkout would be handed the FIRST
-- visitor's `confirm_token` and order id — a cross-account order disclosure
-- reachable by replaying a UUID.
--
-- Keys are now scoped to the actor that submitted them (the signed-in user id,
-- or the guest's normalized email), so a collision can only ever resolve inside
-- one actor's own submissions.

alter table orders add column if not exists idempotency_scope text;

drop index if exists orders_idempotency_idx;

-- Backfill existing rows into a scope that keeps their behaviour isolated.
update orders
set idempotency_scope = coalesce('user:' || user_id, 'guest:' || lower(email))
where idempotency_key is not null and idempotency_scope is null;

create unique index if not exists orders_idempotency_scoped_idx
  on orders (idempotency_scope, idempotency_key)
  where idempotency_key is not null and idempotency_scope is not null;

-- Guest confirm tokens are the only handle on an order for a signed-out buyer,
-- so the token column must never be null for a row created after this point.
-- (Existing rows without a token are left alone; they were created before guest
-- confirmation existed and are reachable through the account route instead.)
alter table orders drop constraint if exists orders_confirm_token_format;
alter table orders add constraint orders_confirm_token_format
  check (confirm_token is null or confirm_token ~ '^[0-9a-fA-F-]{16,64}$');

-- Addresses: a saved address is bounded text, and the country column must hold
-- an ISO-3166 alpha-2 code (the shipping table is keyed by it).
alter table addresses drop constraint if exists addresses_country_format;
alter table addresses add constraint addresses_country_format
  check (country ~ '^[A-Z]{2}$');

alter table addresses drop constraint if exists addresses_lengths;
alter table addresses add constraint addresses_lengths
  check (
    char_length(line1) between 1 and 160
    and (line2 is null or char_length(line2) <= 160)
    and char_length(city) between 1 and 80
    and (region is null or char_length(region) <= 80)
    and (postal_code is null or char_length(postal_code) <= 24)
    and (label is null or char_length(label) <= 40)
  );

-- At most one default address per visitor, enforced by the database rather than
-- by the two-statement dance in `saveAddress`.
create unique index if not exists addresses_one_default_idx
  on addresses (user_id)
  where is_default;
