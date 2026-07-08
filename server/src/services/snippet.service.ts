import { CreateSnippetData, UpdateSnippetData } from '../types/snippet';
import { snippetRepository } from '../repositories/snippet.repository';

export const snippetService = {
  findAll: () => snippetRepository.findAll(),
  create: (data: CreateSnippetData) => snippetRepository.create(data),
  findById: (id: string) => snippetRepository.findById(id),
  update: (id: string, data: UpdateSnippetData) => snippetRepository.update(id, data),
  delete: (id: string) => snippetRepository.delete(id),
};
