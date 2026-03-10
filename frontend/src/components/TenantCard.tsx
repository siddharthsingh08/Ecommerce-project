import { useNavigate } from "react-router-dom";

interface Tenant {
  id: number;
  name: string;
  domain: string;
  status: string;
}

interface Props {
  tenant: Tenant;
  onToggle: (tenant: Tenant) => void;
  onDelete: (id: number) => void;
}

export default function TenantCard({ tenant, onToggle, onDelete }: Props) {
  const navigate = useNavigate();
  const isActive = tenant.status === "ACTIVE";

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between shadow-sm hover:shadow-lg transition-all duration-200 mb-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <h2
            onClick={() => navigate(`/public/products/${tenant.name}`)}
            className="text-lg font-semibold text-gray-800 cursor-pointer hover:text-blue-600">
            {tenant.name.toUpperCase()}
          </h2>

          <span
            className={`text-xs px-2 py-1 rounded-full font-semibold ${
              isActive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            }`}>
            {tenant.status}
          </span>
        </div>

        <p className="text-gray-500 text-sm">{tenant.domain}</p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => onToggle(tenant)}
          className={`px-4 py-2 rounded text-xs font-semibold ${
            isActive
              ? "bg-red-100 text-red-600 hover:bg-red-200"
              : "bg-green-100 text-green-700 hover:bg-green-200"
          }`}>
          {isActive ? "Deactivate" : "Activate"}
        </button>

        <button
          onClick={() => onDelete(tenant.id)}
          className="px-4 py-2 rounded text-xs font-semibold bg-gray-100 hover:bg-red-500 hover:text-white">
          Delete
        </button>

        <button
          onClick={() => navigate(`/public/products/${tenant.name}`)}
          className="text-sm font-semibold text-blue-600 hover:underline">
          View →
        </button>
      </div>
    </div>
  );
}
