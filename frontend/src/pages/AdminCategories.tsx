import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import apiClient from "../api/apiClient";
import { toast } from "react-toastify";
import ConfirmModal from "../components/ConfirmModal";

interface Category {
  id: number;
  name: string;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const didFetchCategory = useRef(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (didFetchCategory.current) return;
    didFetchCategory.current = true;
    fetchCategories(0);
  }, []);

  const fetchCategories = async (pageNumber = 0) => {
    try {
      const res = await apiClient.get("/admin/category", {
        params: { page: pageNumber, size: 5 },
      });

      setCategories(res.data.content);
      setPage(res.data.number);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    }
  };

  const createCategory = async () => {
    try {
      await apiClient.post("/admin/category", { name });

      setName("");
      toast.success(`Category ${name} created!`);
      fetchCategories(page);
    } catch (err) {
      toast.error("Failed to add Category!");
      console.error(err);
    }
  };

  const deleteCategory = (name: string) => {
    setCategoryToDelete(name);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      await apiClient.delete(`/admin/category/${categoryToDelete}`);
      toast.success(`Category ${categoryToDelete} deleted!`);
      fetchCategories(page);
    } catch (err) {
      toast.error("Failed to Delete!");
      console.error(err);
    } finally {
      setShowConfirm(false);
      setCategoryToDelete(null);
    }
  };

  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen">
      <Navbar />

      <div className="max-w-3xl mx-auto p-10">
        <h1 className="text-3xl font-semibold mb-6">Category Management</h1>

        <div className="flex gap-3 mb-8">
          <input
            placeholder="New Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            disabled={!name.trim()}
            onClick={createCategory}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
            Add
          </button>
        </div>

        <div className="space-y-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white flex justify-between items-center border border-gray-200 p-4 rounded-lg shadow-sm">
              <span className="text-lg">{category.name}</span>

              <button
                onClick={() => deleteCategory(category.name)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded cursor-pointer">
                Delete
              </button>
            </div>
          ))}

          <div className="flex justify-center gap-4 mt-8">
            <button
              disabled={page === 0}
              onClick={() => fetchCategories(page - 1)}
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded disabled:opacity-50 cursor-pointer">
              Previous
            </button>

            <span className="self-center text-sm">
              Page {page + 1} of {totalPages}
            </span>

            <button
              disabled={page + 1 >= totalPages}
              onClick={() => fetchCategories(page + 1)}
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded disabled:opacity-50 cursor-pointer">
              Next
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        title="Delete Category"
        message={`Are you sure you want to delete "${categoryToDelete}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}
