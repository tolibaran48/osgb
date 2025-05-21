import React, { useContext } from 'react';
import { Route, Routes, NavLink, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './publicRelations.scss'
import CompanyPage from '../../components/halkla-iliskiler/pages/companyPage/companyPage';
import AuthenticationPage from '../../components/halkla-iliskiler/pages/authPage/authPage';
import ContractsPage from '../../components/halkla-iliskiler/pages/companyContracts/companyContracts';
import InsurancePage from '../../components/halkla-iliskiler/pages/insuranceList/insurancePage';
import OfferPage from '../../components/halkla-iliskiler/pages/offerPage/offerPage';
import WhatsAppPersonPage from '../../components/halkla-iliskiler/pages/whatsAppPage/whatsAppPersonPage';
import { AiFillCaretRight, AiFillShop } from "react-icons/ai";
import { ImHome } from "react-icons/im";
import { ImOffice } from "react-icons/im";
import { FaRegAddressCard } from "react-icons/fa";
import { useLazyQuery } from '@apollo/client';
import { AuthContext } from '../../context/authContext';
import { CompaniesContext } from '../../context/companiesContext';
import { InsurancesContext } from '../../context/insurancesContext';
import { GET_Insurances } from '../../GraphQL/Queries/insurances/insurance';
import { GET_COMPANIES } from '../../GraphQL/Queries/company/company';


const PublicRelations = () => {
  const navigate = useNavigate();
  const { signOut } = useContext(AuthContext);
  const { getInsurances, insuranceLoading } = useContext(InsurancesContext);
  const { getCompanies, companyLoading } = useContext(CompaniesContext);


  const navSlide = () => {
    const navButton = document.querySelector('.nav-btn-toggle');
    const bodyContainer = document.querySelector('.body-container');

    navButton.classList.toggle('toggle');
    navButton.classList.toggle('toggle-m');
    bodyContainer.classList.toggle('left')
  }

  const [_getCompanies, { loading: getCompaniesLoading }] = useLazyQuery(GET_COMPANIES, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      getCompanies(data.companies)
    },
    onError({ graphQLErrors }) {
      companyLoading(false);
      const err = graphQLErrors[0].extensions;
      if (err.status && err.status == 401) {
        signOut()
        navigate('/portal-giris')
      }
    }
  });

  const [_getInsurances, { loading: getInsurancesLoading }] = useLazyQuery(GET_Insurances, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      getInsurances(data.insurances);
    },
    onError({ graphQLErrors }) {
      insuranceLoading(false);
      const err = graphQLErrors[0].extensions;
      if (err.status && err.status == 401) {
        signOut()
        navigate('/portal-giris')
      }
    }
  });


  return (

    <div className="page-component-pb">

      <div className='body-container left'>
        <div className='nav-btn' >
          <div className='nav-btn-toggle' onClick={navSlide} >
            <AiFillCaretRight />
          </div>
        </div>
        <nav className='side-bar bg-nav-top' style={{ border: 'none', fontFamily: 'sans-serif', color: 'white' }}>
          <ul>
            <li role="none">
              <NavLink end to='/halkla-iliskiler/'>
                <div>
                  <ImHome />
                </div>
                <div>
                  Ana Sayfa
                </div>
              </NavLink>
            </li>
            <li role="none">
              <NavLink end to='/halkla-iliskiler/firma-islemleri'>
                <div>
                  <ImOffice />
                </div>
                <div>
                  Firma İşlemleri
                </div>
              </NavLink>
            </li>
            <li role="none">
              <NavLink end to='/halkla-iliskiler/sicil-islemleri'>
                <div>
                  <AiFillShop />
                </div>
                <div>
                  İşyeri İşlemleri
                </div>
              </NavLink>
            </li>
            <li role="none">
              <NavLink end to='/halkla-iliskiler/yetkilendirme-islemleri'>
                <div>
                  <FaRegAddressCard />
                </div>
                <div>
                  Yetkilendirme İşlemleri
                </div>
              </NavLink>
            </li>
            <li role="none">
              <NavLink end to='/halkla-iliskiler/teklif-islemleri'>
                <div>
                  <FaRegAddressCard />
                </div>
                <div>
                  Teklif İşlemleri
                </div>
              </NavLink>
            </li>
            <li role="none">
              <NavLink end to='/halkla-iliskiler/personel-islemleri'>
                <div>
                  <FaRegAddressCard />
                </div>
                <div>
                  Personel İşlemleri
                </div>
              </NavLink>
            </li>
            <li role="none">
              <NavLink end to='/halkla-iliskiler/firma-sozlesmeleri'>
                <div>
                  <FaRegAddressCard />
                </div>
                <div>
                  Sözleşmeler
                </div>
              </NavLink>
            </li>
          </ul>
        </nav>
        <nav className='side-bar-min'>
          <ul>
            <li>
              <NavLink end to='/halkla-iliskiler/firma-islemleri' onClick={navSlide}>Firma İşlemleri</NavLink>
              <NavLink end to='/halkla-iliskiler/sicil-islemleri' onClick={navSlide}>İşyeri İşlemleri</NavLink>
              <NavLink end to='/halkla-iliskiler/yetkilendirme-islemleri' onClick={navSlide}>Yetkilendirme İşlemleri</NavLink>
            </li>
          </ul>
        </nav>

        <div className='body-context' >

          <Routes>
            <Route index element={<div>AnaSayfa</div>} />
            <Route path='firma-islemleri' element={<CompanyPage _getCompanies={_getCompanies} getCompaniesLoading={getCompaniesLoading} _getInsurances={_getInsurances} getInsurancesLoading={getInsurancesLoading} />} />
            <Route path='sicil-islemleri' element={<InsurancePage _getInsurances={_getInsurances} getInsurancesLoading={getInsurancesLoading} />} />
            <Route path='yetkilendirme-islemleri' element={<AuthenticationPage />} />
            <Route path='personel-islemleri' element={<WhatsAppPersonPage />} />
            <Route path='teklif-islemleri' element={<OfferPage />} />
            <Route path='firma-sozlesmeleri' element={<ContractsPage />} />
            <Route path="*" element={<Navigate to="/hata" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );

}

export default PublicRelations;