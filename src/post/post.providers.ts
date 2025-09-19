import { DataSource } from 'typeorm';
import { Post } from './entities/post.entity';
import { DATA_SOURCE, POST_REPOSITORY } from '../constants';

export const postProviders = [
  {
    provide: POST_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Post),
    inject: [DATA_SOURCE],
  },
];
