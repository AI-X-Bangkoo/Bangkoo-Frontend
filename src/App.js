import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './pages/header/Header';
import Home from './pages/home/Home';

function App() {
  return (
      <BrowserRouter>
          <Header />
          <Routes>
              <Route path="/" element={<Home />} />
          </Routes>
      </BrowserRouter>
  );
}

export default App;
