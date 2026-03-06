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
  // Track if the image failed to load to avoid infinite retry loops
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onClick={() =>
        navigate(`/public/products/${product.tenant}/${product.id}`)
      }
      className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform cursor-pointer h-full flex flex-col">
      {/* IMAGE CONTAINER */}
      <div className="h-40 bg-gray-800 relative flex items-center justify-center overflow-hidden">
        {!imgError ? (
          <img
            src={`http://localhost:8080/public/products/${product.id}/image`}
            alt={product.name}
            className="w-full h-full object-cover transition-opacity duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          /* This shows immediately if imgError is true, no flickering */
          <div className="flex flex-col items-center opacity-40">
            <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">
              No Image Available
            </span>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-4 flex-grow">
        <h2 className="font-semibold text-lg mb-1 truncate">{product.name}</h2>
        <p className="text-gray-400 text-sm mb-2">{product.category}</p>
        <p className="text-xl font-bold text-green-400 mb-2">
          ₹{product.price}
        </p>
        <p className="text-xs text-gray-500 font-mono tracking-tighter">
          {product.tenant.toUpperCase()}
        </p>
      </div>
    </div>
  );
}

export default ProductCard;
