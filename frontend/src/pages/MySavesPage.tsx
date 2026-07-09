import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
} from '@nextui-org/react';
import { Bookmark, ArrowLeft } from 'lucide-react';
import { apiService, Post, BookmarkDto } from '../services/apiService';
import PostList from '../components/PostList';

const MySavesPage: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        setLoading(true);
        const bookmarks: BookmarkDto[] = await apiService.getUserBookmarks();
        const postIds = bookmarks.map(b => b.postId);
        const postsData = await Promise.all(
          postIds.map(id => apiService.getPost(id).catch(() => null))
        );
        setPosts(postsData.filter((p): p is Post => p !== null));
        setError(null);
      } catch {
        setError('Failed to load saved posts.');
      } finally {
        setLoading(false);
      }
    };
    fetchSavedPosts();
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
            <Bookmark size={24} className="text-primary-500" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Saves</h1>
          </div>
        </CardHeader>
        <CardBody className="p-6">
          <PostList posts={posts} loading={loading} error={error} />
        </CardBody>
      </Card>
    </div>
  );
};

export default MySavesPage;