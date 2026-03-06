import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProductForm from "../components/ProductForm";
import apiClient from "../api/apiClient";

export default function CreateProduct() {
  const { tenant } = useParams();
  const navigate = useNavigate();

  const createProduct = async (data: any) => {
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
      await apiClient.post(`/tenant/${tenant}/products`, formData, {
        headers: { "Content-Type": "multipart/form-data", },
      });

      navigate(`/tenant/${tenant}/products`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar search="" setSearch={() => {}} onSearch={() => {}} />

      <div className="max-w-xl mx-auto p-10">
        <h1 className="text-3xl mb-6">Create Product</h1>

        <ProductForm onSubmit={createProduct} buttonText="Create Product" />
      </div>
    </div>
  );
}
