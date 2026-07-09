import React, { useEffect, useState, useRef } from 'react';
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
import Image from '@tiptap/extension-image';

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
  Image as ImageIcon,
  Loader2,
  Smile,
} from 'lucide-react';
import { Post, Category, Tag, PostStatus } from '../services/apiService';
import EmojiPicker from './EmojiPicker';

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
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      Image.configure({ inline: false }),
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors({ ...errors, content: 'Only image files are allowed' });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrors({ ...errors, content: 'Image must be less than 10MB' });
      return;
    }

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/v1/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      editor?.chain().focus().setImage({ src: data.url }).run();
    } catch {
      setErrors({ ...errors, content: 'Failed to upload image' });
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
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
                    size="sm"
                    endContent={<ChevronDown size={14} />}
                    className="bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium"
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
                onClick={() => editor?.chain().focus().toggleBold().run()}
                className={`text-gray-600 hover:bg-gray-200 ${editor?.isActive('bold') ? 'bg-primary-100 text-primary' : 'bg-gray-100'}`}
              >
                <Bold size={16} />
              </Button>
              <Button
                size="sm"
                isIconOnly
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                className={`text-gray-600 hover:bg-gray-200 ${editor?.isActive('italic') ? 'bg-primary-100 text-primary' : 'bg-gray-100'}`}
              >
                <Italic size={16} />
              </Button>

              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

              <Button
                size="sm"
                isIconOnly
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                className={`text-gray-600 hover:bg-gray-200 ${editor?.isActive('bulletList') ? 'bg-primary-100 text-primary' : 'bg-gray-100'}`}
              >
                <List size={16} />
              </Button>
              <Button
                size="sm"
                isIconOnly
                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                className={`text-gray-600 hover:bg-gray-200 ${editor?.isActive('orderedList') ? 'bg-primary-100 text-primary' : 'bg-gray-100'}`}
              >
                <ListOrdered size={16} />
              </Button>

              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <Button
                size="sm"
                isIconOnly
                onClick={() => fileInputRef.current?.click()}
                isLoading={uploadingImage}
                className="bg-gray-100 text-gray-600 hover:bg-gray-200"
              >
                {uploadingImage ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />}
              </Button>

              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

              <EmojiPicker onEmojiSelect={(emoji) => editor?.chain().focus().insertContent(emoji).run()}>
                <Button
                  size="sm"
                  isIconOnly
                  className="bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                  <Smile size={16} />
                </Button>
              </EmojiPicker>

              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

              <Button
                size="sm"
                isIconOnly
                onClick={() => editor?.chain().focus().undo().run()}
                isDisabled={!editor?.can().undo()}
                className="bg-gray-100 text-gray-600 hover:bg-gray-200"
              >
                <Undo size={16} />
              </Button>
              <Button
                size="sm"
                isIconOnly
                onClick={() => editor?.chain().focus().redo().run()}
                isDisabled={!editor?.can().redo()}
                className="bg-gray-100 text-gray-600 hover:bg-gray-200"
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
              <SelectItem key={cat.id} value={cat.id} textValue={cat.name}>
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
                      textValue={tag.name}
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
            onChange={(e) => {
              const value = e.target.value;
              if (value) setStatus(value as PostStatus);
            }}
            variant="bordered"
            disallowEmptySelection
            classNames={{
              label: 'text-sm font-medium',
            }}
          >
            <SelectItem key={PostStatus.DRAFT} value={PostStatus.DRAFT}>
              Draft
            </SelectItem>
            <SelectItem key={PostStatus.PUBLISHED} value={PostStatus.PUBLISHED}>
              Published
            </SelectItem>
          </Select>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              onClick={onCancel}
              isDisabled={isSubmitting}
              className="bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
              className="bg-primary-600 text-white hover:bg-primary-700 font-medium shadow-lg shadow-primary/20 min-w-[140px]"
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
