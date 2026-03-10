import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProductForm from "../components/ProductForm";
import apiClient from "../api/apiClient";
import { toast } from "react-toastify";

export default function EditProduct() {
  const { tenant, id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<any>(null);
  const didFetchProduct = useRef(false);

  useEffect(() => {
    if (didFetchProduct.current) return;

    didFetchProduct.current = true;
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await apiClient.get(`/public/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateProduct = async (data: any) => {
    try {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("quantity", data.quantity);
      formData.append("categoryName", data.categoryName);

      if (data.image) {
        formData.append("image", data.image);
      }

      await apiClient.put(`/tenant/${tenant}/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Product Updated Successfully!");
      navigate(`/tenant/${tenant}/products`);
    } catch (err) {
      toast.error("Failed to Update Product!");
      console.error(err);
    }
  };

  if (!product) return <div className="text-gray-700 p-10">Loading...</div>;

  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen">
      <Navbar />

      <div className="max-w-xl mx-auto p-10">
        <h1 className="text-3xl font-semibold mb-6">Edit Product</h1>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <ProductForm
            initialName={product.name}
            initialDescription={product.description}
            initialPrice={product.price}
            initialQuantity={product.quantity}
            initialCategory={product.category.name}
            onSubmit={updateProduct}
            buttonText="Update Product"
          />
        </div>
      </div>
    </div>
  );
}
