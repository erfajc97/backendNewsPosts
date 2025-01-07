import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  HttpCode,
  NotFoundException,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Delete,
  InternalServerErrorException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('image'))
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
          new FileTypeValidator({ fileType: '.(png|jpg|jpeg)' }),
        ],
      }),
    ) file: Express.Multer.File,
  ) {
    try {
      const post = await this.postsService.createPostService(createPostDto, file);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Post creado exitosamente',
        response: post,
      };
    } catch (error) {
      console.error('Error al crear el post:', error.message);
      throw new InternalServerErrorException('No se pudo crear el post. Verifica los datos enviados.');
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllPosts(@Query('page') page?: string) {
    try {
      const pageNumber = page ? parseInt(page, 10) : 1;
      const posts = await this.postsService.getAllPostsService(pageNumber);
      return {
        statusCode: HttpStatus.OK,
        message: 'Posts obtenidos exitosamente',
        response: posts,
      };
    } catch (error) {
      console.error('Error al obtener los posts:', error.message);
      throw new InternalServerErrorException('No se pudieron obtener los posts.');
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getPostById(@Param('id') id: string) {
    try {
      const post = await this.postsService.getPostByIdService(id);
      if (!post) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Post no encontrado',
          error: 'Not Found',
        });
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Post obtenido exitosamente',
        response: post,
      };
    } catch (error) {
      console.error('Error al obtener el post por ID:', error.message);
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException('No se pudo obtener el post.');
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deletePost(@Param('id') id: string) {
    try {
      const post = await this.postsService.deletePostService(id);
      return {
        statusCode: HttpStatus.OK,
        message: 'Post eliminado exitosamente',
        response: post,
      };
    } catch (error) {
      console.error('Error al eliminar el post:', error.message);
      throw new InternalServerErrorException('No se pudo eliminar el post.');
    }
  }
}
