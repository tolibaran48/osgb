import React, { Fragment, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import vergiNoSorgula from '../../../functions/vergiNoSorgula';
import { CompaniesContext } from '../../../context/companiesContext';
import { AuthContext } from '../../../context/authContext';
import tcNoSorgula from '../../../functions/tcSorgula';
import { ADD_COMPANY } from '../../../GraphQL/Mutations/company/company';
import { useMutation } from '@apollo/client';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import './addCompany.scss'
import { MdLibraryAdd } from "react-icons/md";
import toastr from 'toastr';

const AddCompany = () => {
    const [ModalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate();
    const { signOut } = useContext(AuthContext);
    const [companyNameValid, setCompanyNameValid] = useState({ status: null, message: null });
    const [companyAdressValid, setCompanyAdressValid] = useState({ status: null, message: null });
    const [companyVergiDairesiValid, setCompanyVergiDairesiValid] = useState({ status: null, message: null });
    const [companyVergiNumarasiValid, setCompanyVergiNumarasiValid] = useState({ status: null, message: null });
    const context = useContext(CompaniesContext);

    const initial = {
        name: '',
        adress: '',
        vergi: { vergiDairesi: '', vergiNumarasi: '' }
    }

    const [createFormValues, setCreateFormValues] = useState(initial)

    const ValidationReset = () => {
        setCompanyNameValid({ status: null, message: null });
        setCompanyAdressValid({ status: null, message: null });
        setCompanyVergiDairesiValid({ status: null, message: null });
        setCompanyVergiNumarasiValid({ status: null, message: null });
    }

    const [addCompany, { loading }] = useMutation(ADD_COMPANY, {
        update(cache, { data: { createCompany: values } }) {
            cache.modify({
                fields: {
                    companies: (previous, { toReference }) => (
                        [...previous, toReference(values)]
                    )
                }
            });

            context.addCompany(values);
            toastr.success('Kayıt başarıyla gerçekleştirilmiştir.', 'BAŞARILI')
            setModalOpen(!ModalOpen);
            ValidationReset();
            setCreateFormValues(initial);
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
        setCreateFormValues(initial)
        ValidationReset()
    }, [ModalOpen])

    useEffect(() => {
        loading && context.companyLoading(loading);
    }, [loading])

    const onCreateCompanySubmit = async e => {
        e.preventDefault();
        let error = { status: false, message: [] };

        const { name, adress, vergi } = createFormValues;
        let newName = '';
        let newAdress = '';
        let newVergiDairesi = '';
        try {
            const validateForm = new Promise((resolve, reject) => {
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
                    addCompany({ variables: { data: { name: newName.trim(), adress: newAdress.trim(), vergi: { vergiDairesi: newVergiDairesi.trim(), vergiNumarasi: vergi.vergiNumarasi } } } })

                }
                else {
                    for (let mes of error.message) {
                        toastr.warning(mes, 'UYARI')
                    }
                }
            })

        } catch (err) {
            toastr.error(error.message, 'HATA')
        }
    }

    const toggle = () => {
        setModalOpen(!ModalOpen)
    }

    return (
        <Fragment>
            <button type="button" className='btn button-bg-green' onClick={toggle} style={{ lineHeight: '1.4', height: '100%', display: 'flex', flexDirection: 'column' }}  >
                <div style={{ alignSelf: 'center' }}>
                    <MdLibraryAdd style={{ height: '1.5em', width: '1.5em' }} />
                </div>
                <div>
                    <span>Firma Ekle</span>
                </div>
            </button>

            <Modal
                isOpen={ModalOpen}
                centered={true}
                toggle={toggle}
                className='modal-dialog modal-lg'
            >
                <ModalHeader toggle={toggle} ><span>Firma Kaydet</span></ModalHeader>
                <ModalBody>
                    <form id='FirmaKaydet' onSubmit={onCreateCompanySubmit}>
                        <fieldset>
                            <div className='label' >
                                <label htmlFor="unvani" >Ünvanı : </label>
                            </div>
                            <div className='input' style={{ position: 'relative' }}>
                                <input className={`form-control  ${companyNameValid.status}`} id="unvani" autoComplete="off"
                                    value={createFormValues.name}
                                    onChange={(e) => setCreateFormValues({ ...createFormValues, name: e.target.value })}
                                />
                                <div className="invalid-feedback mt-0" style={{ position: 'absolute' }}>
                                    {companyNameValid.message}
                                </div>
                            </div>
                        </fieldset>
                        <fieldset >
                            <div className='label'>
                                <label htmlFor="address" >Adresi : </label>
                            </div>
                            <div className='input' style={{ position: 'relative' }}>
                                <textarea
                                    className={`form-control  ${companyAdressValid.status}`}
                                    type='textarea'
                                    autoComplete="off"
                                    id='adress'
                                    value={createFormValues.adress}
                                    onChange={(e) => setCreateFormValues({ ...createFormValues, adress: e.target.value })}
                                />
                                <div className="invalid-feedback mt-0" style={{ position: 'absolute' }}>
                                    {companyAdressValid.message}
                                </div>
                            </div>
                        </fieldset>
                        <div className='rows'>
                            <div lg="6">
                                <fieldset >
                                    <div className='label'>
                                        <label htmlFor="vergiDairesi" >Vergi Dairesi : </label>
                                    </div>
                                    <div className='input' style={{ position: 'relative' }}>
                                        <input className={`form-control  ${companyVergiDairesiValid.status}`} id="vergiDairesi" autoComplete="off"
                                            value={createFormValues.vergi.vergiDairesi}
                                            onChange={(e) => setCreateFormValues({ ...createFormValues, vergi: { ...createFormValues.vergi, vergiDairesi: e.target.value } })}
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
                                        <input className={`form-control   ${companyVergiNumarasiValid.status}`} id="vergiNumarasi" autoComplete="off"
                                            value={createFormValues.vergi.vergiNumarasi}
                                            onChange={(e) => setCreateFormValues({ ...createFormValues, vergi: { ...createFormValues.vergi, vergiNumarasi: e.target.value } })}
                                        />
                                        <div className="invalid-feedback mt-0" style={{ position: 'absolute' }}>
                                            {companyVergiNumarasiValid.message}
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>

                        <div className='form-footer'>
                            <button type='submit' form='FirmaKaydet' className='btn'  >Kaydet</button>
                        </div>
                    </form>
                </ModalBody>
            </Modal>
        </Fragment>
    )
}

export default AddCompany;