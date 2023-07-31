import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class Auth0AuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // You can add custom logic here if needed
    console.log('Auth0AuthGuard');
    console.log('context', context);
    console.log(super.canActivate(context));
    return super.canActivate(context);
  }
  handleRequest(
    ...args: Parameters<
      InstanceType<ReturnType<typeof AuthGuard>>['handleRequest']
    >
  ) {
    console.log('handleRequest');
    console.log('args', args);

    return super.handleRequest(...args);
  }
}
