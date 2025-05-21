import React, { Fragment, useState, useEffect } from 'react';
import Inputmask from 'inputmask';

const AzTehlikeliFormPage = () => {

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


    return (
        <Fragment>
            <div id='h-wrapper'>
                <div className='header'>
                    <h2 style={{ paddingBottom: '.7rem', color: 'white', fontWeight: '300', fontSize: '2.7rem' }}>Az Tehlikeli İşletmeler</h2>
                </div>
                <div id='content'>
                    <div id='content-wrapper'>
                        <div className='rows'>
                            <div id='rows-form-content' x-lg="6" lg="6" md="6" sm="12">
                                <div  >
                                    <div id='header'><h4>İLETİŞİM FORMU</h4></div>
                                    <form id='Iletisim' onSubmit={''} style={{ background: 'aliceblue' }}>
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
                                                    {//companyNameValid.message
                                                    }
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
                                                    {//companyPhoneNumberValid.message
                                                    }
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
                                                    {//companyMailValid.message
                                                    }
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
                                                    {//companyMessageValid.message
                                                    }
                                                </div>
                                            </div>
                                        </fieldset>

                                        <div className='form-footer' style={{ border: 'none' }}>
                                            <button type='submit' form='Iletisim' className='btn'  >Kaydet</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default AzTehlikeliFormPage;