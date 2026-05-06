import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { Layout } from "./components/Layout";
import Home from "./pages/Home";
import Detector from "./pages/Detector";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import { Toaster } from "sonner";

function App() {
  return (
    <div className="App">
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="detector" element={<Detector />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="about" element={<About />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster theme="dark" position="bottom-right" />
      </AppProvider>
    </div>
  );
}

export default App;
