import React, { useState, Fragment, useEffect, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import './anonymous.component.BottomNavbar.scss'
import { FaFacebookF, FaWhatsapp, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { FiPhone } from "react-icons/fi";
import { SlLocationPin } from "react-icons/sl";


const BottomNavbar = () => {
    return (
        <Fragment>
            <div id='bottom-navbar' className="bg-nav-top" >
                <div id='bottom-navbar-wrapper'>
                    <div id='first-content'>
                        <div className="header">
                            <span className='color-logo'>bodrum</span><span style={{ color: 'white' }} >İSG</span>
                        </div>
                        <div className="content">
                            <p className="title">İş Sağlığı ve Güvenliği bilincinin oluşması amacıyla, sunduğu hizmetten ödün vermeden, uzman kadro, bilgi, tecrübe ve teknolojiyi birleştirerek, işverenlere gerekli desteği sağlamak, hizmet kalitesiyle tercih edilen İş sağlığı ve Güvenliği özelliğini sürdürmek.</p>
                        </div>
                        <div className='bottom-content'>
                            <div className="image">
                                <FaFacebookF style={{ width: '18px', height: '18px' }} />
                            </div>
                            <div className="image">
                                <FaInstagram style={{ width: '20px', height: '20px' }} />
                            </div>
                            <div className="image">
                                <FaLinkedinIn style={{ width: '20px', height: '20px' }} />
                            </div>
                            <div className="image">
                                <FaWhatsapp style={{ width: '20px', height: '20px' }} />
                            </div>
                        </div>
                    </div>
                    <div id='second-content'>
                        <div className="header">
                            <span className='color-logo'>Hızlı Bağlantılar</span>
                            <ul>
                                <li>
                                    <NavLink target="_self" rel="" end to='/hakkimizda' className="menu-item-container" role="menuitem" aria-disabled="false" >
                                        Hakkımızda
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink target="_self" rel="" end to='/hakkimizda' className="menu-item-container" role="menuitem" aria-disabled="false" >
                                        Hizmetlerimiz
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink target="_self" rel="" end to='/hakkimizda' className="menu-item-container" role="menuitem" aria-disabled="false" >
                                        Kariyer
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink target="_self" rel="" end to='/iletisim' className="menu-item-container" role="menuitem" aria-disabled="false" >
                                        İletişim
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink target="_self" rel="" end to='/hakkimizda' className="menu-item-container" role="menuitem" aria-disabled="false" >
                                        Aydınlatma Metni
                                    </NavLink>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div id='third-content'>
                        <div className="header">
                            <span className='color-logo' >Faydalı Linkler</span>
                            <ul>
                                <li>
                                    <NavLink target="_blank" rel="noopener noreferrer" end to='https://isgkatip.csgb.gov.tr/' className="menu-item-container" role="menuitem" aria-disabled="false" >
                                        İsg-Katip
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink target="_blank" rel="noopener noreferrer" end to='https://www.csgb.gov.tr/isggm' className="menu-item-container" role="menuitem" aria-disabled="false" >
                                        İSGGM
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink target="_blank" rel="noopener noreferrer" end to='https://www.csgb.gov.tr/isgum' className="menu-item-container" role="menuitem" aria-disabled="false" >
                                        İSGÜM
                                    </NavLink>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div id='fourth-content'>
                        <div className="header">
                            <span className='color-logo'>İletişim</span>
                            <ul>
                                <li>
                                    <span><SlLocationPin style={{ width: '20px', height: '20px', color: 'coral', marginRight: '10px' }} />Yalıkavak Mahallesi 6221 Sokak 11/1 Bodrum/MUĞLA</span>
                                </li>
                                <li>
                                    <span><FiPhone style={{ width: '20px', height: '20px', color: 'coral', marginRight: '10px' }} />(252) 385 26 48</span>
                                </li>
                                <li>
                                    <span><MdOutlineEmail style={{ width: '20px', height: '20px', color: 'coral', marginRight: '10px' }} />info@yalikavakosgb.com</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div id='footer'>
                    © Copyright 2024 Bodrum Yalıkavak İş Sağlığı ve Güvenliği - Tüm hakları saklıdır.
                </div>
            </div>
        </Fragment>
    );
}

export default BottomNavbar;