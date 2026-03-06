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
    <div className="bg-[#111] border border-gray-800 rounded-xl p-5 flex items-center justify-between hover:border-gray-600 hover:bg-[#161616] transition-all duration-200 group mb-4">
      {/* LEFT SIDE: Info */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <h2
            onClick={() => navigate(`/public/products/${tenant.name}`)}
            className="text-lg font-bold text-white cursor-pointer hover:text-blue-400 transition-colors tracking-tight">
            {tenant.name.toUpperCase()}
          </h2>

          {/* Minimalist Status Badge */}
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest border ${
              isActive
                ? "bg-green-500/10 text-green-400 border-green-500/20"
                : "bg-red-500/10 text-red-400 border-red-500/20"
            }`}>
            {tenant.status}
          </span>
        </div>

        <p className="text-gray-500 text-sm font-medium">{tenant.domain}</p>
      </div>

      {/* RIGHT SIDE: Actions */}
      <div className="flex items-center gap-3">
        {/* Toggle Button - Transparent style */}
        <button
          onClick={() => onToggle(tenant)}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${
            isActive
              ? "text-gray-400 border-gray-800 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30"
              : "text-gray-400 border-gray-800 hover:bg-green-500/10 hover:text-green-400 hover:border-green-500/30"
          }`}>
          {isActive ? "Deactivate" : "Activate"}
        </button>

        {/* Delete Button - Subtle until hovered */}
        <button
          onClick={() => onDelete(tenant.id)}
          className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-white hover:bg-red-600 border border-transparent transition-all">
          Delete
        </button>

        {/* View Link */}
        <button
          onClick={() => navigate(`/public/products/${tenant.name}`)}
          className="ml-2 text-gray-400 hover:text-blue-400 transition-colors text-sm font-bold">
          VIEW →
        </button>
      </div>
    </div>
  );
}
