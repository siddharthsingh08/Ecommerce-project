import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

interface Category {
  id: number;
  name: string;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function CategorySelect({ value, onChange }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await apiClient.get("/public/category");
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  return (
    <select
      required
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="p-2 text-white border border-white rounded">
      <option value="" className="text-black">
        Select Category
      </option>

      {categories.map((c) => (
        <option key={c.id} value={c.name} className="text-black">
          {c.name}
        </option>
      ))}
    </select>
  );
}
