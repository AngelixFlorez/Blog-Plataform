import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { createSanitizedHTML } from '../utils/sanitize';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Chip,
  Button,
  Divider,
  Avatar,
} from '@nextui-org/react';
import {
  Calendar,
  Clock,
  Tag,
  Edit,
  Trash,
  ArrowLeft,
  Share,
  Heart,
  MessageCircle,
  Bookmark,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { apiService, Post } from '../services/apiService';

interface PostPageProps {
  isAuthenticated?: boolean;
  currentUserId?: string;
}

const PostPage: React.FC<PostPageProps> = ({ isAuthenticated, currentUserId: _currentUserId }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        if (!id) throw new Error('Post ID is required');
        const fetchedPost = await apiService.getPost(id);
        setPost(fetchedPost);
        setError(null);
      } catch (err) {
        setError('Failed to load the post. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!post || !window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      setIsDeleting(true);
      await apiService.deletePost(post.id);
      toast.success('Post deleted successfully');
      navigate('/');
    } catch (err) {
      setError('Failed to delete the post. Please try again later.');
      setIsDeleting(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: post?.title,
        text: post?.content.substring(0, 100) + '...',
        url: window.location.href,
      });
    } catch (err) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
        <div className="space-y-6">
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 animate-pulse" />
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/3 animate-pulse" />
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" style={{ width: `${80 - i * 10}%` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
        <Card className="border border-gray-200/50 dark:border-gray-700/50">
          <CardBody className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-danger-50 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-danger">!</span>
            </div>
            <p className="text-danger text-lg font-medium mb-4">
              {error || 'Post not found'}
            </p>
            <Button
              as={Link}
              to="/"
              color="primary"
              variant="flat"
              startContent={<ArrowLeft size={16} />}
              className="font-medium"
            >
              Back to Home
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      {/* Back button */}
      <Button
        as={Link}
        to="/"
        variant="light"
        startContent={<ArrowLeft size={16} />}
        className="mb-6 font-medium hover-lift"
        size="sm"
      >
        Back to Posts
      </Button>

      {/* Main content card */}
      <Card className="border border-gray-200/50 dark:border-gray-700/50 shadow-xl overflow-hidden">
        {/* Header */}
        <CardHeader className="flex flex-col gap-6 p-8 sm:p-12">
          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-3">
            <Chip color="primary" variant="flat" size="sm" className="font-medium">
              {post.category.name}
            </Chip>
            <div className="flex items-center gap-1 text-sm text-gray-400">
              <Calendar size={14} />
              <span>{formatDate(post.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-400">
              <Clock size={14} />
              <span>{post.readingTime} min read</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight text-balance">
            {post.title}
          </h1>

          {/* Author */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <Avatar
                name={post.author?.name}
                size="md"
                color="primary"
                isBordered
                className="ring-2 ring-primary-200"
              />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {post.author?.name}
                </p>
                <p className="text-sm text-gray-400">Author</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {isAuthenticated && (
                <>
                  <Button
                    as={Link}
                    to={`/posts/${post.id}/edit`}
                    color="primary"
                    variant="flat"
                    startContent={<Edit size={16} />}
                    size="sm"
                    className="font-medium"
                  >
                    Edit
                  </Button>
                  <Button
                    color="danger"
                    variant="flat"
                    startContent={<Trash size={16} />}
                    onClick={handleDelete}
                    isLoading={isDeleting}
                    size="sm"
                    className="font-medium"
                  >
                    Delete
                  </Button>
                </>
              )}
              <Button
                variant="flat"
                startContent={<Share size={16} />}
                onClick={handleShare}
                size="sm"
                className="font-medium"
              >
                Share
              </Button>
            </div>
          </div>
        </CardHeader>

        <Divider />

        {/* Content */}
        <CardBody className="p-8 sm:p-12">
          <div
            className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-primary prose-img:rounded-xl prose-blockquote:border-primary prose-blockquote:bg-primary-50/50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg leading-relaxed"
            dangerouslySetInnerHTML={createSanitizedHTML(post.content)}
          />

          {/* Engagement bar */}
          <div className="flex items-center gap-4 mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <Button variant="light" startContent={<Heart size={18} />} className="text-gray-500">
              0 Likes
            </Button>
            <Button variant="light" startContent={<MessageCircle size={18} />} className="text-gray-500">
              0 Comments
            </Button>
            <Button variant="light" startContent={<Bookmark size={18} />} className="text-gray-500">
              Save
            </Button>
          </div>
        </CardBody>

        <Divider />

        {/* Footer - Tags */}
        <CardFooter className="p-8 sm:p-12">
          <div className="flex flex-col gap-4 w-full">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Chip
                  key={tag.id}
                  variant="flat"
                  className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium"
                  startContent={<Tag size={14} />}
                >
                  {tag.name}
                </Chip>
              ))}
              {post.tags.length === 0 && (
                <p className="text-sm text-gray-400">No tags</p>
              )}
            </div>
          </div>
        </CardFooter>
      </Card>
    </article>
  );
};

export default PostPage;
