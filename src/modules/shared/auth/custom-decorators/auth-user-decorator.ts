import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// custom decorator for returning the user from the request.
export const AuthUser = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
