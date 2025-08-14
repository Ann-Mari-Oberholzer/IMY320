import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { SiGoogle, SiSteam, SiTwitch } from "react-icons/si";

import {
    globalReset,
    containerStyle,
    contentWrapper,
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
    roundedIcon,
    navBar,
    navRight,
    navItem,
    logo,
    overlayStyle
} from "./loginStyles";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        // Login logic here
        navigate("/about");
    };

    useEffect(() => {
        const styleElement = document.createElement("style");
        styleElement.textContent = globalReset;
        document.head.appendChild(styleElement);
        
        return () => {
            document.head.removeChild(styleElement);
        };
    }, []);

    return (
        <div style={containerStyle}>
            {/* Background overlay */}
            <div style={overlayStyle}></div>

            {/* Navbar */}
            <nav style={navBar}>
                <img src="/GameCraft3-1.png" alt="Game Craft Logo" style={logo} />
                <div style={navRight}>
                    <span style={navItem} onClick={() => navigate("/")}>Home</span>
                    <span style={navItem}>Store</span>
                    <span style={navItem} onClick={() => navigate("/about")}>About</span>
                </div>
            </nav>

            {/* Content wrapper to center the card */}
            <div style={contentWrapper}>
                <div style={{ ...cardStyle, zIndex: 1 }}>
                    <img src="/GameCraft3-1.png" alt="Game Craft Logo" style={logoStyle} />
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

                        {/* Remember me / Forgot password */}
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

                    {/* Divider */}
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
        </div>
    );
}

export default Login;