import { TwitterApi } from 'twitter-api-v2'
import dotenv from 'dotenv'

dotenv.config();


const twitterClient = new TwitterApi(
    process.env.TWITTER_BEARER_TOKEN,

    console.log("This is my twitter token", process.env.TWITTER_BEARER_TOKEN)
);

export default twitterClient;