import mongoose, { isValidObjectId } from 'mongoose';
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { Like } from '../models/like.model.js'
import { ApiResponse } from '../utils/ApiResponse.js'




const toggleVideoLike = asyncHandler(async (req, res) => {
    /* ** algorithm to follow step by step, to toggle like a video by its ID **
    1. extract the videoId from req.params and validate that videoId is a valid MongoDB ObjectId to prevent BSON errors
    2. search the Like collection to see if a document already exists for this specific item and this specific user (req.user._id)
    3. if like exists, delete it (unlike)
    4. if the like does not exist, create a new Like document (like)
    5. return success response
    */

    // ======== 1. extract the videoId from req.params and validate that videoId is a valid MongoDB ObjectId to prevent BSON errors ========
    const { videoId } = req.params;
    
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, 'The provided video ID is invalid or missing');
    }
    // ======== 1. extract the videoId from req.params and validate that videoId is a valid MongoDB ObjectId to prevent BSON errors ========


    // ========= 2. search the Like collection to see if a document already exists for this specific item and this specific user (req.user._id) =========
    const existingLike = await Like.findOne({
        video: videoId,
        likedBy: req.user?._id
    });

    console.log('Existing video likes', existingLike);
    // ========= 2. search the Like collection to see if a document already exists for this specific item and this specific user (req.user._id) =========


    // ========= 3. if like exists, delete it (unlike) =========
    if (existingLike) {
        await Like.findByIdAndDelete(existingLike?._id);
        return res
        .status(200)
        .json(
            new ApiResponse(200, {isLiked: false}, 'Video unliked successfully')
        );
    }
    // ========= 3. if like exists, delete it (unlike) =========


    // ========= 4. if the like does not exist, create a new Like document (like) =========
    await Like.create({
        video: videoId,
        likedBy: req.user?._id
    });
    // ========= 4. if the like does not exist, create a new Like document (like) =========


    // ============== 5. return success response ==============
    return res
    .status(200)
    .json(
        new ApiResponse(200, {isLiked: true}, 'Video liked successfully')
    );
    // ============== 5. return success response ==============
});



const toggleCommentLike = asyncHandler(async (req, res) => {
    /* ** algorithm to follow step by step, to toggle like a comment by its ID **
    1. extract the commentId from req.params and validate that videoId is a valid MongoDB ObjectId to prevent BSON errors
    2. search the Like collection to see if a document already exists for this specific item and this specific user (req.user._id)
    3. if like exists, delete it (unlike)
    4. if the like does not exist, create a new Like document (like)
    5. return success response
    */

    // ========== 1. extract the commentId from req.params and validate that videoId is a valid MongoDB ObjectId to prevent BSON errors ==========
    const { commentId } = req.params;
    
    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, 'The provided comment ID is invalid or missing');
    }
    // ========== 1. extract the commentId from req.params and validate that videoId is a valid MongoDB ObjectId to prevent BSON errors ==========


    // ========== 2. search the Like collection to see if a document already exists for this specific item and this specific user (req.user._id) ==========
    const existingLike = await Like.findOne({
        comment: commentId,
        likedBy: req.user?._id
    });
    // ========== 2. search the Like collection to see if a document already exists for this specific item and this specific user (req.user._id) ==========

    
    // ========== 3. if like exists, delete it (unlike) ==========
    if (existingLike) {
        await Like.findByIdAndDelete(existingLike?._id);
        return res
        .status(200)
        .json(
            new ApiResponse(200, {isLiked: false}, 'Comment unliked successfully')
        );
    }
    // ========== 3. if like exists, delete it (unlike) ==========


    // ========== 4. if the like does not exist, create a new Like document (like) ==========
    await Like.create({
        comment: commentId,
        likedBy: req.user?._id
    });
    // ========== 4. if the like does not exist, create a new Like document (like) ==========


    // ============= 5. return success response =============
    return res
    .status(200)
    .json(
        new ApiResponse(200, {isLiked: true}, 'Comment liked successfully')
    );
    // ============= 5. return success response =============
});



