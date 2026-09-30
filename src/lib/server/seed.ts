import { getSql } from "@/lib/db";

const globalRef = globalThis as typeof globalThis & {
  __courSeed__?: Promise<void>;
};

const SIZES = ["XS", "S", "M", "L", "XL"] as const;

type ProductSeed = {
  id: string;
  slug: string;
  name: string;
  description: string;
  story: string;
  price: number;
  featured: boolean;
  mediaId: string;
  image: string;
  alt: string;
  colorName: string;
  colorHex: string;
  fit: string;
  material: string;
  care: string;
  inventory: number[];
};

const PRODUCTS: ProductSeed[] = [
  {
    id: "prd_void",
    slug: "void-puffer",
    name: "VOID PUFFER",
    description:
      "The origin specimen. A cropped iridescent shell designed to be inspected, not merely worn.",
    story:
      "Built as a laboratory object: lacquered baffles, high collar, oversized pockets. Blue and violet light is part of the garment, not an effect applied later.",
    price: 48000,
    featured: true,
    mediaId: "media_void",
    image: "/media/void-puffer.webp",
    alt: "COUR Void Puffer, dark iridescent cropped jacket",
    colorName: "Void",
    colorHex: "#12131A",
    fit: "Oversized, cropped hem",
    material: "Lacquered technical nylon shell, thermal fill",
    care: "Wipe shell, cold wash bagged, do not tumble, do not iron face",
    inventory: [6, 8, 10, 8, 4],
  },
  {
    id: "prd_shadow",
    slug: "shadow-puffer",
    name: "SHADOW PUFFER JACKET",
    description: "Acid-lime lacquer puffer. Same cropped architecture as the origin piece.",
    story: "A high-visibility colorway of the COUR puffer block. Same collar, same pocket geometry, same hem draw.",
    price: 45000,
    featured: true,
    mediaId: "media_shadow",
    image: "/media/shadow-puffer.webp",
    alt: "COUR Shadow Puffer Jacket in acid lime",
    colorName: "Acid Lime",
    colorHex: "#C6F000",
    fit: "Oversized, cropped hem",
    material: "Lacquered technical nylon shell, thermal fill",
    care: "Wipe shell, cold wash bagged, do not tumble",
    inventory: [5, 7, 9, 7, 3],
  },
  {
    id: "prd_tactical",
    slug: "tactical-hooded",
    name: "TACTICAL HOODED JACKET",
    description: "Hooded puffer in magenta lacquer, cut for movement with a stowed hood.",
    story: "Adds a structured hood to the COUR block without changing the cropped silhouette.",
    price: 39500,
    featured: true,
    mediaId: "media_tactical",
    image: "/media/tactical-hooded.webp",
    alt: "COUR Tactical Hooded Jacket in magenta",
    colorName: "Magenta",
    colorHex: "#E14CA8",
    fit: "Oversized, hooded",
    material: "Lacquered technical nylon shell, thermal fill",
    care: "Cold wash bagged, air dry",
    inventory: [4, 6, 8, 6, 3],
  },
  {
    id: "prd_thermal",
    slug: "thermal-bomber",
    name: "THERMAL BOMBER JACKET",
    description: "Coral bomber-puffer hybrid. Thermal insulation with a tighter hem.",
    story: "A slightly more compact COUR block. Same material language, bomber proportion.",
    price: 35000,
    featured: true,
    mediaId: "media_thermal",
    image: "/media/thermal-bomber.webp",
    alt: "COUR Thermal Bomber Jacket in coral",
    colorName: "Coral",
    colorHex: "#E25A2A",
    fit: "Oversized bomber",
    material: "Lacquered nylon, thermal fill",
    care: "Cold wash bagged, air dry",
    inventory: [6, 8, 10, 8, 5],
  },
  {
    id: "prd_shell",
    slug: "tech-shell",
    name: "TECH SHELL JACKET",
    description: "Cobalt technical shell with angular panels and a structured collar.",
    story: "The most weather-oriented COUR block. Harder panel lines, same inspection lighting.",
    price: 52000,
    featured: true,
    mediaId: "media_shell",
    image: "/media/tech-shell.webp",
    alt: "COUR Tech Shell Jacket in cobalt",
    colorName: "Cobalt",
    colorHex: "#2F5BFF",
    fit: "Oversized, structured",
    material: "Technical shell nylon, weather membrane, thermal fill",
    care: "Wipe shell, cold wash bagged, do not iron",
    inventory: [3, 5, 7, 5, 2],
  },
];

