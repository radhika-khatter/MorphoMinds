import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";


import { ThemeProvider } from "@/hooks/use-theme";
import { FontProvider } from "@/providers/FontProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light">
      <FontProvider>
        <App />
      </FontProvider>
    </ThemeProvider>
  </StrictMode>
);