import React, { memo, Fragment,useContext} from 'react';
import { Spinner } from 'reactstrap';
import Insurance from './insurance';
import AddInsurance from '../../forms/addInsurance';
import { InsurancesContext } from '../../../../context/insurancesContext';
import { MdCheckCircle, MdError, MdCircle } from "react-icons/md";
import { RiIndeterminateCircleFill } from "react-icons/ri";
import './insuranceInformation.scss'

const InsuranceInformation = ({ selectedId, insurancesLoading}) => {
  const { insuranceState: { insurances } } = useContext(InsurancesContext);

  return (
    <Fragment>
      <div className='insurance-information i-form-frame frame'>
        <div className='form-containers'>
          <div className='form-header' >
            <div className='header'>
              <span>İşyeri Bilgileri</span>
            </div>
            <div className='header-buttons'>
              <AddInsurance />
            </div>
          </div>
          <div className='content'>
            <div className='table-header' >
              <ul className='header-container'>
                <li id='header1'>Sgk Sicil Numarası</li>
                <li id='header2'></li>
                <li id='header3'>T</li>
                <li id='header4'>P</li>
                <li id='header5'>Atama Durumu</li>
              </ul>
            </div>
            {insurancesLoading && <Spinner color='primary' />}
            <div className='list'>
              {selectedId && insurances.length > 0 ?
                insurances.filter(x => x.company == selectedId).map((insurance) =>
                  !insurancesLoading && <Insurance key={insurance._id} insurance={insurance} />
                )
                : null}
            </div>

            <div className='form-footer'>
              <div className='form-footer-container' style={{ display: 'flex', flexDirection: 'row', fontSize: '9px' }}>
                <div id='status'>
                  <div style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                    <svg stroke="currentColor" fill="#13aa52" strokeWidth="0" viewBox="0 0 112 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" >
                      <path d="M512 512H0V0h112v512z"></path>
                    </svg>
                    <span>: Aktif Sicil Dosyası</span>
                  </div>
                  <div style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                    <svg stroke="currentColor" fill="#ff8100" strokeWidth="0" viewBox="0 0 112 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" >
                      <path d="M512 512H0V0h112v512z"></path>
                    </svg>
                    <span>: Sicil Dosyasında Personel Yok</span>
                  </div>
                  <div style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                    <svg stroke="currentColor" fill="red" strokeWidth="0" viewBox="0 0 112 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" >
                      <path d="M512 512H0V0h112v512z"></path>
                    </svg>
                    <span>: Kapalı Sicil Dosyası</span>
                  </div>
                </div>
                <div className='media-min' style={{ paddingLeft: '20px' }}>
                  <div style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                    <span style={{ fontWeight: 'bold' }}>T</span><span >: Tehlike Sınıfı</span>
                  </div>
                  <div style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                    <span style={{ fontWeight: 'bold' }}>P</span><span>: Personel Sayısı</span>
                  </div>
                </div>
                <div className='media-min' style={{ paddingLeft: '20px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                  <div>
                    <MdCircle style={{ height: '1.28em', width: '1.28em', color: '#007bff' }} /><span>: Az Tehlikeli</span>
                  </div>
                  <div>
                    <MdCircle style={{ height: '1.28em', width: '1.28em', color: '#ff8100' }} /><span>: Tehlikeli</span>
                  </div>
                  <div>
                    <MdCircle style={{ height: '1.28em', width: '1.28em', color: 'red' }} /><span>: Çok Tehlikeli</span>
                  </div>
                </div>
                <div className='media-min' style={{ paddingLeft: '20px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                  <div>
                    <MdCheckCircle style={{ height: '1.28em', width: '1.28em', color: '#13aa52' }} /><span>: Atama Onaylı</span>
                  </div>
                  <div>
                    <MdError style={{ height: '1.28em', width: '1.28em', color: '#ff8100' }} /><span>: Atama Onay Bekliyor</span>
                  </div>
                  <div>
                    <RiIndeterminateCircleFill style={{ height: '1.28em', width: '1.28em', color: 'red' }} /><span>: Atama Yok</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default memo(InsuranceInformation);