import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ValidationError } from '../../domain/errors/DomainError.js';

export const validateDto = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params
    });

    if (!result.success) {
      // Map error details into a descriptive message
      const errorMsg = result.error.errors
        .map(err => {
          const field = err.path.slice(1).join('.'); // skip the root 'body' / 'query' / 'params'
          return `${field ? field + ': ' : ''}${err.message}`;
        })
        .join(', ');
      
      return next(new ValidationError(errorMsg));
    }

    // Assign validated and coerced data back to req
    if (result.data.body) req.body = result.data.body;
    if (result.data.query) req.query = result.data.query;
    if (result.data.params) req.params = result.data.params;

    next();
  };
};

export default validateDto;
