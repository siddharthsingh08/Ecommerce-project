import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import apiClient from "../api/apiClient";

interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  orderId: number;
  totalPrice: number;
  totalQuantity: number;
  status: string;
//   createdAt: string;
  items: OrderItem[];
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await apiClient.get("/orders/all");

      setOrders(res.data.content);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await apiClient.put(`/orders`, {
        orderId: id,
        status,
      });

      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar search="" setSearch={() => {}} onSearch={() => {}} />

      <div className="max-w-5xl mx-auto p-10">
        <h1 className="text-3xl mb-8">All Orders</h1>

        {orders.map((order) => (
          <div
            key={order.orderId}
            className="border border-gray-700 rounded-lg p-6 mb-6">
            <div className="flex justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold">Order #{order.orderId}</h2>

                <p>Total Items: {order.totalQuantity}</p>

                <p className="text-green-400">₹{order.totalPrice}</p>
              </div>

              <div>
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.orderId, e.target.value)}
                  className="bg-gray-800 border border-gray-600 p-2 rounded">
                  <option value="CREATED">CREATED</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="CANCELLED">CANCEL</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="DELIVERED">DELIVERED</option>
                </select>
              </div>
            </div>

            {/* Order Items */}

            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between text-sm text-gray-300">
                  <span>{item.productName}</span>

                  <span>
                    {item.quantity} × ₹{item.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
