import React, { useEffect, Fragment, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UsersContext } from '../../../../context/usersContext';
import { AuthContext } from '../../../../context/authContext';
import { useLazyQuery } from '@apollo/client';
import { GET_USERS } from '../../../../GraphQL/Queries/user/user';
import ContactList from './contactList';
import CompanyButtons from '../companyPage/companyButtons';
import ContactInformation from './contactInformation';
//import './companyPage.scss';

const ContactPage = () => {
  const navigate = useNavigate();
  const contextUser = useContext(UsersContext);
  const { signOut } = useContext(AuthContext);

  const [getUsers, { loading: getusersLoading }] = useLazyQuery(GET_USERS, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      contextUser.getUsers(data.users)
    },
    onError({ graphQLErrors }) {
      contextUser.userLoading(false);
      const err = graphQLErrors[0].extensions;
      if (err.status && err.status == 401) {
        signOut()
        navigate('/portal-giris')
      }
    }
  });

  useEffect(() => {
    getUsers()
    return () => {
      contextUser.resetUserPage();
    }
  }, [])

  return (
    <Fragment>
      <div className='part-header-container'>
        <div className='buttons' style={{ height: '100%' }}>
          <CompanyButtons />
        </div>
      </div>
      <div className='company-container'>
        <div className='list-container'>
          <ContactList getusersLoading={getusersLoading} />
        </div>
        <div className='content'>
          <ContactInformation />
        </div>
      </div>
    </Fragment>
  );
}

export default ContactPage;