import twitterClient from "./twitter-client.js";


export const fetchtweets = async () => {
    try {
        const tweets = await twitterClient.v2.search(
            "frontend developer hiring lang:en is:retweet",
            {
                max_results: 10,
            }
        );

        console.log(tweets.data)
    } catch (error) {
        console.log(error)
    }
}