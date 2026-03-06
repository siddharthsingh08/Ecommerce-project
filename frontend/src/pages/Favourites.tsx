import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";

interface Favourite {
  id: number;
  name: string;
  price: number;
  tenant: string;
  category?: string; 
}

export default function Favourites() {
  const [items, setItems] = useState<Favourite[]>([]);

  useEffect(() => {
    fetchFavourites();
  }, []);

  const fetchFavourites = async () => {
    try {
      const res = await apiClient.get("/favourites");
      setItems(res.data.content);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar search="" setSearch={() => {}} onSearch={() => {}} />

      <div className="p-10">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your Favourites</h1>
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
                    tenant: item.tenant,
                    category: item.category || "General",
                    description: "",
                    quantity: 0,
                  }}
                />

                {/* OVERLAY REMOVE BUTTON */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents navigating to product detail
                    removeFavourite(item.id);
                  }}
                  className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity uppercase">
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h1>No Favourites Yet!</h1>
          </div>
        )}
      </div>
    </div>
  );

  async function removeFavourite(productId: number) {
    try {
      await apiClient.delete(`/favourites/${productId}`);
      fetchFavourites();
    } catch (err) {
      console.error(err);
    }
  }
}
