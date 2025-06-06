import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';

//simple decorator
export const Auth = createParamDecorator(
  //data jika diperlukan, context untuk ambil req atau res
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest()
    return request.user
  },
)