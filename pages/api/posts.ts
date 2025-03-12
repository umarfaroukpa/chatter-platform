import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/mongodb';
import Post, { IPost } from '../../models/Post';
import User, { IUserDocument } from '../../models/User';
import { v4 as uuidv4 } from 'uuid';
import { findOne, findOneAndUpdate, find, countDocuments } from '../../lib/mongoose-utils';

interface ApiResponse {
    success: boolean;
    data?: PostData | PostData[];
    error?: string;
    pagination?: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
    if (req.method === 'POST') {
        try {
            const { title, content, tags, uid } = req.body;

            if (!title || !content || !uid) {
                return res.status(400).json({
                    success: false,
                    error: 'Title, content, and user ID are required'
                });
            }

            await connectToDatabase();

            // Use the utility function instead of direct mongoose method
            const user = await findOne<IUserDocument>(User, { uid });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            }

            if (user.userType !== 'Writer') {
                return res.status(403).json({
                    success: false,
                    error: 'Only Writers can create posts'
                });
            }

            const postId = uuidv4();

            const newPost = new Post({
                postId,
                title,
                content,
                author: user.username || 'Anonymous',
                authorId: uid,
                authorProfilePic: user.profilePicUrl || '',
                tags: tags || [],
                createdAt: new Date(),
                updatedAt: new Date(),
                likes: [],
                comments: []
            });

            await newPost.save();

            // Use the utility function instead of direct mongoose method
            await findOneAndUpdate<IUserDocument>(
                User,
                { uid },
                { $push: { posts: { id: postId, title } } },
                { new: true }
            );

            return res.status(201).json({
                success: true,
                data: newPost
            });

        } catch (error: any) {
            console.error('Error creating post:', error);
            return res.status(500).json({
                success: false,
                error: error.message || 'Failed to create post'
            });
        }
    } else if (req.method === 'GET') {
        try {
            await connectToDatabase();

            const { tag, authorId, limit = '10', page = '1' } = req.query;
            const skip = (Number(page) - 1) * Number(limit);

            const query: any = {};
            if (tag) query.tags = tag;
            if (authorId) query.authorId = authorId;

            // Use the utility function instead of direct mongoose method
            const posts = await find<IPost>(
                Post,
                query,
                {
                    sort: { createdAt: -1 },
                    skip: skip,
                    limit: Number(limit)
                }
            );

            // Use the utility function instead of direct mongoose method
            const total = await countDocuments(Post, query);

            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

            return res.status(200).json({
                success: true,
                data: posts,
                pagination: {
                    total,
                    page: Number(page),
                    limit: Number(limit),
                    pages: Math.ceil(total / Number(limit))
                }
            });

        } catch (error: Error) {
            console.error('Error fetching posts:', error);
            return res.status(500).json({
                success: false,
                error: error.message || 'Failed to fetch posts'
            });
        }
    } else {
        return res.status(405).json({
            success: false,
            error: 'Method not allowed'
        });
    }
}
