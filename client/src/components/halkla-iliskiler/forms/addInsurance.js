import React, { Fragment, useState, useEffect, useContext, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CompaniesContext } from '../../../context/companiesContext';
import { InsurancesContext } from '../../../context/insurancesContext';
import { AuthContext } from '../../../context/authContext';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import './addInsurance.scss'
import Inputmask from 'inputmask';
import SearchInput from '../../../downshift/searchInput';
import BasaSifirEkle from '../../../functions/basaSifirEkle';
import SicilIndex from '../../../functions/sicilIndex';
import { iller, ilceler } from '../../../lists/il';
import { ADD_INSURANCE } from '../../../GraphQL/Mutations/insurance/insurance';
import { useMutation } from '@apollo/client';
import { MdLibraryAdd } from "react-icons/md";
import toastr from 'toastr';

const AddInsurance = () => {
    const navigate = useNavigate();
    const { signOut } = useContext(AuthContext);
    const [ModalOpen, setModalOpen] = useState(false);
    const context = useContext(CompaniesContext);
    const { selectedId, selectedCompany } = context.companyState;
    const contextInsurance = useContext(InsurancesContext);
    const MaskSicilNo = new Inputmask("9-9999-99-99-9999999-999-99-99-999");

    const [insuranceNumberValid, setInsuranceNumberValid] = useState({ status: null, message: null });
    const [descriptiveNameValid, setDescriptiveNameValid] = useState({ status: null, message: null });
    const [adressDetailValid, setAdressDetailValid] = useState({ status: null, message: null });
    const [adressIlValid, setAdressIlValid] = useState({ status: null, message: null });
    const [adressIlceValid, setAdressIlceValid] = useState({ status: null, message: null });
    const [ilceItems, setIlceItems] = useState([]);


    const initial = {
        company: `${selectedCompany && selectedCompany.name}`,
        descriptiveName: '',
        insuranceNumber: '',
        adress: {
            detail: '',
            il: { id: '', name: '' },
            ilce: { id: '', name: '' }
        }
    }

    const [createFormValues, setCreateFormValues] = useState(initial);


    useEffect(() => {
        setCreateFormValues({ ...createFormValues, company: `${selectedCompany && selectedCompany.name}` })
    }, [selectedId])

    useEffect(() => {
        setCreateFormValues(initial)
        ValidationReset()
    }, [ModalOpen])

    const [addInsurance] = useMutation(ADD_INSURANCE, {
        update(cache, { data: { createInsurance: values } }) {
            cache.modify({
                id: `Firma:${selectedId}`,
                fields: {
                    insurances: (previous, { toReference }) => (
                        [...previous, toReference(values)]
                    )
                }
            });

            contextInsurance.addInsurance(values);
            toastr.success('Kayıt başarıyla gerçekleştirilmiştir.', 'BAŞARILI')
            setModalOpen(false)


        },
        onError({ graphQLErrors }) {
            const err = graphQLErrors[0].extensions;
            if (err.status && err.status === 401) {
                signOut()
                navigate('/portal-giris')
            }
        }
    });

    const ValidationReset = () => {
        setInsuranceNumberValid({ status: null, message: null });
        setDescriptiveNameValid({ status: null, message: null });
        setAdressDetailValid({ status: null, message: null });
        setAdressIlValid({ status: null, message: null });
        setAdressIlceValid({ status: null, message: null });
    }

    const onCreateInsuranceSubmit = async e => {
        e.preventDefault();


        let error = { status: false, message: [] };

        let { insuranceNumber, descriptiveName, adress } = createFormValues;

        let insuranceControlNumber = '';
        let newInsuranceNumber = insuranceNumber;
        let newDescriptiveName = '';
        let newAdressDetail = '';
        try {
            const validateForm = new Promise((resolve, reject) => {

                if (!descriptiveName) {
                    setDescriptiveNameValid({ status: 'is-invalid', message: 'Tanımlayıcı ad girilmesi zorunludur' })
                    error = { ...error, status: true, message: [...error.message, 'Tanımlayıcı ad girilmesi zorunludur'] }
                }
                else {
                    let nameReplace = descriptiveName.trim().replace(/(\s)+/g, "$1");
                    const arr = nameReplace.split(" ");
                    arr.forEach(
                        (i, index) =>
                            newDescriptiveName = newDescriptiveName + ' ' + (i[0].toLocaleUpperCase() + i.slice(1).toLocaleLowerCase())
                    )
                    setDescriptiveNameValid({ status: 'is-valid', message: null })
                }

                if (insuranceNumber) {
                    const arr = insuranceNumber.split("-");
                    let intValue = '';
                    let err = false;
                    arr.forEach(
                        (i, index) => {
                            intValue = parseInt(i);
                            if (Number.isInteger(intValue)) {
                                let { start, hane } = SicilIndex(index)
                                newInsuranceNumber = newInsuranceNumber.replace(newInsuranceNumber.substring(start, start + hane), BasaSifirEkle(intValue, hane))
                                insuranceControlNumber = insuranceControlNumber + BasaSifirEkle(intValue, hane);
                                setInsuranceNumberValid({ status: 'is-valid', message: null })
                            }
                            else {
                                err = true;
                            }
                        }
                    )
                    if (err) {
                        setInsuranceNumberValid({ status: 'is-invalid', message: 'Sicil numarasını kontrol edin' })
                        error = { ...error, status: true, message: [...error.message, 'Sicil numarasını kontrol edin'] }
                    }
                }
                else {
                    setInsuranceNumberValid({ status: 'is-invalid', message: 'Sicil numarası girilmesi zorunludur' })
                    error = { ...error, status: true, message: [...error.message, 'Sicil numarası girilmesi zorunludur'] }
                }
                if (!adress.detail) {
                    setAdressDetailValid({ status: 'is-invalid', message: 'Adres girilmesi zorunludur' })
                    error = { ...error, status: true, message: [...error.message, 'Adres girilmesi zorunludur'] }
                }
                else {
                    let nameReplace = adress.detail.trim().replace(/(\s)+/g, "$1");
                    const arr = nameReplace.split(" ");
                    arr.forEach(
                        (i, index) =>
                            newAdressDetail = newAdressDetail + ' ' + (i[0].toLocaleUpperCase() + i.slice(1).toLocaleLowerCase())
                    )
                    setAdressDetailValid({ status: 'is-valid', message: null })
                }
                if (!adress.il.id) {
                    setAdressIlValid({ status: 'is-invalid', message: 'İlin seçilmesi zorunludur' })
                    error = { ...error, status: true, message: [...error.message, 'İlin seçilmesi zorunludur'] }
                }
                else {
                    setAdressIlValid({ status: 'is-valid', message: null })
                }
                if (!adress.ilce.id) {
                    setAdressIlceValid({ status: 'is-invalid', message: 'İlçenin seçilmesi zorunludur' })
                    error = { ...error, status: true, message: [...error.message, 'İlçenin seçilmesi zorunludur'] }
                }
                else {
                    setAdressIlceValid({ status: 'is-valid', message: null })
                }


                resolve(error);
            })


            validateForm.then((error) => {
                if (error.status === false) {
                    addInsurance({ variables: { data: { descriptiveName: newDescriptiveName.trim(), insuranceNumber: newInsuranceNumber, insuranceControlNumber, company: selectedId, adress: { detail: newAdressDetail, il: adress.il, ilce: adress.ilce } } } })
                }
                else {
                    for (let mes of error.message) {
                        toastr.warning(mes, 'UYARI')
                    }
                }
            })

        } catch (err) {
            toastr.error(err.message, 'HATA')
        }
    }

    const toggle = () => {
        setModalOpen(!ModalOpen)
    }


    return (
        <Fragment>
            <button type='button' className='btn ' onClick={toggle} disabled={`${selectedId ? '' : 'disabled'}`} ><MdLibraryAdd style={{ height: '1.28em', width: '1.28em' }} /><span>Sicil Ekle</span></button>

            <Modal
                isOpen={ModalOpen}
                centered={true}
                toggle={toggle}
                className='modal-dialog modal-lg'
            >
                <ModalHeader toggle={toggle} ><span>İşyeri Kaydet</span></ModalHeader>
                <ModalBody>
                    <form id='AddInsurance' onSubmit={onCreateInsuranceSubmit}>
                        <fieldset>
                            <div className='label' >
                                <label htmlFor="unvani" >Ünvanı : </label>
                            </div>
                            <div className='input' style={{ position: 'relative' }}>
                                <input className='form-control' disabled='disabled' id="unvani" autoComplete="off"
                                    value={createFormValues.company}
                                />
                            </div>
                        </fieldset>
                        <fieldset>
                            <div className='label'>
                                <label htmlFor="descriptiveName" >Tanımlayıcı Ad : </label>
                            </div>
                            <div className='input' style={{ position: 'relative' }}>
                                <input
                                    className={`form-control  ${descriptiveNameValid.status}`}
                                    autoComplete="off"
                                    id='descriptiveName'
                                    value={createFormValues.descriptiveName}
                                    onChange={(e) => setCreateFormValues({ ...createFormValues, descriptiveName: e.target.value })}
                                />
                                <div className="invalid-feedback mt-0" style={{ position: 'absolute' }}>
                                    {descriptiveNameValid.message}
                                </div>
                            </div>
                        </fieldset>
                        <fieldset>
                            <div className='label' >
                                <label htmlFor="insuranceNumber" >Sicil Numarası : </label>
                            </div>
                            <div className='input' style={{ position: 'relative' }}>
                                <input
                                    className={`form-control  ${insuranceNumberValid.status}`}
                                    autoComplete="off"
                                    id='insuranceNumber'
                                    value={createFormValues.insuranceNumber}
                                    onChange={(e) => setCreateFormValues({ ...createFormValues, insuranceNumber: e.target.value })}
                                    onFocus={(e) => MaskSicilNo.mask(e.target)}
                                />
                                <div className="invalid-feedback mt-0" style={{ position: 'absolute' }}>
                                    {insuranceNumberValid.message}
                                </div>
                            </div>
                        </fieldset>
                        <fieldset className='label-top' >
                            <div className='label'>
                                <label htmlFor="address" >Adresi : </label>
                            </div>
                            <div className='input' style={{ position: 'relative' }}>
                                <textarea
                                    className={`form-control  ${adressDetailValid.status}`}
                                    type='textarea'
                                    autoComplete="off"
                                    id='adress'
                                    value={createFormValues.adress.detail}
                                    onChange={(e) => setCreateFormValues({ ...createFormValues, adress: { ...createFormValues.adress, detail: e.target.value } })}
                                />
                                <div className="invalid-feedback mt-0" style={{ position: 'absolute' }}>
                                    {adressDetailValid.message}
                                </div>
                            </div>
                        </fieldset>
                        <div className='rows row'>
                            <div lg="6">
                                <fieldset>
                                    <div className='label'>
                                        <label htmlFor="il" >Bulunduğu İl : </label>
                                    </div>
                                    <div className='input' style={{ position: 'relative' }}>
                                        <SearchInput defValue={''} className='form-control'
                                            validation={adressIlValid}
                                            onChange={(e) => [setCreateFormValues({ ...createFormValues, adress: { ...createFormValues.adress, il: { id: e.id, name: e.value }, ilce: { id: '', name: '' } } }),
                                            setIlceItems(ilceler.filter(ilce => ilce.ilId === e.id))]}
                                            value={createFormValues.adress.il.id} alignment={'left'}
                                            reset={() => setCreateFormValues({ ...createFormValues, adress: { ...createFormValues.adress, il: { id: '', name: '' }, ilce: { id: '', name: '' } } })}
                                            items={iller.map(({ Sehir, ilId }) => { return { value: Sehir, id: ilId } })} />
                                    </div>
                                </fieldset>
                            </div>
                            <div lg="6">
                                <fieldset>
                                    <div className='label'>
                                        <label htmlFor="ilce" >Bulunduğu İlçe : </label>
                                    </div>
                                    <div className='input' style={{ position: 'relative' }}>
                                        <SearchInput defValue={''}
                                            validation={adressIlceValid}
                                            onChange={(e) => setCreateFormValues({ ...createFormValues, adress: { ...createFormValues.adress, ilce: { id: e.id, name: e.value } } })}
                                            className='form-control'
                                            value={createFormValues.adress.ilce.id} alignment={'left'}
                                            disabled={createFormValues.adress.il.id ? '' : 'disabled'}
                                            reset={() => setCreateFormValues({ ...createFormValues, adress: { ...createFormValues.adress, ilce: { id: '', name: '' } } })}
                                            items={ilceItems.map(({ ilce, ilceId }) => { return { value: ilce, id: ilceId } })} />
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                        <div className='form-footer'>
                            <button type='submit' form='AddInsurance' className='btn'  >Kaydet</button>
                        </div>
                    </form>
                </ModalBody>
            </Modal>

        </Fragment>
    )
}

export default memo(AddInsurance);