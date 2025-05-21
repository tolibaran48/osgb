import React, { useState, memo, Fragment, useContext } from 'react';
import { CompaniesContext } from '../../../../context/companiesContext';
import '../companyPage/companyInformation.scss'
import SelectInput from '../../../../downshift/selectInput';
import { FaEdit } from "react-icons/fa";
import Inputmask from 'inputmask';


const ContactInformation = () => {
    const context = useContext(CompaniesContext);
    const { selectedId, selectedCompany } = context.companyState;
    const MaskPhone = new Inputmask("(999) 999 99 99");
    const [ModalOpen, setModalOpen] = useState(false);
    const [nameValid, setNameValid] = useState({ status: null, message: null });
    const [surnameValid, setSurnameValid] = useState({ status: null, message: null });
    const [emailValid, setEmailValid] = useState({ status: null, message: null });
    const [phoneNumberValid, setPhoneNumberValid] = useState({ status: null, message: null });


    const [auths, setAuths] = useState({ insuranceAuths: [], companyAuths: [] })
    const insuranceAuth = { id: Math.random(), insurance: '', roles: [] }
    const companyAuth = { id: Math.random(), company: '', roles: [] }

    const initialFormValues = {
        name: '',
        surname: '',
        email: '',
        phoneNumber: '',
        auth: {
            type: 'Customer',
            auths: {
                companyAuths: [{
                    company: '',
                    roles: []
                }],
                insuranceAuths: [{
                    insurance: '',
                    roles: []
                }],
            }
        }
    }
    const handleInsuranceAuthAdd = () => {
        setAuths({ ...auths, insuranceAuths: [...auths.insuranceAuths, insuranceAuth] })
    }
    const handleCompanyAuthAdd = () => {
        setAuths({ ...auths, companyAuths: [...auths.companyAuths, companyAuth] })
    }

    const [createFormValues, setCreateFormValues] = useState(initialFormValues);

    const onCreateContactSubmit = async e => {
        e.preventDefault();
        let error = { status: false, message: [] };

        const { name, surname, phoneNumber, email } = createFormValues;
        let newName = '';
        let newSurname = '';
        try {
            const validateForm = new Promise((resolve, reject) => {
                if (!name) {
                    setNameValid({ status: 'is-invalid', message: 'İsim girilmesi zorunludur' })
                    error = { ...error, status: true, message: [...error.message, 'İsim girilmesi zorunludur'] }
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

                if (!surname) {
                    setSurnameValid({ status: 'is-invalid', message: 'Soyadı girilmesi zorunludur' })
                    error = { ...error, status: true, message: [...error.message, 'Soyadı girilmesi zorunludur'] }
                }
                else {
                    let surnameReplace = surname.trim().replace(/(\s)+/g, "$1");
                    const arr = surnameReplace.split(" ");
                    arr.forEach(
                        (i, index) =>
                            newSurname = newSurname + ' ' + (i[0].toLocaleUpperCase() + i.slice(1).toLocaleLowerCase())
                    )
                    setSurnameValid({ status: 'is-valid', message: null })
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
                if (email) {
                    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
                        setEmailValid({ status: 'is-valid', message: null })
                    }
                    else {
                        setEmailValid({ status: 'is-invalid', message: 'Email adresini kontrol edin' })
                        error = { ...error, status: true, message: [...error.message, 'Email adresini kontrol edin'] }
                    }
                }
                else {
                    setEmailValid({ status: 'is-invalid', message: 'Email adresi girilmesi zorunludur' })
                    error = { ...error, status: true, message: [...error.message, 'Email adresi girilmesi zorunludur'] }
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
            <div className='company-information c-form-frame frame'>
                <div className='form-containers'>
                    <div className='form-header' >
                        <div className='header'>
                            <span>Yetkili Bilgileri</span>
                        </div>
                        <div className='header-buttons'>
                            <button type='button' className='btn ' onClick={handleCompanyAuthAdd}  ><FaEdit style={{ height: '1.28em', width: '1.28em' }} /><span>Düzenle</span></button>
                        </div>
                    </div>
                    <form id='YetkiliKaydet' autoComplete='off' onSubmit={onCreateContactSubmit}>
                        <div className='rows'>
                            <div lg="6">
                                <fieldset>
                                    <div className='label' >
                                        <label htmlFor="name" >Adı : </label>
                                    </div>
                                    <div className='input' style={{ position: 'relative' }}>
                                        <input className={`form-control  ${nameValid.status}`} id="name"
                                            autoComplete='off'
                                            value={createFormValues.name}
                                            onChange={(e) => setCreateFormValues({ ...createFormValues, name: e.target.value })}
                                        />
                                        <div className="invalid-feedback mt-0" style={{ position: 'absolute' }}>
                                            {nameValid.message}
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                            <div lg="6">
                                <fieldset >
                                    <div className='label'>
                                        <label htmlFor="surname" >Soyadı : </label>
                                    </div>
                                    <div className='input' style={{ position: 'relative' }}>
                                        <input
                                            className={`form-control  ${surnameValid.status}`}
                                            autoComplete='off'
                                            id='surname'
                                            value={createFormValues.surname}
                                            onChange={(e) => setCreateFormValues({ ...createFormValues, surname: e.target.value })}
                                        />
                                        <div className="invalid-feedback mt-0" style={{ position: 'absolute' }}>
                                            {surnameValid.message}
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                        <div className='rows'>
                            <div lg="6">
                                <fieldset >
                                    <div className='label'>
                                        <label htmlFor="email" >Email : </label>
                                    </div>
                                    <div className='input' style={{ position: 'relative' }}>
                                        <input className={`form-control  ${emailValid.status}`} id="email"
                                            value={createFormValues.email}
                                            onChange={(e) => setCreateFormValues({ ...createFormValues, email: e.target.value })}
                                        />
                                        <div className="invalid-feedback mt-0" style={{ position: 'absolute' }}>
                                            {emailValid.message}
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                            <div lg="6">
                                <fieldset >
                                    <div className='label'>
                                        <label htmlFor="phoneNumber" >Telefon : </label>
                                    </div>
                                    <div className='input' style={{ position: 'relative' }}>
                                        <input className={`form-control ${phoneNumberValid.status}`} id="phoneNumber"
                                            value={createFormValues.phoneNumber}
                                            onChange={(e) => setCreateFormValues({ ...createFormValues, phoneNumber: e.target.value })}
                                            onFocus={(e) => MaskPhone.mask(e.target)}
                                        />
                                        <div className="invalid-feedback mt-0" style={{ position: 'absolute' }}>
                                            {phoneNumberValid.message}
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                        <div className='rows row'>
                            <div lg="6">
                                <fieldset>
                                    <div className='label'>
                                        <label htmlFor="employment" >Görevi : </label>
                                    </div>
                                    <div className='input' style={{ position: 'relative' }}>
                                        <input className={`form-control  ${emailValid.status}`} id="employment"
                                            value={createFormValues.email}
                                            onChange={(e) => setCreateFormValues({ ...createFormValues, email: e.target.value })}
                                        />
                                        <div className="invalid-feedback mt-0" style={{ position: 'absolute' }}>
                                            {emailValid.message}
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                        <div className='rows row'>
                            <div lg="6">
                                <fieldset>
                                    <div className='label'>
                                        <label  >Yetki Tipi : </label>
                                    </div>
                                    <div className='input' style={{ position: 'relative' }}>
                                        <SelectInput defValue={''} className='form-control' alignment='left'
                                            items={[
                                                { value: "Müşteri", id: "Müşteri" },
                                                { value: "Ziyaretçi", id: "Müşteri" }
                                            ]} />
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                        <table border="1" style={{ display: 'flex', flexDirection: 'column' }}>
                            <thead>
                                <tr>
                                    <th >
                                        Firma
                                    </th>
                                    <th >
                                        Rol
                                    </th>
                                </tr>
                            </thead>
                            <tbody style={{ flexGrow: '1', height: '0px !important' }}>

                                {
                                    auths.companyAuths.map((row, i) => {
                                        return (
                                            <tr key={i} >
                                                <td  >
                                                    <input className={`form-control`} id="employment"
                                                        value={row.id}
                                                    />
                                                </td>
                                                <td  >
                                                    <input className={`form-control`} id="employment"
                                                        value={row.company}
                                                    />
                                                </td>

                                            </tr>
                                        )
                                    })
                                }

                            </tbody>
                        </table>

                        <div className='form-footer'>
                            <button type='submit' form='YetkiliKaydet' className='btn'>Kaydet</button>
                        </div>
                    </form>

                </div>
            </div>
        </Fragment >
    )
}

export default memo(ContactInformation);