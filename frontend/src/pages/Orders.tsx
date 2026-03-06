import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import Navbar from "../components/Navbar";

interface OrderItems {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  orderId: number;
  productName: string;
  totalQuantity: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  items: OrderItems[];
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await apiClient.get(`/orders`);

      console.log(res.data);

      setOrders(res.data.content);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar search="" setSearch={() => {}} onSearch={() => {}} />
      <div className="p-10">
        <h1 className="text-3xl mb-8">Your Orders</h1>

        {orders.map((order) => (
          <div
            key={order.orderId}
            className="border border-gray-700 rounded-lg p-6 mb-6">
            <div className="flex justify-between mb-4">
              <div>
                <p className="font-bold">Order #{order.orderId}</p>
                <p className="text-gray-400 text-sm">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-green-400 font-bold">₹{order.totalPrice}</p>
                <p className="text-sm">{order.status}</p>
              </div>
            </div>

            {order.items.map((item) => (
              <div
                key={item.productId}
                className="flex justify-between border-t border-gray-700 py-3">
                <span>
                  {item.productName} (Qty: {item.quantity})
                </span>
                <span>₹{item.price}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
