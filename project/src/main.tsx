import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { UserAuthContextProvider } from "./context/UserAuthContext";
import "./index.css";
import { CartProvider } from "./context/CartContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <CartProvider>
      <UserAuthContextProvider>
        <BrowserRouter>
        <App />
      </BrowserRouter>
    </UserAuthContextProvider>
    </CartProvider>
  </React.StrictMode>
);
