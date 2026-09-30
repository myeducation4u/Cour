# ULTRA PRO MAX — FORENSIC FULL-STACK REPAIR + PIXEL-PERFECT RECONSTRUCTION PROMPT

## MISSION

You are continuing work inside an existing Grok website workspace that was previously generated and then partially enhanced. The current workspace is **NOT acceptable yet**. It contains visual mismatches, transition/scroll choreography errors, content inconsistencies, implementation bugs, security/authorization weaknesses, commerce workflow problems, configuration drift, and incomplete fidelity to the supplied reference video.

Your job is **NOT to create another approximate redesign**.

Your job is to:

1. **Continue the enhancement already present in the workspace.**
2. Exhaustively inspect the existing workspace before modifying it.
3. Compare the current implementation against the supplied reference video and reference frames.
4. Find and fix the current implementation's visual, interaction, animation, data, backend, security, testing, and deployment defects.
5. Preserve correct existing functionality and platform-specific infrastructure unless there is a concrete defect that requires change.
6. Reconstruct every observable part of the reference faithfully.
7. Ensure that every interactive feature is real and wired end-to-end.
8. Produce a stable production build and verify the result rather than stopping after code generation.

This is a **forensic repair and reconstruction task**, not a “make it look similar” task.

---

# 0. NON-NEGOTIABLE FIRST INSTRUCTION — CONTINUE CURRENT ENHANCEMENT

**FIRST: CONTINUE THE ENHANCEMENT YOU ARE ALREADY DOING. DO NOT RESET THE PROJECT. DO NOT RE-SCAFFOLD FROM ZERO. DO NOT THROW AWAY THE CURRENT WORK. DO NOT START BY REWRITING THE APP AS A NEW PROJECT.**

Before touching architecture:

- inspect the current git/workspace state;
- identify what the previous enhancement already changed;
- preserve all correct work;
- continue from that state;
- then repair the defects listed below and anything else you discover during the audit.

Do not satisfy this task by merely producing an audit report. **Actually modify the workspace and implement the fixes.**

Do not stop after fixing only the homepage.
Do not stop after fixing only visual CSS.
Do not stop after making screenshots look better.
Do not stop after TypeScript passes.
Do not stop after the first successful build.

The finished product must be simultaneously:

- reference-faithful visually;
- smooth and reference-faithful in motion;
- responsive;
- accessible;
- type-safe;
- testable;
- secure;
- data-consistent;
- server-authoritative where required;
- deployable;
- maintainable;
- and fully functional.

---

# 1. SOURCE-OF-TRUTH PRIORITY

Use the following priority order when resolving conflicts:

### Priority A — Supplied reference video and extracted reference frames
The video is the strongest authority for observable visual composition, timing, movement, transitions, hover states, scroll behavior, text placement, object movement, and overall experience.

### Priority B — Supplied reference screenshots/crops
Use these to measure static states and inspect details that are difficult to see in motion.

### Priority C — Existing workspace assets that demonstrably correspond to the reference
Do not replace correct assets with generic substitutes.

### Priority D — Existing implementation
Preserve it when it is already correct; repair it when it is not.

### Priority E — Inference
For behavior or backend details that cannot be directly observed from the video, use the existing application intent and conventional production architecture, but do not invent fake functionality merely to make the UI appear complete.

When something is directly observable, do not replace it with an aesthetically similar interpretation.

---

# 2. EXHAUSTIVE AUDIT REQUIREMENT

Before implementation, perform a repository-wide audit.

The current workspace contains approximately **482 files** and approximately **15k+ lines of application/configuration/test/migration source** in the primary code corpus. Treat the repository as a single system, not just a frontend folder.

Inspect, at minimum:

- every application source file;
- every route;
- every component;
- every style file;
- every server function;
- every auth file;
- every middleware file;
- every database migration;
- every seed/data file;
- every test;
- every build/config file;
- every script used by development, preview, migration, testing, and deployment;
- every public media asset;
- all reference screenshots available inside the workspace;
- generated build output only as an artifact to inspect, never as the primary source of truth.

Do not assume that a file is correct because it compiles.
Do not assume that a file is irrelevant because it is not visually visible.
Do not assume that a feature is complete because a button exists.

For each subsystem, answer internally:

- What is it supposed to do?
- What does it actually do?
- What calls it?
- What data does it depend on?
- What happens on failure?
- Is authorization enforced server-side?
- Is state authoritative or merely client-local?
- Does it match the reference?
- Is it responsive?
- Does it have loading/error/empty states?
- Does it remain correct on refresh/navigation/back/forward?
- Does it work without JavaScript-dependent illusions?
- Does it survive race conditions and repeated clicks?
- Does it create stale or duplicated data?
- Does it introduce visual layout drift?

Create an internal defect matrix before editing. Then fix the defects instead of merely listing them.

---

# 3. KNOWN CURRENT DEFECTS — TREAT THESE AS REQUIRED FIXES

The current workspace already exhibits the following defects. Verify each one against the current code before changing it, because the workspace may have evolved, but **none of these may simply be ignored**.

## 3.1 Loader / screenshot timing bug

The home experience currently uses a roughly 1400 ms timeout plus image onLoad to hide the loader. This is fragile and has produced screenshots where the supposed hero is still only:

- a centered COUR mark;
- “PLEASE WAIT”;
- an otherwise empty black stage.

Fix this properly.

Requirements:

- preload all critical hero assets required for the first visible stage;
- track actual critical readiness rather than using a fixed arbitrary delay;
- guarantee a fallback timeout so a single broken/non-firing asset cannot trap the app forever;
- do not flash the loader in normal fast navigation;
- do not capture an incomplete visual state during normal startup;
- ensure screenshot/Playwright automation waits for a reliable readiness condition;
- expose a deterministic `data-ready` or equivalent state for QA;
- preserve accessibility semantics.

The loading experience itself should visually match the reference only to the degree it is observable. Do not invent a full-page loader sequence if the reference does not show one.

## 3.2 Scroll-progress calculation is coupled to the entire document

The current stage progress uses:

`document.documentElement.scrollHeight - window.innerHeight`

as the denominator.

This means the immersive homepage's internal animation timeline is affected by unrelated document content such as the footer and viewport changes.

Replace this with a stage-local progress model based on the actual sticky track/stage geometry.

The homepage timeline must remain deterministic regardless of footer length.

## 3.3 Chapter thresholds are crude approximations

The current implementation effectively uses hard chapter boundaries like:

- form before ~0.18;
- surface before ~0.40;
- line before ~0.62;
- build before ~0.82;
- know after that.

These values are rough guesses, not a faithful representation of the reference video.

Do not just tweak the five numbers.

Reconstruct continuous ranges for:

- entering chapter;
- chapter body state;
- exit state;
- next chapter pre-roll;
- hero-object movement;
- text appearance/disappearance;
- card appearance;
- typography transitions;
- nav/rail changes;
- decorative line/grid changes.

The rendered page must be correct **between** the major chapter screenshots, not only at the five endpoints.

## 3.4 Crossfade layers currently behave like five independent full-screen pages

The current code stacks five absolute layers and gates opacity with CSS variables.

This can cause:

