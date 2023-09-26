import { useState } from "react";
import { Button, TextField, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import "./ForgotPassword.scss";
import { sendPasswordResetEmail } from "firebase/auth";
import { fireBaseAuth } from "../../../firebase/firebase";

export default function ForgotPassword() {
  const [emailAddress, setEmailAddress] = useState<string>("");
  const [hasSent, setHasSent] = useState<boolean>(false);

  const handlePasswordReset = async () => {
    try {
        await sendPasswordResetEmail(fireBaseAuth, emailAddress);
        setHasSent(true);
        alert("An email has been sent to your email address if it's registered.");
    }
    catch (error) {
        alert("Error sending password reset email: " + error);
    }
  };

  return (
    <div className="registration-form">
      <div id="recaptcha-container"></div>
      <h1>Password Recovery</h1>
      <br />
      <TextField
        variant="outlined"
        label="Email Address"
        type="text"
        onChange={(e) => setEmailAddress(e.target.value)}
        value={emailAddress}
        style={{ width: "90%" }}
      />
      <br /> <br /> <br />
      <Button disabled={hasSent} variant="outlined" onClick={handlePasswordReset} sx={{
          width: "90%",
        }}>
        Send a reset link
      </Button>
      <Typography variant="subtitle1" className="registration-link" style={{ marginTop: "15px" }}>
        Remembered your password?&nbsp;
        <NavLink to="/auth/login" style={{ fontWeight: "bold" }}>
        Login here
        </NavLink>
      </Typography>
    </div>
  );
}
