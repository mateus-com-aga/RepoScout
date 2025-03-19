import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Criando dinamicamente o link do favicon
const link = document.createElement("link");
link.rel = "icon";
link.href = "https://github.githubassets.com/favicons/favicon.png"; // URL de um favicon válido
document.head.appendChild(link);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
