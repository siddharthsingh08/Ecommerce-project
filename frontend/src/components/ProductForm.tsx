import { useState } from "react";
import CategorySelect from "./CategorySelect";

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
    <div className="flex flex-col gap-4">
      <input
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="p-2 text-white border border-white rounded"
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="p-2 text-white border border-white rounded"
      />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) =>
          setPrice(e.target.value === "" ? "" : Number(e.target.value))
        }
        className="p-2 text-white border border-white rounded"
      />

      <input
        type="number"
        placeholder="Stock Quantity"
        value={quantity}
        onChange={(e) =>
          setQuantity(e.target.value === "" ? "" : Number(e.target.value))
        }
        className="p-2 text-white border border-white rounded"
      />

      <CategorySelect value={category} onChange={setCategory} />

      <input
        type="file"
        onChange={(e) => {
          if (e.target.files) {
            setImage(e.target.files[0]);
          }
        }}
      />

      <button
        disabled={!name || !price || !quantity || !category}
        onClick={handleSubmit}
        className="bg-green-500 p-3 rounded cursor-pointer">
        {buttonText}
      </button>
    </div>
  );
}
