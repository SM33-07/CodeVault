import prisma from '../prisma/client';
import { Snippet } from '../types/snippet';

export const snippetRepository = {
  findAll: () => prisma.snippet.findMany({ orderBy: { createdAt: 'desc' } }),
  create: (data: Partial<Snippet>) => prisma.snippet.create({ data: data as any }),
  findById: (id: string) => prisma.snippet.findUnique({ where: { id } }),
  update: (id: string, data: Partial<Snippet>) =>
    prisma.snippet.update({ where: { id }, data: data as any }).catch(() => null),
  delete: (id: string) =>
    prisma.snippet.delete({ where: { id } }).then(() => true).catch(() => false),
};
