import { Routes, Route, Navigate } from "react-router-dom";
import ReportGenerator from "./ReportGen/reportgenerator.jsx";
import Placeholder from "./Placeholder/placeholder.jsx";
import Navbar from "./components/Navbar.jsx";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<ReportGenerator />} />
        <Route path="/placeholder" element={<Placeholder />} />
        {/* Fallback to default */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;