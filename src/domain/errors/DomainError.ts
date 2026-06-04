export class DomainError extends Error {
  constructor(public readonly message: string, public readonly statusCode: number = 500) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundError extends DomainError {
  constructor(message: string = 'Recurso no encontrado') {
    super(message, 404);
  }
}

export class ValidationError extends DomainError {
  constructor(message: string = 'Datos inválidos') {
    super(message, 400);
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message: string = 'No autorizado') {
    super(message, 401);
  }
}

export class ForbiddenError extends DomainError {
  constructor(message: string = 'Acceso prohibido') {
    super(message, 403);
  }
}

export class ConflictError extends DomainError {
  constructor(message: string = 'Conflicto con recurso existente') {
    super(message, 409);
  }
}
