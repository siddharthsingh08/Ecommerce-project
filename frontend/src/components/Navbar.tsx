import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import keycloak from "../auth/keycloak";

interface Props {
  search: string;
  setSearch: (value: string) => void;
  onSearch: () => void;
}

export default function Navbar({ search, setSearch, onSearch }: Props) {
  const { isAuthenticated, login, logout, roles, tenant } = useAuth();

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-2xl font-bold">
        E-CommerceSite
      </Link>

      <div className="flex gap-6 items-center">
        <Link to="/cart">Cart</Link>

        <Link to="/orders">Orders</Link>

        <Link to="/favourites">Favourites</Link>
        {roles.includes("ROLE_TENANT") && (
          <Link to={`/tenant/${tenant}/products`}>My Store</Link>
        )}
        {roles.includes("ROLE_ADMIN") && (<>
        <Link to="/admin/tenant">Admin</Link>
        <Link to="/admin/category">Categories</Link>
        <Link to="/admin/orders">Manage Orders</Link>
        </>)}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 rounded-lg text-white border border-white "
        />

        <button
          onClick={onSearch}
          className="bg-blue-500 px-4 py-2 rounded cursor-pointer">
          Search
        </button>
        {!isAuthenticated ? (
          <div>
            <button
              onClick={login}
              className="bg-green-500 px-3 py-2 rounded cursor-pointer mr-2">
              Login
            </button>
            <button
              onClick={() => keycloak.register()}
              className="bg-purple-500 px-3 py-2 rounded cursor-pointer"
            >
              Sign Up
            </button>
          </div>
        ) : (
          <button
            onClick={logout}
            className="bg-red-500 px-3 py-2 rounded cursor-pointer">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
