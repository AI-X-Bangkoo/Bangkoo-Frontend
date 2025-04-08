import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./pages/header/Header";
import Home from "./pages/home/Home";
import FurnitureEditorPage from "./pages/3d/FurnitureEditorPage"; // ✅ 태원
import AISearchComponent from "./pages/furnitureSearch/SearchPage";
import KakaoCallback from "./pages/auth/KakaoCallback";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/placement/add" element={<FurnitureEditorPage />} />
        <Route path="/search" element={<AISearchComponent />} />
        <Route path="/auth/callback/kakao" element={<KakaoCallback />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
