import { Request } from 'express';

interface UserPayload {
  userId: number;
  role: string;
  projectId: number;
}

export interface RequestWithUser extends Request {
  user: UserPayload;
}
