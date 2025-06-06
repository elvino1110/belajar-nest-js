import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Roles } from './roles.decorator';

//Guard semacam role untuk menuju API yang boleh diakses
@Injectable()
export class RoleGuard implements CanActivate {
  // constructor(private  roles: string[]) {
  // }
  //diubah menjadi reflector agar tidak perlu membuat guard berkali2 akan berat
  constructor(private reflector: Reflector) {
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles: string[] = this.reflector.get(Roles, context.getHandler())
    if (!roles) {
      return  true
    }
    const user = context.switchToHttp().getRequest().user
    return roles.indexOf(user.role) != -1
  }
}
