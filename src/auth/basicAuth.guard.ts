import {
  Injectable,
  UnauthorizedException,
  ExecutionContext,
} from '@nestjs/common';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';

@Injectable()
export class BasicAuthGuard extends PassportAuthGuard('basic') {
  constructor() {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Implement your authentication logic here
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;
    const token = request.headers.authorization?.split(' ')[1];
    console.log('authorization', authorization);
    console.log('process.env.SECRET', process.env.SECRET);

    const valid = token === process.env.SECRET;

    if (!valid) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
