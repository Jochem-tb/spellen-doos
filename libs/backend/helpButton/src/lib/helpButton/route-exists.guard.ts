import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { first, Observable } from 'rxjs';
import { HelpButton } from './helpButton.schema';
import { HelpButtonService } from './helpButton.service';

@Injectable()
export class RouteExistsGuard implements CanActivate {
  constructor(private readonly helpButtonService: HelpButtonService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { route } = request.body;

    const foundContent = await this.helpButtonService.getContentByRoute(route);
    Logger.debug(foundContent);

    if (foundContent) {
      throw new BadRequestException('Content for this route already exists');
    }

    return true;
  }
}
