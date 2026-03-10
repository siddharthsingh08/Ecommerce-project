import { useState } from "react";
import Navbar from "../components/Navbar";
import apiClient from "../api/apiClient";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function CreateTenant() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [email, setEmail] = useState("");
  const [managerFirstName, setManagerFirstName] = useState("");
  const [managerLastName, setManagerLastName] = useState("");
  const [password, setPassword] = useState("");

  const createTenant = async () => {

    if(!name.trim()) {
      toast.error("Tenant name is required");
      return;
    }
    
    if(!managerFirstName.trim()) {
      toast.error("Manager's First Name is required");
      return;
    }
    if(!managerLastName.trim()) {
      toast.error("Manager's Last Name is required");
      return;
    }

    if (!email.trim()) {
      toast.error("Manager's Email is required");
      return;
    }
    
    if(!password.trim()) {
      toast.error("Password is required");
      return;
    }

    try {
      await apiClient.post("/admin/tenant", {
        name,
        domain,
        email,
        managerFirstName,
        managerLastName,
        password,
      });

      toast.success("Tenant Created Successfully!");
      navigate("/admin/tenant");
    } catch (err) {
      toast.error("Failed to Create Tenant!");
      console.error(err);
    }
  };

  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen">
      <Navbar />

      <div className="max-w-xl mx-auto p-10">
        <h1 className="text-3xl font-semibold mb-6">Create Tenant</h1>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex flex-col gap-4">
          <input
            placeholder="Tenant Name"
            onChange={(e) => setName(e.target.value)}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            placeholder="Domain"
            onChange={(e) => setDomain(e.target.value)}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            placeholder="Manager First Name"
            onChange={(e) => setManagerFirstName(e.target.value)}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            placeholder="Manager Last Name"
            onChange={(e) => setManagerLastName(e.target.value)}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            placeholder="Manager Email"
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            disabled={
              !name.trim() &&
              !domain.trim() &&
              !email.trim() &&
              !managerFirstName.trim() &&
              !managerLastName.trim() &&
              !password.trim()
            }
            onClick={createTenant}
            className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed">
            Create Tenant
          </button>
        </div>
      </div>
    </div>
  );
}
