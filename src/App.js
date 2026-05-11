import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HomePage from "./components/pages/HomePage";
import LoginForm from "./components/pages/Login";
import RegisterForm from "./components/pages/Register";
import ProductListPage from "./components/pages/ProductListPage";
import ProductDetailPage from "./components/pages/ProductDetailPage";
import CartPage from "./components/pages/CartPage";
import ProfilePage from "./components/pages/ProfilePage";
import CheckoutPage from "./components/pages/CheckoutPage";
import OrdersPage from "./components/pages/OrdersPage";
import ForgotPasswordPage from "./components/pages/ForgotPasswordPage";
import ResetPasswordPage from "./components/pages/ResetPasswordPage";
import PublicRoute from "./components/router/PublicRoute";
import PrivateRoute from "./components/router/PrivateRoute";

import NotFoundPage from "./components/pages/NotFoundPage";

import AdminRoute from "./components/router/AdminRoute";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboardPage from "./components/admin/AdminDashboardPage";
import AdminProductsPage from "./components/admin/AdminProductsPage";
import AdminOrdersPage from "./components/admin/AdminOrdersPage";

function MainLayout() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/ProductListPage" element={<ProductListPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="*" element={<NotFoundPage />} />


          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Route>

          <Route element={<PrivateRoute />}>
            <Route path="/cart" element={<CartPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders" element={<OrdersPage />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
            </Route>
          </Route>
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
