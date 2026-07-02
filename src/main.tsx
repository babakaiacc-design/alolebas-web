import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles.css";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Product from "./pages/Product";
import AminKharid from "./pages/AminKharid";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/amin-kharid" element={<AminKharid />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
