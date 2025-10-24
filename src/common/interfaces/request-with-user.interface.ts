import { Request } from 'express';

interface UserPayload {
  userId: number;
  projectId: number;
}

export interface RequestWithUser extends Request {
  user: UserPayload;
}
