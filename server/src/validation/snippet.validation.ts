import { z } from "zod";

export const createSnippetSchema = z.object({
  title: z.string().min(1),
  content: z.string().optional(),
  tagIds: z.array(z.string().uuid()).optional(),
});

export const updateSnippetSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().optional(),
  tagIds: z.array(z.string().uuid()).optional(),
});

export const paramsIdSchema = z.object({
  id: z.string().uuid(),
});
