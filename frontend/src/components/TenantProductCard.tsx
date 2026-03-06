import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: Category;
}

interface Props {
  product: Product;
  tenantName?: string;
  onDelete: (id: number) => void;
}

export default function TenantProductCard({
  product,
  tenantName,
  onDelete,
}: Props) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
      {/* IMAGE */}
      <div className="h-40 bg-gray-800 flex items-center justify-center overflow-hidden">
        {!imgError ? (
          <img
            src={`http://localhost:8080/public/products/${product.id}/image`}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-gray-500 text-xs">No Image</span>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-4">
        <h2 className="font-bold text-lg">{product.name}</h2>

        <p className="text-gray-400 text-sm">{product.category.name}</p>

        <p className="text-green-400 font-bold text-xl mt-2">
          ₹{product.price}
        </p>

        <p className="text-sm text-gray-400 mt-1">Stock: {product.quantity}</p>

        {/* ACTIONS */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={() =>
              navigate(`/tenant/${tenantName}/products/${product.id}`)
            }
            className="bg-blue-500 px-3 py-1 rounded cursor-pointer">
            Edit
          </button>

          <button
            onClick={() => onDelete(product.id)}
            className="bg-red-500 px-3 py-1 rounded cursor-pointer">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
