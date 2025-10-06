import React, { Fragment, useState, useEffect } from 'react';
import { FaFacebookF, FaWhatsapp, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import './anonymous.page.Iletisim.scss'
import Inputmask from 'inputmask';
import { CREATE_OTP, VALID_OTP } from '../../GraphQL/Mutations/otp/otp';
import { CREATE_CONVERSATION } from '../../GraphQL/Mutations/conversation/conversation';
import { useMutation, useLazyQuery } from '@apollo/client';
import toastr, { error } from 'toastr';
import { Spinner } from 'reactstrap';
//import { GET_LOCATIONS } from '../../GraphQL/Queries/insurances/insuranceLocation';

const Iletisim = () => {
  const MaskPhone = new Inputmask("(999) 999 99 99");
  const [myMap, setMyMap] = useState();
  //const [locations, setLocations] = useState();
  const [otpValid, setOtpValid] = useState({ status: null, message: null });
  const [NameValid, setNameValid] = useState({ status: null, message: null });
  const [PhoneNumberValid, setPhoneNumberValid] = useState({ status: null, message: null });
  const [MailValid, setMailValid] = useState({ status: null, message: null });
  const [MessageValid, setMessageValid] = useState({ status: null, message: null });

  const [createConversationLoading, setCreateConversationLoading] = useState(false);
  const [validOtpLoading, setValidOtpLoading] = useState(false);

  const initial = {
    message: '',
    name: '',
    EmailAdress: '',
    phoneNumber: '',
    otpVisibility: false
  }


  const resetForm = () => {
    setCreateFormValues(initial)
    setOtpValid({ status: null, message: null })
    setNameValid({ status: null, message: null })
    setPhoneNumberValid({ status: null, message: null })
    setMailValid({ status: null, message: null })
    setMessageValid({ status: null, message: null })
  }
  const [createFormValues, setCreateFormValues] = useState(initial)

  /*const [getLocations] = useLazyQuery(GET_LOCATIONS, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      setLocations(data.insuranceLocations)

      data.insuranceLocations.forEach(
        (point, index) => {
          let placemark = new ymaps.Placemark(point.location.coordinates, {
            iconContent: `${point.insurance.descriptiveName}`,
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
      )


    },
    onError({ graphQLErrors }) {
      const err = graphQLErrors[0].extensions;
    }
  });*/

  const [createConversation] = useMutation(CREATE_CONVERSATION, {
    onCompleted: (data) => {
      toastr.success('Talebiniz başarıyla iletilmiştir', 'BAŞARILI')
      resetForm()
    },
    onError({ graphQLErrors }) {
      //console.log(graphQLErrors[0].extensions)
      const err = graphQLErrors[0].extensions;
    }
  });

  const [createOtp] = useMutation(CREATE_OTP, {
    onCompleted: (data) => {
      let otp = data.createOtp
      setCreateConversationLoading(false)
      setCreateFormValues({ ...createFormValues, otp: data.createOtp, otpVisibility: true })
      if (data.createOtp.responseStatus == null) {
        setOtpValid({ status: 'not-valid', message: `Telefonunuza gelen SMS doğrulama kodunu girin` })
      }
      else {
        setOtpValid({ status: 'is-invalid', message: otp.error })
      }

    },
    onError({ graphQLErrors }) {
      setCreateConversationLoading(false)
      const err = graphQLErrors[0].extensions;
      toastr.success(err, 'BAŞARILI')
    }
  });

  const [validOtp] = useMutation(VALID_OTP, {
    onCompleted: (data) => {
      setValidOtpLoading(false)
      setCreateFormValues({ ...createFormValues, otp: data.validOtp })
      let otp = data.validOtp
      if (otp.responseStatus == null) {
        setOtpValid({ status: 'is-valid', message: `Lütfen SMS şifresini doğrulayın` })
      }
      else if (otp.responseStatus == 'error') {
        setOtpValid({ status: 'is-invalid', message: otp.error })
        if (otp.status == 'Aborted') {
          resetForm()
          toastr.error('Doğrulama kodunuz iptal edilmiştir', 'HATA')
        }
      }
      else if (otp.responseStatus == 'success') {
        setOtpValid({ status: 'is-valid', message: '' })
        createConversation({ variables: { data: { phone: createFormValues.phoneNumber.replaceAll(/[^0-9]/gi, ""), type: 'iletisim', e_mail: createFormValues.EmailAdress, name: createFormValues.name, message: createFormValues.message, otpId: createFormValues.otp.otpId } } })
      }
    },
    onError({ graphQLErrors }) {
      setValidOtpLoading(false)
      const err = graphQLErrors[0].extensions;
      toastr.error(err, 'HATA')
    }
  });

  function init() {
    setMyMap(new ymaps.Map('map', {
      center: [37.102518, 27.294760],
      zoom: 17,
      controls: ['zoomControl']
    }))


  }
  const ymaps = window.ymaps;

  useEffect(() => {
    ymaps.ready(init);
  }, [])

  useEffect(() => {
    if (myMap) {
      // getLocations()

      let placemark = new ymaps.Placemark([37.102518, 27.294760], {
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
  }, [myMap])



  const onCreateConversationSubmit = async e => {
    e.preventDefault();
    setCreateConversationLoading(true)
    let error = { status: false, message: [] };

    const { name, message, EmailAdress, phoneNumber } = createFormValues;
    let newName = '';
    try {
      const validateForm = new Promise((resolve, reject) => {
        if (!name) {
          setNameValid({ status: 'is-invalid', message: 'İsim Soyisim girilmesi zorunludur' })
          error = { ...error, status: true, message: [...error.message, 'İsim Soyisim girilmesi zorunludur'] }
        }
        else {
          let nameReplace = name.trim().replace(/(\s)+/g, "$1");
          const arr = nameReplace.split(" ");
          arr.forEach(
            (i, index) =>
              newName = newName + ' ' + (i[0].toLocaleUpperCase() + i.slice(1).toLocaleLowerCase())
          )
          setNameValid({ status: 'is-valid', message: null })
        }
        if (phoneNumber) {
          if (phoneNumber.includes("_")) {
            setPhoneNumberValid({ status: 'is-invalid', message: 'Telefon numarasını kontrol edin' })
            error = { ...error, status: true, message: [...error.message, 'Telefon numarasını kontrol edin'] }
          }
          else {
            setPhoneNumberValid({ status: 'is-valid', message: null })
          }
        }
        else {
          setPhoneNumberValid({ status: 'is-invalid', message: 'Telefon numarası girilmesi zorunludur' })
          error = { ...error, status: true, message: [...error.message, 'Telefon Numarası girilmesi zorunludur'] }
        }
        if (EmailAdress) {
          if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(EmailAdress)) {
            setMailValid({ status: 'is-valid', message: null })
          }
          else {
            setMailValid({ status: 'is-invalid', message: 'Email adresini kontrol edin' })
            error = { ...error, status: true, message: [...error.message, 'Email adresini kontrol edin'] }
          }
        }
        else {
          setMailValid({ status: 'is-invalid', message: 'Email adresi girilmesi zorunludur' })
          error = { ...error, status: true, message: [...error.message, 'Email adresi girilmesi zorunludur'] }
        }
        if (!message) {
          setMessageValid({ status: 'is-invalid', message: 'İçerik girilmesi zorunludur' })
          error = { ...error, status: true, message: [...error.message, 'İçerik girilmesi zorunludur'] }
        }
        else {
          setMessageValid({ status: 'is-valid', message: null })
        }
        resolve(error);
      })


      validateForm.then((error) => {
        if (error.status === false) {
          setCreateFormValues({ name: newName.trim(), message, EmailAdress, phoneNumber })
          createOtp({ variables: { data: { phone: createFormValues.phoneNumber.replaceAll(/[^0-9]/gi, ""), type: 'iletisim' } } })
        }
        else {
          setCreateConversationLoading(false)
          for (let mes of error.message) {
          }
        }
      })

    } catch (err) {

    }
  }

  const validOtpSubmit = async e => {
    e.preventDefault();
    setValidOtpLoading(true)
    validOtp({ variables: { data: { phone: createFormValues.phoneNumber.replaceAll(/[^0-9]/gi, ""), type: 'iletisim', otp: parseInt(createFormValues.otpValue), otpId: createFormValues.otp.otpId } } })
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
              <div>
                <div id='header'><h4>İLETİŞİM FORMU</h4></div>
                <form id='Iletisim' onSubmit={onCreateConversationSubmit} style={{ background: 'aliceblue', position: 'relative' }}>
                  {createConversationLoading && <Spinner color='primary' />}
                  <fieldset>
                    <div className='input'>
                      <input className={`form-control  ${NameValid.status}`}
                        id="nameSurname"
                        autoComplete="off"
                        placeholder="Ad Soyad"
                        value={createFormValues.name}
                        onChange={(e) => setCreateFormValues({ ...createFormValues, name: e.target.value })}
                      />
                      <div className="invalid-feedback mt-0" style={{ position: 'absolute' }}>
                        {NameValid.message}
                      </div>
                    </div>
                  </fieldset>
                  <fieldset >
                    <div className='input'>
                      <input className={`form-control  ${PhoneNumberValid.status}`}
                        id="phoneNumber"
                        autoComplete="off"
                        placeholder="Telefon Numarası"
                        value={createFormValues.phoneNumber}
                        onChange={(e) => setCreateFormValues({ ...createFormValues, phoneNumber: e.target.value })}
                        onFocus={(e) => MaskPhone.mask(e.target)}
                      />
                      <div className="invalid-feedback mt-0" style={{ position: 'absolute' }}>
                        {PhoneNumberValid.message}
                      </div>
                    </div>
                  </fieldset>
                  <fieldset >
                    <div className='input'>
                      <input className={`form-control ${MailValid.status}`}
                        id="EmailAdress"
                        autoComplete="off"
                        placeholder="E-mail"
                        value={createFormValues.EmailAdress}
                        onChange={(e) => setCreateFormValues({ ...createFormValues, EmailAdress: e.target.value })}
                      />
                      <div className="invalid-feedback mt-0" style={{ position: 'absolute' }}>
                        {MailValid.message}
                      </div>
                    </div>
                  </fieldset>
                  <fieldset >
                    <div className='input'>
                      <textarea
                        rows='5'
                        className={`form-control  ${MessageValid.status}`}
                        type='textarea'
                        autoComplete="off"
                        placeholder="Mesajınız..."
                        id='Message'
                        value={createFormValues.message}
                        onChange={(e) => setCreateFormValues({ ...createFormValues, message: e.target.value })}
                      />
                      <div className="invalid-feedback mt-0" style={{ position: 'absolute' }}>
                        {MessageValid.message}
                      </div>
                    </div>
                  </fieldset>
                  <fieldset >

                    <div style={{ display: `${createFormValues.otpVisibility ? 'flex' : 'none'}`, flexDirection: 'row', gap: '5px' }} >
                      <div className='input'>
                        <input className={`form-control ${otpValid.status}`}
                          type='number'
                          id="Otp"
                          autoComplete="off"
                          placeholder="SMS Şifresi"
                          value={createFormValues.otpValue || ''}
                          onChange={(e) => setCreateFormValues({ ...createFormValues, otpValue: e.target.value })}
                        />
                        <div className="valid-feedback mt-0" style={{ position: 'absolute', display: `${otpValid.status == 'not-valid' && 'block'}` }}>
                          {otpValid.message}
                        </div>
                        <div className="invalid-feedback mt-0" style={{ position: 'absolute' }}>
                          {otpValid.message}
                        </div>
                      </div>
                      <div className='form-footer' style={{ border: 'none', width: '100%', marginTop: '0px', padding: '0px', justifyContent: 'left' }}>
                        <button type='button' onClick={e => validOtpSubmit(e)} className='btn' style={{ position: 'relative' }}  >{validOtpLoading && <Spinner color='primary' style={{ top: '12%', left: '28%' }} />}Onayla</button>
                      </div>
                    </div>


                    <div className='form-footer' style={{ border: 'none', width: '100%', marginTop: '0px', padding: '0px', justifyItems: 'right', display: `${createFormValues.otpVisibility ? 'none' : 'block'}` }}>
                      <button type='submit' form='Iletisim' className='btn'  >Gönder</button>
                    </div>
                  </fieldset>
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
        <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '4rem' }}>
          <div className='rows' style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <div x-lg="7" lg="7" md="7" sm="11">
              <div id="map" style={{ height: '25rem', position: 'relative', display: "inline-table", background: 'white', padding: "5px", boxShadow: "rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px" }} ></div>
            </div>
          </div>
        </div>
      </div>
    </Fragment >
  );

}
//<div x-lg="9" lg="10" md="12" sm="12">
//         <div id="map" style={{height: '25rem', position: 'relative' }} ></div>
//      </div>
export default Iletisim;