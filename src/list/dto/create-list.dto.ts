import { IsString, IsNotEmpty, IsInt } from 'class-validator';
import { List } from '../entities/list.entity';
import { ParentListExists } from '../validator/parentListExist.validator';

export class CreateListDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsInt()
  priority: number;

  @ParentListExists()
  parent_id: List;
}

export default CreateListDto;
