import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home.js";
import Rules from "./pages/rules.js";
import "./App.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/rules" element={<Rules />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
