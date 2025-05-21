import React, { useState, useEffect, memo, Fragment, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConcubinesContext } from '../../../../context/concubinesContext';
import { InsurancesContext } from '../../../../context/insurancesContext';
import { CompaniesContext } from '../../../../context/companiesContext';
import { AuthContext } from '../../../../context/authContext';
import './companyInformation.scss'
import SelectInput from '../../../../downshift/selectInput';
import vergiNoSorgula from '../../../../functions/vergiNoSorgula';
import tcNoSorgula from '../../../../functions/tcSorgula';
import { UPDATE_COMPANY } from '../../../../GraphQL/Mutations/company/company';
import { useMutation } from '@apollo/client';
import { FaEdit } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import toastr from 'toastr';


const CompanyInformation = ({ companyActive, setCompanyActive }) => {
    const navigate = useNavigate();
    const { signOut } = useContext(AuthContext);
    const { updateConcubineCompanyName } = useContext(ConcubinesContext);
    const { updateInsuranceCompanyName } = useContext(InsurancesContext);
    const { companyLoading, updateCompany, companyState: { selectedId, selectedCompany } } = useContext(CompaniesContext);
    const [updateFormValues, setFormValues] = useState({
        name: '',
        adress: '',
        vergi: { vergiDairesi: '', vergiNumarasi: '' },
        phoneNumber: '',
        workingtatus: ''
    });

    //FORM VALIDATTION
    const [companyNameValid, setCompanyNameValid] = useState({ status: null, message: null });
    const [companyAdressValid, setCompanyAdressValid] = useState({ status: null, message: null });
    const [companyVergiDairesiValid, setCompanyVergiDairesiValid] = useState({ status: null, message: null });
    const [companyVergiNumarasiValid, setCompanyVergiNumarasiValid] = useState({ status: null, message: null });
    const [companyWorkingStatusValid, setCompanyWorkingStatusValid] = useState({ status: null, message: null });


    const [_updateCompany, { loading }] = useMutation(UPDATE_COMPANY, {
        update(proxy, { data: { updateCompany: values } }) {
            if (selectedCompany.name !== values.name) {
                updateInsuranceCompanyName({ name: values.name, _id: values._id })
                updateConcubineCompanyName({ name: values.name, _id: values._id })
            }
            updateCompany(values);
            toastr.success('Kayıt başarıyla güncelleştirilmiştir.', 'BAŞARILI')
            setCompanyActive(!companyActive)
            AbortValidation()
        },
        onError({ graphQLErrors }) {
            const err = graphQLErrors[0].extensions;
            if (err.status && err.status == 401) {
                signOut()
                navigate('/portal-giris')
            }
        }
    });

    useEffect(() => {
        loading && companyLoading(loading);
    }, [loading])


    useEffect(() => {
        setCompanyActive(false)
        if (selectedCompany) {
            setFormValues(selectedCompany)
        }
        else {
            setFormValues({
                name: '',
                adress: '',
                vergi: { vergiDairesi: '', vergiNumarasi: '' },
                phoneNumber: '',
                workingStatus: ''
            });
        }
        AbortValidation();
    }, [selectedCompany])

    const companyFormActive = () => {
        if (selectedId) {
            setCompanyActive(!companyActive)
            setFormValues(selectedCompany)
        }
        AbortValidation();
    }

    const AbortValidation = () => {
        setCompanyNameValid({ status: null, message: null });
        setCompanyAdressValid({ status: null, message: null });
        setCompanyVergiDairesiValid({ status: null, message: null });
        setCompanyVergiNumarasiValid({ status: null, message: null });
        setCompanyWorkingStatusValid({ status: null, message: null })
    }

    /* const CompanySubmit = async e => {
         e.preventDefault();
 
         companyFormActive();
         setOtpFormValues({
             otpPass: ''
         })
     }*/

    const validCompanyForm = async e => {
        e.preventDefault();
        let error = { status: false, message: [] };

        const { name, adress, vergi, workingStatus } = updateFormValues;
        let newName = '';
        let newAdress = '';
        let newVergiDairesi = '';
        try {
            const validateForm = new Promise((resolve, reject) => {
                if (!workingStatus) {
                    setCompanyWorkingStatusValid({ status: 'is-invalid', message: 'Firma çalışma durumunun seçilmesi zorunludur' })
                    error = { ...error, status: true, message: [...error.message, 'Firma çalışma durumunun seçilmesi zorunludur'] }
                }
                else {
                    setCompanyWorkingStatusValid({ status: 'is-valid', message: null })
                }
                if (!name) {
                    setCompanyNameValid({ status: 'is-invalid', message: 'Firma ünvanı girilmesi zorunludur' })
                    error = { ...error, status: true, message: [...error.message, 'Firma ünvanı girilmesi zorunludur'] }
                }
                else {
                    let nameReplace = name.trim().replace(/(\s)+/g, "$1");
                    const arr = nameReplace.split(" ");
                    arr.forEach(
                        (i, index) =>
                            newName = newName + ' ' + (i[0].toLocaleUpperCase() + i.slice(1).toLocaleLowerCase())
                    )
                    setCompanyNameValid({ status: 'is-valid', message: null })
                }

                if (!adress) {
                    setCompanyAdressValid({ status: 'is-invalid', message: 'Firma adresi girilmesi zorunludur' })
                    error = { ...error, status: true, message: [...error.message, 'Firma adresi girilmesi zorunludur'] }
                }
                else {
                    let adressReplace = adress.trim().replace(/(\s)+/g, "$1");
                    const arr = adressReplace.split(" ");
                    arr.forEach(
                        (i, index) =>
                            newAdress = newAdress + ' ' + (i[0].toLocaleUpperCase() + i.slice(1).toLocaleLowerCase())
                    )
                    setCompanyAdressValid({ status: 'is-valid', message: null })
                }

                if (!vergi.vergiDairesi) {
                    setCompanyVergiDairesiValid({ status: 'is-invalid', message: 'Vergi dairesi girilmesi zorunludur' })
                    error = { ...error, status: true, message: [...error.message, 'Vergi dairesi girilmesi zorunludur'] }
                }
                else {
                    let daireReplace = vergi.vergiDairesi.trim().replace(/(\s)+/g, "$1");
                    const arr = daireReplace.split(" ");
                    arr.forEach(
                        (i, index) =>
                            newVergiDairesi = newVergiDairesi + ' ' + (i[0].toLocaleUpperCase() + i.slice(1).toLocaleLowerCase())
                    )
                    setCompanyVergiDairesiValid({ status: 'is-valid', message: null })
                }

                if (vergi.vergiNumarasi) {
                    if (vergi.vergiNumarasi.length < 10) {
                        setCompanyVergiNumarasiValid({ status: 'is-invalid', message: 'Vergi Numarası 10 haneden az olamaz' })
                        error = { ...error, status: true, message: [...error.message, 'Vergi Numarası 10 haneden az olamaz'] }
                    }
                    else if (vergi.vergiNumarasi.length > 11) {
                        setCompanyVergiNumarasiValid({ status: 'is-invalid', message: 'Vergi Numarası 11 haneden fazla olamaz' })
                        error = { ...error, status: true, message: [...error.message, 'Vergi Numarası 11 haneden fazla olamaz'] }
                    }
                    else if (vergi.vergiNumarasi.length === 10) {
                        if (!vergiNoSorgula(vergi.vergiNumarasi)) {
                            setCompanyVergiNumarasiValid({ status: 'is-invalid', message: 'Vergi numarasını kontrol edin' })
                            error = { ...error, status: true, message: [...error.message, 'Vergi numarasını kontrol edin'] }
                        }
                        else { setCompanyVergiNumarasiValid({ status: 'is-valid', message: null }) }
                    }
                    else {
                        if (!tcNoSorgula(vergi.vergiNumarasi)) {
                            setCompanyVergiNumarasiValid({ status: 'is-invalid', message: 'Vergi numarasını kontrol edin' })
                            error = { ...error, status: true, message: [...error.message, 'Vergi numarasını kontrol edin'] }
                        }
                        else { setCompanyVergiNumarasiValid({ status: 'is-valid', message: null }) }
                    }
                }
                else {
                    setCompanyVergiNumarasiValid({ status: 'is-invalid', message: 'Vergi numarası girilmesi zorunludur' })
                    error = { ...error, status: true, message: [...error.message, 'Vergi numarası girilmesi zorunludur'] }
                }

                resolve(error);
            })


            validateForm.then((error) => {
                if (error.status === false) {
                    _updateCompany({ variables: { data: { name: newName.trim(), adress: newAdress.trim(), vergi: { vergiDairesi: newVergiDairesi.trim(), vergiNumarasi: vergi.vergiNumarasi }, _id: selectedId, workingStatus } } })
                }
                else {
                    for (let mes of error.message) {
                        toastr.warning(mes, 'UYARI')
                    }
                }
            })

        } catch (error) {
            toastr.error(error.message, 'HATA')
        }
    }


    return (
        <Fragment>
            <div className='company-information c-form-frame frame'>
                <div className='form-containers'>
                    <div className='form-header' >
                        <div className='header'>
                            <span>Firma Bilgileri</span>
                        </div>
                        <div className='header-buttons'>
                            <button type='button' className='btn ' onClick={companyFormActive} disabled={`${selectedId ? '' : 'disabled'}`} >{companyActive ? <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}><MdCancel style={{ height: '1.28em', width: '1.28em', color: 'red' }} /><span>Vazgeç</span></div> : <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}><FaEdit style={{ height: '1.28em', width: '1.28em' }} /><span>Düzenle</span></div>}</button>
                        </div>
                    </div>
                    <form onSubmit={validCompanyForm} id='FirmaBilgileri'>

                        <fieldset >
                            <div className='label' >
                                <label htmlFor="unvani" >Ünvanı : </label>
                            </div>
                            <div className='input' style={{ position: 'relative' }}>
                                <input className={`form-control form-control  ${companyNameValid.status}`} id="unvani" autoComplete="off"
                                    value={updateFormValues.name}
                                    onChange={(e) => setFormValues({ ...updateFormValues, name: e.target.value })}
                                    disabled={companyActive ? '' : 'disabled'}
                                />
                                <div className="invalid-feedback mt-0" style={{ position: 'absolute' }}>
                                    {companyNameValid.message}
                                </div>
                            </div>
                        </fieldset>
                        <fieldset className='label-top' >
                            <div className='label'>
                                <label htmlFor="address" >Adresi : </label>
                            </div>
                            <div className='input' style={{ position: 'relative' }}>
                                <textarea
                                    className={`form-control form-control  ${companyAdressValid.status}`}
                                    type='textarea'
                                    autoComplete="off"
                                    id='address'
                                    value={updateFormValues.adress}
                                    onChange={(e) => setFormValues({ ...updateFormValues, adress: e.target.value })}
                                    disabled={companyActive ? '' : 'disabled'}
                                />
                                <div className="invalid-feedback mt-0" style={{ position: 'absolute' }}>
                                    {companyAdressValid.message}
                                </div>
                            </div>
                        </fieldset>
                        <div className='rows row'>
                            <div lg="6">
                                <fieldset >
                                    <div className='label'>
                                        <label htmlFor="vergiDairesi" >Vergi Dairesi : </label>
                                    </div>
                                    <div className='input' style={{ position: 'relative' }}>
                                        <input className={`form-control form-control  ${companyVergiDairesiValid.status}`} id="vergiDairesi" autoComplete="off"
                                            value={updateFormValues.vergi.vergiDairesi}
                                            onChange={(e) => setFormValues({ ...updateFormValues, vergi: { ...updateFormValues.vergi, vergiDairesi: e.target.value } })}
                                            disabled={companyActive ? '' : 'disabled'}
                                        />
                                        <div className="invalid-feedback mt-0" style={{ position: 'absolute' }}>
                                            {companyVergiDairesiValid.message}
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                            <div lg="6">
                                <fieldset >
                                    <div className='label'>
                                        <label htmlFor="vergiNumarasi" >Vergi Numarası : </label>
                                    </div>
                                    <div className='input' style={{ position: 'relative' }}>
                                        <input className={`form-control form-control  ${companyVergiNumarasiValid.status}`} id="vergiNumarasi" autoComplete="off"
                                            value={updateFormValues.vergi.vergiNumarasi}
                                            onChange={(e) => setFormValues({ ...updateFormValues, vergi: { ...updateFormValues.vergi, vergiNumarasi: e.target.value } })}
                                            disabled={companyActive ? '' : 'disabled'}
                                        />
                                        <div className="invalid-feedback mt-0" style={{ position: 'absolute' }}>
                                            {companyVergiNumarasiValid.message}
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                        <div className='rows row'>
                            <div lg="6">
                                <fieldset>
                                    <div className='label'>
                                        <label  >Çalışma Durumu : </label>
                                    </div>
                                    <div className='input' style={{ position: 'relative' }}>
                                        <SelectInput defValue={''} className='form-control' alignment='left' validation={companyWorkingStatusValid} disabled={!companyActive} onChange={(e) => { setFormValues({ ...updateFormValues, workingStatus: e }) }} value={updateFormValues.workingStatus}
                                            items={[
                                                { value: "Aktif", id: "Aktif" },
                                                { value: "Fesih", id: "Fesih" }
                                            ]} />
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                        <div className='form-footer'>
                            <button type='submit' style={{ visibility: `${companyActive ? '' : 'hidden'}` }} className='btn' >Kaydet</button>
                        </div>
                    </form>

                </div>
            </div>
        </Fragment>
    )
}

export default memo(CompanyInformation);