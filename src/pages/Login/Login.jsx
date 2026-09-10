import {
    UserRound,
    Mail,
    LockKeyhole,
    X
} from "lucide-react";

import { useNavigate } from "react-router";

import { useState } from "react";

import "./Login.css";


function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [loginSuccess, setLoginSuccess] = useState(false);

    const navigate = useNavigate();


    const handleClear = () => {
        setEmail("");
        setPassword("");
        setMessage("");
        setLoginSuccess(false);
    };


     const handleLogin = async (event) => {

        event.preventDefault();

        setMessage("");
        setLoginSuccess(false);


        // Basic validation

        if (!email || !password) {

            setMessage("Please enter email and password.");

            return;
        }


        setLoading(true);


        try {

            const response = await fetch(
                "http://localhost:8080/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );


            const data = await response.json();


            if (response.ok && data.success) {

                setLoginSuccess(true);
                localStorage.setItem("isLoggedIn", "true");
                setMessage(data.message);
                console.log("Login successful:", data); 
                // Save logged-in user
                localStorage.setItem(
                "user",
                  JSON.stringify({
                  id: data.id,
                  name: data.name,
                  email: data.email
                 }));

                navigate("/");
                // We will add dashboard navigation here later.
            } else {

                setLoginSuccess(false);

                setMessage(data.message || "Invalid email or password.");

            }

        } catch (error) {

            console.error("Login error:", error);

            setLoginSuccess(false);

            setMessage(
                "Unable to connect to server. Please try again."
            );

        } finally {

            setLoading(false);

        }
    };


    return (

        <section className="admin-login-page">

            <div className="admin-login-container">

                {/* ================= LEFT SECTION ================= */}

                <div className="admin-login-greet">

                    <div className="admin-login-greet-content">

                        <div className="admin-login-icon">
                            <UserRound size={32} strokeWidth={1.8} />
                        </div>
                        <h1>
                            Welcome Back
                        </h1>
                        <h2>
                        Admin Dashboard
                        </h2>
                        <p>
                            Login to manage your Solar Services
                            administration panel.
                        </p>
                    </div>
                </div>


                {/* ================= RIGHT SECTION ================= */}

                <div className="admin-login-main">

                    <div className="admin-login-form-wrapper">

                        <div className="admin-login-heading">

                            <span className="admin-login-small-heading">
                                ADMIN PORTAL
                            </span>
                            <h1>
                                Login Here
                            </h1>
                            <p>
                                Enter your credentials to continue.
                            </p>
                        </div>

                        {/* ================= FORM ================= */}
                        <form
                            onSubmit={handleLogin}
                            className="admin-login-form">

                            {/* Email */}
                            <div className="admin-login-input-container">
                                <label
                                    htmlFor="email"
                                    className="admin-input-label"
                                >
                                    Email Address
                                </label>

                                <div className="admin-input-wrapper">
                                    <Mail
                                        className="admin-input-icon"
                                        size={19}
                                        strokeWidth={1.8}
                                    />
                                    <input
                                        id="email"
                                        className="admin-input-field"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(event) =>
                                            setEmail(event.target.value)
                                        }
                                        required/>
                                </div>
                            </div>


                            {/* Password */}

                            <div className="admin-login-input-container">
                                <label
                                    htmlFor="password"
                                    className="admin-input-label"
                                >
                                    Password
                                </label>

                                <div className="admin-input-wrapper">

                                    <LockKeyhole
                                        className="admin-input-icon"
                                        size={19}
                                        strokeWidth={1.8}/>

                                    <input
                                        id="password"
                                        className="admin-input-field"
                                        type="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(event) =>
                                            setPassword(event.target.value)
                                        }
                                        required/>
                                </div>
                            </div>

                            
                        {message && (
                            <p
                                className={
                                    loginSuccess
                                        ? "login-message success"
                                        : "login-message error"
                                }>
                                {message}
                            </p>
                          )}



                            {/* ================= BUTTONS ================= */}
                            <div className="admin-login-footer">

                                <button
                                    type="button"
                                    className="admin-clear-btn"
                                    onClick={handleClear}
                                    disabled={loading}>
                                    <X size={18} />
                                    Clear
                                </button>
                                <button
                                    type="submit"
                                    className="admin-login-btn"
                                    disabled={loading}> 

                                    {loading ? "Logging in..." : "Login"}

                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
export default Login;