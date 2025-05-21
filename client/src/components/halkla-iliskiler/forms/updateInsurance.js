import React, { Fragment, useState, useEffect, useContext, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CompaniesContext } from '../../../context/companiesContext';
import { InsurancesContext } from '../../../context/insurancesContext';
import { AuthContext } from '../../../context/authContext';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import SelectInput from '../../../downshift/selectInput';
import { iller, ilceler } from '../../../lists/il';
import SearchInput from '../../../downshift/searchInput';
import BasaSifirEkle from '../../../functions/basaSifirEkle';
import SicilIndex from '../../../functions/sicilIndex';
import { UPDATE_INSURANCE } from '../../../GraphQL/Mutations/insurance/insurance';
import { useMutation } from '@apollo/client';
//import {editInsurance} from '../../../../actions/publicRelations/companyProcess';
//import {getOtp} from '../../../../actions/authActions'
//import {DELETE_OTP} from '../../../../actions/types'
//import OTP from '../../../otp'
import './updateInsurance.scss'
import Inputmask from 'inputmask';
//import toastr from 'toastr';
import { FaEdit } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import toastr from 'toastr';

const UpdateInsurance = ({ insurance }) => {
    const navigate = useNavigate();
    const { signOut } = useContext(AuthContext);
    const [ModalOpen, setModalOpen] = useState(false);
    const { companyState: { selectedCompany } } = useContext(CompaniesContext)
    const { updateInsurance } = useContext(InsurancesContext);
    const [ilceItems, setIlceItems] = useState(ilceler.filter(ilce => ilce.ilId === insurance.adress.il.id));
    const MaskSicilNo = new Inputmask("9-9999-99-99-9999999-999-99-99-999");

    const [insuranceNumberValid, setInsuranceNumberValid] = useState({ status: null, message: null });
    const [descriptiveNameValid, setDescriptiveNameValid] = useState({ status: null, message: null });
    const [insuranceWorkingStatusValid, setinsuranceWorkingStatusValid] = useState({ status: null, message: null });
    const [adressDetailValid, setAdressDetailValid] = useState({ status: null, message: null });
    const [adressIlValid, setAdressIlValid] = useState({ status: null, message: null });
    const [adressIlceValid, setAdressIlceValid] = useState({ status: null, message: null });

    const [insuranceActive, setInsuranceActive] = useState(false);

    const initial = {
        descriptiveName: insurance.descriptiveName,
        workingStatus: insurance.workingStatus,
        insuranceNumber: insurance.insuranceNumber,
        employeeCount: insurance.employeeCount,
        adress: {
            detail: insurance.adress.detail,
            il: { id: insurance.adress.il.id, name: insurance.adress.il.name },
            ilce: { id: insurance.adress.ilce.id, name: insurance.adress.ilce.name }
        },
        company: selectedCompany.name
    }

    const [createFormValues, setCreateFormValues] = useState(initial);

    const AbortInsuranceValidation = () => {
        setInsuranceNumberValid({ status: null, message: null });
        setDescriptiveNameValid({ status: null, message: null });
        setinsuranceWorkingStatusValid({ status: null, message: null });
        setAdressDetailValid({ status: null, message: null });
        setAdressIlValid({ status: null, message: null });
        setAdressIlceValid({ status: null, message: null });
    }

    const FormReset = () => {
        setCreateFormValues(initial)
    }

    useEffect(() => {
        setIlceItems(ilceler.filter(ilce => ilce.ilId === insurance.adress.il.id))
        FormReset()
        AbortInsuranceValidation()
    }, [insuranceActive])

    useEffect(() => {
        setIlceItems(ilceler.filter(ilce => ilce.ilId === insurance.adress.il.id))
        FormReset()
    }, [insurance])

    const [UpdateInsurance] = useMutation(UPDATE_INSURANCE, {
        onCompleted: (data) => {
            updateInsurance(data.updateInsurance);
            toastr.success('Kayıt başarıyla güncelleştirilmiştir.', 'BAŞARILI')
            AbortInsuranceValidation();
            setInsuranceActive(!insuranceActive)
            toggle()
        },
        onError({ graphQLErrors }) {
            const err = graphQLErrors[0].extensions;
            if (err.status && err.status === 401) {
                signOut()
                navigate('/portal-giris')
            }
        }
    });

    const toggle = () => {
        setModalOpen(!ModalOpen)
    }

    const validForm = async e => {
        e.preventDefault();


        let error = { status: false, message: [] };

        let { insuranceNumber, descriptiveName, workingStatus, adress } = createFormValues;

        let newInsuranceNumber = insuranceNumber;
        let newDescriptiveName = '';
        let newAdressDetail = '';
        try {
            const validateForm = new Promise((resolve, reject) => {
                if (!workingStatus) {
                    setinsuranceWorkingStatusValid({ status: 'is-invalid', message: 'Sicil çalışma durumunun seçilmesi zorunludur' })
                    error = { ...error, status: true, message: [...error.message, 'Firma çalışma durumunun seçilmesi zorunludur'] }
                }
                else {
                    setinsuranceWorkingStatusValid({ status: 'is-valid', message: null })
                }
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
                    setAdressIlValid({ status: 'is-invalid', message: 'İl seçilmesi zorunludur' })
                    error = { ...error, status: true, message: [...error.message, 'İl seçilmesi zorunludur'] }
                }
                else {
                    setAdressIlValid({ status: 'is-valid', message: null })
                }
                if (!adress.ilce.id) {
                    setAdressIlceValid({ status: 'is-invalid', message: 'İlçe seçilmesi zorunludur' })
                    error = { ...error, status: true, message: [...error.message, 'İlçe seçilmesi zorunludur'] }
                }
                else {
                    setAdressIlceValid({ status: 'is-valid', message: null })
                }

                resolve(error);
            })


            validateForm.then((error) => {
                if (error.status === false) {
                    UpdateInsurance({ variables: { data: { descriptiveName: newDescriptiveName.trim(), insuranceNumber: newInsuranceNumber, insuranceControlNumber: insurance.insuranceControlNumber, adress: { detail: newAdressDetail, il: adress.il, ilce: adress.ilce }, _id: insurance._id, workingStatus, company: selectedCompany._id } } })
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

    return (
        <Fragment>
            <button type='button' className='btn ' onClick={toggle} ><span>&#65049;</span></button>

            <Modal
                isOpen={ModalOpen}
                centered={true}
                toggle={toggle}
                className='modal-dialog modal-xl'
            >
                <ModalHeader toggle={toggle} >{!insuranceActive ? <span>İşyeri Detay</span> : <span>İşyeri Güncelle</span>}
                </ModalHeader>
                <ModalBody>
                    <form onSubmit={validForm} id='sicilEdit' >
                        <div className='rows row'>
                            <div lg="8">
                                <fieldset>
                                    <div className='label' >
                                        <label htmlFor="unvani" >Ünvanı : </label>
                                    </div>
                                    <div className='input' style={{ position: 'relative' }}>
                                        <input className='form-control' disabled='disabled' id="unvani"
                                            value={createFormValues.company}
                                        />
                                    </div>
                                </fieldset>
                            </div>
                            <div lg="4">
                                <fieldset>
                                    <div className='label'>
                                        <label htmlFor="dangerStatus" >Tehlike Sınıfı: </label>
                                    </div>
                                    <div className='input' style={{ position: 'relative' }}>
                                        <input className='form-control' disabled='disabled' id="unvani"
                                            value={insurance.tehlikeSinifi ? insurance.tehlikeSinifi : '-'}
                                        />
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                        <div className='rows row'>

                            <div lg="8">
                                <fieldset >
                                    <div className='label'>
                                        <label htmlFor="descriptiveName" >Tanımlayıcı Ad : </label>
                                    </div>
                                    <div className='input' style={{ position: 'relative' }}>
                                        <input
                                            className={`form-control  ${descriptiveNameValid.status}`}
                                            autoComplete='nope'
                                            id='descriptiveName'
                                            value={createFormValues.descriptiveName}
                                            disabled={insuranceActive ? '' : 'disabled'}
                                            onChange={(e) => setCreateFormValues({ ...createFormValues, descriptiveName: e.target.value })}
                                        />
                                        <div className="invalid-feedback mt-0" style={{ position: 'absolute' }}>
                                            {descriptiveNameValid.message}
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                            <div lg="4">
                                <fieldset>
                                    <div className='label'>
                                        <label htmlFor="employeeCount" >Personel Sayısı: </label>
                                    </div>
                                    <div className='input' style={{ position: 'relative' }}>
                                        <input className='form-control' disabled='disabled' id="unvani"
                                            value={insurance.employeeCount}
                                        />
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                        <div className='rows row'>
                            <div lg="8">
                                <fieldset>
                                    <div className='label' >
                                        <label htmlFor="insuranceNumber" >Sicil Numarası : </label>
                                    </div>
                                    <div className='input' style={{ position: 'relative' }}>
                                        <input
                                            className={`form-control  ${insuranceNumberValid.status}`}
                                            autoComplete='nope'
                                            id='insuranceNumber'
                                            value={createFormValues.insuranceNumber}
                                            disabled={insuranceActive ? '' : 'disabled'}
                                            onChange={(e) => setCreateFormValues({ ...createFormValues, insuranceNumber: e.target.value })}
                                            onFocus={(e) => MaskSicilNo.mask(e.target)}
                                        />
                                        <div className="invalid-feedback mt-0" style={{ position: 'absolute' }}>
                                            {insuranceNumberValid.message}
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                            <div lg="4">
                                <fieldset>
                                    <div className='label'>
                                        <label htmlFor="workingStatus" >Çalışma Durumu : </label>
                                    </div>
                                    <div className='input' style={{ position: 'relative' }}>
                                        <SelectInput defValue={''} alignment={'left'} className='form-control' validation={insuranceWorkingStatusValid} disabled={!insuranceActive} onChange={(e) => { setCreateFormValues({ ...createFormValues, workingStatus: e }) }} value={createFormValues.workingStatus}
                                            items={[
                                                { value: "Aktif", id: "Aktif" },
                                                { value: "Askıya Alındı", id: "Askıya Alındı" },
                                                { value: "Kapandı", id: "Kapandı" }
                                            ]} />
                                    </div>

                                </fieldset>
                            </div>
                        </div>
                        <div className='rows row'>
                            <div lg="8">
                                <fieldset className='label-top' >
                                    <div className='label'>
                                        <label htmlFor="address" >Adresi : </label>
                                    </div>
                                    <div className='input' style={{ position: 'relative' }}>
                                        <textarea
                                            disabled={insuranceActive ? '' : 'disabled'}
                                            className={`form-control  ${adressDetailValid.status}`}
                                            type='textarea'
                                            autoComplete='nope'
                                            id='adress'
                                            value={createFormValues.adress.detail}
                                            onChange={(e) => setCreateFormValues({ ...createFormValues, adress: { ...createFormValues.adress, detail: e.target.value } })}
                                        />
                                        <div className="invalid-feedback mt-0" style={{ position: 'absolute' }}>
                                            {adressDetailValid.message}
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                        <div className='rows row'>
                            <div lg="4">
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
                                            disabled={insuranceActive ? '' : 'disabled'}
                                            reset={() => setCreateFormValues({ ...createFormValues, adress: { ...createFormValues.adress, il: { id: '', name: '' }, ilce: { id: '', name: '' } } })}
                                            items={iller.map(({ Sehir, ilId }) => { return { value: Sehir, id: ilId } })} />
                                    </div>
                                </fieldset>
                            </div>
                            <div lg="4">
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
                                            disabled={createFormValues.adress.il.id && insuranceActive ? '' : 'disabled'}
                                            reset={() => setCreateFormValues({ ...createFormValues, adress: { ...createFormValues.adress, ilce: { id: '', name: '' } } })}
                                            items={ilceItems.map(({ ilce, ilceId }) => { return { value: ilce, id: ilceId } })} />
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                        <div className='rows row'>
                            <fieldset>
                                <table style={{ height: 'auto' }}>
                                    <thead style={{ display: 'flex', alignItems: 'center', padding: '5px', color: 'black', borderBottom: '1px solid black', background: 'none' }}>
                                        <tr>
                                            <th style={{ width: '35%', padding: '0.1rem 0 0.1rem 0.75rem', fontWeight: '400' }} >Adı Soyadı</th>
                                            <th style={{ width: '26%', padding: '0.1rem 0 0.1rem 0.75rem', fontWeight: '400' }}>Onay Durumu</th>
                                            <th style={{ width: '17%', padding: '0.1rem 0 0.1rem 0.75rem', fontWeight: '400' }}>Atama Süresi</th>
                                            <th style={{ width: '16%', padding: '0.1rem 0 0.1rem 0.75rem', fontWeight: '400' }}>Onay Tarihi</th>
                                            <th style={{ width: '16%', padding: '0.1rem 0 0.1rem 0.75rem', fontWeight: '400' }}>Bitiş Tarihi</th>
                                        </tr>
                                    </thead>
                                    <tbody style={{ display: 'block' }}>
                                        {insurance.assignmentStatus.uzmanStatus.approvalAssignments.length > 0 ? insurance.assignmentStatus.uzmanStatus.approvalAssignments.map((uzman) => (
                                            <tr style={{ color: '#2c2b2b' }} key={uzman.assignmentId}>
                                                <td style={{ width: '35%', padding: '0.1rem 0 0.1rem 0.75rem', verticalAlign: 'middle' }}>{uzman.nameSurname}</td>
                                                <td style={{ width: '26%', padding: '0.1rem 0 0.1rem 0.75rem', verticalAlign: 'middle' }}>{uzman.approvalStatus}</td>
                                                <td style={{ width: '17%', padding: '0.1rem 0 0.1rem 0.75rem', verticalAlign: 'middle' }}>{uzman.assignmentTime} dk.</td>
                                                <td style={{ width: '16%', padding: '0.1rem 0 0.1rem 0.75rem', verticalAlign: 'middle' }}>{uzman.startDate}</td>
                                                <td style={{ width: '16%', padding: '0.1rem 0 0.1rem 0.75rem', verticalAlign: 'middle' }}>{uzman.endDate ? uzman.endDate : '-'}</td>
                                            </tr>
                                        )) :
                                            null
                                        }
                                        {insurance.assignmentStatus.hekimStatus.approvalAssignments.length > 0 ? insurance.assignmentStatus.hekimStatus.approvalAssignments.map((hekim) => (
                                            <tr style={{ color: '#2c2b2b' }} key={hekim.assignmentId}>
                                                <td style={{ width: '35%', padding: '0.1rem 0 0.1rem 0.75rem', verticalAlign: 'middle' }}>{hekim.nameSurname}</td>
                                                <td style={{ width: '26%', padding: '0.1rem 0 0.1rem 0.75rem', verticalAlign: 'middle' }}>{hekim.approvalStatus}</td>
                                                <td style={{ width: '17%', padding: '0.1rem 0 0.1rem 0.75rem', verticalAlign: 'middle' }}>{hekim.assignmentTime} dk.</td>
                                                <td style={{ width: '16%', padding: '0.1rem 0 0.1rem 0.75rem', verticalAlign: 'middle' }}>{hekim.startDate}</td>
                                                <td style={{ width: '16%', padding: '0.1rem 0 0.1rem 0.75rem', verticalAlign: 'middle' }}>{hekim.endDate ? hekim.endDate : '-'}</td>
                                            </tr>
                                        )) :
                                            null
                                        }
                                        {insurance.assignmentStatus.dspStatus.approvalAssignments.length > 0 ? insurance.assignmentStatus.dspStatus.approvalAssignments.map((dsp) => (
                                            <tr style={{ color: '#2c2b2b' }} key={dsp.assignmentId}>
                                                <td style={{ width: '35%', padding: '0.1rem 0 0.1rem 0.75rem', verticalAlign: 'middle' }}>{dsp.nameSurname}</td>
                                                <td style={{ width: '26%', padding: '0.1rem 0 0.1rem 0.75rem', verticalAlign: 'middle' }}>{dsp.approvalStatus}</td>
                                                <td style={{ width: '17%', padding: '0.1rem 0 0.1rem 0.75rem', verticalAlign: 'middle' }}>{dsp.assignmentTime} dk.</td>
                                                <td style={{ width: '16%', padding: '0.1rem 0 0.1rem 0.75rem', verticalAlign: 'middle' }}>{dsp.startDate}</td>
                                                <td style={{ width: '16%', padding: '0.1rem 0 0.1rem 0.75rem', verticalAlign: 'middle' }}>{dsp.endDate ? dsp.endDate : '-'}</td>
                                            </tr>
                                        )) :
                                            insurance.tehlikeSinifi === 'Çok Tehlikeli' & insurance.employeeCount > 9 ?
                                                <tr key={0} style={{ textAlign: 'left', color: '#2c2b2b' }}>
                                                    <td style={{ padding: '0.1rem 0 0.1rem 0.75rem', verticalAlign: 'middle' }} colSpan="4">SAĞLIK PERSONELİ ATAMASI BULUNMAMAKTADIR!</td>
                                                </tr>
                                                :
                                                null
                                        }
                                    </tbody>
                                </table>
                            </fieldset>
                        </div>

                        <div className='form-footer'>
                            <button type='button' className='btn ' onClick={e => { setInsuranceActive(!insuranceActive) }} >{insuranceActive ? <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}><MdCancel style={{ height: '1.28em', width: '1.28em', color: 'red' }} /><span>Vazgeç</span></div> : <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}><FaEdit style={{ height: '1.28em', width: '1.28em' }} /><span>Düzenle</span></div>}</button>
                            <button type='submit' className='btn ' style={{ display: `${insuranceActive ? 'block' : 'none'}` }} ><div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}><FaEdit style={{ height: '1.28em', width: '1.28em' }} /><span>Kaydet</span></div></button>
                        </div>
                    </form>
                </ModalBody>
            </Modal>
        </Fragment>
    )
}

export default memo(UpdateInsurance);