import React from 'react';
import { Route, Routes, NavLink, Navigate } from 'react-router-dom';
import './finance.scss'
import { AiFillCaretRight } from "react-icons/ai";
import { ImHome } from "react-icons/im";
import { GiReceiveMoney } from "react-icons/gi";
import CompanyConcubinePage from '../../components/mali-isler/page/allConcubinePage/companyConcubinePage';
import DetailPage from '../../components/mali-isler/page/concubineDetail/detailPage';
import InvoiceUploadPage from '../../components/mali-isler/page/Uploads/invoiceUpload';
const Finance = () => {

  const navSlide = () => {
    const navButton = document.querySelector('.nav-btn-toggle');
    const bodyContainer = document.querySelector('.body-container');

    navButton.classList.toggle('toggle');
    navButton.classList.toggle('toggle-m');
    bodyContainer.classList.toggle('left')
  }


  return (

    <div className="page-component-pb">

      <div className='body-container left'>
        <div className='nav-btn' >
          <div className='nav-btn-toggle' onClick={navSlide} >
            <AiFillCaretRight />
          </div>
        </div>
        <nav className='side-bar bg-nav-top' style={{ border: 'none', fontFamily: 'sans-serif' }}>
          <ul>
            <li role="none">
              <NavLink end to='/mali-isler/'>
                <div>
                  <ImHome />
                </div>
                <div>
                  Ana Sayfa
                </div>
              </NavLink>
            </li>
            <li role="none">
              <NavLink end to='/mali-isler/cari-dokum'>
                <div>
                  <GiReceiveMoney />
                </div>
                <div>
                  Cari Döküm
                </div>
              </NavLink>
            </li>
            <li role="none">
              <NavLink end to='/mali-isler/invoice-upload'>
                <div>
                  <GiReceiveMoney />
                </div>
                <div>
                  Fatura Yükle
                </div>
              </NavLink>
            </li>
          </ul>
        </nav>
        <nav className='side-bar-min'>
          <ul>
            <li>
              <NavLink end to='/mali-isler/firma-islemleri' onClick={navSlide}>Finans İşlemleri</NavLink>
            </li>
          </ul>
        </nav>

        <div className='body-context' >

          <Routes>
            <Route index element={<div>AnaSayfa</div>} />
            <Route path='cari-dokum' element={<CompanyConcubinePage />} />
            <Route path='cari-dokum/detay' element={<DetailPage />} />
            <Route path='invoice-upload' element={<InvoiceUploadPage />} />
            <Route path="*" element={<Navigate to="/hata" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );

}

export default Finance;