import { BrowserRouter, Route, Routes } from "react-router-dom";
import PublicProducts from "../pages/PublicProducts";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import ProtectedRoute from "./ProtectedRoute";
import Orders from "../pages/Orders";
import Favourites from "../pages/Favourites";
import TenantDashboard from "../pages/TenantDashboard";
import TenantRoute from "./TenantRoutes";
import CreateProduct from "../pages/CreateProduct";
import EditProduct from "../pages/EditProduct";
import AdminRoute from "./AdminRoute";
import AdminDashboard from "../pages/AdminDashboard";
import CreateTenant from "../pages/CreateTenant";
import AdminCategories from "../pages/AdminCategories";
import AdminOrders from "../pages/AdminOrders";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicProducts />} />

        <Route path="/public/products" element={<PublicProducts />} />

        <Route path="/public/products/:tenant" element={<PublicProducts />} />

        <Route
          path="/public/products/:tenant/:id"
          element={<ProductDetails />}
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/favourites"
          element={
            <ProtectedRoute>
              <Favourites />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tenant/:tenant/products"
          element={
            <TenantRoute>
              <TenantDashboard />
            </TenantRoute>
          }
        />

        <Route
          path="/tenant/:tenant/products/create"
          element={
            <TenantRoute>
              <CreateProduct />
            </TenantRoute>
          }
        />

        <Route
          path="/tenant/:tenant/products/:id"
          element={
            <TenantRoute>
              <EditProduct />
            </TenantRoute>
          }
        />

        <Route
          path="/admin/tenant"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/tenant/:id/:tenantName"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/tenant/create"
          element={
            <AdminRoute>
              <CreateTenant />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/category"
          element={
            <AdminRoute>
              <AdminCategories />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
