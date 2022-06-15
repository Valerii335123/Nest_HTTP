import { PartialType } from '@nestjs/mapped-types';
import { CreateListDto } from './create-list.dto';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateListDto extends PartialType(CreateListDto) {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsInt()
  priority: number;
}
