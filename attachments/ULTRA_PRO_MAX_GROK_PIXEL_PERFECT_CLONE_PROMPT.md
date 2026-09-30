# ULTRA PRO MAX MASTER PROMPT — CONTINUE THE CURRENT ENHANCEMENT, THEN FORENSICALLY REBUILD THE ENTIRE COUR WEBSITE

## 0. FIRST COMMAND — DO NOT RESTART

**CONTINUE THE ENHANCEMENT YOU ARE ALREADY DOING. DO NOT STOP THE CURRENT IMPROVEMENT WORK, DO NOT RESET THE PROJECT, DO NOT RE-SCAFFOLD FROM ZERO, AND DO NOT THROW AWAY THE EXISTING WORKSPACE.**

You are working inside the existing Grok workspace that already contains a partially implemented COUR website, working routes, assets, authentication, database schema, commerce logic, admin logic, state management, tests, build tooling, and an existing visual enhancement pass.

Your job is to:

1. Continue the current enhancement first.
2. Inspect the entire existing codebase before changing architecture.
3. Then perform a forensic visual/interaction audit against the supplied reference video.
4. Then repair and upgrade the existing implementation in place.
5. Preserve every working feature that is correct.
6. Replace every incorrect approximation with a reference-faithful implementation.
7. Finish only when the implementation behaves and looks like the reference, while the full underlying product stack is actually functional.

**Do not interpret “clone” as “make something with a similar aesthetic.” This is a forensic reconstruction task.**

---

# 1. ABSOLUTE SOURCE-OF-TRUTH PRIORITY

Use the sources in this exact priority order:

**SOURCE 1 — SUPPLIED REFERENCE VIDEO:** absolute authority for visual design, layout, typography proportions, spatial relationships, animation, scroll choreography, hover states, active states, transitions, section order, framing, composition, interaction timing, and visible content.

**SOURCE 2 — EXISTING WORKSPACE:** authority for already-implemented application architecture, routes, server functions, authentication, database, commerce, admin, tests, build system, and assets that can be reused.

**SOURCE 3 — EXISTING MEDIA ASSETS:** use them when they correspond to what appears in the reference.

**SOURCE 4 — EXISTING DATABASE/SEED CONTENT:** reuse only where it agrees with the reference. If the reference visibly differs, update the data/content to match the reference rather than blindly preserving incorrect seed values.

**SOURCE 5 — YOUR OWN DESIGN JUDGMENT:** use this only to fill genuinely invisible implementation details. Never use it to redesign something that the video already shows.

Never let “modern best practice”, a generic ecommerce template, Tailwind defaults, component-library defaults, or your personal design preference override the reference.

---

# 2. IMPORTANT VIDEO INTERPRETATION RULE

The supplied video is a **vertical 864×1920 recording**, but the website itself is the much smaller framed browser/canvas visible inside the recording. The large black areas above/below the website are part of the recording canvas, **NOT part of the website design**.

Therefore:

- Treat the inner website surface as the visual reference.
- Do not reproduce the large black phone/video letterboxing around it.
- First calibrate the implementation against the approximate reference website viewport visible in the recording, roughly an **800×600 class desktop viewport**.
- Then make the same design scale correctly at 1280×800 and 390×844 without changing the visual language.
- Use the actual aspect/proportions of the website frame rather than the outer 864×1920 recording dimensions.

Before coding, inspect the supplied video frame-by-frame or at sufficiently dense intervals and create your own internal visual timeline of every major state.

---

# 3. DO A FORENSIC AUDIT BEFORE EDITING

Do not immediately start replacing components.

First inspect:

- Every route in `src/routes`.
- Every shared UI component.
- `src/styles.css`.
- Store/state code.
- Authentication code and middleware.
- Server functions.
- Database access and migrations.
- Seed data.
- Admin tools.
- Tests and QA scripts.
- Public media.
- Existing screenshots.
- Existing preview/build configuration.

Then compare the current implementation with the reference video.

Create an internal discrepancy matrix with at least these dimensions:

**Geometry:** x/y positions, width, height, spacing, margins, paddings, alignment, frame inset, corner radius, card dimensions, column proportions, text blocks, image scale.

**Visual styling:** background, grid density, border opacity, glow, contrast, text brightness, blur, shadows, gradients, texture, image treatment.

**Typography:** family, weight, casing, tracking, line-height, size hierarchy, text width, wrapping, baseline alignment.

**Interaction:** hover, active, click, cursor, focus, accordion behavior, button states, link transitions.

**Motion:** easing, duration, delay, interpolation, parallax, scale, fade, translation, image movement, section crossfades, scroll-linked progress.

**Content:** visible wording, labels, prices, product names, chapter names, icons, microcopy, footer labels, FAQ content.

**Application behavior:** routing, data loading, auth, role checks, cart, wishlist, inventory, orders, admin, forms, error states, persistence, SEO, caching, deployment.

