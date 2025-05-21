import React, { Fragment, useState, useEffect } from 'react';
import { FaFacebookF, FaWhatsapp, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import './anonymous.page.Iletisim.scss'
import Inputmask from 'inputmask';

const Iletisim = () => {
  const MaskPhone = new Inputmask("(999) 999 99 99");
  const [companyNameValid, setCompanyNameValid] = useState({ status: null, message: null });
  const [companyPhoneNumberValid, setCompanyPhoneNumberValid] = useState({ status: null, message: null });
  const [companyMailValid, setCompanyMailValid] = useState({ status: null, message: null });
  const [companyMessageValid, setCompanyMessageValid] = useState({ status: null, message: null });

  const initial = {
    message: '',
    nameSurname: '',
    EmailAdress: '',
    phoneNumber: ''
  }

  const [createFormValues, setCreateFormValues] = useState(initial)

  function init() {
    var myMap = new ymaps.Map('map', {
      center: [37.102518, 27.294760],
      zoom: 17,
      controls: ['zoomControl']
    }),

      placemark = new ymaps.Placemark([37.102518, 27.294760], {
        iconContent: "bodrumİSG",
        hintContent: "İş Sağlığı ve Güvenliği Hizmetleri"
      }, {
        // Disabling the replacement of the conventional balloon with the balloon panel.
        balloonPanelMaxMapArea: 0,
        draggable: false,
        preset: "islands#orangeStretchyIcon",
        // Making the balloon open even if there is no content.
        openEmptyBalloon: false
      });


    myMap.geoObjects
      .add(placemark)
  }
  const ymaps = window.ymaps;

  useEffect(() => {
    ymaps.ready(init);
  }, [])



  const onCreateCompanySubmit = async e => {
    e.preventDefault();
    let error = { status: false, message: [] };

    const { nameSurname, message, EmailAdress, phoneNumber } = createFormValues;
    let newName = '';
    let newAdress = '';
    let newVergiDairesi = '';
    try {
      const validateForm = new Promise((resolve, reject) => {
        if (!nameSurname) {
          setCompanyNameValid({ status: 'is-invalid', message: 'İsim Soyisim girilmesi zorunludur' })
          error = { ...error, status: true, message: [...error.message, 'İsim Soyisim girilmesi zorunludur'] }
        }
        else {
          let nameReplace = nameSurname.trim().replace(/(\s)+/g, "$1");
          const arr = nameReplace.split(" ");
          arr.forEach(
            (i, index) =>
              newName = newName + ' ' + (i[0].toLocaleUpperCase() + i.slice(1).toLocaleLowerCase())
          )
          setCompanyNameValid({ status: 'is-valid', message: null })
        }
        if (phoneNumber) {
          if (phoneNumber.includes("_")) {
            setCompanyPhoneNumberValid({ status: 'is-invalid', message: 'Telefon numarasını kontrol edin' })
            error = { ...error, status: true, message: [...error.message, 'Telefon numarasını kontrol edin'] }
          }
          else {
            setCompanyPhoneNumberValid({ status: 'is-valid', message: null })
          }
        }
        else {
          setCompanyPhoneNumberValid({ status: 'is-invalid', message: 'Telefon numarası girilmesi zorunludur' })
          error = { ...error, status: true, message: [...error.message, 'Telefon Numarası girilmesi zorunludur'] }
        }
        if (EmailAdress) {
          if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(EmailAdress)) {
            setCompanyMailValid({ status: 'is-valid', message: null })
          }
          else {
            setCompanyMailValid({ status: 'is-invalid', message: 'Email adresini kontrol edin' })
            error = { ...error, status: true, message: [...error.message, 'Email adresini kontrol edin'] }
          }
        }
        else {
          setCompanyMailValid({ status: 'is-invalid', message: 'Email adresi girilmesi zorunludur' })
          error = { ...error, status: true, message: [...error.message, 'Email adresi girilmesi zorunludur'] }
        }
        if (!message) {
          setCompanyMessageValid({ status: 'is-invalid', message: 'İçerik girilmesi zorunludur' })
          error = { ...error, status: true, message: [...error.message, 'İçerik girilmesi zorunludur'] }
        }
        else {
          let daireReplace = message.trim().replace(/(\s)+/g, "$1");
          const arr = daireReplace.split(" ");
          arr.forEach(
            (i, index) =>
              newVergiDairesi = newVergiDairesi + ' ' + (i[0].toLocaleUpperCase() + i.slice(1).toLocaleLowerCase())
          )
          setCompanyMessageValid({ status: 'is-valid', message: null })
        }
        resolve(error);
      })


      validateForm.then((error) => {
        if (error.status === false) {
          //addCompany({ variables: { data: { name: newName.trim(), adress: newAdress.trim(), vergi: { vergiDairesi: newVergiDairesi.trim(), vergiNumarasi: vergi.vergiNumarasi } } } })

        }
        else {
          for (let mes of error.message) {
          }
        }
      })

    } catch (err) {

    }
  }

  return (

    <Fragment>
      <div id='iletisim-wrapper'>
        <div className='header'>
          <h2>İletişim</h2>
        </div>
        <div id='content'>
          <div className='rows'>
            <div id='rows-form-content' x-lg="6" lg="6" md="6" sm="12">
              <div  >
                <div id='header'><h4>İLETİŞİM FORMU</h4></div>
                <form id='Iletisim' onSubmit={onCreateCompanySubmit} style={{background:'aliceblue'}}>
                  <fieldset>
                    <div className='input'>
                      <input className={`form-control  ${companyNameValid.status}`}
                        id="nameSurname"
                        autoComplete="off"
                        placeholder="Ad Soyad"
                        value={createFormValues.nameSurname}
                        onChange={(e) => setCreateFormValues({ ...createFormValues, nameSurname: e.target.value })}
                      />
                      <div className="invalid-feedback mt-0">
                        {companyNameValid.message}
                      </div>
                    </div>
                  </fieldset>
                  <fieldset >
                    <div className='input'>
                      <input className={`form-control  ${companyPhoneNumberValid.status}`}
                        id="phoneNumber"
                        autoComplete="off"
                        placeholder="Telefon Numarası"
                        value={createFormValues.phoneNumber}
                        onChange={(e) => setCreateFormValues({ ...createFormValues, phoneNumber: e.target.value })}
                        onFocus={(e) => MaskPhone.mask(e.target)}
                      />
                      <div className="invalid-feedback mt-0">
                        {companyPhoneNumberValid.message}
                      </div>
                    </div>
                  </fieldset>
                  <fieldset >
                    <div className='input'>
                      <input className={`form-control   ${companyMailValid.status}`}
                        id="EmailAddress"
                        autoComplete="off"
                        placeholder="E-mail"
                        value={createFormValues.EmailAddress}
                        onChange={(e) => setCreateFormValues({ ...createFormValues, EmailAdress: e.target.value })}
                      />
                      <div className="invalid-feedback mt-0">
                        {companyMailValid.message}
                      </div>
                    </div>
                  </fieldset>
                  <fieldset >
                    <div className='input'>
                      <textarea
                        rows='5'
                        className={`form-control  ${companyMessageValid.status}`}
                        type='textarea'
                        autoComplete="off"
                        placeholder="Mesajınız..."
                        id='Message'
                        value={createFormValues.message}
                        onChange={(e) => setCreateFormValues({ ...createFormValues, message: e.target.value })}
                      />
                      <div className="invalid-feedback mt-0">
                        {companyMessageValid.message}
                      </div>
                    </div>
                  </fieldset>

                  <div className='form-footer' style={{ border: 'none' }}>
                    <button type='submit' form='Iletisim' className='btn'  >Kaydet</button>
                  </div>
                </form>
              </div>
            </div>
            <div id='rows-adress-content' x-lg="6" lg="6" md="6" sm="12">
              <div id='adress-wrapper'>
                <div>
                  <h4>ADRES</h4>
                  <address>
                    Yalıkavak Mahallesi 6221. Sokak 11/1-2<br />
                    Bodrum/Muğla-TÜRKİYE
                  </address>
                </div>
                <div>
                  <h4>EMAİL</h4>
                  <address>
                    <a href="mailto:info@yalikavakosgb.com">info@yalikavakosgb.com</a>
                  </address>
                </div>
                <div id='adress-social'>
                  <h4>SOSYAL MEDYA</h4>
                  <div id='address-social-content'>
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
              </div>
            </div>            
          </div>          
        </div>
        <div style={{display:'flex',justifyContent:'center',paddingBottom:'4rem'}}>
        <div className='rows' style={{width:'100%',display:'flex',justifyContent:'center'}}>
    <div x-lg="7" lg="7" md="7" sm="11">
         <div  id="map" style={{height: '25rem', position: 'relative',display:"inline-table",background:'white',padding:"5px",boxShadow: "rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px" }} ></div>
         </div>
      </div>
        </div>
        

      </div>
    </Fragment>
  );

}
//<div x-lg="9" lg="10" md="12" sm="12">
//         <div id="map" style={{height: '25rem', position: 'relative' }} ></div>
//      </div>
export default Iletisim;