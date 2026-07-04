import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  Input,
  Select,
  SelectItem,
  Chip,
  SelectSection,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import {
  Bold,
  Italic,
  Undo,
  Redo,
  List,
  ListOrdered,
  ChevronDown,
  X,
  Type,
} from 'lucide-react';
import { Post, Category, Tag, PostStatus } from '../services/apiService';

interface PostFormProps {
  initialPost?: Post | null;
  onSubmit: (postData: {
    title: string;
    content: string;
    categoryId: string;
    tagIds: string[];
    status: PostStatus;
  }) => Promise<void>;
  onCancel: () => void;
  categories: Category[];
  availableTags: Tag[];
  isSubmitting?: boolean;
}

const PostForm: React.FC<PostFormProps> = ({
  initialPost,
  onSubmit,
  onCancel,
  categories,
  availableTags,
  isSubmitting = false,
}) => {
  const [title, setTitle] = useState(initialPost?.title || '');
  const [categoryId, setCategoryId] = useState(initialPost?.category?.id || '');
  const [selectedTags, setSelectedTags] = useState<Tag[]>(initialPost?.tags || []);
  const [status, setStatus] = useState<PostStatus>(
    initialPost?.status || PostStatus.DRAFT
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
      }),
      Heading.configure({ levels: [1, 2, 3] }),
      BulletList.configure({ keepMarks: true, keepAttributes: false }),
      OrderedList.configure({ keepMarks: true, keepAttributes: false }),
      ListItem,
    ],
    content: initialPost?.content || '',
    editorProps: {
      attributes: {
        class:
          'prose max-w-none focus:outline-none min-h-[400px] px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 transition-colors focus:border-primary-300 dark:focus:border-primary-600',
      },
    },
  });

  useEffect(() => {
    if (initialPost && editor) {
      setTitle(initialPost.title);
      editor.commands.setContent(initialPost.content);
      setCategoryId(initialPost.category?.id);
      setSelectedTags(initialPost.tags);
      setStatus(initialPost.status || PostStatus.DRAFT);
    }
  }, [initialPost, editor]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!editor?.getHTML() || editor?.getHTML() === '<p></p>') {
      newErrors.content = 'Content is required';
    }
    if (!categoryId) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    await onSubmit({
      title: title.trim(),
      content: editor?.getHTML() || '',
      categoryId,
      tagIds: selectedTags.map((tag) => tag.id),
      status,
    });
  };

  const handleTagAdd = (tag: Tag) => {
    if (tag && !selectedTags.includes(tag) && selectedTags.length < 10) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleTagRemove = (tagToRemove: Tag) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const handleHeadingSelect = (level: number) => {
    editor?.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 }).run();
  };

  const suggestedTags = availableTags
    .filter((tag) => !selectedTags.includes(tag))
    .slice(0, 5);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <CardBody className="p-6 space-y-6">
          {/* Title */}
          <Input
            label="Post Title"
            placeholder="Enter a compelling title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            isInvalid={!!errors.title}
            errorMessage={errors.title}
            isRequired
            variant="bordered"
            size="lg"
            classNames={{
              input: 'text-xl font-bold',
              label: 'text-sm font-medium',
            }}
          />

          {/* Editor Toolbar */}
          <div className="space-y-2">
            <div className="bg-gray-50 dark:bg-gray-800/50 p-2 rounded-xl flex gap-1 flex-wrap items-center border border-gray-200 dark:border-gray-700">
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    variant="flat"
                    size="sm"
                    endContent={<ChevronDown size={14} />}
                    className="font-medium"
                  >
                    <Type size={16} className="mr-1" />
                    Heading
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  onAction={(key) => handleHeadingSelect(Number(key))}
                  aria-label="Heading levels"
                >
                  <DropdownItem
                    key="1"
                    className={editor?.isActive('heading', { level: 1 }) ? 'bg-primary-50' : ''}
                    startContent={<span className="font-bold text-lg">H1</span>}
                  >
                    Heading 1
                  </DropdownItem>
                  <DropdownItem
                    key="2"
                    className={editor?.isActive('heading', { level: 2 }) ? 'bg-primary-50' : ''}
                    startContent={<span className="font-bold text-base">H2</span>}
                  >
                    Heading 2
                  </DropdownItem>
                  <DropdownItem
                    key="3"
                    className={editor?.isActive('heading', { level: 3 }) ? 'bg-primary-50' : ''}
                    startContent={<span className="font-bold text-sm">H3</span>}
                  >
                    Heading 3
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>

              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

              <Button
                size="sm"
                isIconOnly
                variant="flat"
                onClick={() => editor?.chain().focus().toggleBold().run()}
                className={editor?.isActive('bold') ? 'bg-primary-100 text-primary' : ''}
              >
                <Bold size={16} />
              </Button>
              <Button
                size="sm"
                isIconOnly
                variant="flat"
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                className={editor?.isActive('italic') ? 'bg-primary-100 text-primary' : ''}
              >
                <Italic size={16} />
              </Button>

              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

              <Button
                size="sm"
                isIconOnly
                variant="flat"
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                className={editor?.isActive('bulletList') ? 'bg-primary-100 text-primary' : ''}
              >
                <List size={16} />
              </Button>
              <Button
                size="sm"
                isIconOnly
                variant="flat"
                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                className={editor?.isActive('orderedList') ? 'bg-primary-100 text-primary' : ''}
              >
                <ListOrdered size={16} />
              </Button>

              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

              <Button
                size="sm"
                isIconOnly
                variant="flat"
                onClick={() => editor?.chain().focus().undo().run()}
                isDisabled={!editor?.can().undo()}
              >
                <Undo size={16} />
              </Button>
              <Button
                size="sm"
                isIconOnly
                variant="flat"
                onClick={() => editor?.chain().focus().redo().run()}
                isDisabled={!editor?.can().redo()}
              >
                <Redo size={16} />
              </Button>
            </div>

            <EditorContent editor={editor} />

            {errors.content && (
              <div className="text-danger text-sm flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-danger" />
                {errors.content}
              </div>
            )}
          </div>

          {/* Category */}
          <Select
            label="Category"
            placeholder="Select a category"
            selectedKeys={categoryId ? [categoryId] : []}
            onChange={(e) => setCategoryId(e.target.value)}
            isInvalid={!!errors.category}
            errorMessage={errors.category}
            isRequired
            variant="bordered"
            classNames={{
              label: 'text-sm font-medium',
            }}
          >
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </Select>

          {/* Tags */}
          <div className="space-y-2">
            <Select
              label="Add Tags"
              placeholder="Select tags"
              selectedKeys={selectedTags.map((tag) => tag.id)}
              variant="bordered"
              classNames={{
                label: 'text-sm font-medium',
              }}
            >
              <SelectSection title="Suggested tags">
                {suggestedTags.length > 0 ? (
                  suggestedTags.map((tag) => (
                    <SelectItem
                      key={tag.id}
                      value={tag.id}
                      onClick={() => handleTagAdd(tag)}
                    >
                      {tag.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem key="none" textValue="No more tags">
                    No more tags available
                  </SelectItem>
                )}
              </SelectSection>
            </Select>
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                {selectedTags.map((tag) => (
                  <Chip
                    key={tag.id}
                    onClose={() => handleTagRemove(tag)}
                    variant="flat"
                    color="primary"
                    endContent={<X size={14} />}
                    className="font-medium"
                  >
                    {tag.name}
                  </Chip>
                ))}
              </div>
            )}
          </div>

          {/* Status */}
          <Select
            label="Status"
            placeholder="Select status"
            selectedKeys={[status]}
            onChange={(e) => setStatus(e.target.value as PostStatus)}
            variant="bordered"
            classNames={{
              label: 'text-sm font-medium',
            }}
          >
            <SelectItem key={PostStatus.DRAFT} value={PostStatus.DRAFT}>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-warning" />
                Draft
              </div>
            </SelectItem>
            <SelectItem key={PostStatus.PUBLISHED} value={PostStatus.PUBLISHED}>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success" />
                Published
              </div>
            </SelectItem>
          </Select>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              color="danger"
              variant="flat"
              onClick={onCancel}
              isDisabled={isSubmitting}
              className="font-medium"
            >
              Cancel
            </Button>
            <Button
              color="primary"
              variant="shadow"
              type="submit"
              isLoading={isSubmitting}
              className="font-medium text-white shadow-lg shadow-primary/20 min-w-[140px]"
            >
              {initialPost ? 'Update' : 'Publish'} Post
            </Button>
          </div>
        </CardBody>
      </Card>
    </form>
  );
};

export default PostForm;
