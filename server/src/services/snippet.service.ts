import { Snippet } from '../types/snippet';
import { snippetRepository } from '../repositories/snippet.repository';

export const snippetService = {
  findAll: () => snippetRepository.findAll(),
  create: (data: Partial<Snippet>) => snippetRepository.create(data),
  findById: (id: string) => snippetRepository.findById(id),
  update: (id: string, data: Partial<Snippet>) => snippetRepository.update(id, data),
  delete: (id: string) => snippetRepository.delete(id),
};
