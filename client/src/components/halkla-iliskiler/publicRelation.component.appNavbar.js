import React, { Fragment,  useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import { NavLink } from 'react-router-dom';
import './publicRelation.component.appNavbar.scss';


const AppNavbar = (props) => {
    const context = useContext(AuthContext);

    return (
        <Fragment>
            <nav className='bg-nav-top top-nav1' >
                <div className="navs-container">
                    <NavLink end to='/' className='logo-text'>
                        <span className='color-logo' style={{ letterSpacing: '0.5px', fontSize: '26px' }}>bodrum</span><span className='logo-text' style={{ color: 'white', letterSpacing: '0.5px', fontSize: '26px' }}>İSG</span>
                    </NavLink>
                </div>
                <div className="navs-right-container" >
                    <div className="navs-dropdown-container">
                        <div className="navs-profile-container">
                            <div>
                                <div className="navs-profile-menu">
                                    <button aria-expanded="false" className="navs-profile-menu-trigger">
                                        <span className="navs-profile-menu-trigger-span">
                                            {context.activeUser.user.name} {context.activeUser.user.surname}
                                        </span>
                                        <svg className="navs-dropdown-arrow-down" height="15" width="15" role="presentation" aria-hidden="true" alt="" viewBox="0 0 15 15">
                                            <path d="M8.67903 10.7962C8.45271 11.0679 8.04729 11.0679 7.82097 10.7962L4.63962 6.97649C4.3213 6.59428 4.5824 6 5.06866 6L11.4313 6C11.9176 6 12.1787 6.59428 11.8604 6.97649L8.67903 10.7962Z" fill="currentColor"></path>
                                        </svg>
                                    </button>
                                    <div data-leafygreen-ui="interaction-ring" className="leafygreen-ui-139eoox">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            {props.children}
        </Fragment>
    );
}

export default AppNavbar;