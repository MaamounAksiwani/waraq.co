import React, { useState, useEffect } from 'react';
import './Hero.css';
import hereImage from '../../assets/img/WHP.svg'
import languageImage from '../../assets/img/Group 1.svg';
import codingLanguage from '../../assets/img/Group 2.svg'
import CheckIcon from '@mui/icons-material/Check'
import arrow from '../../assets/img/Vector.svg'
import checkIcon from '../../assets/img/material-symbols_check-small-rounded.svg'

import vector_arrow from '../../assets/img/Vector_arrow.svg'
import black_arrow from '../../assets/img/dark_arrow.svg'

const Hero = () => {
    return (

        <>
            <div className="container-hero">
                <div className="content">
                    <h1>Certified German, English & Arabic Translation Services</h1>
                    <p>At Waraq Translation Agency, we deliver accurate, timely,  and culturally precise certified translations for legal,  business, and personal documents worldwide.</p>
                    <a href="#" className="cta-button">Order Your Translation
                        <img src={arrow} />
                    </a>
                </div>

                <div className="illustration">
                    <img src={hereImage} />

                </div>
            </div>


            <div className="container">
                <div className="header">
                    <h1 className="main-title">
                        Reliable Translations for both your
                        Business Operations and Personal Needs
                    </h1>

                    <div className="features-list">
                        <div className="feature-item">

                            <img style={{ width: '24px', height: '24px' }} src={checkIcon} alt='' />

                            Quality translation</div>
                        <div className="feature-item">


                            <img style={{ width: '24px', height: '24px' }} src={checkIcon} alt='' />

                            Fast turnaround</div>
                        <div className="feature-item">

                            <img style={{ width: '24px', height: '24px' }} src={checkIcon} alt='' />
                            Competitive pricing</div>
                    </div>
                </div>

                <div className="services-grid">
                    <div className="service-card">
                        <img src={languageImage} />
                        <h2 className="service-title">Certified Translation</h2>
                        <p className="service-description">
                            Receive a certified and official translation for professional, legal or private reasons.
                        </p>
                        <ul className="service-features">
                            <div>
                                <img style={{ width: '15px', height: '15px' }} src={black_arrow} alt='' />
                                <li>Sworn & Notarized Translators</li>
                            </div>

                            <div>
                                <img style={{ width: '15px', height: '15px' }} src={black_arrow} alt='' />
                                <li>Accurate Translations</li>
                            </div>

                            <div>
                                <img style={{ width: '15px', height: '15px' }} src={black_arrow} alt='' />
                                <li>Time Saving & Convenient</li>

                            </div>
                        </ul>
                    </div>

                    <div className="service-card professional">
                        <img src={codingLanguage} />
                        <h2 className="service-title">Professional Translation</h2>
                        <p className="service-description">
                            Receive high quality translation from native-speaker translators. Proofreading service available.
                        </p>
                        <ul className="service-features">
                            <div>
                                <img style={{ width: '15px', height: '15px' }} src={vector_arrow} alt='' />
                                <li>

                                    Industry Specific Expertise</li>
                            </div>


                            <div>
                                <img style={{ width: '15px', height: '15px' }} src={vector_arrow} alt='' />

                                <li>
                                    Cultural Awareness</li>
                            </div>

                            <div>

                                <img style={{ width: '15px', height: '15px' }} src={vector_arrow} alt='' />
                                <li>
                                    Time Efficient</li>
                            </div>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Hero;
