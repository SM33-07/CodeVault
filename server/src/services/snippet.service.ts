import { CreateSnippetData, UpdateSnippetData } from "../types/snippet";
import { snippetRepository } from "../repositories/snippet.repository";
import { ForbiddenError, NotFoundError } from "../errors";

export const snippetService = {
  findAll: () => snippetRepository.findAll(),

  async create(data: CreateSnippetData, requestingUserId: string) {
    return snippetRepository.create({
      ...data,
      ownerId: requestingUserId,
    });
  },

  findById: (id: string) => snippetRepository.findById(id),

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
};