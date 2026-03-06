import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import apiClient from "../api/apiClient";

interface Category {
  id: number;
  name: string;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await apiClient.get("/admin/category");
      setCategories(res.data.content);
    } catch (err) {
      console.error(err);
    }
  };

  const createCategory = async () => {
    try {
      await apiClient.post("/admin/category", { name });

      setName("");
      alert(`Category ${name} created!`)
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCategory = async (name: string) => {
    try {
      if (!confirm("Delete this category?")) return;

      await apiClient.delete(`/admin/category/${name}`);

      alert(`Category ${name} deleted!`);
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar search="" setSearch={() => {}} onSearch={() => {}} />

      <div className="max-w-3xl mx-auto p-10">
        <h1 className="text-3xl mb-6">Category Management</h1>

        {/* CREATE CATEGORY */}
        <div className="flex gap-3 mb-8">
          <input
            placeholder="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 border border-white rounded flex-1"
          />

          <button
            onClick={createCategory}
            className="bg-green-500 px-4 py-2 rounded cursor-pointer">
            Add
          </button>
        </div>

        {/* CATEGORY LIST */}
        <div className="space-y-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex justify-between items-center border border-gray-700 p-4 rounded">
              <span className="text-lg">{category.name}</span>

              <button
                onClick={() => deleteCategory(category.name)}
                className="bg-red-500 px-3 py-1 rounded cursor-pointer">
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