- simultaneous content that should not coexist;
- visual overlap;
- wrong z-order;
- interaction being unavailable during transition states;
- abrupt chapter switches.

The reference behaves like one coordinated scene.

Rebuild the timeline around a shared choreography model.

Every layer should have a controlled lifecycle:

`pre-enter -> enter -> hold -> exit -> hidden`

and its position, scale, opacity, blur, visibility, z-index, pointer-events and content should be tied to the same continuous progress value.

## 3.5 Reference chapter composition is wrong in the current collections screenshot

The current implementation can show the COLLECTIONS heading, TECHNOLOGY copy, construction object, and collection products in an overlapping state.

This is not acceptable.

Fix the transition model so that:

- the reference's in-between states exist only where the video actually shows them;
- each element has a controlled entrance/exit interval;
- the jacket/object and section copy transition independently but coherently;
- construction content cannot visually sit on top of collections cards merely because two layers both have non-zero opacity;
- z-index is deterministic;
- pointer-events follow visual/semantic availability.

## 3.6 Wrong hero product visual / treatment

The reference hero is a dark, glossy, high-specification puffer with deep blue/black body tones, violet/iridescent highlights and a premium technical-material appearance.

Do not substitute a generic blue-green product render or visibly boxed catalog image when the reference presents the object as an immersive specimen.

Use the closest existing correct asset where available. If the asset requires preprocessing, do not alter the product's identity or silhouette.

If a transparent product cutout is used, the surrounding treatment must reproduce the reference's integration with:

- dark grid;
- subtle bloom/specular highlights;
- edge glow where observable;
- scale;
- position;
- rotation;
- depth impression;
- and transition movement.

Do not turn the product into a fake hero card.

## 3.7 DETAILS state composition mismatch

The reference DETAILS state has:

- large `DETAILS MATTER.` heading on the left;
- restrained paragraph directly beneath;
- `EXPLORE THE JACKET →` CTA;
- large dark/iridescent hero jacket occupying the center/left;
- five technical specification cards arranged on the right;
- small numbered identifiers;
- technical icons;
- thin borders and dense technical grid;
- controlled vertical framing;
- reference-faithful typography scale.

The current state is too generic, with wrong jacket treatment and spacing.

Re-measure and rebuild the layout.

The five observable features are:

1. WEATHER-RESISTANT SHELL
2. THERMAL INSULATION
3. REINFORCED CONSTRUCTION
4. FUNCTIONAL STORAGE
5. OVERSIZED FIT

Keep copy and order consistent with the reference/data model.

## 3.8 COLLECTIONS state mismatch

The reference collection row presents four products with distinct bright jacket colors and consistent product card geometry:

- SHADOW PUFFER JACKET — lime/green appearance;
- TACTICAL HOODED JACKET — magenta/pink appearance;
- THERMAL BOMBER JACKET — orange/red appearance;
- TECH SHELL JACKET — blue appearance.

The row uses:

- numbered product index;
- product name;
- price;
- plus/action control;
- product cutout/image;
- restrained card framing;
- technical grid background;
- hover/interactive CTA behavior;
- consistent vertical baseline.

The current implementation allows unrelated technology content to remain visible at the same time.

Fix layout, product scale, image cropping, text baselines, action positioning, hover transitions, and stage choreography.

## 3.9 TECHNOLOGY state is not a faithful recreation

The reference shows a technical construction/exploded-layer composition rather than a generic editorial image block.

The visible concept is a layered jacket construction with multiple physical material layers and labels. The supplied reference frame shows an exploded stack with spatial separation.

Do not use a generic static two-dimensional `<img>` simply placed inside a card if the reference requires a depth/exploded treatment.

Where a real 3D model is unavailable:

- use transparent layer assets and transform-based depth staging;
- or construct a layered 3D scene with CSS/Three.js if appropriate;
- do not fabricate a random 3D object unrelated to the reference.

The labels should correspond to the observable construction order and remain aligned to the moving layers.

## 3.10 NEED TO KNOW / FAQ state mismatch

The reference places the NEED TO KNOW content as a composed technical chapter rather than a standard full-width FAQ page.

Requirements:

- heading placement should match the reference;
- FAQ stack should be right-weighted;
- jacket/object may remain as a transitional visual where the video shows it;
- rows must have exact line treatment and plus/expanded indicators;
- expanded content must not be clipped;
- accordion height must be content-driven, not an arbitrary hard maximum;
- transitions must be smooth and reversible;
- keyboard accessibility must work.

## 3.11 Header/nav mismatch

The reference home header is minimalist and technical. The current implementation can expose extra account/search behavior that is not part of the reference home chrome.

Preserve real app navigation functionality, but make the visible home presentation match the reference.

Required visible primary structure on desktop should align to the reference:

- SHOP
- COLLECTIONS with indicator
- TECHNOLOGY
- ABOUT
- CART with count/state

Do not add conspicuous extra primary items simply because the backend supports accounts.

Account access can remain available through the correct product flow/menu where appropriate without visually damaging the reference header.

`COLLECTIONS` indicator must correspond to a real interactive affordance, not decorative dead UI.

## 3.12 Brand mark mismatch

The existing brand mark is an approximation built from a generic square/letter treatment.

The reference has a distinctive technical mark.

Inspect the supplied reference and the existing logo assets carefully.

Do not replace it with a random logo redesign.

Reproduce:

- silhouette;
- line weight;
- dimensions;
- negative space;
- wordmark spacing;
- alignment;
- small-size rendering;
- hover/transition behavior.

If the mark is not fully recoverable as a vector from the supplied references, create a clean vector reconstruction based on observable geometry rather than relying on an unrelated icon package.

## 3.13 Grid system mismatch

The current grid is too generic/coarse.

The reference uses a dense technical micro-grid with multiple line scales.

Reconstruct the grid as layered systems where observable:

- primary micro grid;
- secondary grid lines;
- subtle contrast hierarchy;
- chapter-specific hot/highlight grid movement;
- clipping inside the rounded stage;
- transition behavior.

Avoid expensive per-pixel DOM grids. Prefer CSS gradients or canvas/WebGL where appropriate.

Do not use random high-contrast lines.

## 3.14 Pointer tilt is too generic/exaggerated

The current implementation can rotate the hero roughly ±14deg on Y and ±8deg on X.

This is an excessive generic parallax effect unless the reference actually demonstrates that magnitude.

Reconstruct the observed pointer response:

- amplitude;
- easing;
- return-to-center speed;
- effect radius;
- whether text/grid/object move differently;
- disabled behavior on coarse pointers;
- reduced-motion behavior.

Do not let pointer motion change semantic layout.

## 3.15 Glitch/decode text is non-deterministic

The existing DecodeText uses randomized glyph replacement over multiple frames.

Problems:

- visual regression tests become unstable;
- repeated activations can produce different frames;
- animation timing may not match the reference;
- text can flicker unnecessarily.

Make the effect deterministic per text token/state.

Use:

- seeded pseudo-random sequence;
- stable glyph set;
- reference-calibrated timing;
- cleanup on unmount/state change;
- reduced-motion fallback;
- no content corruption after the animation finishes.

If a glitch pattern is not observable in a particular state, do not apply it merely for style.

