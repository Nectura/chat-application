import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Chat from "./pages/chat/Chat";
import Register from "./pages/auth/register/Register";
import Login from "./pages/auth/login/Login";
import { ProtectedRoute } from "./models/protected-route";
import { AuthRedirectionRoute } from "./models/auth-redirection-route";
import ForgotPassword from "./pages/auth/forgot-password/ForgotPassword";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/" element={<ProtectedRoute component={<Chat />} />} />
          <Route path="/auth/login" element={<AuthRedirectionRoute component={<Login />} path="/" />} />
          <Route path="/auth/register" element={<AuthRedirectionRoute component={<Register />} path="/" />} />
          <Route path="/auth/forgot-password" element={<AuthRedirectionRoute component={<ForgotPassword />} path="/" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
