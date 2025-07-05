import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App";
import './index.css'
import { ThemeProvider } from "@emotion/react";
import theme from '../theme'

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
   <ThemeProvider theme={theme}>
    <App />
    </ThemeProvider>
  </BrowserRouter>
);