## 3.16 Hardcoded content patch is unacceptable

The current homepage code contains logic equivalent to converting `EST. 2020` into `EST. 2022` in the rendering path, and the seed data separately patches the same content.

Do not keep content-repair hacks inside rendering logic.

Choose one canonical source of truth.

Content must be:

- stored correctly;
- read correctly;
- validated;
- rendered directly;
- editable from the appropriate admin mechanism;
- and covered by test fixtures where relevant.

No string-replacement hacks.

## 3.17 Admin editor has unsafe raw homepage JSON

`homepage_sections.content` is currently treated as a raw string.

This allows malformed JSON or structurally invalid data to reach the live homepage.

Implement typed schema validation with Zod or the existing validation layer.

Validation must be section-specific.

For example:

- hero content schema;
- details spec schema;
- collections presentation schema;
- construction layer schema;
- know/FAQ schema.

Reject malformed content server-side.

Do not rely on client validation alone.

## 3.18 Critical authorization bug in address editing

The current `saveAddress` flow allows an optional address id and then performs an `ON CONFLICT (id)` update without first proving that the address belongs to the authenticated user.

This can permit a user who knows another address id to update that record.

Fix it immediately.

When updating:

- select/verify ownership first;
- or use an `UPDATE ... WHERE id = ? AND user_id = ?` path;
- never let primary-key conflict resolution bypass ownership checks.

Add regression tests for horizontal privilege escalation.

## 3.19 Order placement has inventory race conditions

The current checkout logic:

1. reads inventory;
2. verifies quantity;
3. inserts the order;
4. inserts each order item;
5. decrements inventory separately;
6. does not guarantee that the decrement affected exactly one row;
7. is not atomic across the full order.

This is unsafe under concurrent checkout.

Replace it with a transaction.

Requirements:

- validate all lines;
- compute server-authoritative prices;
- atomically reserve/decrement inventory;
- abort on any failed stock decrement;
- create order and order items in the same transaction;
- rollback everything on failure;
- clear server cart only after successful order completion;
- use idempotency protection for repeated submit requests;
- never create an order that exceeds actual inventory.

## 3.20 Guest checkout completion flow is broken

The current checkout can place an order as a guest but then clears the local bag and navigates to `/account`, which can redirect the guest to `/login`.

That means a successful guest purchase does not have a proper completion destination.

Implement a real order confirmation route, for example:

`/order/$orderId`

or an equivalent guest-safe confirmation route using a secure confirmation token.

Show:

- order identifier;
- total;
- shipping summary;
- items;
- confirmation message;
- next navigation.

Do not expose another user's order by predictable id alone.

Use a secure lookup strategy.

## 3.21 Shipping logic is too hardcoded

The current server logic uses fixed shipping values and a fixed threshold, including a default US country.

Centralize this configuration.

The server remains authoritative.

The client may preview an estimate, but the server must recompute the exact shipping charge during order creation.

Make country/address requirements consistent throughout:

- checkout form;
- account address form;
- database;
- server validation;
- order snapshot.

## 3.22 Checkout lacks robust state handling

Add:

- disabled submit while pending;
- prevention of duplicate submits;
- inline field validation;
- server error display;
- retry behavior;
- clear success state;
- no silent failure;
- preserved form data when non-destructive failures occur.

Never show a false success state.

## 3.23 Login performs navigation during render

The login route currently triggers navigation conditionally from render.

Move navigation into an appropriate effect/state transition or route guard.

Ensure there is no render-side side effect loop.

Authentication UX must have explicit:

- loading;
- error;
- success;
- disabled;
- redirect target handling.

## 3.24 Authentication configuration drift

The workspace contains a mismatch between the comment in the email/password auth toggle and the actual value, and `.grok/app-env.json` does not align with tests that expect auth-off behavior.

Do not blindly disable authentication.

Instead, determine the intended environment contract from the workspace's platform wiring and tests.

Then make the application deterministic in each environment.

At minimum:

- preview auth behavior must be intentional;
- local/dev auth behavior must be intentional;
- deployed auth behavior must be intentional;
- tests must match the intended configuration;
- the login UI must reflect actual enabled providers.

Do not break the platform's frozen auth integration merely to “simplify” it.

## 3.25 Admin permission model is too broad

The current `requireStaff` approach broadly permits multiple staff roles to perform sensitive mutations.

Introduce permission granularity.

At minimum separate permissions conceptually into:

- owner/platform settings;
- catalog/product management;
- inventory management;
- order management;
- content management;
- media management;
- customer data access;
- audit access.

Server-side enforcement is mandatory.

Hiding a button is not authorization.

## 3.26 Admin claim-owner race condition

The first-admin/owner claim operation must be atomic.

Do not rely on:

`select -> if none -> insert`

without a uniqueness/race-safe mechanism.

Use:

- transaction;
- unique constraint/index where appropriate;
- atomic insert/compare-and-set semantics;
- deterministic error handling.

## 3.27 Admin mutations lack strong validation

Server-side validate:

- product slug format;
- unique slug errors;
- non-negative prices;
- finite integer inventory;
- allowed variant status;
- allowed product status;
- color hex format;
- length constraints;
- URL protocols;
- internal route references;
- FAQ content length;
- navigation location/sort values;
- media kind values;
- policy content size;
- content JSON schema.

Do not trust frontend dropdowns or form types.

## 3.28 Arbitrary navigation hrefs

Admin navigation editing currently accepts arbitrary href strings.

Validate and constrain routes according to intended behavior.

If external links are permitted, explicitly validate allowed schemes and apply safe attributes where relevant.

Do not let malformed input produce broken navigation or unsafe protocols.

## 3.29 Arbitrary media URLs

Media management currently accepts arbitrary URLs.

Implement a proper media model and validation.

At minimum reject dangerous protocols and validate expected image/media forms.

Where the platform supports uploads, use the supported upload mechanism rather than forcing admins to type raw URLs.

Do not promise CDN upload functionality if the environment does not support it, but do not leave the current raw-string trap either.

## 3.30 Order status is not server-whitelisted

Server-side order status mutation must reject arbitrary status strings.

Define an explicit allowed state machine, for example:

`placed -> confirmed -> packed -> shipped -> delivered`

plus controlled cancellation/refund states if those are supported.

Do not let the client invent statuses.

## 3.31 Public inquiry/newsletter form is too permissive

The public inquiry endpoint lacks sufficient anti-spam and input hardening.

Add appropriate protections such as:

- strict email validation;
- max lengths;
- message limits;
- honeypot if appropriate;
- rate limiting compatible with runtime;
- duplicate submission protection;
- normalized kind values.

Avoid breaking legitimate use.

## 3.32 Public product route leaks raw inventory quantities

The public product API currently returns `inventoryQuantity` for active variants.

Decide whether the exact quantity is actually required by the public product UI.

Prefer returning semantic availability such as:

- in stock;
- low stock;
- sold out;

unless exact numeric quantity is explicitly required.

Do not leak unnecessary operational inventory data.

## 3.33 Search implementation is split between server and client

A server-side `searchProducts` function exists, but the search route currently performs client-side filtering over a fetched product list.

