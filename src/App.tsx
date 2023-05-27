import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Books from "./pages/Books";
import Register from "./pages/Register";
import PrivateRoute from "./pages/PrivateRoute";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
            <Route element={<PrivateRoute/>}>
                <Route path="/books" element={<Books />} />
            </Route>
            <Route path="/" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
