import { z } from "zod";

const specSchema = z.object({
  id: z.string().min(1).max(8),
  title: z.string().min(1).max(80),
  body: z.string().max(400),
});

const layerSchema = z.object({
  id: z.string().min(1).max(8),
  title: z.string().min(1).max(80),
  body: z.string().max(400),
});

export const heroContentSchema = z
  .object({
    leftTitle: z.string().max(80).optional(),
    leftBody: z.string().max(80).optional(),
    rightTitle: z.string().max(80).optional(),
    rightBody: z.string().max(80).optional(),
    ticker: z.string().max(240).optional(),
    established: z.string().max(24).optional(),
    establishedNote: z.string().max(160).optional(),
  })
  .strict();

export const detailsContentSchema = z
  .object({
    specs: z.array(specSchema).max(8).optional(),
  })
  .strict();

export const collectionsContentSchema = z.object({}).strict();

export const constructionContentSchema = z
  .object({
    layers: z.array(layerSchema).max(8).optional(),
  })
  .strict();

export const knowContentSchema = z.object({}).strict();

const SCHEMAS: Record<string, z.ZodType> = {
  hero: heroContentSchema,
  details: detailsContentSchema,
  collections: collectionsContentSchema,
  construction: constructionContentSchema,
  know: knowContentSchema,
};

export function serializeSectionContent(sectionKey: string, raw: string): string {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw || "{}");
  } catch {
    throw new Error("Section content must be valid JSON.");
  }
  const schema = SCHEMAS[sectionKey] ?? z.record(z.string(), z.unknown());
  const result = schema.safeParse(parsed);
  if (!result.success) {
    throw new Error(`Section content is invalid for ${sectionKey}.`);
  }
  return JSON.stringify(result.data);
}
