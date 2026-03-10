import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import keycloak from "../auth/keycloak";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const { isAuthenticated, login, logout, roles, tenant, userName } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 text-gray-800">
      <div className="flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-gray-900">
          E-CommerceSite
        </Link>

        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>

        <div className="hidden md:flex gap-6 items-center text-sm font-medium">
          {isAuthenticated && (
            <>
              <Link to="/cart" className="hover:text-blue-600">
                Cart
              </Link>
              <Link to="/orders" className="hover:text-blue-600">
                Orders
              </Link>
              <Link to="/favourites" className="hover:text-blue-600">
                Favourites
              </Link>{" "}
            </>
          )}

          {roles.includes("ROLE_TENANT") && (
            <Link
              to={`/tenant/${tenant}/products`}
              className="hover:text-blue-600">
              My Store
            </Link>
          )}

          {roles.includes("ROLE_ADMIN") && (
            <>
              <Link to="/admin/tenant" className="hover:text-blue-600">
                Manage Tenants
              </Link>

              <Link to="/admin/category" className="hover:text-blue-600">
                Categories
              </Link>

              <Link to="/admin/orders" className="hover:text-blue-600">
                Manage Orders
              </Link>
            </>
          )}

          {!isAuthenticated ? (
            <>
              <button
                onClick={login}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
                Login
              </button>

              <button
                onClick={() => keycloak.register()}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded cursor-pointer">
                Sign Up
              </button>
            </>
          ) : (
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded cursor-pointer">
                <span className="text-lg">👤</span>
                <span className="font-medium">{userName}</span>
                <span className="text-xs">▼</span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-md">
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 hover:text-red-600">
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="flex flex-col gap-4 mt-4 md:hidden text-sm">
          <Link to="/cart">Cart</Link>
          <Link to="/orders">Orders</Link>
          <Link to="/favourites">Favourites</Link>

          {roles.includes("ROLE_TENANT") && (
            <Link to={`/tenant/${tenant}/products`}>My Store</Link>
          )}

          {roles.includes("ROLE_ADMIN") && (
            <>
              <Link to="/admin/tenant">Manage Tenants</Link>
              <Link to="/admin/category">Categories</Link>
              <Link to="/admin/orders">Manage Orders</Link>
            </>
          )}

          {!isAuthenticated ? (
            <>
              <button
                onClick={login}
                className="bg-blue-500 text-white px-4 py-2 rounded">
                Login
              </button>

              <button
                onClick={() => keycloak.register()}
                className="bg-purple-500 text-white px-4 py-2 rounded">
                Sign Up
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 font-semibold">
                <span>👤</span>
                {userName}
              </div>

              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded">
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
