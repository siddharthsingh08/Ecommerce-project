import { useState } from "react";
import CategorySelect from "./CategorySelect";
import { toast } from "react-toastify";

interface Props {
  initialName?: string;
  initialDescription?: string;
  initialPrice?: number;
  initialQuantity?: number;
  initialCategory?: string;
  onSubmit: (data: any) => void;
  buttonText: string;
}

export default function ProductForm({
  initialName = "",
  initialDescription = "",
  initialPrice = 0,
  initialQuantity = 0,
  initialCategory = "",
  onSubmit,
  buttonText,
}: Props) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [price, setPrice] = useState<number | "">(initialPrice || "");
  const [quantity, setQuantity] = useState<number | "">(initialQuantity || "");
  const [category, setCategory] = useState(initialCategory);
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error("Product name is required");
      return;
    }

    if (!description.trim()) {
      toast.error("Description is required");
      return;
    }

    if (!category) {
      toast.error("Please select a category");
      return;
    }

    if (price === "" || Number(price) <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }

    if (quantity === "" || Number(quantity) <= 0) {
      toast.error("Stock quantity must be greater than 0");
      return;
    }

    onSubmit({
      name,
      description,
      price,
      quantity,
      categoryName: category,
      image,
    });
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm p-6 rounded-xl flex flex-col gap-4">
      <input
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 outline-none"
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 outline-none"
      />

      <input
        type="number"
        min="0"
        placeholder="Price"
        value={price}
        onChange={(e) => {
          const value = e.target.value;
          if (value === "" || Number(value) >= 0) {
            setPrice(value === "" ? "" : Number(value));
          }
        }}
        className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 outline-none"
      />

      <input
        type="number"
        min="0"
        placeholder="Stock Quantity"
        value={quantity}
        onChange={(e) => {
          const value = e.target.value;
          if (value === "" || Number(value) >= 0) {
            setQuantity(value === "" ? "" : Number(value));
          }
        }}
        className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 outline-none"
      />

      <CategorySelect value={category} onChange={setCategory} />

      <input
        type="file"
        onChange={(e) => {
          if (e.target.files) {
            setImage(e.target.files[0]);
          }
        }}
        className="text-sm"
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded cursor-pointer">
        {buttonText}
      </button>
    </div>
  );
}
