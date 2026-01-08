import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { Tweet } from '../models/tweet.model.js'
import { isValidObjectId } from 'mongoose';




const createTweet = asyncHandler(async (req, res) => {
    /* ** algorithm to follow step by step, to add a tweet **
    1. extract content from req.body and validate it
    2. if content present then create a tweet in db with content, owner fields
    3. if there is no tweet and user hits tweet btn then return error 500
    4. return success response
    */

   // ========= 1. extract content from req.body and validate it =========
    const { content } = req.body;
    
    if (!content || content.trim() === '') {
        throw new ApiError(400, 'Tweet content is required');
    }
    // ========= 1. extract content from req.body and validate it =========
    
    
    // ======== 2. if content present then create a tweet in db with content, owner fields ========
    const tweet = await Tweet.create({
        content,
        owner: req.user?._id
    });
    // ======== 2. if content present then create a tweet in db with content, owner fields ========

    
    // ============ 3. if there is no tweet and user hits tweet btn then return error 500 ============
    if (!tweet) {
        throw new ApiError(500, 'Failed to add tweet');
    }
    
    console.log('Tweet: ', tweet);
    // ============ 3. if there is no tweet and user hits tweet btn then return error 500 ============

    
    // ========= 4. return success response =========
    return res
    .status(201)
    .json(
        new ApiResponse(201, tweet, 'Tweet created successfully')
    );
    // ========= 4. return success response =========
});

export {
    createTweet,
}