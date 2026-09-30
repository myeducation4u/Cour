alter table products drop constraint if exists products_price_nonneg;
alter table products add constraint products_price_nonneg check (price_cents >= 0);

alter table product_variants drop constraint if exists variants_inv_nonneg;
alter table product_variants add constraint variants_inv_nonneg check (inventory_quantity >= 0);

alter table product_variants drop constraint if exists variants_price_override_nonneg;
alter table product_variants add constraint variants_price_override_nonneg
  check (price_override_cents is null or price_override_cents >= 0);

alter table order_items drop constraint if exists order_items_qty_pos;
alter table order_items add constraint order_items_qty_pos check (quantity > 0);

alter table order_items drop constraint if exists order_items_unit_nonneg;
alter table order_items add constraint order_items_unit_nonneg check (unit_cents >= 0);

alter table orders drop constraint if exists orders_total_nonneg;
alter table orders add constraint orders_total_nonneg check (total_cents >= 0);

alter table orders drop constraint if exists orders_shipping_nonneg;
alter table orders add constraint orders_shipping_nonneg check (shipping_cents >= 0);
