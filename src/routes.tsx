import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import { PaginaDeErro } from "./components/pages/PaginaDeErro";
import { Duvidas } from "./components/pages/Duvidas";
import { Formulario } from "./components/pages/Formulario";
import { Home } from "./components/pages/Home";
import { Produtos } from "./components/pages/Produtos";
import { Servicos } from "./components/pages/Servicos";
import { Sobre } from "./components/pages/Sobre";
import Login from "./components/pages/Login";
import ProtectedRoute from "./context/ProtectedRoute";
import PaginaDeEdicao from "./components/pages/PaginaDeEdicao";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <PaginaDeErro />,
    children: [
      { index: true, element: <Home /> },
      { path: "sobre", element: <Sobre /> },
      { path: "contatos", element: <Formulario /> },
      { path: "duvidas", element: <Duvidas /> },
      { path: "servicos", element: <Servicos /> },
      { path: "produtos", element: <Produtos /> },
      { path: "login", element: <Login /> },
      {
        path: "edicao",
        element: (
          <ProtectedRoute>
            <PaginaDeEdicao />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);