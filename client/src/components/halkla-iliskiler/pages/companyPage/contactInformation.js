import React, { memo, Fragment, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'reactstrap';
import { MdCheckCircle, MdError, MdCircle, MdLibraryAdd } from "react-icons/md";
import { RiIndeterminateCircleFill } from "react-icons/ri";
import './contactInformation.scss'
import Contact from './contact';
import { useLazyQuery } from '@apollo/client';
import AddContact from '../../forms/addContact';
import { GET_COMPANY_BY_ID } from '../../../../GraphQL/Queries/company/company';
import { UsersContext } from '../../../../context/usersContext';
import { AuthContext } from '../../../../context/authContext';
//import toastr from 'toastr';

const ContactInformation = ({ selectedId }) => {

  const navigate = useNavigate();
  const { userLoading, getUsers, addUser, userState: { users, isLoading } } = useContext(UsersContext)
  const { signOut } = useContext(AuthContext);

  const [_getCompanyById, { loading: getContactsLoading }] = useLazyQuery(GET_COMPANY_BY_ID, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      getUsers(data.companyById.contacts)
      userLoading(false)
    },
    onError({ graphQLErrors }) {
      userLoading(false);
      const err = graphQLErrors[0].extensions;
      if (err.status && err.status == 401) {
        signOut()
        navigate('/portal-giris')
      }
    }
  });

  useEffect(() => {
    if (selectedId) {
      _getCompanyById({ variables: { "id": selectedId } })
      userLoading(true)
    }
  }, [selectedId])

  return (
    <Fragment>
      <div className='contact-form-frame frame' style={{ height: '300px' }}>
        <div className='form-containers'>

          <div className='form-header' >
            <div className='header'>
              <span>İletişim Listesi</span>
            </div>
            <div className='header-buttons'>
              <AddContact />
            </div>
          </div>
          <div className='table-header' >
            <ul className='header-container'>
              <li id='header1'>Adı Soyadı</li>
              <li id='headerN'></li>
              <li id='header2'>Görevi</li>
              <li id='header3'>E-mail</li>
              <li id='header4'>Telefon</li>
            </ul>
          </div>
          {isLoading && <Spinner color='primary' />}
          <div className='list'>
            {!isLoading ? !selectedId ? null : users ? users.map((contactInformation, index) => (
              <Contact key={index} contactInformation={contactInformation} />
            )) : null : null}
          </div>

          <div className='form-footer'>

          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default memo(ContactInformation);