import { Injectable, Inject } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { POST_REPOSITORY } from '../constants';

@Injectable()
export class PostService {
  constructor(
    @Inject(POST_REPOSITORY)
    private postsRepository: Repository<Post>,
  ) {}

  create(createPostDto: CreatePostDto, imagePath?: string): Promise<Post> {
    const post = this.postsRepository.create({
      ...createPostDto,
      image: imagePath,
    });
    return this.postsRepository.save(post);
  }

  findAll(): Promise<Post[]> {
    return this.postsRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, _updatePostDto: UpdatePostDto) {
    throw new Error('not implemented');
    // return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
