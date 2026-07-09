import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { createSanitizedHTML } from '../utils/sanitize';
import {
  Card,
  CardBody,
  Chip,
  Button,
  Divider,
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
  Eye,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { apiService, Post, CommentDto } from '../services/apiService';
import { useAuth } from '../components/AuthContext';

const AuthorAvatar = ({ name, size = 'md' }: { name?: string; size?: 'sm' | 'md' | 'lg' }) => {
  const initials = (name || 'A').substring(0, 3).toUpperCase();
  const sizeMap = { sm: 'w-8 h-8 text-xs', md: 'w-12 h-12 text-sm', lg: 'w-16 h-16 text-lg' };
  return (
    <div className={`${sizeMap[size]} rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg shadow-primary-200/50`}>
      {initials}
    </div>
  );
};

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
    } catch {}
  }, [id]);

  const fetchBookmarkStatus = useCallback(async () => {
    if (!id) return;
    try {
      const bookmarkStatus = await apiService.getBookmarkStatus(id);
      setBookmarked(bookmarkStatus.bookmarked);
    } catch {}
  }, [id]);

  const fetchComments = useCallback(async () => {
    if (!id) return;
    try {
      const fetchedComments = await apiService.getComments(id);
      setComments(fetchedComments);
    } catch {}
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
    if (!post || !window.confirm('Are you sure you want to delete this post?')) return;
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
    if (!isAuthenticated) { toast.error('Please log in to like posts'); return; }
    if (!id) return;
    try {
      const result = await apiService.toggleLike(id);
      setLiked(result.liked);
      setLikeCount(result.likeCount);
    } catch { toast.error('Failed to like the post'); }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) { toast.error('Please log in to save posts'); return; }
    if (!id) return;
    try {
      const result = await apiService.toggleBookmark(id);
      setBookmarked(result.bookmarked);
      toast.success(result.bookmarked ? 'Post saved' : 'Post unsaved');
    } catch { toast.error('Failed to save the post'); }
  };

  const handleShare = async () => {
    try {
      await navigator.share({ title: post?.title, text: post?.content.substring(0, 100) + '...', url: window.location.href });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  const handleSubmitComment = async () => {
    if (!isAuthenticated) { toast.error('Please log in to comment'); return; }
    if (!id || !newComment.trim()) return;
    try {
      setSubmittingComment(true);
      const comment = await apiService.createComment(id, newComment.trim());
      setComments([...comments, comment]);
      setNewComment('');
      toast.success('Comment added');
    } catch { toast.error('Failed to add comment'); }
    finally { setSubmittingComment(false); }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!id) return;
    try {
      await apiService.deleteComment(id, commentId);
      setComments(comments.filter(c => c.id !== commentId));
      toast.success('Comment deleted');
    } catch { toast.error('Failed to delete comment'); }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
        <div className="space-y-6">
          <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          <div className="h-16 bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-2xl animate-pulse" />
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
        <Card className="border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
          <CardBody className="p-16 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-danger-100 to-danger-50 dark:from-danger-900/30 dark:to-danger-800/20 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-3xl text-danger font-bold">!</span>
            </div>
            <p className="text-danger text-lg font-medium mb-6">{error || 'Post not found'}</p>
            <Button as={Link} to="/" startContent={<ArrowLeft size={16} />} className="bg-primary-50 text-primary-700 hover:bg-primary-100 font-medium">
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
        className="mb-8 font-medium text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-all hover:gap-3"
        variant="light"
        size="sm"
      >
        Back to Posts
      </Button>

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-500 to-purple-600 p-8 sm:p-14 mb-8 shadow-2xl shadow-primary-200/50">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-300/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <Chip color="warning" variant="solid" size="sm" className="font-semibold text-xs shadow-lg shadow-black/10">
              {post.category.name}
            </Chip>
            <div className="flex items-center gap-1 text-xs text-white/70">
              <Calendar size={12} />
              <span>{formatDate(post.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-white/70">
              <Clock size={12} />
              <span>{post.readingTime} min read</span>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight text-balance mb-6 drop-shadow-sm">
            {post.title}
          </h1>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <AuthorAvatar name={post.author?.name} size="md" />
              <div>
                <p className="font-bold text-white text-lg drop-shadow-sm">{post.author?.name}</p>
                <p className="text-xs text-white/60">Author</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isAuthenticated && (
                <>
                  <Button as={Link} to={`/posts/${post.id}/edit`} startContent={<Edit size={14} />} size="sm" className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm font-medium border border-white/10">
                    Edit
                  </Button>
                  <Button startContent={<Trash size={14} />} onClick={handleDelete} isLoading={isDeleting} size="sm" className="bg-white/20 text-white hover:bg-red-500/60 backdrop-blur-sm font-medium border border-white/10">
                    Delete
                  </Button>
                </>
              )}
              <Button startContent={<Share size={14} />} onClick={handleShare} size="sm" className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm font-medium border border-white/10">
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Card className="border-none shadow-xl bg-white dark:bg-gray-900 overflow-hidden rounded-3xl -mt-6 relative z-10 mx-2 sm:mx-6">
        <CardBody className="p-8 sm:p-14">
          <div
            className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-primary prose-img:rounded-2xl prose-img:shadow-lg prose-blockquote:border-l-primary prose-blockquote:bg-primary-50/50 dark:prose-blockquote:bg-primary-900/20 prose-blockquote:py-3 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl leading-relaxed prose-p:leading-8"
            dangerouslySetInnerHTML={createSanitizedHTML(post.content)}
          />

          <div className="flex flex-wrap items-center gap-3 mt-14 pt-10 border-t border-gray-100 dark:border-gray-800">
            <Button
              variant="light"
              startContent={<Heart size={20} className={`transition-all ${liked ? 'fill-red-500 text-red-500 scale-110' : ''}`} />}
              onPress={handleLike}
              className={`font-semibold ${liked ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
            </Button>
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />
            <Button
              variant="light"
              startContent={<MessageCircle size={20} />}
              className="font-semibold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
            </Button>
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />
            <Button
              variant="light"
              startContent={<Bookmark size={20} className={`transition-all ${bookmarked ? 'fill-primary-500 text-primary-500 scale-110' : ''}`} />}
              onPress={handleBookmark}
              className={`font-semibold ${bookmarked ? 'text-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              {bookmarked ? 'Saved' : 'Save'}
            </Button>
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />
            <Button
              variant="light"
              startContent={<Eye size={20} />}
              onClick={handleShare}
              className="font-semibold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Share
            </Button>
          </div>

          <div className="mt-14 pt-10 border-t border-gray-100 dark:border-gray-800">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary-50 dark:bg-primary-900/30">
                <MessageCircle size={20} className="text-primary" />
              </div>
              Comments <span className="text-gray-400 font-normal">({comments.length})</span>
            </h3>

            {isAuthenticated && (
              <div className="flex gap-3 mb-8 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                <AuthorAvatar name={user?.name} size="sm" />
                <div className="flex-1 flex gap-2 items-start">
                  <Input
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmitComment(); }
                    }}
                    variant="flat"
                    size="sm"
                    className="flex-1"
                    classNames={{ input: 'bg-transparent' }}
                  />
                  <Button
                    isIconOnly
                    onPress={handleSubmitComment}
                    isLoading={submittingComment}
                    isDisabled={!newComment.trim()}
                    className="bg-primary-600 text-white rounded-xl min-w-10 h-10"
                  >
                    <Send size={16} />
                  </Button>
                </div>
              </div>
            )}

            {comments.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                  <MessageCircle size={24} className="text-gray-400" />
                </div>
                <p className="text-gray-400 font-medium">No comments yet</p>
                {!isAuthenticated && <p className="text-gray-400 text-sm mt-1">Log in to be the first to comment</p>}
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4 p-5 bg-gray-50 dark:bg-gray-800/30 rounded-2xl border border-gray-100 dark:border-gray-700/50 hover:border-gray-200 dark:hover:border-gray-600 transition-colors group">
                    <AuthorAvatar name={comment.userName} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="font-bold text-sm text-gray-900 dark:text-white">{comment.userName}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                          {isAuthenticated && user?.name === comment.userName && (
                            <Button
                              isIconOnly
                              size="sm"
                              variant="light"
                              onPress={() => handleDeleteComment(comment.id)}
                              className="text-gray-300 hover:text-danger opacity-0 group-hover:opacity-100 transition-all min-w-0 h-auto p-1"
                            >
                              <Trash2 size={14} />
                            </Button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      <div className="mt-10 mx-2 sm:mx-6">
        <div className="flex flex-wrap gap-2 items-center">
          <Tag size={14} className="text-gray-400" />
          <span className="text-sm font-semibold text-gray-500 mr-2">Tags:</span>
          {post.tags.map((tag) => (
            <Chip
              key={tag.id}
              variant="flat"
              size="sm"
              className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {tag.name}
            </Chip>
          ))}
          {post.tags.length === 0 && <span className="text-sm text-gray-400">No tags</span>}
        </div>
      </div>
    </article>
  );
};

export default PostPage;