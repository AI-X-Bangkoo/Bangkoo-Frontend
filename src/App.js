import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "./App.css";
import Header from './pages/header/Header';
import Home from './pages/home/Home';
import FurnitureEditorPage from './pages/3d/FurnitureEditorPage'; // ✅ 태원
import AISearchComponent from './pages/furnitureSearch/SearchPage'
import MyRoom from "./pages/myroom/MyRoom";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
      <BrowserRouter>
          <Header />
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/placement/add" element={<FurnitureEditorPage />} /> {/* ✅ 태원 */}
              <Route path="/search" element={<AISearchComponent />} />
              <Route path="/myroom" element={<MyRoom />} />
          </Routes>

          {/* 토스트 메시지 */}
          <ToastContainer
              position="top-center"
              autoClose={5000}
              hideProgressBar
              closeButton={false}
              toastClassName="custom-toast-body"
          />
      </BrowserRouter>
  );
}

export default App;
