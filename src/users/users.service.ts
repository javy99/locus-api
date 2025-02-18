import { Injectable } from '@nestjs/common';

interface User {
  userId: number;
  username: string;
  password?: string;
  role: string;
}

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      userId: 1,
      username: 'admin',
      password: 'admin',
      role: 'admin',
    },
    {
      userId: 2,
      username: 'normal',
      password: 'normal',
      role: 'normal',
    },
    {
      userId: 3,
      username: 'limited',
      password: 'limited',
      role: 'limited',
    },
  ];

  findOne(username: string): Promise<User | undefined> {
    return new Promise((resolve) => {
      const user = this.users.find((user) => user.username === username);
      resolve(user);
    });
  }
}
