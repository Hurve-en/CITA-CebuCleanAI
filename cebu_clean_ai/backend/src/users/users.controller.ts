import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';

type CreateUserDto = { email: string; role?: 'resident' | 'officer' | 'admin' };

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get()
  list() {
    return this.service.list();
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.service.create(dto);
  }
}
