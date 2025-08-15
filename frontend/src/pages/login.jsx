import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaExclamationCircle } from "react-icons/fa";
import { SiGoogle, SiSteam, SiTwitch } from "react-icons/si";
import NavBar from '../components/NavBar';
import { useUser } from '../contexts/UserContext';
import apiService from '../services/api';

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
    overlayStyle
} from "./loginStyles";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { user, login } = useUser();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setFieldErrors({});
        
        // Validate fields
        const errors = {};
        if (!email.trim()) errors.email = 'Email is required';
        if (!password.trim()) errors.password = 'Password is required';
        
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        setIsLoading(true);

        try {
            const response = await apiService.login(email, password);
            
            if (response.success) {
                // Login successful
                login(response.user);
                navigate("/");
        } else {
                // Login failed
                setError(response.error || 'Login failed. Please try again.');
            }
        } catch (error) {
            setError('Network error. Please check your connection and try again.');
        } finally {
            setIsLoading(false);
        }
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

            {/* Replace the existing nav with: */}
            <NavBar currentPage="login" user={user} />

            {/* Content wrapper to center the card */}
            <div style={contentWrapper}>
                <div 
                    style={{ 
                        ...cardStyle, 
                        zIndex: 1,
                        boxShadow: '0 0 30px rgba(28, 118, 148, 0.2)'
                    }}
                >
                    <img src="/GameCraft3-1.png" alt="Game Craft Logo" style={logoStyle} />
                    <h1 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Welcome Back</h1>

                    <form onSubmit={handleLogin}>
                        {/* Email input */}
                        <div style={iconContainer}>
                            <FaEnvelope style={inputIcon} />
                            <input
                                style={{ 
                                    ...inputStyle, 
                                    ...inputWithIcon,
                                    transition: 'all 0.3s ease',
                                    border: fieldErrors.email ? '2px solid #e74c3c' : '1px solid #CCC'
                                }}
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (fieldErrors.email) {
                                        setFieldErrors(prev => ({ ...prev, email: null }));
                                    }
                                }}
                                onFocus={(e) => {
                                    e.target.style.border = fieldErrors.email ? '2px solid #e74c3c' : '2px solid #00AEBB';
                                    e.target.style.boxShadow = fieldErrors.email ? '0 0 0 3px rgba(231, 76, 60, 0.1)' : '0 0 0 3px rgba(0, 174, 187, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.border = fieldErrors.email ? '2px solid #e74c3c' : '1px solid #CCC';
                                    e.target.style.boxShadow = fieldErrors.email ? '0 0 0 3px rgba(231, 76, 60, 0.1)' : 'none';
                                }}
                            />
                        </div>

                        {/* Email error message */}
                        {fieldErrors.email && (
                            <div style={{
                                color: "#e74c3c",
                                fontSize: "0.8rem",
                                marginTop: "-0.5rem",
                                marginBottom: "0.5rem",
                                paddingLeft: "0.5rem",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.25rem"
                            }}>
                                <FaExclamationCircle style={{ color: "#e74c3c", fontSize: "0.9rem" }} />
                                {fieldErrors.email}
                            </div>
                        )}

                        {/* Password input */}
                        <div style={iconContainer}>
                            <FaLock style={inputIcon} />
                            <input
                                style={{ 
                                    ...inputStyle, 
                                    ...inputWithIcon,
                                    transition: 'all 0.3s ease',
                                    border: fieldErrors.password ? '2px solid #e74c3c' : '1px solid #CCC'
                                }}
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (fieldErrors.password) {
                                        setFieldErrors(prev => ({ ...prev, password: null }));
                                    }
                                }}
                                onFocus={(e) => {
                                    e.target.style.border = fieldErrors.password ? '2px solid #e74c3c' : '2px solid #00AEBB';
                                    e.target.style.boxShadow = fieldErrors.password ? '0 0 0 3px rgba(231, 76, 60, 0.1)' : '0 0 0 3px rgba(0, 174, 187, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.border = fieldErrors.password ? '2px solid #e74c3c' : '1px solid #CCC';
                                    e.target.style.boxShadow = fieldErrors.password ? '0 0 0 3px rgba(231, 76, 60, 0.1)' : 'none';
                                }}
                            />
                            <button
                                type="button"
                                style={passwordToggle}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>

                        {/* Password error message */}
                        {fieldErrors.password && (
                            <div style={{
                                color: "#e74c3c",
                                fontSize: "0.8rem",
                                marginTop: "-0.5rem",
                                marginBottom: "0.5rem",
                                paddingLeft: "0.5rem",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.25rem"
                            }}>
                                <FaExclamationCircle style={{ color: "#e74c3c", fontSize: "0.9rem" }} />
                                {fieldErrors.password}
                            </div>
                        )}

                        {/* Error message */}
                        {error && (
                            <div style={{
                                backgroundColor: "#fee",
                                color: "#c33",
                                padding: "0.75rem",
                                borderRadius: "0.5rem",
                                marginBottom: "1rem",
                                fontSize: "0.9rem",
                                textAlign: "center",
                                border: "1px solid #fcc"
                            }}>
                                {error}
                            </div>
                        )}

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
                                style={{ color: "#0066cc", cursor: "pointer", fontWeight: "500", transition: "color 0.3s ease" }}
                                onClick={() => alert("Password reset not implemented")}
                                onMouseEnter={(e) => {
                                    e.target.style.color = "#000";
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.color = "#0066cc";
                                }}
                            >
                                Forgot password?
                            </span>
                        </div>

                        <button 
                            style={{
                                ...buttonStyle,
                                opacity: isLoading ? 0.7 : 1,
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.3s ease',
                                transform: isLoading ? 'none' : 'translateY(0)',
                                boxShadow: isLoading ? '0 4px 14px rgba(0,0,0,0.1)' : '0 4px 14px rgba(0,0,0,0.1)'
                            }} 
                            type="submit"
                            disabled={isLoading}
                            onMouseEnter={(e) => {
                                if (!isLoading) {
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isLoading) {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 4px 14px rgba(0,0,0,0.1)';
                                }
                            }}
                        >
                            {isLoading ? 'Signing In...' : 'Sign In'}
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
                        {[
                            { Icon: SiSteam, color: "#3c48ceff" },
                            { Icon: SiGoogle, color: "#f05e51ff" },
                            { Icon: SiTwitch, color: "#8118f2ff" }
                        ].map(({ Icon, color }, idx) => (
                            <button
                                key={idx}
                                style={{
                                    ...roundedIconButton,
                                    transition: "all 0.3s ease"
                                }}
                                onClick={() => alert(`${Icon.name} sign-in`)}
                                onMouseEnter={(e) => {
                                    e.target.style.transform = "scale(1.1)";
                                    e.target.style.backgroundColor = "#00AEBB";
                                    e.target.querySelector("svg").style.color = "#fff";
                                    e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = "scale(1)";
                                    e.target.style.backgroundColor = "";
                                    e.target.querySelector("svg").style.color = color;
                                    e.target.style.boxShadow = "none";
                                }}
                            >
                                <Icon style={{ ...roundedIcon, color }} />
                            </button>
                        ))}
                    </div>

                    <p
                        style={{
                            ...toggleStyle,
                            transition: 'all 0.3s ease'
                        }}
                        onClick={() => navigate("/register")}
                        onMouseEnter={(e) => {
                            e.target.style.color = '#00AEBB';
                            e.target.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.color = '#1E232C';
                            e.target.style.transform = 'translateY(0)';
                        }}
                    >
                        Don't have an account? <span style={{ fontWeight: "600" }}>Sign up</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;