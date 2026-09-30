-- Alignment with the reference capture: the collection rail and its prices.
--
-- The COLLECTIONS chapter shows exactly four jackets — shadow, tactical, thermal
-- and tech shell — in that order, at $160 / $250 / $374 / $300. The seed shipped
-- five slugs in the section content (including the VOID, which the reference
-- uses as the stage's own specimen rather than as a rail card) and studio
-- pricing that does not match the reference.
--
-- The reference is the authority for values that are directly observable in it,
-- so the stored content and the stored prices are corrected here — once, in the
-- same place every other content correction lives — rather than being patched at
-- render time. Prices are stored in cents, as everywhere else in the schema.
--
-- Idempotent: a database that is already aligned matches nothing, and the seed
-- (`src/lib/server/seed.ts`) writes these values directly for a fresh install.

-- The rail: four products, reference order.
update homepage_sections
set content = jsonb_build_object(
  'productSlugs', jsonb_build_array('shadow-puffer', 'tactical-hooded', 'thermal-bomber', 'tech-shell')
)::text
where section_key = 'collections'
  and (
    content is null
    or content not like '%"productSlugs"%'
    or content like '%void-puffer%'
  );

-- Reference pricing for the four rail pieces.
update products set price_cents = 16000
where slug = 'shadow-puffer' and price_cents <> 16000;

update products set price_cents = 25000
where slug = 'tactical-hooded' and price_cents <> 25000;

update products set price_cents = 37400
where slug = 'thermal-bomber' and price_cents <> 37400;

update products set price_cents = 30000
where slug = 'tech-shell' and price_cents <> 30000;

-- The theme names are part of the observable copy: the cards read
-- SHADOW PUFFER JACKET / TACTICAL HOODED JACKET / THERMAL BOMBER JACKET /
-- TECH SHELL JACKET.
update products set name = 'SHADOW PUFFER JACKET'
where slug = 'shadow-puffer' and name <> 'SHADOW PUFFER JACKET';

update products set name = 'TACTICAL HOODED JACKET'
where slug = 'tactical-hooded' and name <> 'TACTICAL HOODED JACKET';

update products set name = 'THERMAL BOMBER JACKET'
where slug = 'thermal-bomber' and name <> 'THERMAL BOMBER JACKET';

update products set name = 'TECH SHELL JACKET'
where slug = 'tech-shell' and name <> 'TECH SHELL JACKET';
