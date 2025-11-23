import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";               // Tu Home (no se cambia)
import "./style.css";

// Páginas que ya tienes
import Home from "./App";              // alias para claridad: Home = App
import Menu from "./pages/Menu";
import Eventos from "./pages/Eventos";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Reserva from "./pages/Reserva";
import TestSupabase from "./pages/TestSupabase";
import MisReservas from "./pages/MisReservas";
import CatalogoVinos from "./pages/CatalogoVinos";

// Componentes de administración
import RequireAdmin from "./components/RequireAdmin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminWines from "./pages/admin/AdminWines";
import AdminUsers from "./pages/admin/AdminUsers";


createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />           {/* Tu App.tsx */}
        <Route path="/menu" element={<Menu />} />
        <Route path="/eventos" element={<Eventos />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/reserva" element={<Reserva />} />
        <Route path="/test" element={<TestSupabase />} />
        <Route path="/mis-reservas" element={<MisReservas />} />
        <Route path="/catalogo-vinos" element={<CatalogoVinos />} />

        {/* Rutas de administración (protegidas) */}
        <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
        <Route path="/admin/vinos" element={<RequireAdmin><AdminWines /></RequireAdmin>} />
        <Route path="/admin/usuarios" element={<RequireAdmin><AdminUsers /></RequireAdmin>} />

        {/* Si quieres 404 luego: <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
