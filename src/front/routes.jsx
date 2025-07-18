// src/front/routes.jsx

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { VerifyEmail } from "./pages/VerifyEmail";
import { LastResults } from "./pages/LastResults";
import { AboutUs } from "./pages/AboutUs";
import { LegalBases } from "./pages/LegalBases";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { CartPage } from "./pages/CartPage";
import { Profile } from "./pages/Profile";
import { SelectTicket } from "./pages/SelectTicket";
import { MyRifas } from "./pages/MyRifas";
import { Success } from "./pages/Success";
import { Cancel } from "./pages/Cancel";
import RuletaPage from "./pages/RuletaPage"; 

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/ultimos-resultados" element={<LastResults />} />
      <Route path="/sobre-nosotros" element={<AboutUs />} />
      <Route path="/bases-legales" element={<LegalBases />} />
      <Route path="/politica-privacidad" element={<PrivacyPolicy />} />
      <Route path="/checkout" element={<CartPage />} />
      <Route path="/seleccion-boletos/:id" element={<SelectTicket />} />
      <Route path="/myrifas" element={<MyRifas />} />
      <Route path="/myrifas/:id" element={<MyRifas />} />
      <Route path="/success" element={<Success />} />
      <Route path="/cancel" element={<Cancel />} />
      <Route path="/ruleta" element={<RuletaPage />} /> 
    </Route>
  )
);
