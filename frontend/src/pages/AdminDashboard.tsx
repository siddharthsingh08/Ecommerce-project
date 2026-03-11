import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import apiClient from "../api/apiClient";
import { useNavigate } from "react-router-dom";
import TenantCard from "../components/TenantCard";
import { toast } from "react-toastify";
import ConfirmModal from "../components/ConfirmModal";

interface Tenant {
  id: number;
  name: string;
  domain: string;
  status: string;
}

export default function AdminDashboard() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const navigate = useNavigate();
  const didFetchTenant = useRef(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [tenantToDelete, setTenantToDelete] = useState<number | null>(null);

  useEffect(() => {
    if (didFetchTenant.current) return;
    didFetchTenant.current = true;
    fetchTenants(0);
  }, []);

  const fetchTenants = async (pageNumber = 0) => {
    try {
      const res = await apiClient.get("/admin/tenant", {
        params: { page: pageNumber, size: 8, sort: "id,desc" },
      });

      setTenants(res.data.content);
      setPage(res.data.number);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStatus = async (tenant: Tenant) => {
    try {
      const newStatus = tenant.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

      await apiClient.put(`/admin/tenant/${tenant.id}/${newStatus}`, {});
      toast.success("Tenant Status Updated!");

      fetchTenants(page);
    } catch (err) {
      toast.error("Failed to Update!");
      console.error(err);
    }
  };

  const deleteTenant = (id: number) => {
    setTenantToDelete(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!tenantToDelete) return;

    try {
      await apiClient.delete(`/admin/tenant/${tenantToDelete}`);
      toast.success(`Tenant deleted!`);
      fetchTenants(page);
    } catch (err) {
      toast.error("Failed to Delete!");
      console.error(err);
    } finally {
      setShowConfirm(false);
      setTenantToDelete(null);
    }
  };

  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen">
      <Navbar />

      <div className="p-10 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold">Tenant Management</h1>

          <button
            onClick={() => navigate("/admin/tenant/create")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer">
            Create Tenant
          </button>
        </div>

        <div className="space-y-4">
          {tenants.map((tenant) => (
            <TenantCard
              key={tenant.id}
              tenant={tenant}
              onToggle={toggleStatus}
              onDelete={deleteTenant}
            />
          ))}
        </div>

        <div className="flex justify-center gap-4 mt-10">
          <button
            disabled={page === 0}
            onClick={() => fetchTenants(page - 1)}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded disabled:opacity-50 cursor-pointer">
            Previous
          </button>

          <span className="self-center text-sm">
            Page {page + 1} of {totalPages}
          </span>

          <button
            disabled={page + 1 >= totalPages}
            onClick={() => fetchTenants(page + 1)}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded disabled:opacity-50 cursor-pointer">
            Next
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        title="Delete Category"
        message={`Are you sure you want to delete this tenant?`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}
