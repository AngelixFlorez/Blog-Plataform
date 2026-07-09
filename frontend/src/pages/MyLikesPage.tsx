import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Spinner,
} from '@nextui-org/react';
import { Heart, ArrowLeft } from 'lucide-react';
import { apiService, Post, LikeDto } from '../services/apiService';
import PostList from '../components/PostList';

const MyLikesPage: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLikedPosts = async () => {
      try {
        setLoading(true);
        const likes: LikeDto[] = await apiService.getUserLikes();
        const postIds = likes.map(l => l.postId);
        const postsData = await Promise.all(
          postIds.map(id => apiService.getPost(id).catch(() => null))
        );
        setPosts(postsData.filter((p): p is Post => p !== null));
        setError(null);
      } catch {
        setError('Failed to load liked posts.');
      } finally {
        setLoading(false);
      }
    };
    fetchLikedPosts();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <Button
        onPress={() => navigate(-1)}
        startContent={<ArrowLeft size={16} />}
        className="mb-6 font-medium text-gray-600 hover:text-gray-900"
        size="sm"
      >
        Back
      </Button>
      <Card className="border border-gray-200/50 dark:border-gray-700/50 shadow-lg mb-6">
        <CardHeader className="p-6 pb-0">
          <div className="flex items-center gap-3">
            <Heart size={24} className="text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Likes</h1>
          </div>
        </CardHeader>
        <CardBody className="p-6">
          <PostList posts={posts} loading={loading} error={error} />
        </CardBody>
      </Card>
    </div>
  );
};

export default MyLikesPage;