Do not accept “close enough”. Identify the exact cause of every visible mismatch.

---

# 4. CURRENT IMPLEMENTATION HAS ALREADY BEEN PARTIALLY ENHANCED — PRESERVE AND UPGRADE IT

The current project already contains a strong amount of application infrastructure. Keep that foundation instead of replacing it with a fake static mock.

Existing architecture includes, among other things:

- TanStack Router / TanStack Start.
- React.
- Tailwind CSS.
- Zustand bag state.
- Better Auth.
- PGLite/Postgres database support.
- Kysely-style server data access.
- Product/variant/inventory models.
- Cart and wishlist logic.
- Checkout/order creation.
- Admin/staff roles.
- Audit logging.
- Content/section management.
- Media records.
- FAQ/policy data.
- SEO metadata data.
- Playwright/browser smoke tooling.
- Build/deploy support.

**Do not destroy these systems merely to improve the front end.**

Instead, make the immersive homepage the visual experience shown in the video while retaining a real application underneath it.

---

# 5. THE CURRENT UI APPROXIMATION MUST BE REPAIRED, NOT DEFENDED

Known examples of mismatch visible in the current implementation include:

1. The current homepage frame is too generic and square compared with the reference’s inset, rounded, technical viewport frame.
2. The current grid is much coarser than the dense fine-grid reference background.
3. The current navigation exposes items such as SEARCH / ACCOUNT / SIGN IN that are not visible in the reference hero navigation.
4. The current logo treatment is a plain text `COUR` treatment rather than the distinctive visible brand mark in the reference.
5. The hero composition does not match the reference’s jacket scale, placement, transparency/edge treatment, and surrounding technical annotations.
6. The current implementation uses discrete chapter switching based on broad page-progress thresholds; the reference behaves like a continuous scroll-driven visual composition with transitional states.
7. The current ProductTile has a generic `INSPECT` control and a standard card treatment, while the reference cards have a different layout, tag treatment, plus icon, active/hover state, and spacing.
8. The current technology page is a conventional two-column content page, while the reference is an immersive full-screen technical scene with the exploded layer visualization integrated into the scroll choreography.
9. The current FAQ/“Need to know” composition is structurally simpler than the reference’s overlapping/floating scene.
10. The target’s technical typography, iconography, micro-borders, brackets, scroll indicator, and grid treatment are more precise than the generic approximation.

Treat these as examples, not the complete defect list. Continue the audit until every visible mismatch is accounted for.

---

# 6. RECONSTRUCT THE WEBSITE AS A SCROLL-DRIVEN TECHNICAL EXPERIENCE

The homepage is not just a sequence of ordinary stacked sections.

It behaves like a **pinned / immersive visual viewport** in which scrolling progressively transforms the central composition.

The primary chapter sequence visible in the supplied video is:

**01 — FORM**

**02 — SURFACE / DETAILS**

**03 — LINE / COLLECTIONS**

**04 — BUILD / TECHNOLOGY**

**05 — KNOW / NEED TO KNOW**

The user repeatedly scrolls forward and backward through these states. The reverse direction must be as polished as the forward direction.

The transitions are not abrupt page swaps.

They should feel like one continuous cinematic technical inspection surface where elements move, resize, fade, overlap, and become partially visible before the next chapter fully arrives.

Implement the scroll choreography using a stable, frame-synchronized approach such as:

- a pinned/sticky stage;
- a measurable chapter-progress timeline;
- normalized scroll progress;
- interpolation between states;
- requestAnimationFrame or an equivalent performant animation system;
- GPU-friendly transforms and opacity;
- carefully tuned easing only where the reference visibly eases;
- no scroll-jank;
- no layout-thrashing on every pixel of scroll.

Do **not** simply switch `display:none` between five pages.

Do **not** use five unrelated full-screen components that pop in and out.

Do **not** use arbitrary `scrollY / maxScroll` thresholds as the final visual system without calibrating them to the actual reference sequence.

---

# 7. CHAPTER 01 — FORM / HERO

Reconstruct the exact hero composition shown in the video.

Visual structure:

- Dense technical micro-grid covering the framed stage.
- Inset rounded technical frame with very thin borders.
- Small corner/registration marks.
- Distinctive brand mark at upper left.
- Centered top navigation.
- Top-right cart indicator.
- Large glossy dark blue/black iridescent jacket dominating the central stage.
- The jacket is not presented as a normal ecommerce card image. It behaves like the hero specimen being inspected.
- The jacket sits over the grid with deep black/blue tonal integration and reflective blue/violet highlights.
- There is subtle atmospheric/technical silhouette content behind or around the jacket.
- Left technical annotation around the jacket.
- Right technical annotation around the jacket.
- Bottom-left information box with icon and small establishment/brand copy.
- Bottom-right shipping information box with icon.
- Bottom-center technical ticker/copy.
- Bottom-center `SHOP NOW` button inside the same technical design language.

