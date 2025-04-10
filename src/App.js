import { BrowserRouter } from "react-router-dom";
import Header from "./components/layout/header/Header";
import "react-toastify/dist/ReactToastify.css";
import AppRoutes from "./routes/AppRoutes";
import GlobalToast from "./components/layout/toast/GlobalToast";

function App() {
  return (
    <BrowserRouter>
        <Header />
        <AppRoutes />
        <GlobalToast />
    </BrowserRouter>
  );
}

export default App;
