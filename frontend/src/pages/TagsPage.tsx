import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Chip,
  Tooltip,
  Spinner,
} from "@nextui-org/react";
import { Plus, Trash2, X, Hash } from "lucide-react";
import toast from "react-hot-toast";
import { apiService, Tag } from "../services/apiService";

interface TagsPageProps {
  isAuthenticated: boolean;
}

const TagsPage: React.FC<TagsPageProps> = ({ isAuthenticated }) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTags, setNewTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const response = await apiService.getTags();
      setTags(response);
      setError(null);
    } catch (err) {
      setError("Failed to load tags. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTags = async () => {
    if (newTags.length === 0) return;

    try {
      setIsSubmitting(true);
      await apiService.createTags(newTags);
      toast.success("Tags created successfully");
      await fetchTags();
      handleModalClose();
    } catch (err) {
      setError("Failed to create tags. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (tag: Tag) => {
    if (!window.confirm(`Delete "${tag.name}"?`)) return;

    try {
      await apiService.deleteTag(tag.id);
      toast.success("Tag deleted successfully");
      await fetchTags();
    } catch (err) {
      setError("Failed to delete tag. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setNewTags([]);
    setTagInput("");
    onClose();
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const value = tagInput.trim().toLowerCase();
      if (value && !newTags.includes(value)) {
        setNewTags([...newTags, value]);
        setTagInput("");
      }
    } else if (e.key === "Backspace" && !tagInput && newTags.length > 0) {
      setNewTags(newTags.slice(0, -1));
    }
  };

  const handleRemoveNewTag = (tagToRemove: string) => {
    setNewTags(newTags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <Card className="border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <CardHeader className="flex justify-between items-center p-6 pb-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
              <Hash size={20} className="text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Tags</h1>
              <p className="text-sm text-gray-500">
                {tags.length} tag{tags.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          {isAuthenticated && (
            <Button
              color="primary"
              variant="solid"
              startContent={<Plus size={16} />}
              onClick={onOpen}
              className="font-medium text-white shadow-lg shadow-primary/20"
            >
              Add Tags
            </Button>
          )}
        </CardHeader>

        <CardBody className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 text-danger text-sm rounded-xl">
              {error}
            </div>
          )}

          <Table
            aria-label="Tags table"
            isHeaderSticky
            classNames={{
              wrapper: "max-h-[600px]",
              th: "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-semibold text-xs uppercase tracking-wider",
              td: "py-4",
            }}
          >
            <TableHeader>
              <TableColumn>NAME</TableColumn>
              <TableColumn>POSTS</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody
              isLoading={loading}
              loadingContent={<Spinner label="Loading..." />}
            >
              {tags.map((tag) => (
                <TableRow key={tag.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <TableCell>
                    <span className="font-medium">{tag.name}</span>
                  </TableCell>
                  <TableCell>
                    <Chip size="sm" variant="flat" className="font-medium">
                      {tag.postCount || 0} post{(tag.postCount || 0) !== 1 ? "s" : ""}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    {isAuthenticated ? (
                      <Tooltip
                        content={
                          tag.postCount
                            ? "Cannot delete tag with posts"
                            : "Delete tag"
                        }
                      >
                        <Button
                          isIconOnly
                          variant="flat"
                          color="danger"
                          size="sm"
                          onClick={() => handleDelete(tag)}
                          isDisabled={tag?.postCount ? tag.postCount > 0 : false}
                          className="hover-lift"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </Tooltip>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={handleModalClose} placement="center">
        <ModalContent className="border border-gray-200/50 dark:border-gray-700/50">
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-xl font-bold">Add Tags</h2>
            <p className="text-sm text-gray-500 font-normal">
              Type and press Enter or comma to add tags
            </p>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Tags"
                placeholder="e.g. javascript, react, tutorial"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                variant="bordered"
                autoFocus
                classNames={{
                  label: "text-sm font-medium",
                }}
              />
              {newTags.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  {newTags.map((tag) => (
                    <Chip
                      key={tag}
                      onClose={() => handleRemoveNewTag(tag)}
                      variant="flat"
                      color="primary"
                      endContent={<X size={14} />}
                      className="font-medium"
                    >
                      {tag}
                    </Chip>
                  ))}
                </div>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleModalClose} className="bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium">
              Cancel
            </Button>
            <Button
              onClick={handleAddTags}
              isLoading={isSubmitting}
              isDisabled={newTags.length === 0}
              className="bg-primary-600 text-white hover:bg-primary-700 font-medium shadow-lg shadow-primary/20"
            >
              Add {newTags.length > 0 ? `(${newTags.length})` : ""} Tags
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default TagsPage;