const toggleTweetLike = asyncHandler(async (req, res) => {
    /* ** algorithm to follow step by step, to toggle like a tweet by its ID **
    1. extract the tweetId from req.params and validate that tweetId is a valid MongoDB ObjectId to prevent BSON errors
    2. search the Like collection to see if a document already exists for this specific item and this specific user (req.user._id)
    3. if like exists, delete it (unlike)
    4. if the like does not exist, create a new Like document (like)
    5. return success response
    */

    // ======== 1. extract the tweetId from req.params and validate that tweetId is a valid MongoDB ObjectId to prevent BSON errors ========
    const { tweetId } = req.params;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, 'The provided tweet ID is invalid or missing');
    }
    // ======== 1. extract the tweetId from req.params and validate that tweetId is a valid MongoDB ObjectId to prevent BSON errors ========


    // ======== 2. search the Like collection to see if a document already exists for this specific item and this specific user (req.user._id) ========
    const existingLike = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user?._id
    });
    // ======== 2. search the Like collection to see if a document already exists for this specific item and this specific user (req.user._id) ========

    // ======== 3. if like exists, delete it (unlike) ========
    if (existingLike) {
        await Like.findByIdAndDelete(existingLike?._id);
        return res
        .status(200)
        .json(
            new ApiResponse(200, {likedBy: false}, 'Tweet unliked successfully')
        );
    }
    // ======== 3. if like exists, delete it (unlike) ========


    // ========== 4. if the like does not exist, create a new Like document (like) ==========
    await Like.create({
        tweet: tweetId,
        likedBy: req.user?._id
    });
    // ========== 4. if the like does not exist, create a new Like document (like) ==========


    // ============= 5. return success response =============
    return res
    .status(200)
    .json(
        new ApiResponse(200, {isLiked: true}, 'Tweet liked successfully')
    );
    // ============= 5. return success response =============
});



const getLikedVideos = asyncHandler(async (req, res) => {
    /* ** algorithm to follow step by step, to toggle like a tweet by its ID **
    1. filter the Like collection for the current user's documents where the 'video' field is not empty
    2. perform a lookup to join with the videos collection to get full video details
    3. perform another lookup inside the video to get the owner's details
    4. flatten the owner data so the response is a clean list of owner
    5. flatten the video data so the response is a clean list of videos
    6. using replaceRoot to promote the video subdocument(field) of likes model to the top level
    7. return success response
    */
    
   const likedVideosAggregate = await Like.aggregate([
        // ========== 1. filter the Like collection for the current user's documents where the 'video' field is not empty ==========
        {
            $match: {
                likedBy: mongoose.Types.ObjectId.createFromHexString(req.user?._id.toString()),
                video: {
                    $exists: true
                }
            }
        },
        // ========== 1. filter the Like collection for the current user's documents where the 'video' field is not empty ==========

        {
            // ========= 2. perform a lookup to join with the videos collection to get full video details =========
            $lookup: {
                from: 'videos',
                localField: 'video',
                foreignField: '_id',
                as: 'video',
                // ========= 2. perform a lookup to join with the videos collection to get full video details =========
                pipeline: [
                    // =============== 3. perform another lookup inside the video to get the owner's details ===============
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'owner',
                            foreignField: '_id',
                            as: 'owner',
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    // =========== 4. flatten the owner data so the response is a clean list of owner ===========
                    {
                        $unwind: '$owner'
                    }
                    // =========== 4. flatten the owner data so the response is a clean list of owner ===========
                    // =============== 3. perform another lookup inside the video to get the owner's details ===============
                ]
            }
        },

        // =========== 5. flatten the video data so the response is a clean list of videos ===========
        {
            $unwind: '$video'
        },
        // =========== 5. flatten the video data so the response is a clean list of videos ===========

        // ========== 6. using replaceRoot to promote the video subdocument(field) of likes model to the top level ==========
        {
            $replaceRoot: {
                newRoot: '$video',
            }
        }
        // ========== 6. using replaceRoot to promote the video subdocument(field) of likes model to the top level ==========
    ]);

    console.log('Liked videos aggregate: ', likedVideosAggregate);


    // ========= 7. return success response =========
    return res
    .status(200)
    .json(
        new ApiResponse(200, likedVideosAggregate, 'All liked videos fetched successfully')
    );
    // ========= 7. return success response =========
});

export {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos
}