import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './entities/post.entity';
import { v4 } from 'uuid';

@Injectable()
export class PostsService {
  private posts: Post[] = [
    { id: '1', title: 'Post 1', image: 'https://example.com/img1.jpg' },
    { id: '2', title: 'Post 2', image: 'https://example.com/img2.jpg' },
    { id: '3', title: 'Post 3', image: 'https://example.com/img3.jpg' },
  ];

  getAllPostsService(pageNumber: number) {
    const pageSize = 9;
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = pageNumber * pageSize;

    const data = this.posts.slice(startIndex, endIndex);
    return {
      data,
      total: this.posts.length,
      currentPage: pageNumber,
      pageSize,
      totalPages: Math.ceil(this.posts.length / pageSize),
    };
  }

  getPostByIdService(id: string) {
    return this.posts.find((post) => post.id === id);
  }

  createPostService(createPostDto: CreatePostDto, imagePath: string | null) {
    const newPost: Post = {
      id: v4(),
      title: createPostDto.title,
      image: imagePath || createPostDto.image || '',
    };
    this.posts.push(newPost);
    return newPost;
  }
}
