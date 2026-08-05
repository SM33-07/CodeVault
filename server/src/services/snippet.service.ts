import { CreateSnippetData, UpdateSnippetData } from "../types/snippet";
import { snippetRepository } from "../repositories/snippet.repository";
import { ForbiddenError, NotFoundError } from "../errors";

export const snippetService = {
  async findAll(
    filters: {
      tag?: string;
      language?: string;
      q?: string;
    },
    requestingUserId?: string
  ) {
    return snippetRepository.findAll({
      ...filters,
      requestingUserId,
    });
  },

  async create(data: CreateSnippetData, requestingUserId: string) {
    return snippetRepository.create({
      ...data,
      ownerId: requestingUserId,
    });
  },

  async findById(id: string, requestingUserId?: string) {
    const snippet = await snippetRepository.findById(id);

    if (!snippet) {
      throw new NotFoundError("Snippet not found.");
    }

    // Private snippets are only visible to their owner
    if (
      snippet.visibility !== "public" &&
      snippet.ownerId !== requestingUserId
    ) {
      throw new NotFoundError("Snippet not found.");
    }

    // Increment view count for public snippets viewed by non-owners
    if (
      snippet.visibility === "public" &&
      snippet.ownerId !== requestingUserId
    ) {
      await snippetRepository.incrementViewCount(snippet.id);
    }

    return snippet;
  },

  async update(
    id: string,
    data: UpdateSnippetData,
    requestingUserId: string
  ) {
    const snippet = await snippetRepository.findById(id);

    if (!snippet) {
      throw new NotFoundError("Snippet not found.");
    }

    if (snippet.ownerId !== requestingUserId) {
      throw new ForbiddenError(
        "You do not have permission to modify this snippet."
      );
    }

    return snippetRepository.update(id, data);
  },

  async delete(id: string, requestingUserId: string) {
    const snippet = await snippetRepository.findById(id);

    if (!snippet) {
      throw new NotFoundError("Snippet not found.");
    }

    if (snippet.ownerId !== requestingUserId) {
      throw new ForbiddenError(
        "You do not have permission to delete this snippet."
      );
    }

    return snippetRepository.delete(id);
  },

  async fork(snippetId: string, requestingUserId: string) {
    const originalSnippet = await snippetRepository.findById(snippetId);

    if (!originalSnippet) {
      throw new NotFoundError("Snippet not found.");
    }

    // Only public snippets can be forked by non-owners
    if (
      originalSnippet.visibility !== "public" &&
      originalSnippet.ownerId !== requestingUserId
    ) {
      throw new ForbiddenError(
        "Cannot fork a private snippet you do not own."
      );
    }

    const tagIds = originalSnippet.snippetTags.map(
      (snippetTag) => snippetTag.tagId
    );

    const fork = await snippetRepository.create({
      title: originalSnippet.title,
      codeBody: originalSnippet.codeBody,
      language: originalSnippet.language,
      description: originalSnippet.description ?? undefined,
      visibility: originalSnippet.visibility,
      forkedFromId: originalSnippet.id,
      ownerId: requestingUserId,
      tagIds,
    });

    await snippetRepository.incrementForkCount(snippetId);

    return fork;
  },

  findByUserId: (
    userId: string,
    requestingUserId?: string
  ) =>
    snippetRepository.findByUserId(
      userId,
      requestingUserId
    ),
};