Use one coherent search architecture.

For small seed data, either is technically possible, but the application should not carry a dead server API and an unrelated client search path simultaneously.

Prefer server-side search as the canonical implementation and debounce requests.

Handle:

- empty search;
- loading;
- no results;
- error;
- special characters;
- case normalization;
- URL query state.

## 3.34 Cart validation can accept invalid numeric state

Harden client and server quantities.

Never allow:

- NaN;
- Infinity;
- negative values;
- decimals for discrete product quantities;
- values above the intended maximum.

All server-facing cart/order quantities must be independently validated.

Client persistence must tolerate corrupted localStorage without crashing the app.

## 3.35 Footer structure is inconsistent

The non-home shell nests the footer inside the rounded stage, while CSS selectors appear to expect a different hierarchy.

Normalize page shell structure.

Decide exactly what is part of the immersive stage and what is part of the surrounding page.

Do not accidentally put standard site footer content inside the hero stage unless the reference route specifically requires that.

## 3.36 Footer/newsletter UX is under-specified

Add:

- pending state;
- duplicate-submit prevention;
- success feedback;
- error feedback;
- `aria-live` status;
- correct button state;
- meaningful validation.

Avoid double submissions.

## 3.37 Database constraints are weaker than the business model

The migration currently lacks several useful integrity constraints.

Evaluate and add appropriate constraints for:

- non-negative money values;
- non-negative inventory;
- positive quantity;
- allowed status values;
- valid sort orders;
- required relationships;
- ownership references where the auth model permits it;
- relevant indexes.

Be careful with external identity tables and platform-provided auth schema: do not add constraints that break the existing preview/auth architecture.

## 3.38 Query efficiency

`getStorefront` currently performs several sequential reads.

Optimize where safe.

Do not sacrifice correctness for micro-optimizations.

Evaluate:

- query batching;
- caching;
- indexes;
- repeated seed checks;
- N+1 patterns for orders/items;
- repeated product/media lookups.

## 3.39 Seed/data architecture must not mutate production data unpredictably

`ensureSeed()` and related seed logic must be deterministic.

It should be safe to run repeatedly.

Do not silently overwrite administrator-edited content.

Separate:

- initial seed;
- migration;
- content correction;
- test fixture.

Never use render-time content fixes as a substitute for data migration.

---

# 4. REFERENCE VISUAL RECONSTRUCTION — EXACT STAGE MODEL

Treat the reference homepage as a **single immersive technical interface**.

The large black areas visible around the captured website in the portrait recording are not automatically website content. Determine the real webpage stage bounds from the frame itself.

Do not build a 864×1920 “mobile site” merely because the video recording is portrait.

The reference stage itself is a framed web experience with an inset rounded technical viewport.

Implement a stage system that supports:

- desktop/laptop;
- tablet;
- mobile;

while preserving the same art direction.

Do not distort the desktop composition into a tiny mobile replica.

---

# 5. HOME STAGE GEOMETRY

Measure from the supplied reference rather than guessing.

The stage needs:

- inset from browser edges;
- rounded corners;
- thin outer border;
- technical corner marks;
- dense grid clipped within stage;
- subtle background glow/vignette;
- controlled internal safe area;
- small technical scroll indicator;
- chapter index.

Make the geometry responsive using CSS variables so that the visual ratios remain stable across viewport sizes.

Avoid using fixed pixel offsets everywhere.

Use a small set of calibrated design tokens:

- stage inset;
- stage radius;
- border alpha;
- grid spacing;
- edge padding;
- header height;
- content safe zone;
- type scale;
- card gap;
- object scale.

Then calibrate those tokens against the reference screenshots.

---

# 6. TYPOGRAPHY SYSTEM

The reference is highly typographic and technical.

Use the closest existing font assets already supplied in the workspace where they match the reference.

Do not substitute arbitrary modern UI fonts.

Calibrate:

- display heading width;
- letter spacing;
- line height;
- monospace metadata;
- tiny uppercase navigation;
- card title weight;
- number labels;
- body copy width;
- CTA tracking;
- decode/glitch glyphs.

Do not let browser font fallback change geometry unpredictably.

Use explicit font-display/preload strategy where appropriate.

---

# 7. HERO / FORM CHAPTER

The initial chapter should communicate:

`ENGINEERED FOR MOTION.`
`BUILT TO ENDURE.`

on the left, and:

`DESIGNED FOR THE UNKNOWN.`
`READY FOR ANYTHING.`

on the right, with the central product specimen dominating the composition.

The lower region includes the technical ticker/copy and central CTA. The lower left contains the establishment/brand information, and the lower right contains worldwide shipping/delivery information.

The hero should include the reference's small technical corner marks and subtle visual guides where observable.

### CTA

`SHOP NOW →`

must navigate to the real shop route.

### Hero image choreography

Do not use a static centered image.

The object must have calibrated:

- initial scale;
- x/y translation;
- opacity;
- subtle depth;
- transition into DETAILS;
- transition through COLLECTIONS;
- transition into TECHNOLOGY/KNOW.

Do not invent exaggerated movement.

Use continuous interpolation derived from reference frames.

---

# 8. DETAILS / SURFACE CHAPTER

Composition requirements:

Left:

`DETAILS MATTER.`

and descriptive copy.

Below it:

`EXPLORE THE JACKET →`

Center-left/center:

large hero jacket specimen.

Right:

five technical feature cards.

Each card should include:

- tiny number;
- icon;
- title;
- concise technical description;
- reference-faithful border and spacing.

The cards should enter with controlled stagger where observable, not generic simultaneous fade-ins.

The object scale should be much closer to the reference than the current blue-green puffer screenshot.

---

# 9. COLLECTIONS / LINE CHAPTER

The reference's collection sequence is not merely a grid page.

It is a chapter inside the immersive stage.

The top portion may retain/transition the preceding jacket/detail visual while the collection row emerges below. This relationship must be reproduced only to the extent demonstrated in the video.

The collection presentation includes four jacket products.

Each card:

- has a stable number;
- product name;
- price;
- plus action;
- product image;
- hover/active affordance;
- exact relative dimensions.

Hover behavior should smoothly reveal the appropriate CTA such as `SHOP NOW` where observable.

Do not let a hover reveal cause layout reflow.

Use transform/opacity rather than changing intrinsic card height.

The collection chapter should not collide with the TECHNOLOGY chapter.

---

# 10. TECHNOLOGY / BUILD CHAPTER

This section must communicate engineered material construction.

Observable concept:

- outer shell;
- membrane/weather barrier;
- thermal insulation;
- comfort lining.

The reference presents an exploded material stack/technical object with spatial depth.

Build a real presentation using one of these strategies, in this priority:

1. an existing accurate 3D asset if one exists in the workspace;
2. a layered Three.js/R3F composition using accurate supplied transparent layers;
3. a carefully staged 2.5D layer stack using transparent images and depth transforms.

Never replace the reference object with a random 3D primitive or unrelated CGI.

### 3D technical requirements

If Three.js/R3F is used:

