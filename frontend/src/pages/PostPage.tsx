import React, { useEffect, useState, useCallback } from 'react';
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
  Input,
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
  Send,
  Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { apiService, Post, CommentDto, PostStatus } from '../services/apiService';
import { useAuth } from '../components/AuthContext';

interface PostPageProps {
  isAuthenticated?: boolean;
}

const PostPage: React.FC<PostPageProps> = ({ isAuthenticated }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [comments, setComments] = useState<CommentDto[]>([]);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  const fetchPost = useCallback(async () => {
    try {
      setLoading(true);
      if (!id) throw new Error('Post ID is required');
      const fetchedPost = await apiService.getPost(id);
      setPost(fetchedPost);
      setLikeCount(fetchedPost.likeCount || 0);
      setError(null);
    } catch {
      setError('Failed to load the post. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchLikeStatus = useCallback(async () => {
    if (!id) return;
    try {
      const likeStatus = await apiService.getLikeStatus(id);
      setLiked(likeStatus.liked);
      setLikeCount(likeStatus.likeCount);
    } catch {
    }
  }, [id]);

  const fetchBookmarkStatus = useCallback(async () => {
    if (!id) return;
    try {
      const bookmarkStatus = await apiService.getBookmarkStatus(id);
      setBookmarked(bookmarkStatus.bookmarked);
    } catch {
    }
  }, [id]);

  const fetchComments = useCallback(async () => {
    if (!id) return;
    try {
      const fetchedComments = await apiService.getComments(id);
      setComments(fetchedComments);
    } catch {
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
    fetchComments();
    if (isAuthenticated) {
      fetchLikeStatus();
      fetchBookmarkStatus();
    }
  }, [id, isAuthenticated, fetchPost, fetchComments, fetchLikeStatus, fetchBookmarkStatus]);

  const handleDelete = async () => {
    if (!post || !window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      setIsDeleting(true);
      await apiService.deletePost(post.id);
      toast.success('Post deleted successfully');
      navigate('/');
    } catch {
      setError('Failed to delete the post. Please try again later.');
      setIsDeleting(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to like posts');
      return;
    }
    if (!id) return;
    try {
      const result = await apiService.toggleLike(id);
      setLiked(result.liked);
      setLikeCount(result.likeCount);
    } catch {
      toast.error('Failed to like the post');
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to save posts');
      return;
    }
    if (!id) return;
    try {
      const result = await apiService.toggleBookmark(id);
      setBookmarked(result.bookmarked);
      toast.success(result.bookmarked ? 'Post saved' : 'Post unsaved');
    } catch {
      toast.error('Failed to save the post');
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: post?.title,
        text: post?.content.substring(0, 100) + '...',
        url: window.location.href,
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  const handleSubmitComment = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to comment');
      return;
    }
    if (!id || !newComment.trim()) return;
    try {
      setSubmittingComment(true);
      const comment = await apiService.createComment(id, newComment.trim());
      setComments([...comments, comment]);
      setNewComment('');
      toast.success('Comment added');
    } catch {
      toast.error('Failed to add comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!id) return;
    try {
      await apiService.deleteComment(id, commentId);
      setComments(comments.filter(c => c.id !== commentId));
      toast.success('Comment deleted');
    } catch {
      toast.error('Failed to delete comment');
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
              startContent={<ArrowLeft size={16} />}
              className="bg-primary-50 text-primary-700 hover:bg-primary-100 font-medium"
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
      <Button
        as={Link}
        to="/"
        startContent={<ArrowLeft size={16} />}
        className="mb-6 font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
        size="sm"
      >
        Back to Posts
      </Button>

      <Card className="border border-gray-200/50 dark:border-gray-700/50 shadow-xl overflow-hidden">
        <CardHeader className="flex flex-col gap-6 p-8 sm:p-12">
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

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight text-balance">
            {post.title}
          </h1>

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

            <div className="flex items-center gap-2">
              {isAuthenticated && (
                <>
                  <Button
                    as={Link}
                    to={`/posts/${post.id}/edit`}
                    startContent={<Edit size={16} />}
                    size="sm"
                    className="bg-primary-50 text-primary-700 hover:bg-primary-100 font-medium"
                  >
                    Edit
                  </Button>
                  <Button
                    startContent={<Trash size={16} />}
                    onClick={handleDelete}
                    isLoading={isDeleting}
                    size="sm"
                    className="bg-danger-50 text-danger-700 hover:bg-danger-100 font-medium"
                  >
                    Delete
                  </Button>
                </>
              )}
              <Button
                startContent={<Share size={16} />}
                onClick={handleShare}
                size="sm"
                className="bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium"
              >
                Share
              </Button>
            </div>
          </div>
        </CardHeader>

        <Divider />

        <CardBody className="p-8 sm:p-12">
          <div
            className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-primary prose-img:rounded-xl prose-blockquote:border-primary prose-blockquote:bg-primary-50/50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg leading-relaxed"
            dangerouslySetInnerHTML={createSanitizedHTML(post.content)}
          />

          <div className="flex items-center gap-4 mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="light"
              startContent={<Heart size={18} className={liked ? 'fill-red-500 text-red-500' : ''} />}
              onPress={handleLike}
              className={liked ? 'text-red-500' : 'text-gray-500'}
            >
              {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
            </Button>
            <Button
              variant="light"
              startContent={<Bookmark size={18} className={bookmarked ? 'fill-primary-500 text-primary-500' : ''} />}
              onPress={handleBookmark}
              className={bookmarked ? 'text-primary-500' : 'text-gray-500'}
            >
              {bookmarked ? 'Saved' : 'Save'}
            </Button>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <MessageCircle size={20} />
              Comments ({comments.length})
            </h3>

            {isAuthenticated && (
              <div className="flex gap-2 mb-6">
                <Input
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmitComment();
                    }
                  }}
                  variant="bordered"
                  size="sm"
                  className="flex-1"
                />
                <Button
                  isIconOnly
                  onPress={handleSubmitComment}
                  isLoading={submittingComment}
                  isDisabled={!newComment.trim()}
                  className="bg-primary-600 text-white"
                >
                  <Send size={16} />
                </Button>
              </div>
            )}

            {comments.length === 0 ? (
              <p className="text-gray-400 text-sm">No comments yet.</p>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <Avatar name={comment.userName} size="sm" className="mt-1" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-sm text-gray-900 dark:text-white">
                          {comment.userName}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                          {isAuthenticated && user?.name === comment.userName && (
                            <Button
                              isIconOnly
                              size="sm"
                              variant="light"
                              onPress={() => handleDeleteComment(comment.id)}
                              className="text-gray-400 hover:text-danger min-w-0 h-auto p-1"
                            >
                              <Trash2 size={14} />
                            </Button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardBody>

        <Divider />

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