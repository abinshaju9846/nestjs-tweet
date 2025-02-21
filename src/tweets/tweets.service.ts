import { ConflictException, Injectable } from '@nestjs/common';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tweet } from './entities/tweet.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TweetsService {
  constructor(
    @InjectRepository(Tweet)
    private readonly tweetRepository: Repository<Tweet>,
    private userservice: UsersService,
  ) { }
  async create(createTweetDto: CreateTweetDto) {
    await this.userservice.findOne(createTweetDto.user_id)
    const tweets = await this.tweetRepository.create({
      user_id: createTweetDto.user_id,
      content: createTweetDto.content,
    })
    const save = await this.tweetRepository.save(tweets)
    return { ...save, message: "tweet created" }
  }

  async findAll() {
    return await this.tweetRepository.find();
  }

  async findOne(id: number) {
    const tweet = await this.tweetRepository.findOne({
      where: { id }
    })
    if (!tweet) {
      throw new ConflictException(`Tweet with id ${id} not found`)
    }
    return tweet;
  }

  async update(id: number, updateTweetDto: UpdateTweetDto) {
    await this.findOne(id)
    const updatedTweet = await this.tweetRepository.update(id, { content: updateTweetDto.content })
    if (!updatedTweet.affected) {
      throw new ConflictException(`Tweet with id ${id} not affected`)
    }
    const updated = await this.findOne(id)
    return { ...updated, message: "Tweet updated" }
  }

  async remove(id: number) {
    await this.findOne(id)
    const deleteTweet = await this.tweetRepository.delete(id)
    if (!deleteTweet.affected) {
      throw new ConflictException(`Tweet with id ${id} not deleted`)
    }
    return { message: "Tweet deleted" }
  }
}