- keep geometry lightweight;
- support device capability detection;
- avoid expensive post-processing by default;
- preserve alpha/transparency correctly;
- use deterministic camera position;
- use calibrated lighting;
- avoid random animation;
- support reduced motion;
- dispose resources correctly;
- avoid re-creating geometry/materials on every render;
- lazy-load heavy 3D code after the initial critical stage where possible.

### Layer animation

Layers should separate/overlap as the scroll position changes.

Labels must remain tied to their intended material layer rather than floating independently.

---

# 11. NEED TO KNOW / KNOW CHAPTER

Use the reference's right-weighted FAQ arrangement.

The visible questions correspond to product knowledge topics such as:

- how to choose the right size;
- materials used;
- how to care for the jacket;
- international shipping;
- returns/exchanges.

The exact live copy should come from the canonical content data where available.

FAQ behavior:

- click to expand;
- keyboard accessible;
- plus/minus visual state;
- animated height;
- no arbitrary clipping;
- only one open at a time if that matches the reference;
- no scroll jump when toggling;
- preserve URL/route state only if actually required.

The visual chapter should remain integrated with the shared stage rather than turning into a separate generic FAQ website.

---

# 12. CHAPTER INDEX / SCROLL RAIL

The left chapter index should visually match the reference:

`01 FORM`
`02 SURFACE`
`03 LINE`
`04 BUILD`
`05 KNOW`

The active chapter needs a clear but subtle state.

The index buttons must actually move to calibrated progress points.

But clicking a chapter must not use the full document height.

Use a stage-local timeline.

Scrolling should be:

- smooth;
- reversible;
- deterministic;
- stable across viewport heights.

The rail position should reflect actual stage progress.

---

# 13. TRANSITION ENGINE — REBUILD IT AS A SHARED CHOREOGRAPHY

Do not keep independent arbitrary opacity gates for each section.

Create a centralized timeline model.

Example conceptual progress segments:

- `P0`: form hold;
- `P1`: form -> surface;
- `P2`: surface hold;
- `P3`: surface -> line;
- `P4`: line hold;
- `P5`: line -> build;
- `P6`: build hold;
- `P7`: build -> know;
- `P8`: know hold;
- `P9`: exit/end.

Exact values must be calibrated from the video.

For every animated element define:

- enter start;
- enter end;
- hold range;
- exit start;
- exit end;
- easing;
- transform range;
- opacity range;
- filter range if any;
- z-index;
- pointer-events state.

Prefer continuous interpolation over boolean chapter switching.

Use Framer Motion/Motion where it materially helps, but do not force every animation through React state.

For high-frequency scroll transforms, use a performant architecture:

- requestAnimationFrame;
- Motion values;
- CSS custom properties;
- transforms/opacity;
- no repeated forced reflow.

Do not set React state on every scroll frame.

---

# 14. EFFECTS

Only reproduce effects that are supported by the reference.

Potential observable effects include:

- subtle grid parallax;
- product depth/parallax;
- glossy highlight shifts;
- tiny decode/glitch typography;
- border/line emphasis;
- staged opacity fades;
- subtle blur during transitions;
- hover CTA reveal;
- technical micro motion.

Do not add:

- neon cyberpunk overload;
- giant glow effects;
- random particle systems;
- excessive camera shake;
- generic 3D mouse-follow;
- huge scale zooms;
- arbitrary smooth-scroll libraries that fight browser scroll.

The target is the reference, not an imagined “futuristic” version.

---

# 15. PERFORMANCE ARCHITECTURE

The current design is visually intensive. Implement it without creating a low-FPS experience.

Required:

- GPU-friendly transform/opacity animation;
- avoid layout-triggering animation;
- preload only true critical assets;
- lazy-load heavy noncritical assets;
- responsive image sizing;
- AVIF/WebP where already supported and visually correct;
- correct width/height attributes to reduce CLS;
- avoid giant unoptimized source images when a smaller equivalent exists;
- memoize stable derived data where appropriate;
- avoid re-fetching storefront data unnecessarily;
- cache immutable/media data sensibly;
- do not rerender the whole homepage because a pointer moved.

Measure actual performance in production build.

Do not accept “it feels fast”.

---

# 16. RESPONSIVE DESIGN

Reference recording dimensions do NOT establish that the site is mobile-first.

Build responsive variants based on the actual stage composition.

### Desktop
Preserve full stage composition.

### Tablet
Compress spacing and typography proportionally while retaining chapter identity.

### Mobile
Do not squeeze four collection cards into a single desktop-width row.

Create a mobile composition that keeps the same art direction and information hierarchy while using:

- reduced stage padding;
- adjusted hero scale;
- vertical card stack/grid as appropriate;
- mobile-safe navigation;
- touch-friendly controls;
- correct accordion behavior;
- no overflow beyond the stage.

Do not remove features merely to make the page easier.

---

# 17. NAVIGATION / ROUTES

Verify every route currently present:

- `/`
- `/shop`
- `/collection/$slug`
- `/product/$slug`
- `/technology`
- `/about`
- `/search`
- `/cart`
- `/checkout`
- `/login`
- `/account`
- `/wishlist`
- `/admin`
- `/admin/products`
- `/admin/orders`
- `/admin/content`
- `/policies/$slug`
- auth API route(s)

For every route verify:

- loading state;
- data loading;
- error state;
- empty state;
- navigation;
- back navigation;
- refresh;
- deep link;
- SEO head;
- responsive layout;
- accessibility;
- auth requirements;
- server/client data flow.

Do not remove an existing route merely because it was not clearly visible in the video.

The video specifies the reference public experience; the product application still needs its functional routes.

---

# 18. SHOP PAGE

Audit the shop page as a complete storefront, not merely an extension of the homepage.

Verify:

- product listing;
- image aspect ratio;
- filtering/sorting if implemented;
- collection navigation;
- stock state;
- price rendering;
- card hover;
- add-to-bag;
- wishlist;
- accessibility;
- empty state;
- loading state.

The visual language must remain consistent with COUR.

Do not let generic e-commerce UI break the technical brand system.

---

# 19. PRODUCT PAGE

Verify:

- correct product asset;
- product name;
- pricing;
- size selector;
- true stock availability;
- disabled sold-out sizes;
- product description;
- story/material/care data;
- add-to-bag;
- wishlist;
- quantity;
- error state;
- share/deep-link behavior if actually supported.

Never trust client price or inventory.

Do not expose more inventory information than necessary.

---

# 20. CART

The cart is currently primarily local Zustand state.

That can remain as a fast interaction cache, but the architecture must make the source of truth explicit.

Requirements:

- safe local persistence;
- corruption recovery;
- validated quantity;
- remove;
- update;
- empty state;
- totals;
- correct currency formatting;
- server revalidation at checkout;
- auth-aware server cart synchronization if server cart is intended to exist.

Do not maintain two silently competing carts.

If server cart storage remains, define exactly when synchronization occurs.

---

# 21. CHECKOUT — PRODUCTION-GRADE FLOW

Checkout must have:

1. customer contact;
2. shipping identity;
3. address;
4. country/region where required;
5. order summary;
6. shipping estimate;
7. server-authoritative total;
8. duplicate-submit protection;
9. validation;
10. success confirmation.

On success:

