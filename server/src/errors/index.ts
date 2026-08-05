export class ConflictError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ConflictError";
    }
}

export class UnauthorizedError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "UnauthorizedError";
    }
}

export class ForbiddenError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ForbiddenError";
    }
}

export class NotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "NotFoundError";
    }
}

export class ServiceUnavailableError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ServiceUnavailableError";
    }
}

export class TooManyRequestsError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "TooManyRequestsError";
    }
}