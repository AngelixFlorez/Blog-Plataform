import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, CardFooter, CardHeader, Chip } from '@nextui-org/react';
import { Post } from '../services/apiService';
import { Calendar, Tag, ArrowRight, User, PenSquare } from 'lucide-react';
import { createExcerpt } from '../utils/sanitize';

interface PostListProps {
  posts: Post[] | null;
  loading: boolean;
  error: string | null;
}

const PostList: React.FC<PostListProps> = ({
  posts,
  loading,
  error,
}) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (error) {
    return (
      <Card className="border border-danger-200/50 bg-danger-50/50">
        <CardBody className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-danger-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">!</span>
          </div>
          <p className="text-danger text-lg font-medium">{error}</p>
        </CardBody>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, index) => (
          <Card
            key={index}
            className="w-full animate-pulse border border-gray-200/50 dark:border-gray-700/50"
          >
            <CardBody className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-1 space-y-4">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2" />
                  <div className="flex gap-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-20" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-24" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-16" />
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <Card className="border border-gray-200/50 dark:border-gray-700/50">
        <CardBody className="p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <PenSquare size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
            No posts yet
          </h3>
          <p className="text-gray-400">
            Check back later for new content
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post, index) => (
        <Card
          key={post.id}
          className="group border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
          isPressable
          onPress={() => navigate(`/posts/${post.id}`)}
        >
          <CardHeader className="p-6 pb-0">
            <div className="flex items-start justify-between w-full">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <Chip
                    size="sm"
                    variant="flat"
                    color="primary"
                    className="font-medium"
                  >
                    {post.category.name}
                  </Chip>
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                    {formatDate(post.createdAt)}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors leading-snug">
                  {post.title}
                </h2>
              </div>
              <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 group-hover:scale-110 transition-all">
                <ArrowRight
                  size={20}
                  className="text-gray-400 group-hover:text-primary transition-colors"
                />
              </div>
            </div>
          </CardHeader>

          <CardBody className="p-6">
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">
              {createExcerpt(post.content)}
            </p>
          </CardBody>

          <CardFooter className="p-6 pt-0">
            <div className="flex flex-wrap items-center gap-4 w-full">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center">
                  <User size={12} className="text-white" />
                </div>
                <span className="font-medium">{post.author?.name}</span>
              </div>

              <div className="flex items-center gap-1 text-sm text-gray-400">
                <Calendar size={14} />
                <span>{formatDate(post.createdAt)}</span>
              </div>



              <div className="flex-1" />

              <div className="flex gap-1.5">
                {post.tags.slice(0, 3).map((tag) => (
                  <Chip
                    key={tag.id}
                    size="sm"
                    variant="flat"
                    className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                    startContent={<Tag size={12} />}
                  >
                    {tag.name}
                  </Chip>
                ))}
                {post.tags.length > 3 && (
                  <Chip size="sm" variant="flat" className="bg-gray-100 dark:bg-gray-800">
                    +{post.tags.length - 3}
                  </Chip>
                )}
              </div>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default PostList;
