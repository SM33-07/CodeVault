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
  findAll: (filters?: {
    tag?: string;
    language?: string;
    q?: string;
    requestingUserId?: string;
  }) => {
    const where: any = {};

    // Visibility: public snippets + requesting user's own private snippets
    if (filters?.requestingUserId) {
      where.OR = [
        { visibility: 'public' },
        { ownerId: filters.requestingUserId },
      ];
    } else {
      where.visibility = 'public';
    }

    // Filter by tag name
    if (filters?.tag) {
      where.snippetTags = {
        some: {
          tag: {
            name: {
              equals: filters.tag,
              mode: 'insensitive',
            },
          },
        },
      };
    }

    // Filter by language
    if (filters?.language) {
      where.language = {
        equals: filters.language,
        mode: 'insensitive',
      };
    }

    // Keyword search across title and description
    if (filters?.q) {
      where.AND = [
        ...(where.AND || []),
        {
          OR: [
            { title: { contains: filters.q, mode: 'insensitive' } },
            { description: { contains: filters.q, mode: 'insensitive' } },
          ],
        },
      ];
    }

    return prisma.snippet.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: withTags,
    });
  },
  create: (data: CreateSnippetData & { ownerId: string }) => {
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

  incrementForkCount: (id: string) =>
    prisma.snippet.update({
      where: { id },
      data: {
        forkCount: {
          increment: 1,
        },
      },
    }),

  incrementViewCount: (id: string) =>
    prisma.snippet.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    }),

  findByUserId: (userId: string, requestingUserId?: string) => {
    const where: { ownerId: string; visibility?: string } = {
      ownerId: userId,
    };

    if (requestingUserId !== userId) {
      where.visibility = "public";
    }

    return prisma.snippet.findMany({ where, orderBy: { createdAt: "desc" }, include: withTags, });
  },




};
