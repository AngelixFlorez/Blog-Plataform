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
  Tooltip,
  Chip,
  Spinner,
} from "@nextui-org/react";
import { Plus, Edit2, Trash2, Layers } from "lucide-react";
import toast from "react-hot-toast";
import { apiService, Category } from "../services/apiService";

interface CategoriesPageProps {
  isAuthenticated: boolean;
}

const CategoriesPage: React.FC<CategoriesPageProps> = ({ isAuthenticated }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCategories();
      setCategories(response);
      setError(null);
    } catch {
      setError("Failed to load categories. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddEdit = async () => {
    if (!newCategoryName.trim()) return;

    try {
      setIsSubmitting(true);
      if (editingCategory) {
        await apiService.updateCategory(editingCategory.id, newCategoryName.trim());
        toast.success("Category updated successfully");
      } else {
        await apiService.createCategory(newCategoryName.trim());
        toast.success("Category created successfully");
      }
      await fetchCategories();
      handleModalClose();
    } catch {
      setError(`Failed to ${editingCategory ? "update" : "create"} category.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (category: Category) => {
    if (!window.confirm(`Delete "${category.name}"?`)) return;

    try {
      await apiService.deleteCategory(category.id);
      toast.success("Category deleted successfully");
      await fetchCategories();
    } catch {
      setError("Failed to delete category.");
    }
  };

  const handleModalClose = () => {
    setEditingCategory(null);
    setNewCategoryName("");
    onClose();
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
    onOpen();
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setNewCategoryName("");
    onOpen();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <Card className="border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <CardHeader className="flex justify-between items-center p-6 pb-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
              <Layers size={20} className="text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Categories</h1>
              <p className="text-sm text-gray-500">
                {categories.length} category{categories.length !== 1 ? "ies" : "y"}
              </p>
            </div>
          </div>
          {isAuthenticated && (
            <Button
              startContent={<Plus size={16} />}
              onClick={openAddModal}
              className="bg-primary-600 text-white hover:bg-primary-700 font-medium shadow-lg shadow-primary/20"
            >
              Add Category
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
            aria-label="Categories table"
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
              {categories.map((category) => (
                <TableRow key={category.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <TableCell>
                    <span className="font-medium">{category.name}</span>
                  </TableCell>
                  <TableCell>
                    <Chip size="sm" variant="flat" className="font-medium">
                      {category.postCount || 0} post{(category.postCount || 0) !== 1 ? "s" : ""}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    {isAuthenticated ? (
                      <div className="flex gap-2">
                        <Tooltip content="Edit category">
                          <Button
                            isIconOnly
                            size="sm"
                            onClick={() => openEditModal(category)}
                            className="bg-primary-50 text-primary-700 hover:bg-primary-100 hover-lift"
                          >
                            <Edit2 size={16} />
                          </Button>
                        </Tooltip>
                        <Tooltip
                          content={
                            category.postCount
                              ? "Cannot delete category with posts"
                              : "Delete category"
                          }
                        >
                          <Button
                            isIconOnly
                            size="sm"
                            onClick={() => handleDelete(category)}
                            isDisabled={category?.postCount ? category.postCount > 0 : false}
                            className="bg-danger-50 text-danger-700 hover:bg-danger-100 hover-lift"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </Tooltip>
                      </div>
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
            <h2 className="text-xl font-bold">
              {editingCategory ? "Edit Category" : "Add Category"}
            </h2>
            <p className="text-sm text-gray-500 font-normal">
              {editingCategory
                ? "Update the category name"
                : "Create a new category for posts"}
            </p>
          </ModalHeader>
          <ModalBody>
            <Input
              label="Category Name"
              placeholder="e.g. Technology, Design, Life"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              isRequired
              variant="bordered"
              autoFocus
              classNames={{
                label: "text-sm font-medium",
              }}
            />
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleModalClose} className="bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium">
              Cancel
            </Button>
            <Button
              onClick={handleAddEdit}
              isLoading={isSubmitting}
              className="bg-primary-600 text-white hover:bg-primary-700 font-medium shadow-lg shadow-primary/20"
            >
              {editingCategory ? "Update" : "Create"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CategoriesPage;