- create exactly one order for one idempotency token;
- decrement exact inventory atomically;
- store snapshot data;
- clear cart correctly;
- redirect to secure confirmation;
- preserve order access for authenticated user;
- provide safe guest confirmation where guest checkout is enabled.

---

# 22. AUTHENTICATION / AUTHORIZATION

Preserve the current platform's Better Auth integration where it is required.

Do not “simplify” or replace platform-specific auth plumbing without understanding it.

Verify:

- session creation;
- session lookup;
- logout;
- OAuth preview behavior;
- email/password behavior;
- route guards;
- server middleware;
- bearer fallback where the preview architecture genuinely needs it;
- cookie settings;
- secure cookie behavior in deployment;
- CSRF-relevant protections appropriate to the framework;
- authorization on every protected server mutation.

Authentication and authorization are separate concerns.

Being signed in is not sufficient for admin access.

---

# 23. STATE MANAGEMENT

Audit all Zustand/React state.

Classify each state variable:

- server state;
- UI state;
- URL state;
- persistent local state;
- session state;
- derived state.

Do not duplicate server state without a reconciliation rule.

Avoid React state for high-frequency scroll animation.

Keep transition state deterministic.

Ensure stale closures cannot produce incorrect stage behavior.

---

# 24. MIDDLEWARE / API / SERVER FUNCTIONS

Every server function must have:

- appropriate HTTP method;
- input schema validation;
- auth middleware where required;
- authorization checks;
- predictable errors;
- no accidental data leaks;
- safe serialization.

Audit all createServerFn endpoints and route handlers.

Never assume a server function is safe just because it is not linked directly from the UI.

Everything callable from the network must be treated as hostile input.

---

# 25. DATABASE

Review the complete schema.

The current model includes concepts for:

- site settings;
- navigation;
- homepage sections;
- media;
- collections;
- products;
- variants;
- collections relationship;
- FAQs;
- policies;
- SEO pages;
- profiles/roles;
- addresses;
- cart items;
- wishlist items;
- orders;
- order items;
- inquiries;
- audit log.

Verify:

- primary keys;
- foreign keys;
- cascade behavior;
- uniqueness;
- indexes;
- check constraints;
- nullability;
- status semantics;
- monetary units;
- quantity semantics;
- timestamps.

Do not break compatibility with the existing auth schema.

---

# 26. TRANSACTIONAL INTEGRITY

Use DB transactions for multi-step business operations including, where supported by the database/runtime:

- order creation;
- inventory reservation/decrement;
- address default switching;
- role claiming;
- any mutation involving multiple dependent writes.

Do not leave partial records on mid-operation failure.

---

# 27. IDEMPOTENCY / REPLAY SAFETY

Critical mutation endpoints should tolerate repeated network requests safely.

Especially:

- checkout/order creation;
- wishlist toggle where race conditions are possible;
- admin writes where duplicate submission matters;
- newsletter submissions where duplicate spam should be controlled.

Use a server-validated idempotency key where appropriate.

Do not generate a new order merely because the client retried after a timeout.

---

# 28. ADMIN PANEL UX

The admin panel must be real, not decorative.

Verify:

- product CRUD;
- variants;
- inventory;
- order state transitions;
- content editing;
- FAQ editing;
- navigation editing;
- settings;
- media;
- policies;
- audit visibility.

Every mutation needs:

- loading state;
- success feedback;
- error feedback;
- validation;
- authorization.

Do not silently swallow errors and present empty arrays as if the database were empty.

When loading fails, distinguish:

- “there are no records”
from
- “the request failed”.

---

# 29. CONTENT MANAGEMENT

Homepage content must remain reference-correct.

Do not let an admin editor accidentally break the stage by entering malformed structures.

Implement typed content contracts.

Examples:

### Hero
- left title/body;
- right title/body;
- establishment text;
- establishment note;
- shipping label;
- shipping detail;
- ticker;
- CTA.

### Details
- heading;
- body;
- CTA;
- exactly five specs;
- spec icon mapping.

### Collections
- heading;
- intro copy;
- product order;
- pricing display mode;
- CTA.

### Construction
- heading;
- descriptive copy;
- layer list;
- layer asset references;
- labels;
- transform metadata if the CMS needs it.

### Know
- heading;
- FAQ ids/order;
- optional supporting copy.

---

# 30. SEO

Implement coherent SEO across public routes.

Verify:

- title;
- description;
- canonical URL;
- Open Graph;
- Twitter/X card metadata where appropriate;
- semantic headings;
- product structured data where appropriate;
- robots behavior;
- sitemap where supported;
- indexability flags.

Do not invent SEO claims or content that conflicts with the actual product.

---

# 31. ACCESSIBILITY

Maintain the high-visual character without sacrificing usability.

Verify:

- keyboard navigation;
- visible focus;
- semantic headings;
- buttons vs links;
- dialog semantics;
- accordion semantics;
- ARIA only where needed;
- alt text;
- color contrast;
- reduced-motion behavior;
- touch target sizes;
- screen reader labels for technical icon buttons.

Do not remove the reference's subtle design by replacing everything with generic accessible UI styling; improve semantics while preserving visual output.

---

# 32. REDUCED MOTION

The reference is motion-heavy, but users who request reduced motion must get an intentionally simplified experience.

For `prefers-reduced-motion: reduce`:

- remove large transforms;
- avoid pointer tilt;
- reduce blur/scale choreography;
- preserve information hierarchy;
- allow direct chapter visibility changes without disorienting motion.

Do not make the page unusable when motion is reduced.

---

# 33. CACHING

Define caching by data type.

Good candidates:

- static media;
- published product catalog where platform semantics allow;
- site settings with controlled invalidation;
- homepage content with explicit cache invalidation after admin edits.

Do not cache personalized data or inventory in a way that creates incorrect checkout behavior.

The final price and stock at order time must come from authoritative server state.

---

# 34. ASSET AUDIT

Inspect all current assets, including:

- hero product;
- all four collection product assets;
- construction image/layers;
- logos/icons;
- fonts;
- generated image artifacts;
- duplicate formats;
- stale preview artifacts.

For each asset determine:

- source;
- dimensions;
- transparency;
- intended route/state;
- whether it is actually used;
- whether it is a stale artifact;
- whether a better matching asset already exists in the workspace.

Do not use a stale screenshot as a runtime image.

Do not commit giant unused assets merely because they look impressive.

---

# 35. BUILD ARTIFACTS

There is existing `.vercel/output` content in the workspace.

Treat generated build output as disposable.

Do not manually patch built JS/CSS to fix source bugs.

After source changes:

1. clean/rebuild correctly;
2. verify generated output;
3. run production preview;
4. test the built app.

---

# 36. TESTING — EXPAND THE TEST SUITE

Fix all existing failing tests first, then add regression coverage.

The current test suite has a set of failures around `.grok/app-env.json` and expected authentication environment state. Resolve the configuration/test contract rather than silencing the tests.

Required testing categories:

### Unit
- timeline interpolation;
- chapter detection;
- deterministic decode text sequence;
- cart quantity normalization;
- shipping calculation;
- schema validation.

### Server/business logic
- order totals;
- inventory race handling;
- transaction rollback;
- idempotency;
- address authorization;
- order ownership;
- admin permission checks;
- status transition validation;
- media/navigation input validation.

