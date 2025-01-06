import { Module } from '@nestjs/common';
import { PostsModule } from './posts/posts.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';


@Module({
  imports: [PostsModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
