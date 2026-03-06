import { useParams } from "react-router-dom";
import apiClient from "../api/apiClient";
import { useEffect, useState } from "react";

export default function TenantProducts() {
  const { tenant } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await apiClient.get(`/public/products?tenant=${tenant}`);

      setProducts(res.data.content);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Products for {tenant}</h1>

      {products.map((p: any) => (
        <div key={p.id}>
          <p>{p.name}</p>
          <p>{p.price}</p>
        </div>
      ))}
    </div>
  );
}
