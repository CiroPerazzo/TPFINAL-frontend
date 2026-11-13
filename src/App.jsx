import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout.jsx";

import Home from "./pages/Home.jsx";
import Explore from "./pages/Explore.jsx";
import Library from "./pages/Library.jsx";
import Detail from "./pages/Detail.jsx";
import Collections from "./pages/Collections.jsx";
import Profile from "./pages/Profile.jsx";
import Statistics from "./pages/Statistics.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="explorar" element={<Explore />} />
        <Route path="biblioteca" element={<Library />} />
        <Route path="detalle/:id" element={<Detail />} />
        <Route path="colecciones" element={<Collections />} />
        <Route path="perfil" element={<Profile />} />
        <Route path="estadisticas" element={<Statistics />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
