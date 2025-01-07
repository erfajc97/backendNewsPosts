import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { Post } from '@prisma/client';
import { Transform } from 'class-transformer';

export class CreatePostDto implements Partial<Post> {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  title: string;

  @IsOptional()
  image?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.toString())
  timeToRead?: string;

  @IsOptional()
  @IsString()
  tags?: string;
}
