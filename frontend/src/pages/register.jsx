import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaGithub, FaFacebook } from "react-icons/fa";
import {
  containerStyle,
  cardStyle,
  logoStyle,
  inputStyle,
  buttonStyle,
  passwordMeterStyle,
  passwordStrengthStyle,
  dividerStyle,
  lineStyle,
  dividerTextStyle,
  toggleStyle,
  iconStyle,
  termsStyle,
  termsLinkStyle,
  // Add the new style imports
  iconContainer,
  inputIcon,
  passwordToggle,
  inputWithIcon,
  thirdPartyContainer,
  thirdPartyButton
} from "./registerStyles";

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // password tracker
  const getPasswordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.match(/[A-Z]/)) strength += 1;
    if (password.match(/[0-9]/)) strength += 1;
    if (password.match(/[^A-Za-z0-9]/)) strength += 1;
    return strength;
  };

  // register handler 
  const handleRegister = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    if (!acceptedTerms) {
      alert("Please accept the terms and conditions");
      return;
    }
    navigate("/dashboard");
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={logoStyle}>{/* Logo placeholder */}</div>

        <h1 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Create Account</h1>

        <form onSubmit={handleRegister}>
          {/* Email input */}
          <div style={iconContainer}>
            <FaEnvelope style={inputIcon} />
            <input
              style={{ ...inputStyle, ...inputWithIcon }}
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password input */}
          <div style={iconContainer}>
            <FaLock style={inputIcon} />
            <input
              style={{ ...inputStyle, ...inputWithIcon }}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength="6"
              required
            />
            <button
              type="button"
              style={passwordToggle}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Divider */}
          <div style={{ marginBottom: "1rem" }}>
            <div style={passwordMeterStyle}>
              <div style={passwordStrengthStyle(passwordStrength)} />
            </div>
            <div style={{ fontSize: "0.8rem", color: "#777" }}>
              {passwordStrength < 2 ? "Weak" :
                passwordStrength < 4 ? "Moderate" : "Strong"} password
            </div>
          </div>

          {/* Confirm Password input */}
          <div style={iconContainer}>
            <FaLock style={inputIcon} />
            <input
              style={{ ...inputStyle, ...inputWithIcon }}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength="6"
              required
            />
            <button
              type="button"
              style={passwordToggle}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* forget me/remember */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
            fontSize: "0.9rem",
            color: "#555"
          }}>
            <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <input type="checkbox" />
              Remember me
            </label>
            <span
              style={{ color: "#0066cc", cursor: "pointer", fontWeight: "500" }}
              onClick={() => alert("Password reset not implemented")}
            >
              Forgot password?
            </span>
          </div>

          {/* terms and conditions */}
          {/* <div style={termsStyle}>
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              style={{ marginRight: "8px" }}
              required
            />
            <span>
              I agree to the <a href="/terms" style={termsLinkStyle}>Terms and Conditions</a>
            </span>
          </div> */}

          <button style={buttonStyle} type="submit">
            Create Account
          </button>
        </form>

        {/* second divider */}
        <div style={dividerStyle}>
          <div style={lineStyle}></div>
          <div style={dividerTextStyle}>or</div>
          <div style={lineStyle}></div>
        </div>

        <div style={thirdPartyContainer}>
          <button style={thirdPartyButton} onClick={() => alert("Google sign-in")}>
            <FaGoogle style={{ ...iconStyle, color: "#DB4437" }} />
            <span style={{ fontSize: "0.7rem", marginTop: "5px" }}>Google</span>
          </button>

          <button style={thirdPartyButton} onClick={() => alert("GitHub sign-in")}>
            <FaGithub style={iconStyle} />
            <span style={{ fontSize: "0.7rem", marginTop: "5px" }}>GitHub</span>
          </button>

          <button style={thirdPartyButton} onClick={() => alert("Facebook sign-in")}>
            <FaFacebook style={{ ...iconStyle, color: "#4267B2" }} />
            <span style={{ fontSize: "0.7rem", marginTop: "5px" }}>Facebook</span>
          </button>
        </div>

        <p style={toggleStyle} onClick={() => navigate("/login")}>
          Already have an account? <span style={{ fontWeight: "600" }}>Sign in</span>
        </p>
      </div>
    </div>
  );
}

export default Register;