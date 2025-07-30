import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaGithub, FaFacebook } from "react-icons/fa";
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
    iconStyle,
    iconContainer,
    inputIcon,
    passwordToggle,
    inputWithIcon,
    thirdPartyContainer,
    thirdPartyButton
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
            <div style={cardStyle}>
                <div style={logoStyle}>
                    {/* Logo image would go here */}
                </div>

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