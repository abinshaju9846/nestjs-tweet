import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { Repository } from 'typeorm';
import { TweetsService } from 'src/tweets/tweets.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    private readonly tweetService: TweetsService,
    private userservice: UsersService,
  ) { }
  async create(id:number,createLikeDto: CreateLikeDto) {
    await this.tweetService.findOne(createLikeDto.tweet_id)
    await this.userservice.findOne(id)
    const like = this.likeRepository.create({
      user_id: id,
      tweet_id: createLikeDto.tweet_id
    });
    return await this.likeRepository.save(like);
  };



  findAll() {
    return this.likeRepository.find();
  }

  findOne(id: number) {
    const like = this.likeRepository.findOne({ where: { id } })
    if (!like) {
      throw new NotFoundException('Like not found')
    }
    return like;
  }

  // update(id: number, updateLikeDto: UpdateLikeDto) {
  //   return `This action updates a #${id} like`;
  // }

  async remove(id: number) {
    await this.findOne(id)
    const result = await this.likeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Like not found');
    }
    return {
      message: 'Like deleted successfully.',
      statusCode: HttpStatus.OK,
    };
  }
}
