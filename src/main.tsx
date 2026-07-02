import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles.css";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Product from "./pages/Product";
import AminKharid from "./pages/AminKharid";
import B2B from "./pages/B2B";
import Services from "./pages/Services";
import Account from "./pages/Account";
import Seller from "./pages/Seller";
import NotFound from "./pages/NotFound";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/amin-kharid" element={<AminKharid />} />
        <Route path="/b2b" element={<B2B />} />
        <Route path="/services" element={<Services />} />
        <Route path="/account" element={<Account />} />
        <Route path="/seller" element={<Seller />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
