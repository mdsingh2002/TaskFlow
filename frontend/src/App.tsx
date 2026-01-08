/**
 * Main application component with routing and authentication provider.
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<div><h1>TaskFlow</h1><p>Welcome to TaskFlow - Production-Ready Task Management</p></div>} />
          <Route path="/login" element={<div><h1>Login Page</h1><p>Login page will be implemented in Phase 2</p></div>} />
          <Route path="/tasks" element={<div><h1>Tasks Page</h1><p>Tasks page will be implemented in Phase 3</p></div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
