import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { fireBaseAuth } from "../../../firebase/firebase";
import { initializeRecaptcha } from "../../../services/firebase-auth.service";
import { FirebaseError } from "firebase/app";
import { Button, TextField, Typography } from "@mui/material";
import "./Login.scss";
import { NavLink, useNavigate } from "react-router-dom";

export default function Login() {
  const [emailAddress, setEmailAddress] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    initializeRecaptcha();
    try {
      await signInWithEmailAndPassword(fireBaseAuth, emailAddress, password);
      navigate("/");
    } catch (error) {
      const firebaseError = error as FirebaseError;
      let errorMessage = "";
      switch (firebaseError.code) {
        case "auth/invalid-email":
          errorMessage = "Invalid email address";
          break;
        case "auth/user-disabled":
          errorMessage = "User disabled";
          break;
        case "auth/user-not-found":
          errorMessage = "User not found";
          break;
        case "auth/wrong-password":
          errorMessage = "Wrong password";
          break;
        default:
          errorMessage = "Unknown error";
          break;
      }
      alert(errorMessage);
    }
  };

  return (
    <div className="login-form">
      <div id="recaptcha-container"></div>
      <h1>Login</h1>
      <br />
      <TextField
        variant="outlined"
        label="Email Address"
        type="text"
        onChange={(e) => setEmailAddress(e.target.value)}
        value={emailAddress}
        style={{ width: "90%" }}
      />
      <br />
      <br />
      <div className="password-container">
        <TextField
          variant="outlined"
          label="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          style={{ width: "90%" }}
        />
        <NavLink className="forgot-pw" to={"/auth/forgot-password"}>
          Forgot Password?
        </NavLink>
      </div>
      <br />
      <br />
      <Button
        variant="outlined"
        onClick={handleLogin}
        sx={{
          width: "90%",
        }}
      >
        Login
      </Button>
      <Typography variant="subtitle1" className="registration-link" style={{ marginTop: "15px" }}>
        Don't have an account yet?&nbsp;
        <NavLink to="/auth/register" style={{ fontWeight: "bold" }}>
        Register Here
        </NavLink>
      </Typography>
    </div>
  );
}