### Route/integration
- public storefront;
- product;
- collection;
- search;
- cart;
- checkout;
- guest confirmation;
- login;
- account;
- wishlist;
- admin.

### Visual regression
Capture the homepage at controlled progress checkpoints corresponding to the supplied reference frames.

At minimum include:

- hero;
- details;
- collection transition;
- collections;
- technology/build;
- know/FAQ;
- at least several intermediate transition positions.

### Interaction regression
Test:

- scroll forward;
- scroll backward;
- chapter click;
- hover product;
- FAQ expand/collapse;
- add to cart;
- cart update;
- checkout submit;
- login;
- admin mutations.

---

# 37. VISUAL REGRESSION METHODOLOGY

Do NOT judge only from one screenshot.

For each reference checkpoint:

1. capture current implementation;
2. crop to the actual stage bounds;
3. compare geometry;
4. compare object bounding boxes;
5. compare heading position;
6. compare card positions;
7. compare stage border/radius;
8. compare grid density;
9. compare nav alignment;
10. compare text scale;
11. compare opacity/visibility;
12. compare object scale/position;
13. compare transition state;
14. fix;
15. repeat.

Use pixel-oriented reasoning:

- left/right/top/bottom anchor;
- relative percentage of stage;
- bounding box width/height;
- alignment to grid;
- baseline relationships;
- inter-element gap;
- object center;
- z-order;
- alpha/contrast.

Do not accept “looks close enough”.

---

# 38. SCREENSHOT TIMING / STABLE QA API

Add a deterministic testing mechanism for the homepage stage.

For example:

- `data-stage-progress="0.000"`;
- `data-stage-chapter="form"`;
- `data-stage-ready="true"`;

or an equivalent test-only mechanism.

This allows Playwright to set exact timeline positions without relying on uncertain human scroll velocity.

Do not leave the test harness coupled to random animation frames.

---

# 39. DO NOT OVERENGINEER THE VISUAL STACK

The desired stack may use:

- React;
- TanStack Start/Router;
- Tailwind;
- Framer Motion/Motion;
- Three.js/R3F/Drei;
- Zustand;
- React Query where useful;
- Better Auth;
- PGlite/Neon;
- Zod;
- Playwright.

These are already present or implied in the workspace.

Use them deliberately.

Do not add five animation libraries to solve one problem.
Do not add a huge smooth-scroll dependency unless clearly justified.
Do not add WebGL where CSS can faithfully reproduce the effect.
Do not add React state to every animation frame.
Do not use a random external 3D model.

---

# 40. SECURITY HARDENING CHECKLIST

Audit for:

- broken object-level authorization;
- privilege escalation;
- arbitrary URL/protocol injection;
- unsafe direct database mutations;
- missing auth middleware;
- role confusion;
- insecure guest order lookup;
- duplicate order creation;
- inventory race;
- unvalidated status values;
- unbounded text input;
- spam endpoints;
- accidental sensitive-data leakage;
- raw database error exposure;
- unsafe serialization.

Do not claim “secure” merely because parameterized SQL is used.

---

# 41. ERROR-HANDLING STANDARD

Every user-facing mutation must have a visible and accurate outcome.

Never do this pattern:

`catch { setData([]) }`

when the user needs to know that loading actually failed.

Use typed error categories where practical:

- validation;
- authentication;
- authorization;
- not found;
- conflict;
- inventory unavailable;
- server/internal.

Display user-safe messages while logging enough diagnostic information server-side for development.

---

# 42. OBSERVABILITY

Add lightweight diagnostics for:

- homepage asset readiness;
- stage initialization;
- server action failures;
- checkout transaction failures;
- admin mutation failures.

Do not log sensitive credentials or session tokens.

Keep production logging useful and bounded.

---

# 43. VERSION CONTROL / CHANGE MANAGEMENT

Work in small coherent changes.

Before each major subsystem rewrite:

- inspect current behavior;
- modify source;
- run focused checks;
- continue.

Do not produce one giant untestable rewrite.

Do not delete existing files without proving they are obsolete.

Do not leave abandoned duplicate implementations behind.

At the end:

- remove dead code;
- remove dead imports;
- remove stale visual experiments;
- remove unused dependencies if genuinely unused;
- keep migration history coherent.

---

# 44. FINAL ROUTE-BY-ROUTE VISUAL LANGUAGE

Even secondary pages should share the COUR technical system:

- same dark field;
- same grid language;
- same type hierarchy;
- same border treatment;
- same spacing logic;
- same CTA treatment;
- same product-card language.

But do not force the homepage's immersive scroll animation onto ordinary transactional pages unless that is appropriate.

The homepage is the signature cinematic experience.

Shop/product/cart/checkout/account/admin should be functional product interfaces within the same visual design system.

---

# 45. CONTENT CONSISTENCY

Audit all visible content against the reference.

Known important text includes:

### Hero
`ENGINEERED FOR MOTION. BUILT TO ENDURE.`
`DESIGNED FOR THE UNKNOWN. READY FOR ANYTHING.`

### Hero/brand metadata
The reference shows `EST. 2022`; do not reintroduce `EST. 2020` through stale seed/render hacks.

### Details
`DETAILS MATTER.`

### Collections
`COLLECTIONS.`

### Technology
`TECHNOLOGY` / `ENGINEERED TO ENDURE`

### FAQ
`NEED TO KNOW.`

Use the database as the canonical editable source where appropriate, but make the initial seed match the reference.

Do not allow old generated copy to survive merely because it is already in the DB.

---

# 46. IMPORTANT: REFERENCE VS INFERENCE

There is an important distinction:

The video can tell you:

- visual layout;
- visible copy;
- object placement;
- chapter sequence;
- motion behavior;
- visible hover/interaction;
- visual state changes.

The video cannot directly prove:

- exact DB schema;
- exact server framework;
- actual auth provider internals;
- actual hosting provider;
- hidden business rules.

Do not invent claims about the original hidden implementation.

Instead, implement a robust architecture that reproduces the observed behavior.

Keep this principle:

**observable behavior must be faithful; unobservable internals should be production-sensible and consistent with the existing stack.**

---

# 47. IMPLEMENTATION ORDER

Follow this order unless a dependency requires otherwise.

## Phase 1 — Baseline

- install/verify dependencies;
- run typecheck;
- run lint;
- run tests;
- run production build;
- capture current screenshots;
- record all failures.

Do not hide failures caused by tooling.

## Phase 2 — Data/config correctness

- fix environment drift;
- fix seed/content mismatch;
- validate homepage section data;
- fix DB constraints;
- fix search/data contracts.

## Phase 3 — Security/business logic

- address ownership;
- inventory transaction;
- idempotency;
- secure order access;
- admin authorization;
- input validation;
- status validation;
- inquiry protection.

## Phase 4 — Homepage architecture

- stage-local progress;
- deterministic timeline;
- stable readiness;
- shared choreography model;
- pointer behavior.

## Phase 5 — Visual calibration

- stage geometry;
- grid;
- typography;
- brand mark;
- hero;
- details;
- collections;
- technology;
- know.

