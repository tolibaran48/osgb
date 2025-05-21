import React, { Fragment, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SelectInput from '../../../downshift/selectInput';
import { ConcubinesContext } from '../../../context/concubinesContext';
import { AuthContext } from '../../../context/authContext';
import { useMutation } from '@apollo/client';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { MdLibraryAdd } from "react-icons/md";
import { ADD_COLLECT } from '../../../GraphQL/Mutations/concubine/concubine';
import './addCollect.scss';
import dayjs from 'dayjs';

const AddCollect = ({ company }) => {
    const [ModalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate();
    const { signOut } = useContext(AuthContext);
    const [processDateValid, setProcessDateValid] = useState({ status: null, message: null });
    const [collectTypeValid, setCollectTypeValid] = useState({ status: null, message: null });
    const [processNumberValid, setProcessNumberValid] = useState({ status: null, message: null });
    const [chequeDueValid, setChequeDueValid] = useState({ status: null, message: null });
    const [receiveValid, setReceiveValid] = useState({ status: null, message: null });
    const context = useContext(ConcubinesContext);

    const initial = {
        company: company.id,
        name: company.name.name,
        isgName: company.name.isgKatipName ? company.name.isgKatipName : '',
        process: 'Tahsilat',
        processDate: '',
        collectType: '',
        processNumber: '',
        chequeDue: '',
        receive: ''
    }

    const [createFormValues, setCreateFormValues] = useState(initial)
    const [checqueDueShow, setChequeDueShow] = useState(false)

    const ValidationReset = () => {
        setProcessDateValid({ status: null, message: null });
        setCollectTypeValid({ status: null, message: null });
        setProcessNumberValid({ status: null, message: null });
        setChequeDueValid({ status: null, message: null });
        setReceiveValid({ status: null, message: null });
    }

    const [addCollect, { loading }] = useMutation(ADD_COLLECT, {
        update(cache, { data: { createCollect: values } }) {
            cache.modify({
                fields: {
                    concubines: (previous, { toReference }) => (
                        [...previous, toReference(values)]
                    )
                }
            });

            context.addConcubine(values);
            setModalOpen(!ModalOpen);
            ValidationReset();
            setCreateFormValues(initial);
        },
        onError({ graphQLErrors }) {
            const err = graphQLErrors[0].extensions;
            console.log(err)
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
        if (createFormValues.collectType === 'Çek') {
            setChequeDueShow(true)
        }
        else {
            setChequeDueShow(false)
            setCreateFormValues({ ...createFormValues, chequeDue: '' })
        }
    }, [createFormValues.collectType])

    const onCollectSubmit = async e => {
        e.preventDefault();
        let error = { status: false, message: [] };
        const { company, process, processDate, processNumber, collectType, chequeDue, receive } = createFormValues;
        try {
            const validateForm = new Promise((resolve, reject) => {
                if (!processDate) {
                    setProcessDateValid({ status: 'is-invalid', message: 'Tahsilat tarihi girilmesi zorunludur' })
                    error = { ...error, status: true, message: [...error.message, 'Tahsilat tarihi girilmesi zorunludur'] }
                }
                else {
                    setProcessDateValid({ status: 'is-valid', message: null })
                }
                if (!collectType) {
                    setCollectTypeValid({ status: 'is-invalid', message: 'Tahsilat türü girilmesi zorunludur' })
                    error = { ...error, status: true, message: [...error.message, 'Tahsilat türü girilmesi zorunludur'] }
                }
                else {
                    setCollectTypeValid({ status: 'is-valid', message: null })
                }
                if (!processNumber) {
                    setProcessNumberValid({ status: 'is-invalid', message: 'Tahsilat numarası girilmesi zorunludur' })
                    error = { ...error, status: true, message: [...error.message, 'Tahsilat numarası girilmesi zorunludur'] }
                }
                else {
                    setProcessNumberValid({ status: 'is-valid', message: null })
                }
                if (!receive) {
                    setReceiveValid({ status: 'is-invalid', message: 'Tahsilat tutarı girilmesi zorunludur' })
                    error = { ...error, status: true, message: [...error.message, 'Tahsilat tutarı girilmesi zorunludur'] }
                }
                else {
                    try {
                        parseFloat(receive)
                        setReceiveValid({ status: 'is-valid', message: null })
                    } catch (error) {
                        setReceiveValid({ status: 'is-invalid', message: 'Tahsilat tutarını kontrol edin' })
                        error = { ...error, status: true, message: [...error.message, 'Tahsilat tutarını kontrol edin'] }
                    }
                }
                if (collectType==='Çek') {
                    if (!chequeDue) {
                        setChequeDueValid({ status: 'is-invalid', message: 'Çek vadesi girilmesi zorunludur' })
                        error = { ...error, status: true, message: [...error.message, 'Çek Vadesi girilmesi zorunludur'] }
                    }
                    else {
                        setChequeDueValid({ status: 'is-valid', message: null })
                    }
                }
                else {
                    setChequeDueValid({ status: 'is-valid', message: null })
                }
                resolve(error);
            })


            validateForm.then((error) => {               
                if (error.status === false) {
                    if(collectType==='Çek'){
                        addCollect({ variables: { data: { company, process, processDate:dayjs(processDate).format(),processNumber,collectType,chequeDue:dayjs(chequeDue).format(),receive:parseFloat(receive)} } })
                    }
                    else{
                        addCollect({ variables: { data: { company, process, processDate:dayjs(processDate).format(),processNumber,collectType,receive:parseFloat(receive)} } })
                    }
                }
                else {
                    for (let mes of error.message) {
                    }
                }
            })
        } catch (err) {
            //toastr.error(err.message,'HATA')
        }
    }

    const toggle = () => {
        setModalOpen(!ModalOpen)
    }

    return (
        <Fragment>
            <div className='header-buttons' style={{ display: 'flex' }}>
                <button type="button" onClick={toggle} className='btn' style={{ lineHeight: '1.4' }}>
                    <MdLibraryAdd style={{ height: '1.28em', width: '1.28em' }} />
                    <span>Tahsilat Ekle</span>
                </button>
            </div>

            <Modal
                isOpen={ModalOpen}
                backdrop={false}
                centered={true}
                toggle={toggle}
                className='modal-dialog modal-lg'
            >
                <ModalHeader toggle={toggle} ><span>Tahsilat Ekle</span></ModalHeader>
                <ModalBody>
                    <form id='CariEkle' onSubmit={onCollectSubmit}>
                        <fieldset>
                            <div className='label' >
                                <label htmlFor="unvani" >Ünvanı : </label>
                            </div>
                            <div className='input' style={{ position: 'relative' }}>
                                <input className={`form-control`} id="unvani" disabled='disabled'
                                    value={createFormValues.name}
                                />
                            </div>
                        </fieldset>
                        <fieldset>
                            <div className='label' >
                                <label htmlFor="isgUnvani" >Katip Ünvanı : </label>
                            </div>
                            <div className='input' style={{ position: 'relative' }}>
                                <input className={`form-control`} id="isgUnvani" disabled='disabled'
                                    value={createFormValues.isgName}
                                />
                            </div>
                        </fieldset>
                        <div className='rows row'>
                            <div lg="6">
                                <fieldset>
                                    <div className='label'>
                                        <label htmlFor="process" >İşlem Tarihi : </label>
                                    </div>
                                    <div className='input' style={{ position: 'relative' }}>
                                        <input type='date' className={`form-control  ${processDateValid.status}`} id="islemTarihi" autoComplete="off"
                                            value={createFormValues.processDate}
                                            onChange={(e) => setCreateFormValues({ ...createFormValues, processDate: e.target.value })}
                                        />
                                        <div className="invalid-feedback mt-0" style={{ position: 'absolute' }}>
                                            {processDateValid.message}
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                            <div lg="6">
                                <fieldset>
                                    <div className='label'>
                                        <label htmlFor="processNumber" >İşlem Numarası : </label>
                                    </div>
                                    <div className='input' style={{ position: 'relative' }}>
                                        <input className={`form-control  ${processNumberValid.status}`} id="processNumber" autoComplete="off"
                                            value={createFormValues.processNumber}
                                            onChange={(e) => setCreateFormValues({ ...createFormValues, processNumber: e.target.value })}
                                        />
                                        <div className="invalid-feedback mt-0" style={{ position: 'absolute' }}>
                                            {processNumberValid.message}
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                        <div className='rows row'>
                            <div lg="6">
                                <fieldset>
                                    <div className='label'>
                                        <label htmlFor="collectType" >Tahsilat Tipi : </label>
                                    </div>
                                    <div className='input' style={{ position: 'relative' }}>
                                        <SelectInput defValue={''} alignment={'left'} className='form-control' validation={collectTypeValid} onChange={(e) => { setCreateFormValues({ ...createFormValues, collectType: e }) }} value={createFormValues.collectType}
                                            items={[
                                                { value: "Nakit", id: "Nakit" },
                                                { value: "Havale", id: "Havale" },
                                                { value: "Çek", id: "Çek" },
                                                { value: "Kredi Kartı", id: "Kredi Kartı" },
                                                { value: "Mail Order", id: "Mail Order" }
                                            ]}
                                        />
                                    </div>
                                </fieldset>
                            </div>
                            <div lg="6" style={{ display: `${checqueDueShow ? 'block' : 'none'}` }}>
                                <fieldset>
                                    <div className='label'>
                                        <label htmlFor="chequeDue" >Çek Vadesi : </label>
                                    </div>
                                    <div className='input' style={{ position: 'relative' }}>
                                        <input type='date' className={`form-control  ${chequeDueValid.status}`} id="chequeDue" autoComplete="off"
                                            value={createFormValues.chequeDue}
                                            onChange={(e) => setCreateFormValues({ ...createFormValues, chequeDue: e.target.value })}
                                        />
                                        <div className="invalid-feedback mt-0" style={{ position: 'absolute' }}>
                                            {chequeDueValid.message}
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                        <div className='rows row'>
                            <div lg="6">
                                <fieldset>
                                    <div className='label'>
                                        <label htmlFor="receive" >Tutar : </label>
                                    </div>
                                    <div className='input' style={{ position: 'relative' }}>
                                        <input className={`form-control  ${receiveValid.status}`} id="receive" autoComplete="off"
                                            value={createFormValues.receive}
                                            onChange={(e) => setCreateFormValues({ ...createFormValues, receive: e.target.value })}
                                        />
                                        <div className="invalid-feedback mt-0" style={{ position: 'absolute' }}>
                                            {receiveValid.message}
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>

                        <div className='form-footer'>
                            <button type='submit' form='CariEkle' className='btn'  >Kaydet</button>
                        </div>
                    </form>
                </ModalBody>
            </Modal>
        </Fragment>
    )
}

export default AddCollect;