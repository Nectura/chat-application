import { useState } from "react";
import { Button, TextField, Typography } from "@mui/material";
import "./Register.scss";
import { NavLink, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { fireBaseAuth } from "../../../firebase/firebase";

export default function Register() {
  const [emailAddress, setEmailAddress] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleRegistration = async () => {
    try {
      await createUserWithEmailAndPassword(fireBaseAuth, emailAddress, password);
      alert("Registration successful!");
      navigate("/auth/login");
    }
    catch (error) {
      alert("Error registering: " + error);
    }
  };

  return (
    <div className="registration-form">
      <div id="recaptcha-container"></div>
      <h1>Register</h1>
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
      <TextField
        variant="outlined"
        label="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        style={{ width: "90%" }}
      />
      <br /> <br /> <br />
      <Button variant="outlined" onClick={handleRegistration} sx={{
          width: "90%",
        }}>
        Register
      </Button>
      <Typography variant="subtitle1" className="registration-link" style={{ marginTop: "15px" }}>
        Got an account?&nbsp;
        <NavLink to="/auth/login" style={{ fontWeight: "bold" }}>
        Login here
        </NavLink>
      </Typography>
    </div>
  );
}
