import React from "react";
import { createRoot } from "react-dom";
import "./tailwind.css"; // Import Tailwind CSS styles
import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
