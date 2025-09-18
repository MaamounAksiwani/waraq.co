import React, { useState, useEffect } from 'react';
import './HowITwork.css';

// 
import userLogo from '../../assets/img/user-duotone 1.svg';
import truckLogo from '../../assets/img/truck-fast-duotone 1.svg';
import fileImaport from '../../assets/img/file-import-duotone 1.svg';
import languageLogo from '../../assets/img/language-duotone 1.svg';


import personImage from '../../assets/HJ 1.png'
import settingLogo from '../../assets/img/svgexport-7 (92) 1.svg';


import logo_1 from '../../assets/img/Group.svg'
import logo_2 from '../../assets/img/svgexport-7 (95).svg';
import logo_3 from '../../assets/img/svgexport-7 (96).svg';
import logo_4 from '../../assets/img/svgexport-7 (94).svg'


import arrow from '../../assets/img/dark_arrow.svg'
import uplaodFile from '../../assets/img/uploadFile.svg'
const HowITwork = () => {
    return (

        <>


            <main className='main-how-it-works'>

                <div className='waves'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#fff" fillOpacity="1" d="M0,160L60,144C120,128,240,96,360,112C480,128,600,192,720,186.7C840,181,960,107,1080,64C1200,21,1320,11,1380,5.3L1440,0L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path></svg>
                    {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#fff" fill-opacity="1" d="M0,128L60,112C120,96,240,64,360,80C480,96,600,160,720,192C840,224,960,224,1080,186.7C1200,149,1320,75,1380,37.3L1440,0L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path></svg> */}
                    {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#fff" fill-opacity="1" d="M0,320L80,266.7C160,213,320,107,480,101.3C640,96,800,192,960,218.7C1120,245,1280,203,1360,181.3L1440,160L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path></svg> */}
                    {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#fff" fill-opacity="1" d="M0,224L80,240C160,256,320,288,480,277.3C640,267,800,213,960,192C1120,171,1280,181,1360,186.7L1440,192L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path></svg> */}

                </div>

                <div className="container_how_to_works">
                    <h2 className="section-title">How it works</h2>

                    <div className="process-flow">
                        <div className="process-step">
                            <div className="step-icon">
                                <img src={fileImaport} />

                            </div>
                            <h3 className="step-title">File<br />Submission</h3>
                            <p className="step-description">Simply submit your translation requests or documents online, and receive your completed translations directly through our client dashboard.</p>
                            <div className="arrow">

                                <img src={arrow} />
                            </div>
                        </div>

                        <div className="process-step">
                            <div className="step-icon">

                                <img src={userLogo} />

                            </div>
                            <h3 className="step-title">Assessment &<br />Assignment</h3>
                            <p className="step-description">Waraq Translation Agency assesses the documents to determine the difficulty level, then assigns the files to the translator who is best suited for the job.</p>
                            <div className="arrow">

                                <img src={arrow} />
                            </div>
                        </div>

                        <div className="process-step">
                            <div className="step-icon">


                                <img src={languageLogo} />
                            </div>
                            <h3 className="step-title">Translation &<br />Proofreading</h3>
                            <p className="step-description">The documents are translated by a professional, native-speaking translator and then carefully reviewed by a proofreader to ensure accuracy.</p>
                            <div className="arrow">

                                <img src={arrow} />
                            </div>
                        </div>

                        <div className="process-step">
                            <div className="step-icon">

                                <img src={truckLogo} />
                            </div>
                            <h3 className="step-title">Formatting &<br />Delivery</h3>
                            <p className="step-description">The documents are then formatted to match the original as closely as possible and, depending on the client's needs, stamped for official use.</p>
                        </div>
                    </div>
                </div>

                <div className="contact-container">
                    <div className="contact-left">

                        <div className="contact-image-wrapper">
                            <span className="circle_1"></span>

                            <div className="contact-image-clip">
                                <img src={personImage} className="contact-image" />
                            </div>

                            <span className="circle_2"></span>
                        </div>



                        <h2>Get easily in touch</h2>
                        <p>We strive to respond to all inquiries as <br /> quickly as possible.</p>
                    </div>

                    <div className="contact-right">
                        <div className="form-card">
                            <div className="form-header">
                                <span className="form-icon">
                                    <img src={settingLogo} />
                                </span>
                                <h3>Receive a quote</h3>
                            </div>

                            <form>
                                <div className="form-row">
                                    <input type="text" placeholder="First Name" />
                                    <input type="text" placeholder="Last Name" />
                                </div>
                                <input type="email" placeholder="E-Mail" />
                                <input type="text" placeholder="Company Name - Subject" />
                                <textarea placeholder="Message"></textarea>

                                <div className="file-upload">
                                    <label htmlFor="file">
                                        <img src={uplaodFile} alt='' />
                                        Attach Files</label>
                                    <input type="file" id="file" hidden />
                                </div>

                                <div className="dialog-actions">
                                    <button className="send-btn" type='submit'>
                                        Send
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>


                <section className="section">
                    <div className="section-left">
                        <h2>More Reasons to use<br />Waraq Translation Agency:</h2>
                        <p>
                            Our translation services offer competitive pricing  and flexibility for any document,
                            format and industry-specific translation, with an easy online  process.
                        </p>
                        <button>Order Your Translation</button>
                    </div>

                    <div className="section-right">
                        <div className="card">
                            <div className="card-icon">
                                <img src={logo_4} />
                            </div>
                            <h3>QUALITY ASSURANCE</h3>
                            <p>Certified native-speaker translators deliver quality translations through strict quality control measures.</p>
                        </div>
                        <div className="card">
                            <div className="card-icon">

                                <img src={logo_3} />
                            </div>
                            <h3>SPEEDY DELIVERY</h3>
                            <p>We understand the importance of timely delivery, so we work efficiently to ensure that translations are delivered on schedule.</p>
                        </div>
                        <div className="card" >
                            <div className="card-icon">

                                <img src={logo_2} />
                            </div>
                            <h3>SECURITY</h3>
                            <p>We understand the importance of confidentiality and take all necessary measures to protect our customers’ information.</p>
                        </div>
                        <div className="card">
                            <div className="card-icon">

                                <img src={logo_1} />
                            </div>
                            <h3>CUSTOMER SUPPORT</h3>
                            <p>Dedicated customer support team available to answer questions, help with issues, and improve your experience.</p>
                        </div>
                    </div>
                </section>


            </main>

        </>



    );
};

export default HowITwork;
