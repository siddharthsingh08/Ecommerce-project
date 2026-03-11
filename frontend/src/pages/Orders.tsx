import { useEffect, useRef, useState } from "react";
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
      const res = await apiClient.get(`/orders`, {
        params: {
          page: pageNumber,
          size: 5,
          sort: "id,desc",
        },
      });

      setOrders(res.data.content);
      setTotalPages(res.data.totalPages);
      setPage(res.data.number);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen">
      <Navbar />

      <div className="max-w-5xl mx-auto p-10">
        <h1 className="text-3xl font-semibold mb-8">Your Orders</h1>

        {orders.length === 0 && (
          <p className="text-gray-500">You have no orders yet.</p>
        )}

        {orders.map((order) => (
          <div
            key={order.orderId}
            className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
            <div className="flex justify-between mb-4">
              <div>
                <p className="font-bold">Order #{order.orderId}</p>
                <p className="text-gray-500 text-sm">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="text-right">
                <p className="text-green-600 font-semibold">
                  ₹{order.totalPrice}
                </p>
                <p className="text-sm text-gray-600">{order.status}</p>
              </div>
            </div>

            {order.items.map((item) => (
              <div
                key={item.productId}
                className="flex justify-between border-t border-gray-200 py-3">
                <span>
                  {item.productName} (Qty: {item.quantity})
                </span>

                <span className="text-gray-700">₹{item.price}</span>
              </div>
            ))}
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
};

export default Orders;
