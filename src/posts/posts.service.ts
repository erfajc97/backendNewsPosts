import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './entities/post.entity';
import { v4 } from 'uuid';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier'
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class PostsService {

  constructor(private readonly prismaService: PrismaService) {}

  async uploadImage(file: Express.Multer.File): Promise<string> {
    try {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'posts' },
          (error, result) => {
            if (error) {
              console.error('Error subiendo imagen a Cloudinary:', error);
              return reject(new InternalServerErrorException('Error subiendo imagen a Cloudinary'));
            }
            resolve(result.secure_url);
          },
        );
        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      });
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      throw new InternalServerErrorException('Error al procesar la imagen');
    }
  }

  async createPostService(createPostDto: CreatePostDto, file?: Express.Multer.File) {
  let imageUrl = '';
  if (file) {
    imageUrl = await this.uploadImage(file);
  }

  const newPost: Post = {
    id: v4(),
    title: createPostDto.title,
    image: imageUrl,
  };
  const savedPost = await this.prismaService.post.create({ data: newPost });
  return savedPost;
}


async getAllPostsService(pageNumber: number) {
  const pageSize = 9; 
  const currentPage = Number(pageNumber); 
  const startIndex = (currentPage - 1) * pageSize; 

  const [data, total] = await Promise.all([
    this.prismaService.post.findMany({
      skip: startIndex,
      take: pageSize,
      orderBy: {
        createdAt: 'desc', 
      },
    }),
    this.prismaService.post.count(),
  ]);
  return {
    data,
    meta: {
      pagination: {
        total,
        currentPage, 
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    },
  };
}


  async getPostByIdService(id: string) {
    const post = await this.prismaService.post.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException('Post no encontrado');
    }
    return post;
  }

  async deletePostService(id: string) {
    const post = await this.prismaService.post.delete({ where: { id } });
    return post;
  }

}
