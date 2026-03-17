import { Injectable } from '@nestjs/common';

type User = { id: string; email: string; role: 'resident' | 'officer' | 'admin' };

@Injectable()
export class UsersService {
  private users: User[] = [{ id: '1', email: 'resident@example.com', role: 'resident' }];

  list(): User[] {
    return this.users;
  }

  create(user: Omit<User, 'id'>): User {
    const next: User = { id: `${this.users.length + 1}`, ...user };
    this.users.push(next);
    return next;
  }
}
