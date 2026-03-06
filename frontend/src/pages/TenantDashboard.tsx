import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import TenantProductCard from "../components/TenantProductCard";

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
  const navigate = useNavigate();
  const { tenant } = useParams();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      console.log(tenant);
      const res = await apiClient.get(`/tenant/${tenant}/products`);

      setProducts(res.data.content);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      await apiClient.delete(`/tenant/${tenant}/products/${id}`);
      
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar search="" setSearch={() => {}} onSearch={() => {}} />

      <div className="p-10">
        {/* HEADER */}
        <div className="flex justify-between mb-8">
          <h1 className="text-3xl font-bold">My Products</h1>

          <button
            onClick={() => navigate(`/tenant/${tenant}/products/create`)}
            className="bg-green-500 px-6 py-2 rounded">
            Create Product
          </button>
        </div>

        {/* PRODUCT LIST */}
        <div className="grid grid-cols-4 gap-6">
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
    </div>
  );
}
