import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { CloudinaryProvider } from 'src/cloudinary.provider';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [PostsController],
  providers: [PostsService, CloudinaryProvider, PrismaService],
  exports: [CloudinaryProvider],
})
export class PostsModule {}
