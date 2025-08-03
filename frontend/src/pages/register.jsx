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
  iconContainer,
  inputIcon,
  passwordToggle,
  inputWithIcon
} from "./registerStyles";
import { roundedIcon, roundedIconButton, roundedIconRow } from "./loginStyles";
import { SiGoogle, SiSteam, SiTwitch } from "react-icons/si";

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
    navigate("/about");
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div style={containerStyle}>
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        backdropFilter: "blur(4px)",
        backgroundPosition: "center",
        zIndex: 0,
      }}></div>
      <div style={{ ...cardStyle, zIndex: 1 }}>
        <img src="/GameCraft3-1.png" alt="Game Craft Logo" style={logoStyle} />
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
          </div>

          <button style={buttonStyle} type="submit">
            Create Account
          </button>
        </form>

        {/* divider style */}
        <div style={dividerStyle}>
          <div style={lineStyle}></div>
          <div style={dividerTextStyle}>or continue with</div>
          <div style={lineStyle}></div>
        </div>

        {/* Third party sign in */}
        <div style={roundedIconRow}>
          <button style={roundedIconButton} onClick={() => alert("Steam sign-in")}>
            <SiSteam style={{ ...roundedIcon, color: "#3c48ceff" }} />
          </button>
          <button style={roundedIconButton} onClick={() => alert("Google sign-in")}>
            <SiGoogle style={{ ...roundedIcon, color: "#f05e51ff" }} />
          </button>
          <button style={roundedIconButton} onClick={() => alert("Twitch sign-in")}>
            <SiTwitch style={{ ...roundedIcon, color: "#8118f2ff" }} />
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