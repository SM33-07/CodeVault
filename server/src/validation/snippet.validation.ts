import { z } from "zod";

export const createSnippetSchema = z.object({
  title: z.string().min(1),
  codeBody: z.string().min(1),
  language: z.string().min(1),
  visibility: z.enum(["public", "private"]),
  description: z.string().optional(),
  tagIds: z.array(z.string().uuid()).optional(),
});

export const updateSnippetSchema = createSnippetSchema.partial();

export const paramsIdSchema = z.object({
  id: z.string().uuid(),
});

export const snippetQuerySchema = z.object({
  tag: z.string().optional(),
  language: z.string().optional(),
  q: z.string().optional(),
});