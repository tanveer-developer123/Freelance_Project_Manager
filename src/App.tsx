import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

const App = () => {
  return (
    // ✅ Wrap everything in ThemeProvider and AuthProvider
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />

            {/* Protected Dashboard */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <div>
                    <Navbar />
                    <Home />
                  </div>
                </ProtectedRoute>
              }
            />

          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
