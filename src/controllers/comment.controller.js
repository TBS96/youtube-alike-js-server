import mongoose, { isValidObjectId } from 'mongoose';
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { Comment } from '../models/comment.model.js'




const addComment = asyncHandler(async (req, res) => {
    /* ** algorithm to follow step by step, to add a comment by video ID **
    1. extract videoId and content from req.params and req.body respectively and validate them
    2. if videoId and content present then create a comment in db with content, videoId and owner fields
    3. if there is no comment and user hits comment btn then return error 500
    4. return success response
    */

    // ========== 1. extract videoId and content from req.params and req.body respectively and validate them ==========
    const { videoId } = req.params;
    const { content } = req.body;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, 'Invalid or missing video ID');
    }
    
    if (!content || content.trim() === '') {
        throw new ApiError(400, 'Comment is required');
    }
    // ========== 1. extract videoId and content from req.params and req.body respectively and validate them ==========


    // ======== 2. if videoId and content present then create a comment in db with content, videoId and owner fields ========
    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user?._id
    });
    
    console.log('Comment: ', comment);
    // ======== 2. if videoId and content present then create a comment in db with content, videoId and owner fields ========


    // ========== 3. if there is no comment and user hits comment btn then return error 500 ==========
    if (!comment) {
        throw new ApiError(500, 'Failed to add comment');
    }
    // ========== 3. if there is no comment and user hits comment btn then return error 500 ==========
    

    // ========== 4. return success response ==========
    return res
    .status(201)
    .json(
        new ApiResponse(201, comment, 'Comment created successfully')
    );
    // ========== 4. return success response ==========
});



const updateComment = asyncHandler(async (req, res) => {
    /* ** algorithm to follow step by step, to add a comment by video ID **
    1. extract videoId and content from req.params and req.body respectively and validate them
    2. find if the commentId exists using findById else throw 404 error
    3. check ownership of the commenter using comment.owner and req.user._id, else throw 403 error
    4. update content of comment using findByIdAndUpdate
    5. return success response
    */

    // ======== 1. extract commentId and content from req.params and req.body respectively and validate them ========
    const { commentId } = req.params;
    const { content } = req.body;
    
    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, 'Invalid or missing comment ID');
    }
    
    if (!content || content.trim() === '') {
        throw new ApiError('Content is required to update a comment');
    }
    // ======== 1. extract commentId and content from req.params and req.body respectively and validate them ========

    
    // =========== 2. find if the commentId exists using findById else throw 404 error ===========
    const comment = await Comment.findById(commentId);
    
    if (!comment) {
        throw new ApiError(404, 'Comment not found');
    }
    // =========== 2. find if the commentId exists using findById else throw 404 error ===========

    
    // ======== 3. check ownership of the commenter using comment.owner and req.user._id, else throw 403 error ========
    if (comment.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, 'Unauthorized! You do not have permission to edit this comment!');
    }
    // ======== 3. check ownership of the commenter using comment.owner and req.user._id, else throw 403 error ========

    
    // ========= 4. update content of comment using findByIdAndUpdate =========
    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set: {
                content: content
            }
        },
        {
            new: true
        }
    );
    // ========= 4. update content of comment using findByIdAndUpdate =========
    
    
    // ========== 4. return success response ==========
    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedComment, 'Comment updated successfully')
    );
    // ========== 4. return success response ==========
});



const deleteComment = asyncHandler(async (req, res) => {
    /* ** algorithm to follow step by step, to add a comment by video ID **
    1. extract commentId from req.params and validate it
    2. find if the commentId exists using findById else throw 404 error
    3. check ownership of the commenter using comment.owner and req.user._id, else throw 403 error
    4. delete commentId using findByIdAndDelete
    5. return success response
    */

    // ========== 1. extract commentId from req.params and validate it ==========
    const { commentId } = req.params;
    
    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, 'Invalid or missing comment ID');
    }
    // ========== 1. extract commentId from req.params and validate it ==========

    
    // ======== 2. find if the commentId exists using findById else throw 404 error ========
    const comment = await Comment.findById(commentId);
    
    if (!comment) {
        throw new ApiError(404, 'Comment not found');
    }
    // ======== 2. find if the commentId exists using findById else throw 404 error ========
    

    // ========== 3. check ownership of the commenter using comment.owner and req.user._id, else throw 403 error ==========
    if (comment.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, 'Unauthorized! You do not have permission to delete this comment!');
    }
    // ========== 3. check ownership of the commenter using comment.owner and req.user._id, else throw 403 error ==========
    
    
    // ======== 4. delete commentId using findByIdAndDelete ========
    await Comment.findByIdAndDelete(commentId);
    // ======== 4. delete commentId using findByIdAndDelete ========

    
    // =========== 5. return success response ===========
    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, 'Comment deleted successfully')
    );
    // =========== 5. return success response ===========
});



