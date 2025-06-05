import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

//Interceptor dapat mengubah request dan response dari controller
@Injectable()
export class TimeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      //akan menambah timestamp pada response
      map((value) => {
        value.timestamp = new Date()
        return value
      })
    ); //object response body
  }
}
