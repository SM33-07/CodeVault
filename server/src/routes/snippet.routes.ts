import { Router } from 'express';
import { snippetController } from '../controllers/snippet.controller';
import { validate } from "../middlewares/validate.middleware";
import { createSnippetSchema, paramsIdSchema, updateSnippetSchema } from "../validation/snippet.validation";

const router = Router();

router.get('/', snippetController.getAll);
router.post('/', validate(createSnippetSchema, "body"), snippetController.create);
router.get('/:id', validate(paramsIdSchema, "params"), snippetController.getById);
router.put('/:id', validate(paramsIdSchema, "params"), validate(updateSnippetSchema, "body"), snippetController.update);
router.delete('/:id', validate(paramsIdSchema, "params"), snippetController.delete);

export default router;
