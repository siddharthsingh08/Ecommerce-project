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
  const isOutOfStock = product.quantity === 0;

  return (
    <div
      onClick={() => {
        if (!isOutOfStock) {
          navigate(`/public/products/${tenantName}/${product.id}`);
        }
      }}
      className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md overflow-hidden cursor-pointer">
      <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
        {!imgError ? (
          <img
            src={`http://localhost:8080/public/products/${product.id}/image`}
            alt={product.name}
            className={`w-full h-full object-cover ${isOutOfStock ? "grayscale opacity-60" : ""}`}
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-gray-400 text-xs">No Image</span>
        )}
      </div>

      <div className="p-4">
        <h2 className="font-semibold text-lg text-gray-800">{product.name}</h2>

        <p className="text-gray-500 text-sm">{product.category.name}</p>

        <p className="text-green-600 font-bold text-xl mt-2">
          ₹{product.price}
        </p>
        {!isOutOfStock ? (
          <p className="text-sm text-gray-500 mt-1">
            Stock: {product.quantity}
          </p>
        ) : (
          <p className="text-sm text-red-500 mt-1">OUT OF STOCK</p>
        )}

        <div className="flex gap-3 mt-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/tenant/${tenantName}/products/${product.id}`);
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded cursor-pointer">
            Edit
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(product.id);
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded cursor-pointer">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
