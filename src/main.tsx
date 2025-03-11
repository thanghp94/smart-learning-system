
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { DatabaseProvider } from "./contexts/DatabaseContext";
import { AuthProvider } from "./contexts/AuthContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <DatabaseProvider>
        <App />
      </DatabaseProvider>
    </AuthProvider>
  </React.StrictMode>
);
