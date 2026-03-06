import { useState } from "react";
import Navbar from "../components/Navbar";
import apiClient from "../api/apiClient";
import { useNavigate } from "react-router-dom";

export default function CreateTenant() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [email, setEmail] = useState("");
  const [managerFirstName, setManagerFirstName] = useState("");
  const [managerLastName, setManagerLastName] = useState("");
  const [password, setPassword] = useState("");

  const createTenant = async () => {
    try {
      await apiClient.post("/admin/tenant", {
        name,
        domain,
        email,
        managerFirstName,
        managerLastName,
        password,
      });

      navigate("/admin/tenant");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar search="" setSearch={() => {}} onSearch={() => {}} />

      <div className="max-w-xl mx-auto p-10">
        <h1 className="text-3xl mb-6">Create Tenant</h1>

        <div className="flex flex-col gap-4">
          <input
            placeholder="Tenant Name"
            onChange={(e) => setName(e.target.value)}
            className="p-2 border border-white rounded"
          />

          <input
            placeholder="Domain"
            onChange={(e) => setDomain(e.target.value)}
            className="p-2 border border-white rounded"
          />

          <input
            placeholder="Manager Email"
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border border-white rounded"
          />

          <input
            placeholder="Manager First Name"
            onChange={(e) => setManagerFirstName(e.target.value)}
            className="p-2 border border-white rounded"
          />

          <input
            placeholder="Manager Last Name"
            onChange={(e) => setManagerLastName(e.target.value)}
            className="p-2 border border-white rounded"
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 border border-white rounded"
          />

          <button
            onClick={createTenant}
            className="bg-green-500 p-3 rounded cursor-pointer">
            Create Tenant
          </button>
        </div>
      </div>
    </div>
  );
}
