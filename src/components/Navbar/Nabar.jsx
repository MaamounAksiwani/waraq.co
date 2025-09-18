import React, { useState, useEffect } from 'react';
import './Navbar.css';
import PersonIcon from '@mui/icons-material/Person';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import logo from '../../assets/img/Group 1000002447.svg'
import userIcon from '../../assets/img/user-solid-full 1.svg'
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Link } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("jwtToken"));
  const [formData, setFormData] = useState({ name: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);


  const handleOpen = () => setShowForm(true);
  const handleClose = () => setShowForm(false);

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await axios.post(
          "http://51.20.91.71:8080/waraq/api/v1/auth/login",
          {
            email: formData.name,
            password: formData.password,
          }
        );

        const userData = response.data.data;
        const jwtToken = userData.jwtToken;
        const role = userData.role;
        localStorage.setItem("jwtToken", jwtToken);
        localStorage.setItem("role", role);
        

        // const jwtToken = localStorage.getItem("jwtToken");
        setShowForm(false);
        navigate("/dashboard");
      } catch (error) {
        console.error("Login failed:", error);

        let apiErrors = {};
        if (error.response) {
          const message = error.response.data.message?.toLowerCase() || "";
          apiErrors.password =  error.response.data.data
          // console.log('error login ' , error.response.data.data);
          // if (message.includes("email")) {
          //   apiErrors.name = "Email is incorrect";
          // } else if (message.includes("password")) {
          //   apiErrors.password = "Password is incorrect";
          // } else {
          //   apiErrors.password = "Invalid credentials, please try again";
          // }
        } else {
          apiErrors.password = "Network error, please try again later";
        }

        setErrors(apiErrors);
      }
    }
  };


  return (

    <>
      <nav
        style={{
          transition: 'background 0.3s ease',
          boxShadow:
            isScrolled ? '0 4px 10px rgba(0, 0, 0, 0.1)' : '',
        }}

        className="header_navbar">
        <nav className="nav-container">

          <div>
          </div>
          <div className="logo">
            <img src={logo} />
          </div>
          {token ? <>
            <Link to="/dashboard" className="login-btn">
               Dashboard
            </Link>
          </> :
            <div onClick={handleOpen} className='container-btn'>
              <img src={userIcon} />
              <p href="#" className="login-btn">Login</p>
            </div>}
        </nav>
      </nav>

      {showForm && (
        <div
          className="overlay modal"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="dialog"
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "12px",
              width: "90%",
              maxWidth: "450px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            }}
          >
            <h2 style={{ textAlign: "center", marginBottom: "20px", fontWeight: '300' }}>Login</h2>
            <form onSubmit={handleSubmit}>

              <div style={{ marginBottom: "15px" }}>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ccc",

                    background: '#F5F3F066',
                    borderRadius: "8px",
                  }}
                />
                {errors.name && (
                  <p style={{ color: "red", fontSize: "14px", fontWeight: '400', marginTop: '10px' }}>{errors.name}</p>
                )}
              </div>

              <div style={{ marginBottom: "15px", position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "10px 40px 10px 10px",
                    border: "1px solid #ccc",
                    background: '#F5F3F066',
                    borderRadius: "8px",
                  }}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    color: "#555",
                    // backgroundColor: errors.password ? 'red': 'green'
                    marginTop: errors.password ? "-10px" : "0",
                    // backgroundColor:'red',
                  }}
                >
                  {showPassword ? <VisibilityOff style={{ fontSize: '18px'  }} /> : <Visibility style={{ fontSize: '18px' }} />}
                </span>
                {errors.password && (
                  <p style={{ color: "red", fontSize: "14px", fontWeight: '400', marginTop: '10px' }}>
                    {errors.password}
                  </p>
                )}
              </div>

              <button
                type="submit"
                style={{
                  width: "100%",

                  background: "#3F302F",
                  color: "white",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Submit
              </button>
            </form>

            <button
              onClick={handleClose}
              style={{
                marginTop: "15px",
                width: "100%",
                background: "#f1f1f1",
                padding: "10px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

    </>



  );
};

export default Navbar;
