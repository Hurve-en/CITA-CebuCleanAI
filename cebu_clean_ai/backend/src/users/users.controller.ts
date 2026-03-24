import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { IsEmail, IsIn, IsOptional } from 'class-validator';

class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsIn(['resident', 'officer', 'admin'])
  role?: 'resident' | 'officer' | 'admin' = 'resident';
}

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get()
  @Roles('admin')
  list() {
    return this.service.list();
  }

  @Post()
  @Roles('admin')
  create(@Body() dto: CreateUserDto) {
    return this.service.create(dto);
  }
}