const getVideoComments = asyncHandler(async (req, res) => {
    /* ** algorithm to follow step by step, to fetch all comments for a video with metadataD **
    1. extract videoId from req.params, page, limit from req.query, and validate videoId
    2. S1 ($match): filter the Comment collection to find documents where the video field matches the provided videoId
    3. S2 ($lookup): join with the users collection to retrieve the commenter's profile (fullName, username, avatar)
    4. S3 ($lookup): join with the likes collection to fetch all like documents associated with each specific comment
    5. S4 ($addFields): process the joined data to:
        - extract the first object from the commenter array;
        - calculate the likesCount by measuring the size of the likes array;
        - determine isLiked by checking if the current req.user._id exists within the likes.likedBy array
    6. S5 ($sort): organize the results by createdAt in ascending order (oldest to newest)
    7. S6 ($project): remove the raw likes array from the final output to optimize the response payload
    8. paginate the aggregate
    9. return success response
    */

    // ========= 1. extract videoId from req.params, page, limit from req.query, and validate videoId =========
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, 'Invalid or missing video ID');
    }
    // ========= 1. extract videoId from req.params, page, limit from req.query, and validate videoId =========

    // Comment aggregation pipelines
    const commentAggregate = Comment.aggregate([
        // ======= 2. S1 ($match): filter the Comment collection to find documents where the video field matches the provided videoId =======
        {
            $match: {
                video: mongoose.Types.ObjectId.createFromHexString(videoId.toString())
            }
        },
        // ======= 2. S1 ($match): filter the Comment collection to find documents where the video field matches the provided videoId =======

        // ======== 3. S2 ($lookup): join with the users collection to retrieve the commenter's profile (fullName, username, avatar) ========
        {
            $lookup: {
                from: 'users',
                localField: 'owner',
                foreignField: '_id',
                as: 'commenter',
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
        // ======== 3. S2 ($lookup): join with the users collection to retrieve the commenter's profile (fullName, username, avatar) ========

        // ========= 4. S3 ($lookup): join with the likes collection to fetch all like documents associated with each specific comment =========
        {
            $lookup: {
                from: 'likes',
                localField: '_id',
                foreignField: 'comment',
                as: 'likes'
            }
        },
        // ========= 4. S3 ($lookup): join with the likes collection to fetch all like documents associated with each specific comment =========

        // =========== 5. S4 ($addFields): process the joined data to: ===========
        {
            $addFields: {
                // extract the first object from the commenter array
                commenter: {
                    $first: '$commenter'
                },
                // extract the first object from the commenter array
                // calculate the likesCount by measuring the size of the likes array
                likesCount: {
                    $size: '$likes'
                },
                // calculate the likesCount by measuring the size of the likes array
                // determine isLiked by checking if the current req.user._id exists within the likes.likedBy array
                isLiked: {
                    $cond: {
                        if: {$in: [req.user?._id, '$likes.likedBy']},
                        then: true,
                        else: false
                    }
                }
                // determine isLiked by checking if the current req.user._id exists within the likes.likedBy array
            }
        },
        // =========== 5. S4 ($addFields): process the joined data to: ===========

        // ======== 6. S5 ($sort): organize the results by createdAt in ascending order (oldest to newest) ========
        {
            $sort: {
                createdAt: 1
            }
        },
        // ======== 6. S5 ($sort): organize the results by createdAt in ascending order (oldest to newest) ========

        // ======== 7. S6 ($project): remove the raw likes array from the final output to optimize the response payload ========
        {
            $project: {
                likes: 0
            }
        }
        // ======== 7. S6 ($project): remove the raw likes array from the final output to optimize the response payload ========
    ]);


    // ========= 8. paginate the aggregate =========
    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    };
    
    const comments = await Comment.aggregatePaginate(commentAggregate, options);
    console.log('Fetched comments: ', comments);
    // ========= 8. paginate the aggregate =========

    
    // =========== 9. return success response ===========
    return res
    .status(200)
    .json(
        new ApiResponse(200, comments, `All comments for videoID: ${videoId} fetched successfully`)
    );
    // =========== 9. return success response ===========
});

export {
    addComment,
    updateComment,
    deleteComment,
    getVideoComments
}