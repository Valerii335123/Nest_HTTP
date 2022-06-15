import { NotFoundException } from '@nestjs/common';

class listNotFoundException extends NotFoundException {
  constructor(listId: number) {
    super(`List with id ${listId} not found`);
  }
}

export default listNotFoundException;
