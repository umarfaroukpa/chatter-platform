// pages/api/posts.ts
import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/mongodb';
import Post from '../../models/Post';
import User from '../../models/User';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Handle POST request to create a new post
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

            // Get the user to verify permissions and get author information
            const user = await User.findOne({ uid }).exec();
            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            }

            // Check if user is a Writer (optional, can enforce this check)
            if (user.userType !== 'Writer') {
                return res.status(403).json({
                    success: false,
                    error: 'Only Writers can create posts'
                });
            }

            // Create post ID
            const postId = uuidv4();

            // Create new post
            const newPost = new Post({
                postId,
                title,
                content,
                authorId: uid,
                authorName: user.username || 'Anonymous',
                authorProfilePic: user.profilePicUrl || '',
                tags: tags || [],
                createdAt: new Date(),
                updatedAt: new Date(),
                likes: [],
                comments: []
            });

            await newPost.save();

            // Add post reference to user's posts array
            await User.findOneAndUpdate(
                { uid },
                { $push: { posts: { id: postId, title } } }
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
    }

    // Handle GET request to fetch posts
    else if (req.method === 'GET') {
        try {
            await connectToDatabase();

            const { tag, authorId, limit = 10, page = 1 } = req.query;
            const skip = (Number(page) - 1) * Number(limit);

            // Build query based on filters
            const query: any = {};
            if (tag) query.tags = tag;
            if (authorId) query.authorId = authorId;

            // Fetch posts with pagination
            const posts = await Post.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit))
                .exec();

            const total = await Post.countDocuments(query);

            // Disable caching
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

        } catch (error: any) {
            console.error('Error fetching posts:', error);
            return res.status(500).json({
                success: false,
                error: error.message || 'Failed to fetch posts'
            });
        }
    }

    // Method not allowed
    else {
        return res.status(405).json({
            success: false,
            error: 'Method not allowed'
        });
    }
}