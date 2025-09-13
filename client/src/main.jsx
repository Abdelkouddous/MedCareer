import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
// add toasting library
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

// fetch("/api/v1/test")
//   .then((response) => response.json())
//   .then((data) => console.log("Test route response:", data));

const data = axios.get("api/v1/test");
console.log(data);
// render frontend
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ToastContainer position="top-left" />
    <App />
  </StrictMode>
);
