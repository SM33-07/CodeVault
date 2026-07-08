import { Router, Request, Response } from 'express';
import prisma from '../prisma/client';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  const items = await prisma.snippet.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(items);
});

router.post('/', async (req: Request, res: Response) => {
  const payload = req.body;
  const created = await prisma.snippet.create({ data: payload });
  res.status(201).json(created);
});

router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const item = await prisma.snippet.findUnique({ where: { id } });
  if (!item) return res.status(404).json({ error: `Snippet with id "${id}" not found` });
  res.json(item);
});

router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const updated = await prisma.snippet.update({ where: { id }, data });
    res.json(updated);
  } catch (e) {
    res.status(404).json({ error: `Snippet with id "${id}" not found` });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.snippet.delete({ where: { id } });
    res.status(204).send();
  } catch (e) {
    res.status(404).json({ error: `Snippet with id "${id}" not found` });
  }
});

export default router;
