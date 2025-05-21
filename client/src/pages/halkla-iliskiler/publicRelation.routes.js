import React, { useEffect, useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import AppNavbar from '../../components/halkla-iliskiler/publicRelation.component.appNavbar';
import Public from './publicRelations'


const OwnPublicRelations = () => {
    const navigate = useNavigate();
    const {signOut,activeUser} = useContext(AuthContext);

    useEffect(() => {
        if (activeUser.isLoading === false) {
            if (!activeUser.isAuthenticated || !activeUser.user.auth.status.includes('PublicRelations')) {
                signOut()
                navigate('/portal-giris')
            }
        }
    }, [activeUser.isLoading])

    return (
        activeUser.isAuthenticated ?
            <AppNavbar>
                <Public/>
            </AppNavbar>
        :
            null
    )
}

export default OwnPublicRelations;