The reference’s hero copy visibly includes wording close to:

`ENGINEERED FOR MOTION.`
`BUILT TO ENDURE.`

and on the opposite side:

`DESIGNED FOR THE UNKNOWN.`
`READY FOR ANYTHING.`

The exact visual typography, line breaks, tracking, and positioning matter more than generic semantic styling.

The bottom-center ticker contains an intentionally noisy/glitch-like technical text treatment in parts of the reference. Treat transient character corruption/glyph substitution as an **actual visual effect** where it consistently appears, not simply as broken encoding. The semantic source text must still exist cleanly in the DOM/accessibility layer.

The bottom-left card visibly uses an establishment date around **EST. 2022** in the reference. Do not blindly keep the seed’s `EST. 2020` if the reference clearly shows otherwise.

The bottom-right card references worldwide/secure shipping.

The hero `SHOP NOW` button must match the reference’s exact size, border, corner treatment, arrow/icon placement, text tracking, hover state, and active state.

---

# 8. HERO IMAGE TREATMENT

Use the actual matching jacket asset where it corresponds to the reference, but process its presentation correctly.

Requirements:

- Preserve transparent/clean edges where appropriate.
- Do not place a rectangular black image container around the jacket if the reference does not show one.
- Do not use `object-fit: contain` inside a visually obvious black box as a shortcut.
- Match the reference’s apparent image scale relative to the frame.
- Match vertical position.
- Match rotation/perspective, if any.
- Match subtle blue/violet reflection intensity.
- Match apparent depth and atmospheric blending.
- Avoid generic filters that destroy the material.
- Avoid over-sharpening.
- Avoid artificial HDR.
- Avoid adding visual effects that are not present.

The hero image must remain visually stable while the scroll-driven transformations move the presentation around it.

---

# 9. CHAPTER 02 — SURFACE / DETAILS MATTER

This is one of the strongest states in the video and must receive pixel-level attention.

Reference composition:

- Large `DETAILS MATTER.` title on the left.
- Supporting paragraph directly underneath.
- `EXPLORE THE JACKET` button near the lower-left region.
- Extremely large close-up presentation of the dark iridescent jacket in the central/left area.
- Right-side specification stack.
- Five technical information cards.
- Thin borders and dense grid background continue behind the content.
- The cards use tiny index numbers.
- Each card has a technical icon.
- Text is compact, high-tracking, all-caps technical copy.
- The jacket remains integrated with the stage instead of becoming a normal product image block.

The five visible specification concepts are approximately:

01 — WEATHER-RESISTANT SHELL
02 — THERMAL INSULATION
03 — REINFORCED CONSTRUCTION
04 — FUNCTIONAL STORAGE
05 — OVERSIZED FIT

The visible supporting descriptions should follow the reference wording and line breaks as closely as the supplied source allows.

The five icon families should visually correspond to:

- weather/cloud/rain;
- thermal/temperature;
- reinforced stitching/needle/thread;
- pocket/storage;
- expand/oversized fit.

Do not substitute random Lucide icons with visually incompatible geometry. Either use a geometrically matching icon set or build the small icons as custom inline SVG paths.

The right column is not a conventional modern dashboard card grid. Reproduce the thin technical panels, spacing, typography, and transparency.

---

# 10. CHAPTER 03 — LINE / COLLECTIONS

The reference collections state shows four product cards across the frame in one horizontal row.

Header composition:

- Large `COLLECTIONS.` title on the left.
- Short technical description on the right.
- The upper portion can still reveal the residual previous chapter artwork during the transition.
- Dense grid remains continuous across the stage.

Each product card must have:

- numbered index such as `01`, `02`, `03`, `04`;
- title;
- price aligned in the technical layout;
- plus symbol in the upper-right;
- product image centered/lower in the card;
- two compact bottom tags/attribute labels;
- very thin border;
- subtle transparent/dark surface rather than generic solid ecommerce cards;
- precise internal spacing;
- hover/active feedback consistent with the reference.

The visible colorways are approximately:

1. acid-lime / green jacket;
2. pink / magenta jacket;
3. orange / coral jacket;
4. blue / cobalt jacket.

The reference uses product names/prices that should be read from the reference and reconciled with the existing seed. **Do not assume the current seed is correct just because it is already in the database.**

The reference’s cards visibly include labels such as:

- OVERSIZED FIT
- LIMITED QUANTITY
- LAYERING PIECE
- UTILITY
- THERMAL INSULATION
- WINDPROOF
- WATER-RESISTANT
- BREATHABLE

Use the actual visible wording and preserve line wrapping.

At the bottom center is a technical `VIEW ALL JACKETS` button.

---