async function seedInner() {
  const sql = await getSql();
  const existing = await sql<{ id: string }>`select id from site_settings where id = 'default'`;
  if (existing.length) return;

  await sql`
    insert into site_settings (
      id, brand_name, tagline, contact_email, currency, announcement,
      announcement_enabled, footer_note, social_instagram, social_x, shipping_note, maintenance_mode
    ) values (
      'default',
      'COUR',
      'FORM / SURFACE / MOTION',
      'studio@cour.example',
      'USD',
      'Limited quantity. Inspection before selection.',
      false,
      'Technical outerwear, built as an object.',
      'https://instagram.com',
      'https://x.com',
      'Ships from the studio in 3–8 days. Duties calculated at fulfillment.',
      false
    )
  `;

  const nav: Array<[string, string, string, string, number]> = [
    ["nav_shop", "SHOP", "/shop", "header", 0],
    ["nav_col", "COLLECTIONS", "/collection/outerwear", "header", 1],
    ["nav_tech", "TECHNOLOGY", "/technology", "header", 2],
    ["nav_about", "ABOUT", "/about", "header", 3],
    ["nav_f_shop", "SHOP", "/shop", "footer", 0],
    ["nav_f_tech", "TECHNOLOGY", "/technology", "footer", 1],
    ["nav_f_about", "ABOUT", "/about", "footer", 2],
    ["nav_f_support", "SUPPORT", "/policies/shipping", "footer", 3],
    ["nav_f_privacy", "PRIVACY POLICY", "/policies/privacy", "footer", 4],
  ];
  for (const [id, label, href, location, order] of nav) {
    await sql`
      insert into navigation (id, label, href, location, sort_order, visible)
      values (${id}, ${label}, ${href}, ${location}, ${order}, true)
    `;
  }

  const heroContent = JSON.stringify({
    leftTitle: "ENGINEERED FOR MOTION.",
    leftBody: "BUILT TO ENDURE.",
    rightTitle: "DESIGNED FOR THE UNKNOWN.",
    rightBody: "READY FOR ANYTHING.",
    ticker: "WEATHER-RESISTANT. THERMAL INSULATION. OVERSIZED FIT. LIMITED QUANTITY.",
    established: "EST. 2022",
    establishedNote: "BUILT FOR CONTINUAL WEATHER, MOTION AND FOCUS IN USE.",
  });
  const detailsContent = JSON.stringify({
    specs: [
      {
        id: "01",
        title: "WEATHER-RESISTANT SHELL",
        body: "Water-repellent outer shell. Protects against wind and rain.",
      },
      {
        id: "02",
        title: "THERMAL INSULATION",
        body: "Advanced padding traps heat and keeps you warm without unnecessary weight.",
      },
      {
        id: "03",
        title: "REINFORCED CONSTRUCTION",
        body: "Durable stitching and structural panels for added strength.",
      },
      {
        id: "04",
        title: "FUNCTIONAL STORAGE",
        body: "Multiple zippered pockets inside and outside to carry essentials.",
      },
      {
        id: "05",
        title: "OVERSIZED FIT",
        body: "Relaxed silhouette for movement, layering and everyday comfort.",
      },
    ],
  });
  const techContent = JSON.stringify({
    layers: [
      {
        id: "01",
        title: "OUTER SHELL",
        body: "Durable outer layer that repels water and protects against wind and rain.",
      },
      {
        id: "02",
        title: "RIPSTOP PROTECTION",
        body: "Reinforced ripstop structure that resists tear-through without adding bulk.",
      },
      {
        id: "03",
        title: "BREATHABLE MEMBRANE",
        body: "Moisture-managing membrane that keeps the silhouette clean in changing weather.",
      },
      {
        id: "04",
        title: "COMFORT LINING",
        body: "Soft inner layer for motion without surface friction.",
      },
    ],
  });

  await sql`
    insert into homepage_sections (id, section_key, title, eyebrow, body, cta_label, cta_href, enabled, sort_order, content)
    values
      ('sec_hero', 'hero', 'COUR', 'FORM / SURFACE / MOTION', null, 'SHOP NOW', '/shop', true, 0, ${heroContent}),
      ('sec_details', 'details', 'DETAILS MATTER.', null,
        'A technical outer layer made for movement, changing weather and everything that happens beyond the expected.',
        'EXPLORE THE JACKET', '/product/void-puffer', true, 1, ${detailsContent}),
      ('sec_collections', 'collections', 'COLLECTIONS.', null,
        'Technical jackets for changing weather, movement and everyday use.',
        'VIEW ALL JACKETS', '/shop', true, 2, '{}'),
      ('sec_tech', 'construction', ${"TECHNOLOGY\nENGINEERED\nTO ENDURE"}, null,
        'Every detail has a purpose. From the protective outer shell to the insulation inside, the jacket is designed to perform without compromising its form.',
        null, null, true, 3, ${techContent}),
      ('sec_know', 'know', 'NEED TO KNOW.', null, null, null, null, true, 4, '{}')
  `;

  await sql`
    insert into media (id, kind, url, alt_text) values
      ('media_void', 'image', '/media/void-puffer.webp', 'COUR Void Puffer'),
      ('media_shadow', 'image', '/media/shadow-puffer.webp', 'COUR Shadow Puffer'),
      ('media_tactical', 'image', '/media/tactical-hooded.webp', 'COUR Tactical Hooded'),
      ('media_thermal', 'image', '/media/thermal-bomber.webp', 'COUR Thermal Bomber'),
      ('media_shell', 'image', '/media/tech-shell.webp', 'COUR Tech Shell'),
      ('media_layers', 'image', '/media/construction.jpg', 'COUR construction layers')
  `;

  await sql`
    insert into collections (id, slug, name, description, cover_media_id, visible, sort_order)
    values
      ('col_outer', 'outerwear', 'OUTERWEAR', 'The COUR inspection line — cropped technical jackets.', 'media_void', true, 0),
      ('col_limited', 'limited', 'LIMITED', 'Low-quantity colorways of the origin block.', 'media_shell', true, 1)
  `;

  for (const p of PRODUCTS) {
    await sql`
      insert into products (
        id, slug, name, description, story, price_cents, status, featured,
        primary_media_id, color_name, color_hex, fit, material, care, seo_title, seo_description
      ) values (
        ${p.id}, ${p.slug}, ${p.name}, ${p.description}, ${p.story}, ${p.price},
        'published', ${p.featured}, ${p.mediaId}, ${p.colorName}, ${p.colorHex},
        ${p.fit}, ${p.material}, ${p.care}, ${p.name + " — COUR"}, ${p.description}
      )
    `;
    await sql`insert into product_collections (product_id, collection_id) values (${p.id}, 'col_outer')`;
    if (p.id === "prd_void" || p.id === "prd_shell") {
      await sql`insert into product_collections (product_id, collection_id) values (${p.id}, 'col_limited')`;
    }
    for (let i = 0; i < SIZES.length; i++) {
      const size = SIZES[i];
      await sql`
        insert into product_variants (id, product_id, sku, size, inventory_quantity, status)
        values (
          ${`${p.id}_${size}`},
          ${p.id},
          ${`COUR-${p.slug.toUpperCase()}-${size}`},
          ${size},
          ${p.inventory[i]},
          'active'
        )
      `;
    }
  }

  const faqs: Array<[string, string, string, number]> = [
    [
      "faq_1",
      "HOW DO I CHOOSE THE RIGHT SIZE?",
      "Check our size guide for measurements and fit information. The jackets follow an oversized silhouette for comfortable layering.",
      0,
    ],
    [
      "faq_2",
      "WHAT MATERIALS ARE USED IN THE JACKETS?",
      "We use technical fabrics, a weather membrane and aligned insulation for durability, protection and comfort. Exact composition is listed on each product.",
      1,
    ],
    [
      "faq_3",
      "HOW SHOULD I CARE FOR MY JACKET?",
      "Follow the care instructions on the garment. Avoid harsh detergents and excessive heat to preserve the materials.",
      2,
    ],
    [
      "faq_4",
      "DO YOU SHIP INTERNATIONALLY?",
      "Yes. We offer worldwide shipping with duties calculated at fulfillment. Transit times depend on destination.",
      3,
    ],
    [
      "faq_5",
      "CAN I RETURN OR EXCHANGE MY ORDER?",
      "Unworn jackets can be returned or exchanged within the disclosed return period, with original tags attached.",
      4,
    ],
  ];
  for (const [id, q, a, order] of faqs) {
    await sql`
      insert into faqs (id, question, answer, sort_order, published)
      values (${id}, ${q}, ${a}, ${order}, true)
    `;
  }

  await sql`
    insert into policies (id, slug, title, body, published) values
      ('pol_privacy', 'privacy', 'PRIVACY POLICY',
       'COUR stores only what is required to run the studio: account identity, order records, and messages you send us. Public catalog content is readable. Order and address data is not. We do not sell visitor lists.',
       true),
      ('pol_shipping', 'shipping', 'SHIPPING',
       'Orders are packed from the studio. Typical dispatch is 3–8 days after confirmation. International deliveries may incur duties, which are calculated at fulfillment rather than invented at browse time.',
       true),
      ('pol_returns', 'returns', 'RETURNS',
       'Unworn garments with original tags may be returned within 14 days of delivery. Made-to-order or heavily worn pieces are not accepted. Refunds follow the original payment path once the studio receives the garment.',
       true)
  `;

  await sql`
    insert into seo_pages (id, title, description, indexable) values
      ('/', 'COUR — Form / Surface / Motion', 'Technical outerwear inspected as an object.', true),
      ('/shop', 'Shop — COUR', 'The COUR jacket line.', true)
  `;
}

