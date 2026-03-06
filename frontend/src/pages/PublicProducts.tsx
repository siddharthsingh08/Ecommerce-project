import { useParams } from "react-router-dom";
import apiClient from "../api/apiClient";
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import CategorySelect from "../components/CategorySelect";

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

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts(search, 0);
  }, [tenant, category, search]);

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

      const res = await apiClient.get("/public/products", { params });

      setProducts(res.data.content);
      setTotalPages(res.data.totalPages);
      setPage(res.data.number);
    } catch (err) {
      console.error("API ERROR:", err);
    }
  };

  return (
    <div className="bg-black text-white pt-4 min-h-screen">
      <Navbar
        search={search}
        setSearch={setSearch}
        onSearch={() => fetchProducts(search, 0)}
      />

      <div className="pt-6">
        
        <div className="mb-5 ml-4">
          <CategorySelect value={category} onChange={setCategory} />
        </div>

        {/* TITLE */}
        <h1 className="pl-4 text-2xl font-bold">
          {tenant ? `Products for ${tenant.toUpperCase()}` : "All Products"}
        </h1>

        <br />
        <hr />
        <br />

        {/* PRODUCTS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        <div className="flex justify-center gap-4 pl-4 mt-6">
          <button
            disabled={page === 0}
            onClick={() => fetchProducts(search, page - 1)}
            className="bg-gray-700 px-4 py-2 rounded disabled:opacity-50 mb-5 cursor-pointer">
            Previous
          </button>

          <span className="self-center mb-5">
            Page {page + 1} of {totalPages}
          </span>

          <button
            disabled={page + 1 >= totalPages}
            onClick={() => fetchProducts(search, page + 1)}
            className="bg-gray-700 px-4 py-2 rounded disabled:opacity-50 mb-5 cursor-pointer">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
