import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, } from "react-icons/fa";
import { SiGoogle, SiMicrosoft, SiSteam, SiTwitch } from "react-icons/si";

import {
    containerStyle,
    cardStyle,
    logoStyle,
    inputStyle,
    buttonStyle,
    dividerStyle,
    lineStyle,
    dividerTextStyle,
    toggleStyle,
    iconContainer,
    inputIcon,
    passwordToggle,
    inputWithIcon,
    roundedIconRow,
    roundedIconButton,
    roundedIcon
} from "./loginStyles";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        // Login logic here
        navigate("/dashboard");
    };

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
                <img src="/game craft logo.jpeg" alt="Game Craft Logo" style={logoStyle} />
                <h1 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Welcome Back</h1>

                <form onSubmit={handleLogin}>
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

                    <button style={buttonStyle} type="submit">
                        Sign In
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

                <p
                    style={toggleStyle}
                    onClick={() => navigate("/register")}
                >
                    Don't have an account? <span style={{ fontWeight: "600" }}>Sign up</span>
                </p>
            </div>
        </div>
    );
}

export default Login;