# 11. PRODUCT HOVER / ACTIVE STATE

The reference visibly shows hover/active behavior on product cards.

When the pointer enters a card:

- the card must react subtly;
- the action area can switch from passive metadata to a `SHOP NOW` style control;
- the active card receives stronger emphasis without becoming a generic glowing card;
- the tiny side/edge markers remain aligned with the reference;
- typography and borders transition smoothly;
- interaction should feel technical and restrained.

Do not make the whole card bounce, enlarge dramatically, or add generic neon effects.

The pointer seen in the recording is the user’s mouse cursor. Do not automatically invent a custom cursor merely because a pointer is visible in the recording.

---

# 12. CHAPTER 04 — BUILD / TECHNOLOGY ENGINEERED TO ENDURE

This chapter is an immersive materials/engineering visualization.

Reference composition:

- Large stacked title on the left:
  `TECHNOLOGY`
  `ENGINEERED`
  `TO ENDURE`
- Large exploded jacket-material stack in the center.
- Material layers float with vertical separation.
- Strong blue/purple technical lighting.
- Supporting explanatory copy in the lower-left.
- Technical layer labels/details on the right.
- Dense grid background continues.
- Scroll-driven transitions can expose different portions of the previous/next chapter.

The exploded visualization should look like an actual designed technical object, not a generic infographic.

Current `construction.jpg` may be used if it visually matches, but reproduce the reference composition exactly.

Where the reference clearly benefits from layered depth/motion, use one of:

- a pre-rendered high-quality layered image with controlled transforms;
- CSS 3D layers;
- Three.js only if it materially improves fidelity and does not reduce performance.

Do not add gratuitous WebGL.

Right-side technical layer content should reflect the reference, including layer concepts such as:

- OUTER SHELL
- RIPSTOP PROTECTION
- BREATHABLE MEMBRANE
- COMFORT LINING

Again, use reference-faithful text and layout rather than generic filler.

The material stack must remain perfectly aligned with the stage and respond to scroll with calibrated movement rather than independent random animation.

---

# 13. CHAPTER 05 — KNOW / NEED TO KNOW

This is a transitional technical FAQ composition, not a normal FAQ page.

The reference visibly combines multiple layers of visual information at once:

- `NEED TO KNOW.` heading on the left/lower-left region;
- large jacket artwork partially visible in the lower area;
- part of the exploded material visualization remains visible above during transition;
- compact question/answer list occupies the right side;
- the grid and technical framing remain visible through the composition;
- the scene should feel like the previous chapter is dissolving into the information chapter.

FAQ topics visible in the source are approximately:

- HOW DO I CHOOSE THE RIGHT SIZE?
- WHAT MATERIALS ARE USED IN THE JACKETS?
- HOW SHOULD I CARE FOR MY JACKET?
- DO YOU SHIP INTERNATIONALLY?
- CAN I RETURN OR EXCHANGE MY ORDER?

Use the actual source wording where legible.

Accordion interactions must work. The opening/closing transition should visually match the technical language: controlled height/opacity transition, not generic browser accordion animation.

---

# 14. SCROLL TRANSITION CHOREOGRAPHY

This part is critical.

Do not make the five sections feel like unrelated screens.

Model the homepage as one continuous storyboard.

During forward scroll:

FORM should gradually deform toward SURFACE.

SURFACE should gradually compress/reposition into LINE.

LINE should move toward BUILD while residual product imagery/headers can remain momentarily visible.

BUILD should transition into KNOW with the materials stack and jacket sharing the frame.

KNOW should eventually fold back toward FORM when the user scrolls upward.

The reference shows the website being explored repeatedly in both directions, so the implementation must be reversible and deterministic.

Use normalized section progress and interpolation. For each chapter define at minimum:

- opacity;
- x translation;
- y translation;
- scale;
- optional rotation/perspective;
- blur only if clearly present;
- z-index;
- text visibility;
- image position;
- card visibility;
- background/grid emphasis.

Do not create physically impossible jumps between states.

The transition curve must be tuned by comparing screenshots captured at many progress points, not guessed once.

---

# 15. THE FRAME / HUD / GRID MUST BE REBUILT PRECISELY

The reference is built around a technical viewport frame.

Reproduce:

- outer black page background around the framed stage where present;
- inset framed stage;
- rounded corners;
- very thin border;
- tiny corner registration/bracket marks;
- dense dual-scale grid;
- restrained contrast;
- subtle shadow/vignette only where visible;
- continuous frame through all chapters;
- custom/visible scroll indicator treatment if present;
- correct clipping at the rounded corners.

The current 40px coarse grid is not sufficient.

Use a denser grid with one primary fine grid plus an optional larger technical grid, matched to the reference.

Do not use an obvious Tailwind `grid` utility and stop there.

Do not put the frame as a generic full-page rectangle with square corners.

