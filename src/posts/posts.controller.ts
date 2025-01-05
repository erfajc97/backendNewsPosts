import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';

import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const ext = file.originalname.split('.').pop();
          const filename = `${uuid()}.${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  createPost(
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imagePath = file ? file.path : null;

    return this.postsService.createPostService(createPostDto, imagePath);
  }

  @Get()
  getAllPosts(@Query('page') page?: string) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    return this.postsService.getAllPostsService(pageNumber);
  }

  @Get(':id')
  getPostById(@Param('id') id: string) {
    return this.postsService.getPostByIdService(id);
  }
}
