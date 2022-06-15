import { IsString, IsNotEmpty, IsInt } from 'class-validator';

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

  // parent_id:
}

export default CreateListDto;