Use CSS variables for exact frame inset, grid alpha, line opacity, radius, and stage background.

---

# 16. TYPOGRAPHY

Typography is part of the geometry.

The reference uses:

- compact monospaced technical labels;
- distinctive narrow futuristic/display lettering for major titles;
- strong letter spacing;
- uppercase labels;
- compact line heights;
- low-contrast supporting text;
- high-contrast primary text;
- extremely deliberate text block widths.

Do not default to ordinary Helvetica/Inter styling simply because it is convenient.

First determine the closest available font stack from the existing project or a locally available web-safe/open-source dependency. Then calibrate:

- font size;
- font weight;
- width;
- tracking;
- line-height;
- text transform;
- exact wrapping;
- baseline alignment.

Do not solve differences by changing copy length unless the reference copy itself is different.

For the logo/brand mark, prefer an exact SVG/vector reconstruction if the reference mark is not available as an asset.

---

# 17. MICRO-DETAILS ARE NOT OPTIONAL

Inspect and reproduce all of these where visible:

- tiny corner brackets;
- plus signs;
- arrow glyphs;
- tiny section indices;
- small icons;
- border thickness;
- border alpha;
- active card indicators;
- button corner details;
- divider lines;
- text tracking;
- grid intersections;
- micro-labels;
- scroll thumb;
- tiny technical copy;
- logo dimensions;
- nav spacing;
- cart counter spacing;
- image clipping;
- image softness;
- subtle vignette;
- residual previous-section artwork during transitions;
- hover-state text changes;
- focus states;
- loading states.

Do not omit a component merely because it looks “tiny”.

---

# 18. FULL WEBSITE, NOT ONLY THE HOMEPAGE

The reference video primarily exposes the immersive homepage experience, but the application must remain a **complete functioning website**.

Retain and fully wire the existing application routes for:

- Home.
- Shop.
- Collections.
- Individual product.
- Technology.
- About.
- Search where functionally required, but do not expose it in the hero navigation unless the reference does.
- Wishlist.
- Cart.
- Checkout.
- Login/authentication.
- Account.
- Policies.
- Admin dashboard.
- Admin products.
- Admin orders.
- Admin content.

All routes must share the same visual design system and technical language.

A user should not leave the immersive homepage and suddenly enter a generic Tailwind CRUD dashboard unless the route is intentionally an admin surface.

---

# 19. FRONTEND ARCHITECTURE

Use a maintainable component structure.

Separate:

- immersive stage;
- frame/HUD;
- navigation;
- chapter scene components;
- product cards;
- specification cards;
- FAQ items;
- material layer renderer;
- buttons;
- technical typography primitives;
- responsive behavior;
- scroll progress/controller.

Avoid one giant component with all logic mixed together.

Use deterministic state.

Do not duplicate the same content in five separate components if it belongs in the data layer.

Do not hide important application logic inside arbitrary CSS selectors.

---

# 20. STATE MANAGEMENT

Keep the existing Zustand bag/state system where correct, but make it production-safe.

Client state must control only UI/user state that belongs on the client.

Server-authoritative values must remain server-authoritative, especially:

- price;
- inventory;
- order totals;
- shipping calculation;
- authorization;
- user ownership;
- order status.

Handle hydration safely.

Do not cause cart-count flicker during initial render.

Persist cart state only according to the intended product model and reconcile with server state when authenticated.

Wishlist state must be server-backed for authenticated users.

---

# 21. DATABASE

Keep the real relational schema and extend it only when genuinely needed.

The existing data model already covers:

- users;
- sessions/accounts/verification;
- site settings;
- navigation;
- homepage sections;
- media;
- collections;
- products;
- variants;
- collection membership;
- FAQs;
- policies;
- SEO pages;
- user profiles/roles;
- addresses;
- cart items;
- wishlists;
- orders;
- order items;
- inquiries;
- audit logs.

Preserve this architecture.

Where additional fields are needed for true reference fidelity or production correctness, add a new ordered migration rather than editing the old migration destructively.

Use appropriate constraints and indexes.

Do not store critical structured data as an opaque blob when a relational field is clearly required.

---

# 22. BUSINESS LOGIC

Make the commerce system internally consistent.

Product detail:

- correct product;
- variant selection;
- inventory display;
- price from server data;
- add to bag;
- wishlist;
- unavailable state.

Cart:

- quantity changes;
- removal;
- server-side revalidation;
- correct subtotal;
- shipping;
- total;
- empty state;
- inventory conflicts.

Checkout:

- authenticated/customer handling according to current product requirements;
- server-side validation;
- server-side price calculation;
- inventory validation;
- order creation;
- atomic inventory decrement;
- no overselling under concurrent requests.

Do not trust client-submitted price or inventory.

Where payment credentials/provider integration do not exist, do not fabricate a fake payment-provider success. Implement a clean payment/order abstraction and truthful order flow instead.