## Phase 6 — 3D/effects

- only where reference requires it;
- optimize and lazy load.

## Phase 7 — Other routes

- shop;
- collection;
- product;
- cart;
- checkout;
- account;
- wishlist;
- login;
- about;
- technology;
- policies;
- admin.

## Phase 8 — QA

- unit;
- integration;
- E2E;
- visual regression;
- responsive;
- accessibility;
- build/deploy validation.

## Phase 9 — Final forensic comparison

Repeat comparison against every available reference frame.

---

# 48. DO NOT MAKE THESE COMMON MISTAKES

Do not:

- redesign the site;
- replace the technical aesthetic with a generic SaaS UI;
- create only static screenshots;
- use placeholder lorem ipsum;
- replace the jacket with unrelated 3D art;
- make all transitions generic fades;
- use arbitrary giant blur/glow effects;
- hardcode visual text in 20 components;
- patch database content inside render functions;
- hide errors by returning empty arrays;
- trust client price;
- trust client inventory;
- trust client role;
- accept arbitrary admin URLs/statuses/content;
- expose exact inventory unnecessarily;
- ignore mobile;
- ignore reduced motion;
- ignore keyboard accessibility;
- edit generated `.vercel/output` instead of source;
- disable tests just to obtain green status;
- loosen TypeScript solely to get a passing build;
- remove auth because it complicates the UI;
- claim completion before actually testing the built result.

---

# 49. ACCEPTANCE CRITERIA — VISUAL

The homepage is not complete until:

- the stage framing matches the reference closely;
- the dense grid matches the reference character;
- the nav alignment is correct;
- the logo/brand mark is faithful;
- the hero jacket has the correct identity and visual treatment;
- hero copy and edge metadata are positioned correctly;
- the CTA is in the correct region;
- DETAILS matches the reference composition;
- all five spec cards match their intended positions;
- COLLECTIONS has the correct four-product composition;
- the transition into COLLECTIONS is clean;
- TECHNOLOGY shows the correct layered construction concept;
- NEED TO KNOW matches the reference structure;
- no two unrelated chapters overlap accidentally;
- reverse scrolling reproduces the choreography coherently;
- pointer hover/parallax is calibrated rather than exaggerated.

---

# 50. ACCEPTANCE CRITERIA — FUNCTIONAL

The application is not complete until:

- every intended route works;
- product data loads from the database;
- product variants work;
- cart works;
- checkout works;
- guest order completion works if guest checkout is enabled;
- logged-in order history works;
- addresses are properly authorized;
- wishlist is properly authorized;
- admin authorization is server-side;
- admin CRUD works;
- content validation works;
- media validation works;
- search is coherent;
- errors are visible and accurate;
- no critical console errors remain.

---

# 51. ACCEPTANCE CRITERIA — SECURITY

The application is not complete until:

- horizontal authorization tests pass;
- address ownership cannot be bypassed;
- order access is ownership-safe;
- inventory cannot go negative through concurrent checkout;
- repeated checkout submit cannot create duplicate orders;
- admin role checks are granular enough for actual mutations;
- arbitrary statuses/URLs/content are rejected;
- public inquiry is hardened;
- unnecessary inventory data is not leaked.

---

# 52. ACCEPTANCE CRITERIA — CODE QUALITY

The final workspace must have:

- no TypeScript errors;
- no lint errors;
- all intended tests passing;
- no dead imports;
- no obvious duplicate implementations;
- no render-time navigation side effects;
- no arbitrary content replacement hacks;
- no silent destructive catches;
- documented architecture for the homepage timeline;
- clean server/client boundary.

---

# 53. ACCEPTANCE CRITERIA — BUILD / DEPLOYMENT

You must verify:

- development server;
- production build;
- production preview;
- environment configuration;
- database initialization;
- migrations;
- auth integration;
- asset loading;
- deep links;
- route fallback behavior;
- production console warnings/errors.

Do not report “done” because the development server opened once.

---

# 54. REQUIRED FINAL INTERNAL CHECKLIST

Before declaring completion, perform a final pass over the entire workspace and explicitly verify:

### Frontend
routing, layout, typography, components, responsive behavior, loading/error/empty states.

### Backend
server functions, business rules, validation, authorization, transactions, error handling.

### Database
schema, migrations, constraints, indexes, seed, integrity.

### Authentication
session behavior, provider state, login/logout, route guards, cookies.

### Authorization
customer/admin/editor/owner boundaries and object ownership.

### State management
local state, server state, URL state, persistent state, synchronization.

### Middleware
every protected server operation.

### Hosting/DevOps
build, preview, deployment output, environment contract.

### Version control
no accidental generated-file patching, no abandoned duplicate implementation.

### Testing
unit, integration, E2E, visual regression, responsive and accessibility checks.

### Security
input validation, authz, race conditions, replay safety, data exposure.

### Performance
bundle size, image loading, animation cost, caching, 3D cost, render frequency.

### Analytics
preserve/add only privacy-appropriate analytics hooks if the product requires them; do not add random tracking.

### SEO
metadata, canonical, structured data where appropriate, indexability.

### UI/UX
visual hierarchy, feedback, navigation, forms, keyboard, touch.

### Caching
correct invalidation and no stale price/inventory authority.

### Assets
correct files, dimensions, transparency, usage, no stale replacements.

### Animation
scroll choreography, hover, pointer, enter/exit, reverse scroll, reduced motion.

### Effects
glitch, glow, grid/parallax, blur, depth only where justified by reference.

### 3D
correct object/layer concept, optimized rendering, disposal, deterministic camera.

### Content
reference text, canonical DB data, no render-time patch hacks.

### Pages
home plus every application route.

### Working process
startup -> loading -> home -> scroll -> chapter navigation -> product interaction -> cart -> checkout -> confirmation -> account/admin flows.

---

# 55. REQUIRED EXECUTION STYLE

Do not write a giant explanation and then stop.

Work directly on the workspace.

After each major repair:

1. run the relevant check;
2. inspect the result;
3. continue to the next defect.

When a fix in one subsystem affects another subsystem, re-test both.

When a visual fix changes DOM structure, re-check accessibility and interaction.

When a data/schema fix changes content shape, re-check the homepage and admin content editor.

When a server fix changes checkout behavior, re-test cart, checkout, confirmation, and order history.

---

# 56. FINAL COMMAND

**CONTINUE THE EXISTING ENHANCEMENT FIRST. THEN PERFORM THE COMPLETE FORENSIC REPAIR.**

Use the supplied reference video and all available extracted reference frames as the visual authority.

Use the current workspace as the implementation base.

Find the defects rather than waiting for them to be listed.

Fix the known defects listed above.

Find additional defects not listed above.

Do not stop at visual similarity.

Do not stop at functional similarity.

Do not stop at a green build.

The final target is a **production-grade, full-stack, highly reference-faithful COUR reconstruction whose homepage behaves like the reference scene and whose underlying application actually works.**

### Final loop

`INSPECT -> MEASURE -> IMPLEMENT -> BUILD -> TEST -> CAPTURE -> COMPARE -> FIX -> REBUILD -> RECHECK`

Repeat this loop until no material defect remains.

Only then report completion.
