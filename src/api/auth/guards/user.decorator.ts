import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/entity/user.entity';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): User => {
    const req = context.switchToHttp().getRequest();
    return req.user;
  },
);
