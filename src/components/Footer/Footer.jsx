import React, { useState, useEffect } from 'react';
import './Footer.css';

import LinkedInIcon from '@mui/icons-material/LinkedIn';
import logo from '../../assets/img/Group 1000002447.svg'

import phoneIcon from '../../assets/img/phone-solid-full 1.svg'
import emailIcon from '../../assets/img/envelope-solid-full 1.svg'

const Footer = () => {
  return (
    <>
      <footer>
        <div className="footer-col">
          <div className="footer-logo">

            <img src={logo} />
          </div>
          <div className="contact-info">

            <img src={phoneIcon} />
            <span>
              +49 176 20092661</span>
          </div>
          <div className="contact-info">

            <img src={emailIcon} />
            <a href="mailto:info@waraq.com">info@waraq.com</a>
          </div>
          {/* <div className="social-icons">
            <LinkedInIcon />
            <a href="#"><i className="fab fa-linkedin"></i></a>
          </div> */}
            <div className="contact-info">

            <LinkedInIcon style={{fontSize:'13px'}} />

<span>
  +49 176 20092661</span>
</div>
        </div>

        <div className="footer-col services">
          <h3>Services</h3>
          <a href="#">Certified Translation</a>
          <a href="#">Professional Translation</a>
        </div>

        <div className="footer-col">
          <h3>Waraq Translation Agency</h3>
          <a href="#">Legal Notice</a>
          <a href="#">Privacy Policy</a>
        </div>

        <div className="footer-col">
          <p className="about-text">
            <strong>About us:</strong> We deliver high-quality, culturally nuanced translations in German, English, and Arabic.
            From certified documents to business content, our native-speaking linguists ensure accuracy and impact across languages.
          </p>


        </div>
      </footer>



      <div className="footer_under">
        <div className="footer-content">
          Copyright © 2025 Waraq Translation Agency. All Rights Reserved.
        </div>
      </div>
    </>

  );
};

export default Footer;
