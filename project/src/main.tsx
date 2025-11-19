import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { UserAuthContextProvider } from "./components/auth/UserAuthContext";
import "./index.css";

// Radix UI Theme
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Theme>
      <BrowserRouter>
        <UserAuthContextProvider>
          <App />
        </UserAuthContextProvider>
      </BrowserRouter>
    </Theme>
  </React.StrictMode>
);
