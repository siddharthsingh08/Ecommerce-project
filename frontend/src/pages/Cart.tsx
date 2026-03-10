import { useEffect, useRef, useState } from "react";
import apiClient from "../api/apiClient";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

interface CartItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

export default function Cart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const didFetchCart = useRef(false);
  const [imgErrors, setImgErrors] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    if (didFetchCart.current) return;

    didFetchCart.current = true;
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await apiClient.get("/cart");

      setItems(res.data.items);
      setTotalPrice(res.data.totalPrice);
    } catch (err) {
      console.error(err);
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    try {
      await apiClient.put(`/cart/update`, {
        id: productId,
        quantity: quantity,
      });

      fetchCart();
    } catch (err) {
      console.log(err);
    }
  };

  const removeItem = async (productId: number) => {
    try {
      await apiClient.delete(`/cart/${productId}`);

      fetchCart();
    } catch (err) {
      console.log(err);
    }
  };

  const checkout = async () => {
    try {
      await apiClient.post(`/cart/checkout`);

      toast.success("Order Placed Successfully!");
      fetchCart();
    } catch (err) {
      toast.error("Failed to place Order!");
      console.log(err);
    }
  };

  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen">
      <Navbar />

      <div className="max-w-5xl mx-auto p-10">
        <h1 className="text-3xl font-semibold mb-8">Your Cart</h1>

        {items.length === 0 && (
          <p className="text-gray-500">You have no items in your cart.</p>
        )}

        {items.map((item) => (
          <div
            key={item.productId}
            className="grid grid-cols-5 items-center gap-4 border border-gray-200 py-6 mb-6 bg-white px-5 rounded-lg shadow-sm">
            {!imgErrors[item.productId] ? (
              <img
                src={`http://localhost:8080/public/products/${item.productId}/image`}
                alt={item.productName}
                className="w-24 h-24 object-cover rounded-lg"
                onError={() =>
                  setImgErrors((prev) => ({ ...prev, [item.productId]: true }))
                }
              />
            ) : (
              <div className="flex flex-col items-center opacity-40">
                <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                  No Image
                </span>
              </div>
            )}

            <div>
              <p className="font-semibold">{item.productName}</p>
              <p className="text-gray-600">₹{item.price}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  updateQuantity(item.productId, item.quantity - 1)
                }
                className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded cursor-pointer">
                -
              </button>

              <span className="font-medium">{item.quantity}</span>

              <button
                onClick={() =>
                  updateQuantity(item.productId, item.quantity + 1)
                }
                className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded cursor-pointer">
                +
              </button>
            </div>

            <p className="font-medium">₹{item.totalPrice}</p>

            <button
              onClick={() => removeItem(item.productId)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded cursor-pointer">
              Remove
            </button>
          </div>
        ))}

        <div className="mt-10 flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Total: ₹{totalPrice}</h2>

          <button
            onClick={checkout}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded cursor-pointer">
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
