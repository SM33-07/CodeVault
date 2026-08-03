import { Router } from "express";
import { snippetController } from "../controllers/snippet.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createSnippetSchema, paramsIdSchema, updateSnippetSchema } from "../validation/snippet.validation";
import { optionalAuth } from "../middlewares/optionalAuth.middleware";
import { snippetQuerySchema } from "../validation/snippet.validation";

const router = Router();

router.get("/", optionalAuth, validate(snippetQuerySchema, "query"), snippetController.getAll);
router.post("/", authMiddleware, validate(createSnippetSchema, "body"), snippetController.create);
router.get("/:id", optionalAuth, validate(paramsIdSchema, "params"), snippetController.getById);
router.put("/:id", authMiddleware, validate(paramsIdSchema, "params"), validate(updateSnippetSchema, "body"), snippetController.update);
router.delete("/:id", authMiddleware, validate(paramsIdSchema, "params"), snippetController.delete);

export default router;