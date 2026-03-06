import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import Navbar from "../components/Navbar";
import { useAuth } from "../auth/AuthProvider";

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
  const [search, setSearch] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [isFavourite, setIsFavourite] = useState(false);
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
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
        (item: any) => item.productId === Number(id),
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

      alert("Product added to cart");
    } catch (err) {
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

        setIsFavourite(false);
      } else {
        await apiClient.post("/favourites", {
          productId: product?.id,
        });

        setIsFavourite(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!product) return <div className="text-white p-10">Loading...</div>;

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar search={search} setSearch={setSearch} onSearch={() => {}} />

      <div className="p-10">
        <div className="max-w-4xl mx-auto grid grid-cols-2 gap-10">
          <div className="h-80 bg-gray-800 relative flex items-center justify-center overflow-hidden rounded-4xl">
            {!imgError ? (
              <img
                src={`http://localhost:8080/public/products/${product.id}/image`}
                alt={product.name}
                className="w-full h-full object-cover transition-opacity duration-300 rounded-4xl"
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

          {/* DETAILS */}
          <div>
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-3xl font-bold">{product.name}</h1>

              <button
                onClick={toggleFavourite}
                className="text-3xl cursor-pointer">
                {isFavourite ? "❤️" : "🤍"}
              </button>
            </div>

            <p className="text-gray-400 mb-4">{product.description}</p>

            <p className="text-2xl text-green-400 font-bold mb-6">
              ₹{product.price}
            </p>

            <p className="mb-6">Category: {product.category}</p>

            <p
              onClick={() => navigate(`/public/products/${product.tenant}`)}
              className="mb-6 cursor-pointer">
              Brand: {product.tenant.toUpperCase()}
            </p>

            <button
              disabled={!product}
              onClick={addToCart}
              className="bg-blue-500 px-6 py-3 rounded cursor-pointer">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
