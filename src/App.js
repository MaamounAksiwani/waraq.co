import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React , {useEffect} from 'react';
import Navbar from './components/Navbar/Nabar';
import Hero from './components/Hero/Hero';
import HowITwork from './components/HowITworks/HowITwork';
import Footer from './components/Footer/Footer';
import Dashboard from './components/Dashboard/Dashboard';
import { useNavigate } from 'react-router-dom';

import logo from './assets/img/Group 1000002447.svg'


const ProtectedRoute = ({ children }) => {
  const jwtToken = localStorage.getItem("jwtToken");
  const navigate = useNavigate();
  const handleBackClick = () => {
    navigate('/');
  };

  if (!jwtToken) {
    return (
      <>

        <nav
          style={{
            transition: 'background 0.3s ease',
          }}
          className="header_navbar">

          <nav className="nav-container">

            <div>
            </div>
            <div className="logo">
              <img src={logo} />
            </div>

            <div>

            </div>

          </nav>
        </nav>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
            fontSize: "18px",
            fontWeight: "500",
          }}
        >
          <p>
            You do not have permission to access this page login please
          </p>
          <button style={{
            marginTop: '20px',
            padding: '5px 30px',
            borderRadius: '2px',
            background: '#3F302F',
            cursor: 'pointer',
            color: "#FFF",
            border: '1px solid #3F302F'


          }}
            onClick={handleBackClick}>Back</button>
        </div>
        <Footer />

      </>
    );
  }

  return children;
};






function HomePage() {


useEffect(() => {
  window.scrollTo(0, 0)
}, []);


  return (
    <>
      <Navbar />
      <Hero />
      <HowITwork />
      <Footer />
    </>
  );
}
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />      </Routes>
    </BrowserRouter>
  );
}

export default App;
