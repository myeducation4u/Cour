import { z } from "zod";

/**
 * Typed content contracts for `homepage_sections.content`.
 *
 * Every section key the homepage stage renders has its own schema here, and
 * `serializeSectionContent()` is the ONLY path that writes the column (admin
 * save + seed). Malformed or structurally invalid JSON is rejected server-side
 * before it can reach the live stage — the homepage renderer never has to
 * defend against content the editor should not have been able to save.
 *
 * The schemas are deliberately `.strict()`: an unknown key is a typo the editor
 * almost certainly wants to hear about, not silently-ignored data.
 */

/** Trim, then bound. Keeps leading/trailing space out of the rendered grid. */
const text = (max: number) => z.string().trim().max(max);

const specSchema = z
  .object({
    id: text(8).min(1),
    title: text(80).min(1),
    body: text(400),
    /** Optional glyph key from `spec-icons.tsx`; index order is the fallback. */
    icon: z.enum(["weather", "thermal", "stitch", "pocket", "fit"]).optional(),
  })
  .strict();

const layerSchema = z
  .object({
    id: text(8).min(1),
    title: text(80).min(1),
    body: text(400),
    /** Media URL for the transparent layer plate, when one is authored. */
    asset: z
      .string()
      .trim()
      .max(240)
      .regex(/^(?:\/[A-Za-z0-9._~%/-]*|https:\/\/[^\s]+)$/, "Layer asset must be a site path or https URL.")
      .optional(),
  })
  .strict();

export const heroContentSchema = z
  .object({
    leftTitle: text(80).optional(),
    leftBody: text(80).optional(),
    rightTitle: text(80).optional(),
    rightBody: text(80).optional(),
    ticker: text(240).optional(),
    established: text(24).optional(),
    establishedNote: text(160).optional(),
    shippingLabel: text(40).optional(),
    shippingDetail: text(80).optional(),
    ctaLabel: text(40).optional(),
  })
  .strict();

export const detailsContentSchema = z
  .object({
    heading: text(80).optional(),
    /**
     * The reference composition is calibrated for exactly five cards; the bound
     * is wider so an editor can retire a card without breaking the save, and
     * the stage lays out however many arrive.
     */
    specs: z.array(specSchema).min(1).max(8).optional(),
  })
  .strict();

export const collectionsContentSchema = z
  .object({
    heading: text(80).optional(),
    /** Display order of the collection rail, by product slug. */
    productSlugs: z.array(text(80)).max(12).optional(),
    ctaLabel: text(40).optional(),
  })
  .strict();

export const constructionContentSchema = z
  .object({
    heading: text(120).optional(),
    /** Outermost → innermost, matching the exploded stack order. */
    layers: z.array(layerSchema).min(1).max(8).optional(),
  })
  .strict();

export const knowContentSchema = z
  .object({
    heading: text(80).optional(),
    body: text(400).optional(),
  })
  .strict();

export type SpecContent = z.infer<typeof specSchema>;
export type LayerContent = z.infer<typeof layerSchema>;

const SCHEMAS: Record<string, z.ZodType> = {
  hero: heroContentSchema,
  details: detailsContentSchema,
  collections: collectionsContentSchema,
  construction: constructionContentSchema,
  know: knowContentSchema,
};

/** The section keys this module can validate. */
export const SECTION_KEYS = Object.keys(SCHEMAS);

export class SectionContentError extends Error {
  readonly status = 400;
  constructor(message: string) {
    super(message);
    this.name = "SectionContentError";
  }
}

function issuesToMessage(error: z.ZodError): string {
  return error.issues
    .slice(0, 4)
    .map((issue) => {
      const path = issue.path.length ? issue.path.join(".") : "(root)";
      return `${path}: ${issue.message}`;
    })
    .join("; ");
}

/**
 * Validate raw admin JSON for `sectionKey` and return the canonical serialized
 * form, or throw a 400-shaped error naming the offending field.
 */
export function serializeSectionContent(sectionKey: string, raw: string): string {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw || "{}");
  } catch {
    throw new SectionContentError("Section content must be valid JSON.");
  }
  const schema = SCHEMAS[sectionKey];
  if (!schema) {
    throw new SectionContentError(`Unknown homepage section: ${sectionKey}.`);
  }
  const result = schema.safeParse(parsed);
  if (!result.success) {
    throw new SectionContentError(
      `Section content is invalid for ${sectionKey} — ${issuesToMessage(result.error)}`,
    );
  }
  return JSON.stringify(result.data);
}

/**
 * Validate a stored value without throwing. Used on the read path so a row that
 * predates a schema change (or was written by hand in SQL) degrades to its
 * defaults instead of taking the homepage down. The write path still uses the
 * throwing variant above.
 */
export function validateSectionContent(
  sectionKey: string,
  value: unknown,
): { ok: true; data: Record<string, unknown> } | { ok: false; error: string } {
  const schema = SCHEMAS[sectionKey];
  if (!schema) return { ok: false, error: `Unknown homepage section: ${sectionKey}.` };
  const result = schema.safeParse(value ?? {});
  if (!result.success) return { ok: false, error: issuesToMessage(result.error) };
  return { ok: true, data: result.data as Record<string, unknown> };
}
