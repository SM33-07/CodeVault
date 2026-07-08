import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from "zod";

export const validate = (schema: ZodSchema<any>, target: "body" | "params" = "body") => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse((req as any)[target]);
      (req as any)[target] = parsed;
      return next();
    } catch (err) {
      if (err instanceof ZodError) return res.status(400).json({ errors: (err as ZodError).issues });
      next(err as any);
    }
  };
};