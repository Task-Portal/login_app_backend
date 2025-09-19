import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('decimal')
  dhs: number;

  @Column('int')
  tiket: number;

  @Column('decimal')
  yield: number;

  @Column('int')
  days_left: number;

  @Column({ default: 0 })
  sold: number;

  @Column({ nullable: true })
  image: string;
}
