import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import Signup from "./signup/Signup";

function Navbar() {
  const [signup, setsignup] = useState(false);
  return (
    <div
      className="container-fluid"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "70px",   
        backgroundColor: "white",
        zIndex: 1000,
        borderBottom: "1px solid #eee"
      }}
    >

      
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: "100%",
          padding: "12px 24px"
        }}
      >
        {/* Logo (LEFT) */}
        <Link to="/">
        <img
          src="resourses/logo.svg"
          alt="logo"
          className="navbar-logo-img"
        />
        </Link>

        {/* Buttons (RIGHT) */}
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            paddingRight:"100px"
          }}
        >
          {/* <Link className="navlink" to="/signup">Signup</Link> */}
          <button className="navlink" style={{border:"none"}} onClick={()=> setsignup(true)}>Signup</button>
          {signup ? <Signup signup={signup} setsignup={setsignup} /> : null}
          <Link className="navlink" to="/about">About</Link>
          <Link className="navlink" to="/product">Products</Link>
          <Link className="navlink" to="/pricing">Pricing</Link>
          <Link className="navlink" to="/support">Support</Link>

          {/* Hamburger */}
          <Link to="/">
          <div style={{ cursor: "pointer", marginLeft: "8px" }}>
            <div style={{ height: "2px", width: "22px", backgroundColor: "#000", margin: "5px 0" }} />
            <div style={{ height: "2px", width: "22px", backgroundColor: "#000", margin: "5px 0" }} />
            <div style={{ height: "2px", width: "22px", backgroundColor: "#000", margin: "5px 0" }} />
          </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
