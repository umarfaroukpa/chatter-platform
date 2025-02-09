import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const posts = [
    {
        id: 1,
        author: 'Jane Smith',
        content: 'Exploring the latest features in Next.js 12!',
        likes: 20,
        comments: 4,
        isLiked: false,
        isBookmarked: false,
    },

];

const FeedPage = () => {
    const [feedPosts, setFeedPosts] = useState(posts);
    const router = useRouter();

    const handleLike = (postId: number) => {
        setFeedPosts((prevPosts) =>
            prevPosts.map((post) =>
                post.id === postId
                    ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
                    : post
            )
        );
    };

    const handleBack = () => {
        router.back();
    };

    const handleBookmark = (postId: number) => {
        setFeedPosts((prevPosts) =>
            prevPosts.map((post) =>
                post.id === postId
                    ? { ...post, isBookmarked: !post.isBookmarked }
                    : post
            )
        );
    };

    const handleComment = (postId: number) => {
        alert(`Comment on post ${postId}`);
    };

    const handleShare = (postId: number) => {
        alert(`Share post ${postId}`);
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Your Feed</h1>

            <div className="space-y-8">
                {feedPosts.map((post) => (
                    <div key={post.id} className="bg-white p-4 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-2">{post.author}</h2>
                        <p className="mb-4">{post.content}</p>

                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => handleLike(post.id)}
                                className="flex items-center space-x-1 text-blue-600"
                            >
                                <span>{post.isLiked ? 'Unlike' : 'Like'}</span> <span>({post.likes})</span>
                            </button>

                            <button onClick={() => handleComment(post.id)} className="text-gray-600">
                                Comment ({post.comments})
                            </button>

                            <button onClick={() => handleShare(post.id)} className="text-gray-600">
                                Share
                            </button>

                            <button
                                onClick={() => handleBookmark(post.id)}
                                className="ml-auto text-gray-600"
                            >
                                {post.isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div>

                <div>
                    <button onClick={handleBack} className="bg-blue-600 text-[#07327a] text-center py-3 px-6 rounded-lg">Go Back</button>
                    <Link href="/">
                        <p className="bg-blue-600 text-[#07327a] text-center py-3 px-6 rounded-lg">Go Back to Homepage</p>

                    </Link>

                </div>
            </div>
        </div>
    );
};

export default FeedPage;
