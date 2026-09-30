-- Content corrections for databases seeded before the reference copy was
-- final. These used to live inside `ensureSeed()` (a `patchCopy()` pass that ran
-- on every boot) and inside the homepage renderer, which meant content was
-- being repaired at read time instead of being stored correctly. Corrections
-- now run exactly once, in order, as a migration.
--
-- Every statement is idempotent: a freshly seeded database has nothing to match,
-- and a repaired one is a no-op.

update homepage_sections
set content = replace(content, '"EST. 2020"', '"EST. 2022"')
where section_key = 'hero' and content like '%EST. 2020%';

-- The establishment line belongs in the structured hero content, not in the
-- section's free-text `body` (which the stage never renders).
update homepage_sections
set body = null
where section_key = 'hero' and body like '{%';

-- The construction heading is multi-line; the single-line variant was a
-- flattening artefact of an earlier seed.
update homepage_sections
set title = 'TECHNOLOGY' || chr(10) || 'ENGINEERED' || chr(10) || 'TO ENDURE'
where section_key = 'construction'
  and title = 'TECHNOLOGY ENGINEERED TO ENDURE';

-- The layer stack was renamed: the membrane is referenced as a weather barrier
-- in the reference copy, and ripstop protection was not one of the four
-- observable layers.
update homepage_sections
set content = jsonb_build_object(
  'layers', jsonb_build_array(
    jsonb_build_object(
      'id', '01',
      'title', 'OUTER SHELL',
      'body', 'Durable outer layer that repels water and protects against wind and rain.'
    ),
    jsonb_build_object(
      'id', '02',
      'title', 'BREATHABLE MEMBRANE',
      'body', 'Moisture-managing membrane that keeps the silhouette clean in changing weather.'
    ),
    jsonb_build_object(
      'id', '03',
      'title', 'THERMAL INSULATION',
      'body', 'Aligned thermal fill that traps heat without adding unnecessary weight.'
    ),
    jsonb_build_object(
      'id', '04',
      'title', 'COMFORT LINING',
      'body', 'Soft inner layer for motion without surface friction.'
    )
  )
)::text
where section_key = 'construction'
  and content like '%WEATHER BARRIER%'
  and content not like '%BREATHABLE MEMBRANE%';

update faqs
set answer = replace(answer, 'weather-leave membrane', 'weather membrane')
where answer like '%weather-leave%';

-- Product imagery was re-exported as WebP; the .jpg rows are stale references.
update media
set url = replace(url, '.jpg', '.webp')
where url in (
  '/media/void-puffer.jpg',
  '/media/shadow-puffer.jpg',
  '/media/tactical-hooded.jpg',
  '/media/thermal-bomber.jpg',
  '/media/tech-shell.jpg'
);
