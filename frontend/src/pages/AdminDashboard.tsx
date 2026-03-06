import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import apiClient from "../api/apiClient";
import { useNavigate } from "react-router-dom";
import TenantCard from "../components/TenantCard";

interface Tenant {
  id: number;
  name: string;
  domain: string;
  status: string;
}

export default function AdminDashboard() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const res = await apiClient.get("/admin/tenant");

      setTenants(res.data.content);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStatus = async (tenant: Tenant) => {
    try {
      const newStatus = tenant.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

      await apiClient.put(`/admin/tenant/${tenant.id}/${newStatus}`, {});

      alert("Tenant Status Updated!");

      fetchTenants();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTenant = async (id: number) => {
    try {
      if (!confirm("Delete this tenant?")) return;

      await apiClient.delete(`/admin/tenant/${id}`);

      fetchTenants();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar search="" setSearch={() => {}} onSearch={() => {}} />

      <div className="p-10">
        <div className="flex justify-between mb-8">
          <h1 className="text-3xl">Tenant Management</h1>

          <button
            onClick={() => navigate("/admin/tenant/create")}
            className="bg-green-500 px-4 py-2 rounded-lg cursor-pointer">
            Create Tenant
          </button>
        </div>

        {tenants.map((tenant) => (
          <TenantCard
            key={tenant.id}
            tenant={tenant}
            onToggle={toggleStatus}
            onDelete={deleteTenant}
          />
        ))}
      </div>
    </div>
  );
}
