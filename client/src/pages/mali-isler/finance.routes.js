import React, { useEffect, useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import AppNavbar from '../../components/mali-isler/finance.component.appNavbar';
import Finance from './finance'


const OwnFinance = () => {
    const navigate = useNavigate();
    const {signOut,activeUser} = useContext(AuthContext);

    useEffect(() => {
        if (activeUser.isLoading === false) {
            if (!activeUser.isAuthenticated || !activeUser.user.auth.status.includes('Finance')) {
                signOut()
                navigate('/portal-giris')
            }
        }
    }, [activeUser.isLoading])

    return (
        activeUser.isAuthenticated ?
            <AppNavbar>
                <Finance/>
            </AppNavbar>
        :
            null
    )
}

export default OwnFinance;


