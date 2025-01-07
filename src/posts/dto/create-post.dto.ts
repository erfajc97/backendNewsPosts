import { IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';
import { Post } from '@prisma/client';

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
  @IsNumber()
  timeToRead?: number;

  @IsOptional()
  @IsString()
  tags?: string;
}
