import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import LandingPage from "./pages/landingPage.jsx";
import Catalogue from "./pages/catalogue.jsx";
import Product from "./pages/productPage.jsx";
import AddProduct from "./pages/addProduct.jsx";
import Favourites from "./pages/favourite.jsx";
import ShoppingCartPage from "./pages/shoppingCartPage.jsx";
import CheckoutProcess from "./pages/checkoutProcess.jsx";
import AddAddressPage from "./pages/AddAddressPage.jsx";
import EditAddressPage from "./pages/EditAddressPage.jsx";
import OrdersPage from "./pages/ordersPage.jsx";
import UnderConstruction from "./pages/UnderConstruction.jsx";
import { UserProvider, useUser } from "./contexts/UserContext";
import { CartProvider } from "./contexts/CartContext";
import "./globalButtonStyles.css";

function AppContent() {
  const { user } = useUser();
  
  return (
    <BrowserRouter>
      <CartProvider user={user}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/addProduct" element={<AddProduct />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<ShoppingCartPage />} />
          <Route path="/checkout" element={<CheckoutProcess />} />
          <Route path="/checkout/add-address" element={<AddAddressPage />} />
          <Route path="/checkout/edit-address/:addressId" element={<EditAddressPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/underConstruction" element={<UnderConstruction />} />

        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;