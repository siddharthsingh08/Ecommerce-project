import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import apiClient from "../api/apiClient";
import Navbar from "../components/Navbar";
import { useAuth } from "../auth/AuthProvider";
import { toast } from "react-toastify";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  tenant: string;
}

export default function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(0);
  const [isFavourite, setIsFavourite] = useState(false);
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const didFetchProduct = useRef(false);

  useEffect(() => {
    if (didFetchProduct.current) return;

    didFetchProduct.current = true;
    fetchProduct();
    checkFavourite();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await apiClient.get(`/public/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const checkFavourite = async () => {
    try {
      const res = await apiClient.get(`/favourites`);

      const fav = res.data.content.some(
        (item: any) => item.id === Number(id),
      );

      setIsFavourite(fav);
    } catch (err) {
      console.log(err);
    }
  };

  const addToCart = async () => {
    if (!isAuthenticated) {
      login();
      return;
    }

    if (!product) {
      console.log("Product not loaded yet!");
      return;
    }

    const newQuantity = quantity + 1;
    setQuantity(newQuantity);

    try {
      await apiClient.post("/cart/add", {
        id: product.id,
        quantity: newQuantity,
      });

      toast.success("Product added to cart!");
    } catch (err) {
      toast.error("Failed to add to Cart!");
      console.error("Add to cart failed", err);
    }
  };

  const toggleFavourite = async () => {
    if (!isAuthenticated) {
      login();
      return;
    }

    try {
      if (isFavourite) {
        await apiClient.delete(`/favourites/${product?.id}`);
        toast.success("Removed from favourites!");
        setIsFavourite(false);
      } else {
        await apiClient.post("/favourites", {
          productId: product?.id,
        });
        toast.success("Added to Favourites!");
        setIsFavourite(true);
      }
    } catch (err) {
      toast.error("Failed to add to favourites!");
      console.error(err);
    }
  };

  if (!product) return <div className="text-gray-700 p-10">Loading...</div>;

  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen">
      <Navbar />

      <div className="p-10">
        <div className="max-w-4xl mx-auto grid grid-cols-2 gap-10 bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
          <div className="h-80 bg-gray-100 relative flex items-center justify-center overflow-hidden rounded-xl">
            {!imgError ? (
              <img
                src={`http://localhost:8080/public/products/${product.id}/image`}
                alt={product.name}
                className="w-full h-full object-cover rounded-xl border border-black rounded-lg"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="flex flex-col items-center opacity-40">
                <span className="text-gray-400 text-xs font-bold uppercase tracking-widest ">
                  No Image Available
                </span>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-3xl font-bold">{product.name}</h1>

              <button
                onClick={toggleFavourite}
                className="text-3xl cursor-pointer">
                {isFavourite ? "❤️" : "🤍"}
              </button>
            </div>

            <p className="text-gray-600 mb-4">{product.description}</p>

            <p className="text-2xl text-green-600 font-bold mb-6">
              ₹{product.price}
            </p>

            <p className="mb-4 text-gray-700">Category: {product.category}</p>

            <p
              onClick={() => navigate(`/public/products/${product.tenant}`)}
              className="mb-6 cursor-pointer text-blue-600 hover:underline">
              Brand: {product.tenant.toUpperCase()}
            </p>

            <button
              disabled={!product}
              onClick={addToCart}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded cursor-pointer">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
