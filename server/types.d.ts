import { User } from "@shared/schema";

declare global {
  namespace Express {
    interface Request {
      userContext?: User;
    }
  }
}

export {};