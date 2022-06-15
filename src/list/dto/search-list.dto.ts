import { IsString, IsNotEmpty, IsInt, IsOptional } from 'class-validator';

export class CreateListDto {
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

export default CreateListDto;
