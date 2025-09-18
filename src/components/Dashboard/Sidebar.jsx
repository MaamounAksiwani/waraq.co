import React, { useEffect } from "react";
import { FaLeaf, FaHome, FaLayerGroup, FaHistory, FaCircle } from "react-icons/fa";
import "./Dashboard.css";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import { useNavigate } from 'react-router-dom';
import LabelImportantIcon from '@mui/icons-material/LabelImportant'


import logo from '../../assets/img/Subtraction 2.svg'

const Sidebar = ({ setActiveView, setActiveAdminView, activeAdminView }) => {
  const navigate = useNavigate();
  const loginType = localStorage.getItem("role");

  const logout = () => {
    localStorage.clear('jwtToken');
    navigate('/');
  }
  return (
    <>
      {loginType == 'ADMIN' ? <>
        <div className="sidebar">
          <div className="sidebar-logo">
            <img src={logo} al='no logo'/>
            
          </div>

          <div className="sidebar-nav">
            <p
              onClick={() => setActiveAdminView("home")}
              className={`nav-item ${setActiveAdminView === "home" ? "active" : ""}`}
            >
              <FaHome />
            </p>
            <p
              onClick={() => setActiveAdminView("Request")}
              className={`nav-item ${setActiveAdminView === "Request" ? "active" : ""}`}
            >
              <FaLayerGroup />
            </p>
            <p
              onClick={() => setActiveAdminView("Stamp")}
              className={`nav-item ${setActiveAdminView === "Stamp" ? "active" : ""}`}
            >
              <LabelImportantIcon/>
            </p>
            <p
              onClick={() => setActiveAdminView("historyDashboard")}
              className={`nav-item ${setActiveAdminView === "historyDashboard" ? "active" : ""}`}
            >
              <FaHistory />
            </p>

        
          </div>

          <div onClick={logout} className="sidebar-bottom" style={{ cursor: 'pointer' }}>
            <FaCircle />
          </div>
        </div>``

      </> :
        <div className="sidebar">
          <div className="sidebar-logo">
            {/* <FaLeaf /> */}
            <img src={logo} al='no logo'/>
          </div>
          <div className="sidebar-nav">
            <p onClick={() => setActiveView("management")} className="nav-item">
              <FaHome />
            </p>
            <p onClick={() => setActiveView("translator")} className="nav-item">
              <FaLayerGroup />
            </p>
            <p  onClick={() => setActiveView("Proofreading")} className="nav-item"><SpellcheckIcon /></p>


            <p onClick={() => setActiveView("history")} className="nav-item">
              <FaHistory />
            </p>
          </div>
          <div onClick={logout} className="sidebar-bottom" style={{ cursor: 'pointer' }}>
            <FaCircle />
          </div>
        </div>

      }

    </>
  );
};

export default Sidebar;
