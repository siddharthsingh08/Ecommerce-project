import { useEffect, useRef, useState } from "react";
import apiClient from "../api/apiClient";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";

interface Favourite {
  id: number;
  name: string;
  price: number;
  quantity: number;
  tenant: string;
  category?: string;
}

export default function Favourites() {
  const [items, setItems] = useState<Favourite[]>([]);
  const didFetchFavourites = useRef(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (didFetchFavourites.current) return;

    didFetchFavourites.current = true;
    fetchFavourites(0);
  }, []);

  const fetchFavourites = async (pageNumber = 0) => {
    try {
      const res = await apiClient.get("/favourites", {
        params: {
          page: pageNumber,
          size: 8,
        },
      });
      console.log("Fetched favourites:", res.data.content);
      setItems(res.data.content);
      setTotalPages(res.data.totalPages);
      setPage(res.data.number);
    } catch (err) {
      console.error(err);
    }
  };

  async function removeFavourite(productId: number) {
    try {
      await apiClient.delete(`/favourites/${productId}`);
      fetchFavourites(page);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen">
      <Navbar />

      <div className="p-10 max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold">Your Favourites</h1>
        </header>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div key={item.id} className="relative group">
                <ProductCard
                  product={{
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    tenant: item.tenant,
                    category: item.category || "General",
                    description: "",
                  }}
                />

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFavourite(item.id);
                  }}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500">You have no favourites yet.</p>
          </div>
        )}

        <div className="flex justify-center gap-4 mt-10">
          <button
            disabled={page === 0}
            onClick={() => fetchFavourites(page - 1)}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded disabled:opacity-50 cursor-pointer">
            Previous
          </button>

          <span className="self-center text-sm">
            Page {page + 1} of {totalPages}
          </span>

          <button
            disabled={page + 1 >= totalPages}
            onClick={() => fetchFavourites(page + 1)}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded disabled:opacity-50 cursor-pointer">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
