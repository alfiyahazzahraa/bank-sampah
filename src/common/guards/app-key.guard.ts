import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AppKeyGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const appKey = request.headers['x-app-key'];

    if (!appKey) {
      throw new UnauthorizedException('Header x-app-key wajib disertakan.');
    }

    const appMaker = await this.prisma.appMaker.findUnique({
      where: { appKey },
    });

    if (!appMaker) {
      throw new UnauthorizedException('x-app-key tidak valid.');
    }

    request.appMaker = appMaker;

    return true;
  }
}