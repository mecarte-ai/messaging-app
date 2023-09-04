import { useState } from "react";
import Login from "./Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter basename="/messaging-app">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

function Dashboard() {
  return <h1>Welcome</h1>;
}
