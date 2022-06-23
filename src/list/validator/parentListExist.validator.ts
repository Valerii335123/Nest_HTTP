import {
  registerDecorator,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidatorOptions,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { List } from '../entities/list.entity';
import { InjectRepository } from '@nestjs/typeorm';

@ValidatorConstraint({ name: 'ListExists', async: true })
@Injectable()
export class ParentListExistValidator implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(List)
    private listRepository: Repository<List>,
  ) {}

  async validate(value: number) {
    const model = await this.listRepository.findOne({
      where: {
        id: value,
      },
    });
    if (!model) return false;
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `Parent list doesn't exist`;
  }
}

export function ParentListExists(validationOptions?: ValidatorOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'ParentListExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: ParentListExistValidator,
    });
  };
}
