import React, { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  Tabs,
  Tab,
  Chip,
  Button,
} from '@nextui-org/react';
import { apiService, Post, Category, Tag } from '../services/apiService';
import PostList from '../components/PostList';
import { Hash, Layers } from 'lucide-react';

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt,desc");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [postsResponse, categoriesResponse, tagsResponse] = await Promise.all([
          apiService.getPosts({
            categoryId: selectedCategory !== undefined ? selectedCategory : undefined,
            tagId: selectedTag || undefined,
          }),
          apiService.getCategories(),
          apiService.getTags(),
        ]);

        setPosts(postsResponse);
        setCategories(categoriesResponse);
        setTags(tagsResponse);
        setError(null);
      } catch (err) {
        setError('Failed to load content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, sortBy, selectedCategory, selectedTag]);

  const handleCategoryChange = (categoryId: string | undefined) => {
    if ('all' === categoryId) {
      setSelectedCategory(undefined);
    } else {
      setSelectedCategory(categoryId);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8 animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl hero-gradient p-8 sm:p-12 md:p-16">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <img src="/logo.png" alt="Logo" className="w-14 h-14 object-contain brightness-0 invert" />
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
              Bloggeo
            </h1>
          </div>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl leading-relaxed">
            Discover stories, ideas, and expertise from writers on any topic
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <Card className="border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <CardBody className="p-6">
          <div className="flex flex-col gap-6">
            {/* Categories */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Layers size={18} className="text-primary" />
                <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Categories
                </h2>
              </div>
              <Tabs
                selectedKey={selectedCategory}
                onSelectionChange={(key) => handleCategoryChange(key as string)}
                variant="underlined"
                classNames={{
                  tabList: "gap-0",
                  cursor: "w-full bg-primary",
                  tab: "px-4 py-2",
                  tabContent: "text-sm",
                }}
              >
                <Tab key="all" title="All Posts" />
                {categories.map((category) => (
                  <Tab
                    key={category.id}
                    title={
                      <span className="flex items-center gap-1">
                        {category.name}
                        <Chip size="sm" variant="flat" className="ml-1">
                          {category.postCount || 0}
                        </Chip>
                      </span>
                    }
                  />
                ))}
              </Tabs>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Hash size={18} className="text-primary" />
                  <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Tags
                  </h2>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    variant={selectedTag === undefined ? "solid" : "flat"}
                    color={selectedTag === undefined ? "primary" : "default"}
                    onPress={() => setSelectedTag(undefined)}
                    className="rounded-full font-medium"
                  >
                    All
                  </Button>
                  {tags.map((tag) => (
                    <Button
                      key={tag.id}
                      size="sm"
                      variant={selectedTag === tag.id ? "solid" : "flat"}
                      color={selectedTag === tag.id ? "primary" : "default"}
                      onPress={() =>
                        setSelectedTag(
                          selectedTag === tag.id ? undefined : tag.id
                        )
                      }
                      className="rounded-full font-medium"
                    >
                      {tag.name} ({tag.postCount || 0})
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Posts List */}
      <section>
        <PostList
          posts={posts}
          loading={loading}
          error={error}
          page={page}
          sortBy={sortBy}
          onPageChange={setPage}
          onSortChange={setSortBy}
        />
      </section>
    </div>
  );
};

export default HomePage;
