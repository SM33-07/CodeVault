import { Router } from 'express';
import { snippetController } from '../controllers/snippet.controller';

const router = Router();

router.get('/', snippetController.getAll);
router.post('/', snippetController.create);
router.get('/:id', snippetController.getById);
router.put('/:id', snippetController.update);
router.delete('/:id', snippetController.delete);

export default router;
