import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import apiClient from "../api/apiClient";
import { toast } from "react-toastify";

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
  items: OrderItem[];
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const didFetchOrders = useRef(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (didFetchOrders.current) return;

    didFetchOrders.current = true;
    fetchOrders(0);
  }, []);

  const fetchOrders = async (pageNumber = 0) => {
    try {
      const res = await apiClient.get("/orders/all", {
        params: { page: pageNumber, size: 5, sort: "id,desc" },
      });

      setOrders(res.data.content);
      setPage(res.data.number);
      setTotalPages(res.data.totalPages);
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

      toast.success("Order Status Updated!");
      fetchOrders(page);
    } catch (err) {
      toast.error("Failed to change Order Status!");
      console.error(err);
    }
  };

  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen">
      <Navbar />

      <div className="max-w-5xl mx-auto p-10">
        <h1 className="text-3xl font-semibold mb-8">All Orders</h1>

        {orders.map((order) => (
          <div
            key={order.orderId}
            className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
            <div className="flex justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold">Order #{order.orderId}</h2>

                <p>Total Items: {order.totalQuantity}</p>

                <p className="text-green-600 font-semibold">
                  ₹{order.totalPrice}
                </p>
              </div>

              <div>
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.orderId, e.target.value)}
                  className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400">
                  <option value="CREATED">CREATED</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="CANCELLED">CANCEL</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="DELIVERED">DELIVERED</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between text-sm text-gray-600">
                  <span>{item.productName}</span>

                  <span>
                    {item.quantity} × ₹{item.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-center gap-4 mt-8">
          <button
            disabled={page === 0}
            onClick={() => fetchOrders(page - 1)}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded disabled:opacity-50 cursor-pointer">
            Previous
          </button>

          <span className="self-center text-sm">
            Page {page + 1} of {totalPages}
          </span>

          <button
            disabled={page + 1 >= totalPages}
            onClick={() => fetchOrders(page + 1)}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded disabled:opacity-50 cursor-pointer">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