---

# 23. TRANSACTIONS AND CONCURRENCY

The current order/inventory path should be upgraded so inventory mutations are atomic.

Use a real database transaction where supported.

Ensure:

- an order cannot be placed with insufficient inventory;
- two concurrent requests cannot oversell the same variant;
- failed order creation rolls back inventory changes;
- order/item insertion is atomic.

Add tests for this behavior.

---

# 24. API / SERVER FUNCTIONS

Every server operation must have a clear contract.

Provide clean server access for:

- storefront retrieval;
- product retrieval;
- collection retrieval;
- search;
- cart retrieval/update;
- wishlist toggle/list;
- checkout/order creation;
- account data;
- address management;
- admin dashboard;
- admin product editing;
- inventory editing;
- order status updates;
- content management;
- FAQ management;
- navigation management;
- media/content management;
- newsletter/inquiry submission.

Validate every external input with strong runtime schemas.

Do not trust a client-provided user id.

Do not expose staff-only records through public storefront calls.

Do not ship unnecessary endpoints simply because they sound impressive.

---

# 25. AUTHENTICATION / AUTHORIZATION

Keep Better Auth and the current identity integration.

Authentication must remain:

- secure;
- session-based;
- CSRF/origin-safe;
- correctly scoped;
- SSR compatible;
- protected against unauthorized server calls.

Authorization:

- customer pages require authenticated identity where appropriate;
- admin/staff server functions must enforce role checks server-side;
- owner/admin/editor distinctions must be respected if present;
- public content must remain public;
- user-owned data must be scoped to the authenticated user.

Never use a hidden client flag as authorization.

Never rely on UI hiding alone.

Never accept a client-supplied `user_id` as proof of identity.

---

# 26. SECURITY

Preserve and strengthen the current security model.

At minimum review:

- secure session cookies;
- SameSite behavior;
- CSRF/origin protection;
- server-side auth checks;
- role-based access control;
- input validation;
- output escaping/sanitization;
- SQL parameterization;
- rate limiting where appropriate;
- abuse protection on login/newsletter/admin operations;
- secret handling through environment variables;
- no credential/API-key exposure to the client;
- proper error messages that do not leak sensitive internals;
- safe logging.

Do not weaken security to make the clone easier.

---

# 27. CACHING

Use caching strategically without making inventory/account information stale.

Safe candidates include:

- public product catalog data;
- public collection data;
- public content settings;
- static media;
- generated SEO content.

Do not aggressively cache:

- user sessions;
- user-owned cart data;
- wishlist state;
- inventory-sensitive checkout information.

After admin content edits, ensure public cached data invalidates/revalidates correctly.

---

# 28. PERFORMANCE

The immersive homepage must remain smooth.

Target:

- high frame-rate scrolling;
- no visible scroll tearing;
- minimal layout recalculation;
- GPU-friendly transform/opacity animation;
- lazy loading of noncritical imagery;
- hero asset preloading;
- appropriate image dimensions;
- no enormous unnecessary bundles;
- avoid rendering invisible heavy DOM repeatedly;
- avoid needless React re-renders during scroll;
- pause/limit expensive effects when the document is hidden;
- respect `prefers-reduced-motion` without changing the normal reference experience.

Do not sacrifice fidelity for trivial micro-optimizations.

Do not sacrifice performance by adding a large 3D engine when CSS/image composition gives the same result.

---

# 29. RESPONSIVE DESIGN

Use the reference’s design language across viewport sizes.

Primary calibration:

**Reference desktop class:** around 800×600.

Secondary verification:

**1280×800 desktop.**

**390×844 mobile.**

For mobile:

- maintain the same composition hierarchy;
- avoid horizontal overflow;
- preserve the immersive frame;
- preserve the grid;
- preserve the chapter order;
- reorganize content only where physically necessary;
- do not turn the design into an unrelated mobile card layout.

Use responsive interpolation rather than hardcoding a completely different visual design.

---

# 30. UI/UX INTERACTION DETAILS

Every interactive element should have:

- normal state;
- hover state where applicable;
- active/pressed state;
- focus-visible state;
- disabled state;
- loading state where applicable;
- success/error feedback.

The visual language must remain restrained, technical, and reference-faithful.

Do not add:

- generic toast spam;
- excessive glow;
- bouncing buttons;
- oversized rounded cards;
- generic glassmorphism;
- random gradients;
- trendy dashboard patterns;
- animated cursors;
- stock UI icons that clash with the source.

---

# 31. MOTION / FRAMER MOTION / ANIMATION POLICY

Use Framer Motion or an equivalent animation library only where it materially improves the reference reproduction.

For scroll-linked animation, prefer deterministic interpolation over component mount/unmount animation.

Use spring physics only if the reference actually has spring-like motion.

Prefer exact easing curves for visible transition states.

