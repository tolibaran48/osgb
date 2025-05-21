import React, { useState, Fragment, useEffect, useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import LogOut from './anonymous.component.AppNavbar.LogOut'
import './anonymous.component.AppNavbar.scss'
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";


const AppNavbar = (props) => {
    const location = useLocation();
    const context = useContext(AuthContext);
    const [isAuthenticated, setauthenticate] = useState(context.activeUser.isAuthenticated);
    const [user, setuser] = useState(context.activeUser.user);
    const [link, setLink] = useState();

    const [kr, setkr] = useState(false);
    const [dan, setDan] = useState(false);
    const [ka, setKar] = useState(false);

    useEffect(() => {
        setauthenticate(context.activeUser.isAuthenticated)
        setuser(context.activeUser.user)
    }, [context])

    useEffect(() => {
        if (location.pathname === '/hakkimizda' || location.pathname === '/iletisim') {
            setkr(true)
            setDan(false)
            setKar(false)
        }
        else if (location.pathname === '/is-guvenligi-uzmani' || location.pathname === '/isyeri-hekimi' || location.pathname === '/saglik-personeli' || location.pathname === '/danismanlik-hizmetleri' || location.pathname === '/laboratuvar-hizmetleri') {
            setkr(false)
            setDan(true)
            setKar(false)
        }
        else if (location.pathname === '/acik-pozisyonlar' || location.pathname === '/ik-basvuru') {
            setkr(false)
            setDan(false)
            setKar(true)
        }
        else {
            setkr(false)
            setDan(false)
            setKar(false)
        }
    }, [location.pathname])


    const navSlide = () => {
        const burger = document.querySelector('.burger');
        const dropdown = document.querySelector('.top-nav .dropdown');
        const containers = document.querySelectorAll('.top-nav .dropdown .navs-dropdown-container');

        dropdown.classList.toggle('nav-active')

        containers.forEach((container, indexs) => {
            const links = container.querySelectorAll('.navs-dropdown-button, .navs-profile-menu');
            const contexts = container.querySelectorAll('li');

            const contextLength = contexts.length;

            links.forEach((link, indexi) => {
                if (link.style.animation) {
                    link.style.animation = ''
                } else {
                    link.style.animation = `navLinkFade 0.6s ease forwards ${.3 * indexs + .4}s`
                }
                contexts.forEach((context, index) => {
                    if (context.style.animation) {
                        context.style.animation = ''
                    } else {
                        context.style.animation = `navLinkFade 0.6s ease forwards ${((.3 / contextLength) * index) + (.3 * indexs + .5)}s`

                    }
                })
            })
        })
        burger.classList.toggle('toggle')
    }


    return (
        <Fragment>
            <div style={{ position: 'relative' }}>
                <nav className="top-social-nav">

                    <div style={{ display: "flex", gap: '3rem', alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'right', gap: '.5rem' }}>
                            <div style={{ color: 'coral', fontSize: 'large' }}>
                                <MdEmail />
                            </div>
                            <div style={{ fontSize: 'small', alignContent: 'center' }}>info@yalikavakosgb.com</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'right', gap: '.5rem' }}>
                            <div style={{ color: 'coral', fontSize: 'small' }}>
                                <FaPhoneAlt />
                            </div>
                            <div style={{ fontSize: 'small' }}>(252) 385 48 52</div>
                        </div>
                    </div>
                </nav>
                <nav className="top-nav bg-nav-top" >
                    <div className="navs-container">
                        <NavLink end to='/' className='logo-link ' style={{ textDecoration: 'none', fontSize: '26px' }}>
                            {//<img className='logo' src={yalikavaklogo}  style={{height:'58px'}}  alt='Yalıkavak OSGB Logo'/>
                            }
                            <span className='color-logo' style={{ letterSpacing: '0.5px' }}>bodrum</span><span style={{ color: 'white', letterSpacing: '0.5px' }}>İSG</span>
                        </NavLink>
                    </div>
                    <div className="navs-right-container dropdown" >
                        <div className="navs-dropdown-container" >
                            <NavLink end to='/' className="navs-dropdown-button navs-link leafygreen-ui-j5o9j6">
                                <span className="navs-span leafygreen-ui-j752ew link">
                                    Anasayfa
                                </span>
                            </NavLink>
                        </div>
                        <div className="navs-dropdown-container kurumsal" onMouseLeave={() => setLink()}>
                            <button className={`navs-dropdown-button ${"kurumsal" === link && 'hover'} ${kr === true && 'active'}`} onMouseEnter={() => setLink("kurumsal")}>
                                <span className="navs-dropdown-span leafygreen-ui-1aw9qp1">
                                    <span className='link'>Kurumsal</span>
                                    <svg className="navs-dropdown-arrow-down leafygreen-ui-rqvbr6" height="15" width="15" role="presentation" aria-hidden="true" alt="" viewBox="0 0 15 15">
                                        <path d="M8.67903 10.7962C8.45271 11.0679 8.04729 11.0679 7.82097 10.7962L4.63962 6.97649C4.3213 6.59428 4.5824 6 5.06866 6L11.4313 6C11.9176 6 12.1787 6.59428 11.8604 6.97649L8.67903 10.7962Z" fill="currentColor"></path>
                                    </svg>
                                </span>
                            </button>
                            <div className={`menu-include ${"kurumsal" === link && 'hover'}`} id='menu-include'>
                                <div>
                                    <div className="menu-container">
                                        <ul className="menu" role="menu">
                                            <li role="none">
                                                <NavLink target="_self" rel="" end to='/hakkimizda' className="menu-item-container" role="menuitem" aria-disabled="false">
                                                    <div className="menu-item">
                                                        <div>
                                                            Hakkımızda
                                                        </div>
                                                    </div>
                                                </NavLink>
                                            </li>
                                            <li role="none">
                                                <NavLink target="_self" rel="" end to='/iletisim' className="menu-item-container" role="menuitem" aria-disabled="false">
                                                    <div className="menu-item">
                                                        <div>
                                                            İletişim
                                                        </div>
                                                    </div>
                                                </NavLink>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="navs-dropdown-container danismanlik" onMouseLeave={() => setLink()}>
                            <button className={`navs-dropdown-button ${"danismanlik" === link && 'hover'}  ${dan === true && 'active'}`} id="danismanlik" onMouseEnter={() => setLink("danismanlik")} >
                                <span className="navs-dropdown-span ">
                                    <span className='link'>Hizmetlerimiz</span>
                                    <svg className="navs-dropdown-arrow-down " height="15" width="15" role="presentation" aria-hidden="true" alt="" viewBox="0 0 15 15">
                                        <path d="M8.67903 10.7962C8.45271 11.0679 8.04729 11.0679 7.82097 10.7962L4.63962 6.97649C4.3213 6.59428 4.5824 6 5.06866 6L11.4313 6C11.9176 6 12.1787 6.59428 11.8604 6.97649L8.67903 10.7962Z" fill="currentColor"></path>
                                    </svg>
                                </span>
                            </button>
                            <div className={`menu-include ${"danismanlik" === link && 'hover'}`} id='menu-include'>
                                <div >
                                    <div className="menu-container">
                                        <ul className="menu" role="menu">
                                            <li role="none">
                                                <NavLink target="_self" rel="" end to='/is-guvenligi-uzmani' className="menu-item-container" role="menuitem" aria-disabled="false">
                                                    <div className="menu-item">
                                                        <div>
                                                            İş Güvenliği Uzmanı
                                                        </div>
                                                    </div>
                                                </NavLink>
                                            </li>
                                            <li role="none">
                                                <NavLink target="_self" rel="" end to='/isyeri-hekimi' className="menu-item-container" role="menuitem" aria-disabled="false">
                                                    <div className="menu-item">
                                                        <div>
                                                            İşyeri Hekimliği
                                                        </div>
                                                    </div>
                                                </NavLink>
                                            </li>
                                            <li role="none">
                                                <NavLink target="_self" rel="" end to='/saglik-personeli' className="menu-item-container" role="menuitem" aria-disabled="false">
                                                    <div className="menu-item">
                                                        <div>
                                                            Sağlık Personeli
                                                        </div>
                                                    </div>
                                                </NavLink>
                                            </li>
                                            <li role="none">
                                                <NavLink target="_self" rel="" end to='/danismanlik-hizmetleri' className="menu-item-container" role="menuitem" aria-disabled="false">
                                                    <div className="menu-item">
                                                        <div>
                                                            Danışmanlık
                                                        </div>
                                                    </div>
                                                </NavLink>
                                            </li>
                                            <li role="none">
                                                <NavLink target="_self" rel="" end to='/laboratuvar-hizmetleri' className="menu-item-container" role="menuitem" aria-disabled="false">
                                                    <div className="menu-item">
                                                        <div>
                                                            Laboratuvar
                                                        </div>
                                                    </div>
                                                </NavLink>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="navs-dropdown-container kariyer" onMouseLeave={() => setLink()}>
                            <button className={`navs-dropdown-button ${"kariyer" === link && 'hover'} ${ka === true && 'active'}`} onMouseEnter={() => setLink("kariyer")}>
                                <span className="navs-dropdown-span ">
                                    <span className='link'>Kariyer</span>
                                    <svg className="navs-dropdown-arrow-down " height="15" width="15" role="presentation" aria-hidden="true" alt="" viewBox="0 0 15 15">
                                        <path d="M8.67903 10.7962C8.45271 11.0679 8.04729 11.0679 7.82097 10.7962L4.63962 6.97649C4.3213 6.59428 4.5824 6 5.06866 6L11.4313 6C11.9176 6 12.1787 6.59428 11.8604 6.97649L8.67903 10.7962Z" fill="currentColor"></path>
                                    </svg>
                                </span>
                            </button>
                            <div className={`menu-include ${"kariyer" === link && 'hover'}`} id='menu-include'>
                                <div >
                                    <div className="menu-container">
                                        <ul className="menu" role="menu">
                                            <li role="none">
                                                <NavLink target="_self" rel="" end to='/acik-pozisyonlar' className="menu-item-container" role="menuitem" aria-disabled="false">
                                                    <div className="menu-item">
                                                        <div>
                                                            Açık Pozisyonlar
                                                        </div>
                                                    </div>
                                                </NavLink>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="navs-dropdown-container" >
                            <NavLink end to='/sikca-sorulan-sorular' className="navs-dropdown-button navs-link leafygreen-ui-j5o9j6">
                                <span className="navs-span leafygreen-ui-j752ew">
                                    <span className='link'>SSS</span>
                                </span>
                            </NavLink>
                        </div>
                        <div className="navs-dropdown-container">
                            <div className="navs-profile-container" onMouseLeave={() => setLink()}>
                                <div style={{ height: '100%' }}>
                                    <div className="navs-profile-menu">

                                        {isAuthenticated ?
                                            <button aria-expanded="false" className="navs-profile-menu-trigger" onMouseEnter={() => setLink("profile")}>
                                                <span className="navs-profile-menu-trigger-span">
                                                    {user.name} {user.surname}
                                                </span>
                                                <svg className="leafygreen-ui-1latwn6" height="15" width="15" role="presentation" aria-hidden="true" alt="" data-leafygreen-ui="icon-data-prop" viewBox="0 0 16 16">
                                                    <path d="M8.67903 10.7962C8.45271 11.0679 8.04729 11.0679 7.82097 10.7962L4.63962 6.97649C4.3213 6.59428 4.5824 6 5.06866 6L11.4313 6C11.9176 6 12.1787 6.59428 11.8604 6.97649L8.67903 10.7962Z" fill="currentColor"></path>
                                                </svg>
                                            </button>
                                            :
                                            <NavLink end to='/portal-giris' type='button' className="navs-profile-menu-trigger" >
                                                <span className="navs-profile-menu-trigger-span">
                                                    Giriş Yap
                                                </span>
                                            </NavLink>
                                        }
                                        {isAuthenticated &&
                                            (
                                                <div className={`menu-include ${"profile" === link && 'hover'}`} id='menu-include' >
                                                    <div>
                                                        <div className="menu-container">
                                                            <ul className="menu" role="menu">
                                                                {user.auth.type === 'Own' &&
                                                                    (<Fragment>
                                                                        {user.auth.status.includes('Adminisration') &&
                                                                            (<li role="none">
                                                                                <NavLink target="_self" rel="" end to='/yonetim-paneli' className="menu-item-container" role="menuitem" aria-disabled="false">
                                                                                    <div className='menu-item'>
                                                                                        <div>
                                                                                            Yönetim Paneli
                                                                                        </div>
                                                                                    </div>
                                                                                </NavLink>
                                                                            </li>)}
                                                                        {user.auth.status.includes('PublicRelations') &&
                                                                            (<li role="none">
                                                                                <NavLink target="_self" rel="" end to='/halkla-iliskiler/' className="menu-item-container" role="menuitem" aria-disabled="false">
                                                                                    <div className="menu-item">
                                                                                        <div>
                                                                                            Halkla İlişkiler
                                                                                        </div>
                                                                                    </div>
                                                                                </NavLink>
                                                                            </li>)}
                                                                        {user.auth.status.includes('Finance') &&
                                                                            (<li role="none">
                                                                                <NavLink target="_self" rel="" end to='/mali-isler/' className="menu-item-container" role="menuitem" aria-disabled="false">
                                                                                    <div className="menu-item">
                                                                                        <div>
                                                                                            Mali İşler
                                                                                        </div>
                                                                                    </div>
                                                                                </NavLink>
                                                                            </li>)}
                                                                        <li className='exit' role="none" style={{ borderTop: '1px solid dimgray' }}>
                                                                            <LogOut closeK={setkr} closeM={setDan} closeKa={setKar} />
                                                                        </li>
                                                                    </Fragment>)}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='burger' onClick={navSlide}>
                        <div className='line1'></div>
                        <div className='line2'></div>
                        <div className='line3'></div>
                    </div>
                </nav>
                {props.children}
            </div>
        </Fragment>
    );
}

export default AppNavbar;