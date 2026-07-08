import prisma from '../prisma/client';
import { CreateSnippetData, UpdateSnippetData } from '../types/snippet';

const withTags = {
  snippetTags: {
    include: {
      tag: true,
    },
  },
};

const tagConnections = (tagIds: string[]) =>
  tagIds.map((tagId) => ({
    tag: {
      connect: {
        id: tagId,
      },
    },
  }));

export const snippetRepository = {
  findAll: () => prisma.snippet.findMany({ orderBy: { createdAt: 'desc' }, include: withTags }),
  create: (data: CreateSnippetData) => {
    const { tagIds, ...snippetData } = data;

    return prisma.snippet.create({
      data: {
        ...snippetData,
        snippetTags: tagIds?.length
          ? {
              create: tagConnections(tagIds),
            }
          : undefined,
      },
      include: withTags,
    });
  },
  findById: (id: string) => prisma.snippet.findUnique({ where: { id }, include: withTags }),
  update: async (id: string, data: UpdateSnippetData) => {
    const { tagIds, ...snippetData } = data;

    return prisma
      .$transaction(async (tx) => {
        if (tagIds !== undefined) {
          await tx.snippetTag.deleteMany({ where: { snippetId: id } });
        }

        return tx.snippet.update({
          where: { id },
          data: {
            ...snippetData,
            snippetTags: tagIds?.length
              ? {
                  create: tagConnections(tagIds),
                }
              : undefined,
          },
          include: withTags,
        });
      })
      .catch(() => null);
  },
  delete: (id: string) =>
    prisma.snippet.delete({ where: { id } }).then(() => true).catch(() => false),
};