Animations must be reversible.

Do not let animated text reflow unexpectedly.

Do not allow image scale to cause page layout shift.

Do not animate hundreds of DOM elements independently every frame.

---

# 32. 3D / MATERIAL VISUALS

The reference includes a visually dimensional exploded material stack.

Treat this as a serious visual system.

If a true 3D implementation is necessary:

- use Three.js only for the relevant isolated scene;
- keep geometry simple;
- match the material stack exactly;
- use controlled camera/lights;
- keep the background transparent/dark as shown;
- synchronize transforms with scroll progress;
- avoid unnecessary interactivity.

If the supplied static asset already matches the reference better than an improvised model, prefer the asset and animate it intelligently.

The target is visual fidelity, not technical novelty.

---

# 33. ASSET POLICY

Inventory every asset in the workspace.

Reuse exact matching assets.

For missing assets that are clearly simple geometry/icons:

- create them as SVG/CSS/vector elements.

For a missing complex visual:

- inspect whether an existing asset or layer combination can reproduce it before generating a replacement.

Do not use unrelated stock photography.

Do not use placeholder boxes where the reference clearly contains real artwork.

Do not silently change the product jacket artwork.

---

# 34. CONTENT FIDELITY

Do not invent marketing copy.

For each visible text block:

1. read it from the reference;
2. compare with current seed/database content;
3. use the reference wording where legible;
4. preserve punctuation, casing, line breaks, and ordering where visible.

If a tiny text region is genuinely unreadable, use the closest existing content rather than inventing a new marketing claim.

Do not let content length destroy geometry.

Where the reference uses deliberate glyph scrambling/glitching, maintain a clean semantic source string and render the corruption only as a visual effect.

---

# 35. NAVIGATION

The visible hero navigation in the reference is minimalist and centered.

Match the visible items and spacing exactly.

The reference visibly includes:

`SHOP`
`COLLECTIONS` with a small downward indicator
`TECHNOLOGY`
`ABOUT`

and a small `CART [ 0 ]` style indicator on the right.

Do not automatically expose SEARCH / ACCOUNT / SIGN IN in the hero header just because those routes exist.

Those features may remain available through their intended application flows, but the hero header must visually match the reference.

---

# 36. FOOTER / SUPPORTING PAGES

The reference video does not provide enough visual evidence to invent a completely new footer design.

Keep a functional footer and supporting pages, but apply the same technical visual system.

Do not make up sections that are not required.

Keep the real:

- policy pages;
- contact/newsletter functionality;
- account area;
- cart/checkout;
- admin system.

These may use a more conventional internal layout while still using the same typography, borders, grid, spacing, and dark technical aesthetic.

---

# 37. ADMIN PANEL

Retain the real admin functionality, but make sure it actually controls the content used by the public site.

Admin should be able to manage at least:

- site settings;
- navigation;
- homepage sections;
- FAQs;
- policies;
- products;
- variants;
- inventory;
- featured status;
- SEO metadata;
- media references;
- orders/status;
- relevant audit records.

A change in CMS content must appear correctly in the public experience after the appropriate revalidation.

Do not build fake admin toggles that do not persist.

---

# 38. SEO

Implement production-grade SEO without changing the visual design.

Include:

- page titles;
- descriptions;
- canonical URLs;
- Open Graph metadata;
- social preview image;
- robots configuration;
- sitemap support;
- structured data for products/pages where appropriate;
- semantic heading hierarchy;
- meaningful image alt text;
- accessible link/button names.

The immersive visuals must not destroy semantic accessibility.

---

# 39. ACCESSIBILITY

Maintain keyboard and screen-reader functionality without visibly changing the reference.

Requirements:

- semantic buttons/links;
- focus-visible states;
- proper ARIA only where necessary;
- accordion semantics for FAQ;
- alt text;
- reduced-motion support;
- sufficient contrast for important text;
- no inaccessible pointer-only interactions.

The visual glitch effect must never be the only source of important semantic information.

---

# 40. TESTING

Do not stop after visual coding.

Run:

- TypeScript typecheck.
- ESLint.
- Unit tests.
- Auth tests.
- Server/data tests.
- Build.
- Dev preview smoke test.
- Built-output smoke test.
- Interactive browser checks.

For visual QA, capture screenshots at:

1. reference-style 800×600 desktop;
2. 1280×800 desktop;
3. 390×844 mobile.

Capture states at minimum:

- hero settled;
- hero near transition;
- details settled;
- details near transition;
- collections settled;
- a product hover/active state;
- technology settled;
- technology-to-know transition;
- need-to-know settled;
- reverse-scroll return to hero.

Compare each against the supplied video/reference frames.

Do not claim success based on a single screenshot.

---

# 41. VISUAL REGRESSION MINDSET

For every iteration ask:

**What is different from the reference?**

