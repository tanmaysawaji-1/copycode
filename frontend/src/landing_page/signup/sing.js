import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function Sign({ setsignup }) {
  const [isLogin, setIsLogin] = useState(false);
  const [inputValue, setInputValue] = useState({
    mobile: "",
    password: "",
    username: "",
  });
  const { mobile, password, username } = inputValue;

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleError = (err) =>
    toast.error(err, {
      position: "bottom-left",
    });
  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "bottom-right",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || "https://hungryhub-backend-bgem.onrender.com";
      const url = isLogin ? `${backendUrl}/login` : `${backendUrl}/signup`;
      const { data } = await axios.post(
        url,
        {
          ...inputValue,
        },
        { withCredentials: true }
      );
      const { success, message } = data;
      if (success) {
        handleSuccess(message);
        // Store username and mobile in cookies for dashboard access
        document.cookie = `username=${data.user.username}; path=/;`;
        document.cookie = `mobile=${data.user.mobile}; path=/;`;
        setTimeout(() => {
          // Redirect to dashboard
          window.location.href = process.env.REACT_APP_DASHBOARD_URL || "https://your-vercel-dashboard-url.vercel.app"; 
        }, 1500);
      } else {
        handleError(message);
      }
    } catch (error) {
      console.log(error);
    }
    setInputValue({
      ...inputValue,
      mobile: "",
      password: "",
      username: "",
    });
  };

  return (
    <>
      <div className="signupwrapper" onClick={() => setsignup(false)}></div>

      <div className="signup-modal">
        <div className="signup-content">
          <div className="left-section">
            <h1>
              Simple, Free <br /> Investing.
            </h1>
            <span className="intraday">Intraday</span>
          </div>

          <div className="right-section">
            <button className="close-btn" onClick={() => setsignup(false)}>
              ✕
            </button>

            <h2>{isLogin ? "Login to Zerodha" : "Welcome to Zerodha"}</h2>

            <button className="google-btn">
              Continue with Google
            </button>

            <div className="or-divider">
              <span></span>
              <p>Or</p>
              <span></span>
            </div>

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <input
                  type="text"
                  name="username"
                  value={username}
                  placeholder="Username"
                  onChange={handleOnChange}
                  required
                />
              )}
              <input
                type="text"
                name="mobile"
                value={mobile}
                placeholder="Mobile Number"
                onChange={handleOnChange}
                required
              />
              <input
                type="password"
                name="password"
                value={password}
                placeholder="Password"
                onChange={handleOnChange}
                required
              />

              <button type="submit" className="continue-btn">{isLogin ? "Login" : "Continue"}</button>
            </form>

            <p className="terms" style={{cursor:"pointer", color:"#4184f3"}} onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Don't have an account? Signup" : "Already have an account? Login"}
            </p>

            <p className="terms">
              By proceeding, I agree to <a href="/">T&C</a>,{" "}
              <a href="/">Privacy Policy</a> & <a href="/">Tariff Rates</a>
            </p>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default Sign;