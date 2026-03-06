import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import Navbar from "../components/Navbar";

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

  useEffect(() => {
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

      alert("Order Placed Successfully!");
      fetchCart();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar search="" setSearch={() => {}} onSearch={() => {}} />

      <div className="p-10">
        <h1 className="text-3xl mb-8">Your Cart</h1>

        {items.map((item) => (
          <div
            key={item.productId}
            className="grid grid-cols-5 items-center gap-4 border-b border-gray-700 py-6">
            <img
              src="/home/bhcp0098/IdeaProjects/Ecommerce-project/frontend/public/product.jpg"
              alt="Product Image"
              className="w-20 h-20 rounded cursor-pointer"
            />
            <div className="cursor-pointer hover:text-blue-400">
              <p className="font-semibold">{item.productName}</p>
              <p>₹{item.price}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  updateQuantity(item.productId, item.quantity - 1)
                }
                className="bg-gray-700 px-2">
                -
              </button>

              <span>{item.quantity}</span>

              <button
                onClick={() =>
                  updateQuantity(item.productId, item.quantity + 1)
                }
                className="bg-gray-700 px-2">
                +
              </button>
            </div>

            <p>₹{item.totalPrice}</p>

            <button
              onClick={() => removeItem(item.productId)}
              className="bg-red-500 px-3 py-1 rounded">
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-10 flex justify-between items-center mx-10 ">
        <h2 className="text-2xl mb-5">Total: ₹{totalPrice}</h2>

        <button onClick={checkout} className="bg-green-500 mb-5 px-6 py-3 rounded">
          Checkout
        </button>
      </div>
    </div>
  );
}
