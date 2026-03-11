import { useParams } from "react-router-dom";
import apiClient from "../api/apiClient";
import { useEffect, useState, useRef } from "react";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import CategorySelect from "../components/CategorySelect";
import useDebounce from "../hooks/useDebounce";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  tenant: string;
}

export default function PublicProducts() {
  const { tenant } = useParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const debouncedSearch = useDebounce(search, 500);
  const didFetchCategory = useRef(false);

  useEffect(() => {
    if (didFetchCategory.current) return;

    didFetchCategory.current = true;
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts(debouncedSearch);
  }, [tenant, category, debouncedSearch]);

  const fetchCategories = async () => {
    try {
      const res = await apiClient.get("/public/category");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async (searchValue: string, pageNumber = 0) => {
    try {
      const params: any = {};

      if (tenant) params.tenant = tenant;
      if (searchValue) params.search = searchValue;
      if (category) params.category = category;

      params.page = pageNumber;
      params.size = 12;
      params.sort = "id,desc";

      const res = await apiClient.get("/public/products", { params });

      setProducts(res.data.content);
      setTotalPages(res.data.totalPages);
      setPage(res.data.number);
    } catch (err) {
      console.error("API ERROR:", err);
    }
  };

  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen">
      <Navbar />

      <div className="pt-6 max-w-7xl mx-auto px-4">
        <div className="flex gap-4 items-center mb-6">
          <CategorySelect value={category} onChange={setCategory} />

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <h1 className="text-2xl font-semibold mb-4">
          {tenant ? `Products for ${tenant.toUpperCase()}` : "All Products"}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <button
            disabled={page === 0}
            onClick={() => fetchProducts(search, page - 1)}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded disabled:opacity-50 cursor-pointer mb-5">
            Previous
          </button>

          <span className="self-center text-sm mb-5">
            Page {page + 1} of {totalPages}
          </span>

          <button
            disabled={page + 1 >= totalPages}
            onClick={() => fetchProducts(search, page + 1)}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded disabled:opacity-50 cursor-pointer mb-5">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
