import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  tenant: string;
}

interface Props {
  product: Product;
}

function ProductCard({ product }: Props) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const isOutOfStock = product.quantity === 0;

  return (
    <div
      onClick={() => {
        if(!isOutOfStock){
        navigate(`/public/products/${product.tenant}/${product.id}`)
        }}}
      className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer h-full flex flex-col">
      <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
        {!imgError ? (
          <img
            src={`http://localhost:8080/public/products/${product.id}/image`}
            alt={product.name}
            className={`w-full h-full object-cover ${isOutOfStock ? "grayscale opacity-60" : ""}`}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex flex-col items-center opacity-40">
            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">
              No Image
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex-grow">
        <h2 className="font-semibold text-lg mb-1 truncate text-gray-800">
          {product.name}
        </h2>

        <p className="text-gray-500 text-sm mb-2">{product.category}</p>

        <p className="text-xl font-bold text-green-600 mb-2">
          ₹{product.price}
        </p>
        {isOutOfStock && (
          <p className="text-red-500">Out of Stock!</p>
        )}

        <p
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/public/products/${product.tenant}`);
          }}
          className="text-xs text-gray-400 font-mono tracking-tight hover:text-blue-600">
          {product.tenant.toUpperCase()}
        </p>
      </div>
    </div>
  );
}

export default ProductCard;
