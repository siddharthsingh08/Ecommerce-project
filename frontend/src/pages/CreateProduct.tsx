import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProductForm from "../components/ProductForm";
import apiClient from "../api/apiClient";
import { toast } from "react-toastify";

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

      try {
        await apiClient.post(`/tenant/${tenant}/products`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        toast.success("Product Created!");
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to create Product!");
        console.log(err);
      }

      navigate(`/tenant/${tenant}/products`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen">
      <Navbar />

      <div className="max-w-xl mx-auto p-10">
        <h1 className="text-3xl font-semibold mb-6">Create Product</h1>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <ProductForm onSubmit={createProduct} buttonText="Create Product" />
        </div>
      </div>
    </div>
  );
}
