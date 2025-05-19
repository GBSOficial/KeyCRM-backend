import { Request } from 'express-serve-static-core';

declare global {
  namespace Express {
    interface Request {
      user: {
        id: number;
        name?: string;
        email?: string;
        offices?: string;
      }
    }
  }
}

export interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    name?: string;
    email?: string;
    offices?: string;
  }
} 