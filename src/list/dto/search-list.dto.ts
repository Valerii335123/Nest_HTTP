import { IsString, IsNotEmpty, IsInt, IsOptional } from 'class-validator';

export class SearchListDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsInt()
  priority: number;

  public constructor(init?: Partial<SearchListDto>) {
    Object.assign(this, init);
  }
}

export default SearchListDto;
