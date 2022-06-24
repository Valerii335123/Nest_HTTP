import { NotFoundException } from '@nestjs/common';

class userNotFoundException extends NotFoundException {
  constructor() {
    super('User not found');
  }
}

export default userNotFoundException;
