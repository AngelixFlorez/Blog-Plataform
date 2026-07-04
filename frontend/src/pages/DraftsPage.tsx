import React, { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Button,
} from '@nextui-org/react';
import { Plus, BookDashed } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiService, Post } from '../services/apiService';
import PostList from '../components/PostList';

const DraftsPage: React.FC = () => {
  const [drafts, setDrafts] = useState<Post[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("updatedAt,desc");

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        setLoading(true);
        const response = await apiService.getDrafts({
          page: page - 1,
          size: 10,
          sort: sortBy,
        });
        setDrafts(response);
        setError(null);
      } catch (err) {
        setError('Failed to load drafts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDrafts();
  }, [page, sortBy]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <Card className="border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <CardHeader className="flex justify-between items-center p-6 pb-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-warning-50 flex items-center justify-center">
              <BookDashed size={20} className="text-warning" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">My Drafts</h1>
              <p className="text-sm text-gray-500">
                {drafts?.length || 0} draft{drafts?.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <Button
            as={Link}
            to="/posts/new"
            startContent={<Plus size={16} />}
            className="bg-primary-600 text-white hover:bg-primary-700 font-medium shadow-lg shadow-primary/20"
          >
            New Post
          </Button>
        </CardHeader>

        <CardBody className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 text-danger text-sm rounded-xl">
              {error}
            </div>
          )}

          <PostList
            posts={drafts}
            loading={loading}
            error={error}
            page={page}
            sortBy={sortBy}
            onPageChange={setPage}
            onSortChange={setSortBy}
          />

          {drafts?.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                <BookDashed size={32} className="text-gray-400" />
              </div>
              <p className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                No draft posts yet
              </p>
              <p className="text-sm text-gray-400 mb-6">
                Start writing and save as draft
              </p>
              <Button
                as={Link}
                to="/posts/new"
                className="bg-primary-600 text-white hover:bg-primary-700 font-medium shadow-lg shadow-primary/20"
              >
                Create Your First Post
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default DraftsPage;