Then classify the mismatch as:

- geometry;
- typography;
- image scale;
- image position;
- color/contrast;
- border;
- grid;
- content;
- motion;
- interaction;
- responsive behavior.

Fix the highest-impact mismatch first, then repeat.

Do not polish tiny shadows while a major section is still structurally wrong.

Do not declare a section finished until its geometry, content, and motion agree.

---

# 42. DO NOT CHEAT

Never solve the request by:

- embedding the video as the website;
- using the video as a background;
- using a giant screenshot as the UI;
- making a noninteractive image pretending to be a website;
- drawing a screenshot in one canvas while the real application is fake;
- creating five fake sections with buttons that do nothing;
- hardcoding a single screenshot state and calling it responsive;
- removing backend functionality just to make the frontend easier;
- using placeholder text where the reference is readable;
- using generic cards with slightly similar colors;
- using arbitrary CSS transforms without calibrating them against the reference;
- hiding errors behind broad `catch` blocks;
- weakening authentication or authorization.

The final result must be a real application.

---

# 43. DO NOT OVER-REFACTOR

Preserve working code wherever it already does the correct job.

Change architecture only when necessary for:

- visual fidelity;
- performance;
- correctness;
- maintainability;
- security;
- testability.

Do not rewrite the entire project simply because another structure looks cleaner.

The goal is a finished product, not a rewrite exercise.

---

# 44. IMPLEMENTATION ORDER

Follow this order.

### PHASE A — Continue current enhancement
Finish the enhancement already underway without reverting it.

### PHASE B — Forensic reference audit
Study the entire reference video and existing project.

### PHASE C — Visual foundation
Fix frame, grid, typography, logo, navigation, stage sizing, HUD, background, scrollbar treatment.

### PHASE D — Immersive chapter system
Replace discrete chapter swapping with continuous scroll-linked interpolation.

### PHASE E — Chapter fidelity
Rebuild FORM, DETAILS, COLLECTIONS, TECHNOLOGY, KNOW one by one.

### PHASE F — Interaction fidelity
Implement hover, active, accordion, buttons, links, cart count, navigation behavior.

### PHASE G — Data/backend fidelity
Reconcile database/seed content, commerce rules, inventory, auth, RBAC, CMS wiring, APIs.

### PHASE H — Performance/security/SEO/accessibility
Harden the application without altering the visual target.

### PHASE I — QA and visual regression
Run the full test matrix and iterate until major differences are removed.

### PHASE J — Final cleanup
Remove dead code, broken imports, placeholder content, debug logs, and unused visual hacks.

---

# 45. ACCEPTANCE CRITERIA — PIXEL-PERFECT STANDARD

Do not finish merely because the website “looks good”.

The clone is considered complete only when:

1. The reference frame and stage geometry match.
2. The grid density/opacity matches.
3. The brand mark placement matches.
4. Header/nav spacing matches.
5. Hero jacket scale and placement match.
6. Hero annotations match.
7. Hero bottom information boxes match.
8. Hero CTA matches.
9. Details scene geometry matches.
10. All five specification cards and icons match.
11. Collections row matches.
12. Product card geometry/content/actions match.
13. Product hover behavior matches.
14. Technology scene matches.
15. Material-layer visual and labels match.
16. Need-to-know transition matches.
17. FAQ behavior works.
18. Forward and reverse scrolling work smoothly.
19. The full ecommerce/application stack remains functional.
20. Authentication and authorization remain secure.
21. Database state remains durable and consistent.
22. Admin changes are real and persist.
23. SEO/accessibility remain intact.
24. No console errors.
25. No broken routes.
26. No horizontal overflow on mobile.
27. Dev and built output behave consistently.
28. No placeholder/fake UI remains.

---

# 46. FINAL INSTRUCTION

**START BY CONTINUING YOUR CURRENT ENHANCEMENT. THEN DO THE FORENSIC AUDIT. THEN IMPLEMENT ALL REQUIRED CORRECTIONS IN THE EXISTING WORKSPACE. DO NOT PAUSE AFTER THE FIRST VISUAL IMPROVEMENT. DO NOT ASK ME TO MANUALLY PATCH ANYTHING. DO NOT STOP AT A STATIC FRONTEND. BUILD, TEST, COMPARE, FIX, REPEAT.**

Treat the reference video as the visual specification and the existing workspace as the application foundation.

**The goal is not “a website inspired by the video.”**

**The goal is one coherent, pixel-accurate, scroll-driven, production-grade COUR website whose visible experience matches the reference and whose frontend/backend/database/business logic/authentication/authorization/state/API/testing/security/performance/SEO/admin/commerce/deployment stack actually works underneath it.**

When you make a change, verify that the change improves both the reference match and the real application rather than breaking something that already worked.

**Continue first. Enhance second. Reconstruct third. Verify continuously. Finish completely.**
