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

  // Method to create a new tweet
  async create(createTweetDto: CreateTweetDto,id:number) {
    // Verify that the user exists before creating a tweet
    await this.userservice.findOne(id);
    console.log("id from tweet",id);
    
    // Create a new tweet instance with the provided user ID and content
    const tweet = this.tweetRepository.create({user_id:id,
      content: createTweetDto.content,});

    // Save the new tweet to the database
    const savedTweet = await this.tweetRepository.save(tweet);

    // Return the saved tweet along with a success message
    return { ...savedTweet, message: 'Tweet created' };
  }

  // Method to retrieve all tweets
  async findAll() {
    // Fetch all tweets from the database
    return await this.tweetRepository.find();
  }

  // Method to retrieve a single tweet by its ID
  async findOne(id: number) {
    // Attempt to find the tweet with the given ID
    const tweet = await this.tweetRepository.find({ where: {user_id: id } });

    // If the tweet is not found, throw a ConflictException
    if (!tweet) {
      throw new ConflictException(`Tweet with id ${id} not found`);
    }

    // Return the found tweet
    return tweet;
  }

  // Method to update an existing tweet
  async update(id: number, updateTweetDto: UpdateTweetDto) {
    // Ensure the tweet exists before attempting an update
    await this.findOne(id);

    // Update the tweet's content
    const updateResult = await this.tweetRepository.update(id, {
      content: updateTweetDto.content,
    });

    // If no rows were affected, throw a ConflictException
    if (!updateResult.affected) {
      throw new ConflictException(`Tweet with id ${id} not updated`);
    }

    // Retrieve the updated tweet
    const updatedTweet = await this.findOne(id);

    // Return the updated tweet along with a success message
    return { ...updatedTweet, message: 'Tweet updated' };
  }

  // Method to delete a tweet by its ID
  async remove(id: number) {
    // Ensure the tweet exists before attempting deletion
    await this.findOne(id);

    // Delete the tweet from the database
    const deleteResult = await this.tweetRepository.delete(id);

    // If no rows were affected, throw a ConflictException
    if (!deleteResult.affected) {
      throw new ConflictException(`Tweet with id ${id} not deleted`);
    }

    // Return a success message upon successful deletion
    return { message: 'Tweet deleted' };
  }
}
