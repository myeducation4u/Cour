alter table orders add column if not exists confirm_token text;
alter table orders add column if not exists idempotency_key text;

create unique index if not exists orders_confirm_token_idx
  on orders (confirm_token)
  where confirm_token is not null;

create unique index if not exists orders_idempotency_idx
  on orders (idempotency_key)
  where idempotency_key is not null;

create unique index if not exists user_profiles_one_owner
  on user_profiles (role)
  where role = 'owner';
