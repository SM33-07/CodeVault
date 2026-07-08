import { Request, Response } from 'express';
import { snippetService } from '../services/snippet.service';

export const snippetController = {
  getAll: async (_req: Request, res: Response) => {
    const items = await snippetService.findAll();
    res.json(items);
  },

  create: async (req: Request, res: Response) => {
    const created = await snippetService.create(req.body);
    res.status(201).json(created);
  },

  getById: async (req: Request, res: Response) => {
    const item = await snippetService.findById(req.params.id);
    if (!item) return res.status(404).json({ error: `Snippet with id "${req.params.id}" not found` });
    res.json(item);
  },

  update: async (req: Request, res: Response) => {
    const updated = await snippetService.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: `Snippet with id "${req.params.id}" not found` });
    res.json(updated);
  },

  delete: async (req: Request, res: Response) => {
    const deleted = await snippetService.delete(req.params.id);
    if (!deleted) return res.status(404).json({ error: `Snippet with id "${req.params.id}" not found` });
    res.status(204).send();
  },
};