export async function ensureSeed() {
  if (!globalRef.__courSeed__) {
    globalRef.__courSeed__ = seedInner()
      .then(() => patchCopy())
      .catch((err) => {
        globalRef.__courSeed__ = undefined;
        throw err;
      });
  }
  await globalRef.__courSeed__;
}

async function patchCopy() {
  const sql = await getSql();
  await sql`
    update homepage_sections
    set content = replace(content, '"EST. 2020"', '"EST. 2022"')
    where section_key = 'hero' and content like '%EST. 2020%'
  `;
  await sql`
    update homepage_sections
    set title = ${"TECHNOLOGY\nENGINEERED\nTO ENDURE"}
    where section_key = 'construction' and title = 'TECHNOLOGY ENGINEERED TO ENDURE'
  `;
  await sql`
    update homepage_sections
    set body = null
    where section_key = 'hero' and body like '{%'
  `;
  const tech = JSON.stringify({
    layers: [
      {
        id: "01",
        title: "OUTER SHELL",
        body: "Durable outer layer that repels water and protects against wind and rain.",
      },
      {
        id: "02",
        title: "RIPSTOP PROTECTION",
        body: "Reinforced ripstop structure that resists tear-through without adding bulk.",
      },
      {
        id: "03",
        title: "BREATHABLE MEMBRANE",
        body: "Moisture-managing membrane that keeps the silhouette clean in changing weather.",
      },
      {
        id: "04",
        title: "COMFORT LINING",
        body: "Soft inner layer for motion without surface friction.",
      },
    ],
  });
  await sql`
    update homepage_sections
    set content = ${tech}
    where section_key = 'construction' and content like '%WEATHER BARRIER%'
  `;
  await sql`
    update media
    set url = replace(url, '.jpg', '.webp')
    where url in (
      '/media/void-puffer.jpg',
      '/media/shadow-puffer.jpg',
      '/media/tactical-hooded.jpg',
      '/media/thermal-bomber.jpg',
      '/media/tech-shell.jpg'
    )
  `;
  await sql`
    update faqs
    set answer = replace(answer, 'weather-leave membrane', 'weather membrane')
    where answer like '%weather-leave%'
  `;
}
