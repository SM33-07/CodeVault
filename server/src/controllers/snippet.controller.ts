import { Request, Response, NextFunction } from 'express';
import { snippetService } from '../services/snippet.service';

export const snippetController = {
  getAll: async (_req: Request, res: Response) => {
    const items = await snippetService.findAll();
    res.json(items);
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const created = await snippetService.create(req.body, req.user!.id);
      res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await snippetService.findById(req.params.id);
      if (!item) return res.status(404).json({ error: `Snippet with id "${req.params.id}" not found` });
      res.json(item);
    } catch (err) {
      next(err);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updated = await snippetService.update(req.params.id, req.body, req.user!.id);
      if (!updated) return res.status(404).json({ error: `Snippet with id "${req.params.id}" not found` });
      res.json(updated);
    } catch (err) {
      next(err);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deleted = await snippetService.delete(req.params.id, req.user!.id);
      if (!deleted) return res.status(404).json({ error: `Snippet with id "${req.params.id}" not found` });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
