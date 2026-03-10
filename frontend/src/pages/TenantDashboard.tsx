import { useEffect, useRef, useState } from "react";
import apiClient from "../api/apiClient";
import Navbar from "../components/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import TenantProductCard from "../components/TenantProductCard";
import { toast } from "react-toastify";

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: Category;
}

export default function TenantDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const navigate = useNavigate();
  const { tenant } = useParams();
  const didFetchProduct = useRef(false);

  useEffect(() => {
    if (didFetchProduct.current) return;

    didFetchProduct.current = true;
    fetchProducts(0);
  }, []);

  const fetchProducts = async (pageNumber = 0) => {
    try {
      const res = await apiClient.get(`/tenant/${tenant}/products`, {
        params: {
          page: pageNumber,
          size: 8,
        },
      });

      setProducts(res.data.content);
      setPage(res.data.number);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      await apiClient.delete(`/tenant/${tenant}/products/${id}`);
      toast("Product Deleted Successfully!");
      fetchProducts();
    } catch (err) {
      toast("Failed to Deleted Product!");
      console.error(err);
    }
  };

  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen">
      <Navbar />

      <div className="p-10 max-w-7xl mx-auto">
        <div className="flex justify-between mb-8">
          <h1 className="text-3xl font-semibold">My Products</h1>

          <button
            onClick={() => navigate(`/tenant/${tenant}/products/create`)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded cursor-pointer">
            Create Product
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <TenantProductCard
              key={product.id}
              product={product}
              tenantName={tenant}
              onDelete={deleteProduct}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <button
          disabled={page === 0}
          onClick={() => fetchProducts(page - 1)}
          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded disabled:opacity-50 cursor-pointer mb-5">
          Previous
        </button>

        <span className="self-center mb-5">
          Page {page + 1} of {totalPages}
        </span>

        <button
          disabled={page + 1 >= totalPages}
          onClick={() => fetchProducts(page + 1)}
          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded disabled:opacity-50 cursor-pointer mb-5">
          Next
        </button>
      </div>
    </div>
  );
}
