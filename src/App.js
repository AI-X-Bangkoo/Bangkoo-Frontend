import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './pages/header/Header';
import Home from './pages/home/Home';
import FurnitureEditorPage from './pages/3d/FurnitureEditorPage'; // ✅ 태원

function App() {
  return (
      <BrowserRouter>
          <Header />
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/furniture-add" element={<FurnitureEditorPage />} /> {/* ✅ 태원 */}
          </Routes>
      </BrowserRouter>
  );
}

export default App;
