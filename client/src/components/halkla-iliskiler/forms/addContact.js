import React, { Fragment, useState, useContext, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { CompaniesContext } from '../../../context/companiesContext';
import { UsersContext } from '../../../context/usersContext';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';
import './addCompany.scss'
import { MdLibraryAdd } from "react-icons/md";
import Inputmask from 'inputmask';
import { CREATE_COMPANY_USER } from '../../../GraphQL/Mutations/user/user';
import { GET_USER } from '../../../GraphQL/Queries/user/user';
import {
    Modal,
    Button,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Row,
    Col,
    Label,
    Input,
    Spinner
} from 'reactstrap';
import toastr from 'toastr';

const AddContact = () => {
    const navigate = useNavigate();
    const { signOut } = useContext(AuthContext);
    const context = useContext(CompaniesContext);
    const { userLoading, addUser, getUsers, userState: { users, isLoading } } = useContext(UsersContext)
    const { selectedId } = context.companyState;
    const MaskPhone = new Inputmask("(999) 999 99 99");
    const [ModalOpen, setModalOpen] = useState(false);
    const [nameValid, setNameValid] = useState({ status: null, message: null });
    const [surnameValid, setSurnameValid] = useState({ status: null, message: null });
    const [emailValid, setEmailValid] = useState({ status: null, message: null });
    const [phoneNumberValid, setPhoneNumberValid] = useState({ status: null, message: null });
    const [employmentValid, setEmploymentValid] = useState({ status: null, message: null });
    const [YetkiValid, setYetkiValid] = useState({ status: null, message: null });
    const [formInputs, setFormInputs] = useState(true);


    const initialFormValues = {
        name: '',
        surname: '',
        email: '',
        phoneNumber: '',
        employment: '',
        auth: {
            type: 'Customer',
            auths: {
                companyAuths: [],
                insuranceAuths: [],
            }
        }
    }


    const [createFormValues, setCreateFormValues] = useState(initialFormValues);

    const [addCompanyUser, { loading }] = useMutation(CREATE_COMPANY_USER, {
        update(cache, { data: { createUser: values } }) {
            cache.modify({
                fields: {
                    users: (previous, { toReference }) => (
                        [...previous, toReference(values)]
                    )
                }
            });

            addUser(values);
            toastr.success('Kayıt başarıyla gerçekleştirilmiştir.', 'BAŞARILI')
            userLoading(false)
            toggle()
        },
        onError({ graphQLErrors }) {
            userLoading(false)
            const err = graphQLErrors[0].extensions;
            if (err.status && err.status === 401) {
                signOut()
                navigate('/portal-giris')
            }
        }
    });

    const [_getUser, { loading: getUserLoading }] = useLazyQuery(GET_USER, {
        fetchPolicy: 'network-only',
        onCompleted: (data) => {
            ValidationReset()
            if (data.user) {
                const { name, surname, auth, employment, email } = data.user
                //auth = { ...auth, auths: { ...auth.auths }, type: aut }
                setFormInputs(true)
                setCreateFormValues({ ...createFormValues, name, surname, employment, email, auth: { auths: { companyAuths: [...auth.auths.companyAuths.map((aut) => ({ company: aut.company._id, roles: aut.roles }))] }, type: auth.type, status: auth.status } })
            }
            else {
                const { name, surname, auth, employment, email } = initialFormValues
                setFormInputs(false)
                setCreateFormValues({ ...createFormValues, name, surname, auth, employment, email })
            }
            userLoading(getUserLoading)
        },
        onError({ graphQLErrors }) {
            userLoading(false);
            const err = graphQLErrors[0].extensions;
            if (err.status && err.status == 401) {
                signOut()
                navigate('/portal-giris')
            }
        }
    });

    const yetkicheck = (e) => {
        e.target.checked === true ? setCreateFormValues({ ...createFormValues, auth: { ...createFormValues.auth, auths: { ...createFormValues.auth.auths, companyAuths: [...createFormValues.auth.auths.companyAuths.filter((aut) => aut.company === selectedId).length > 0 ? [...createFormValues.auth.auths.companyAuths.map((aut) => aut.company === selectedId ? { company: selectedId, roles: [...aut.roles, e.target.id] } : aut)] : [...createFormValues.auth.auths.companyAuths, { company: selectedId, roles: [e.target.id] }]] } } }) : setCreateFormValues({ ...createFormValues, auth: { ...createFormValues.auth, auths: { ...createFormValues.auth.auths, companyAuths: [...createFormValues.auth.auths.companyAuths.map((aut) => aut.company === selectedId ? { company: selectedId, roles: [...aut.roles.filter((rol) => rol !== e.target.id)] } : aut)] } } })

    }

    const toggle = () => {
        setFormInputs(true)
        setModalOpen(!ModalOpen);
        setCreateFormValues(initialFormValues)
        ValidationReset()
    }
    const getUser = (e) => {
        e.preventDefault();
        if (users.filter(x => x.phoneNumber === createFormValues.phoneNumber.replace("(", "").replace(")", "").replaceAll(" ", "")).length > 0) {
            setPhoneNumberValid({ status: 'is-invalid', message: 'Kullanıcı zaten kayıtlı' })
        }
        else {
            _getUser({ variables: { phoneNumber: createFormValues.phoneNumber.replace("(", "").replace(")", "").replaceAll(" ", "") } })
        }

    }

    const onCreateContactSubmit = async e => {
        userLoading(true)
        e.preventDefault();
        let error = { status: false, message: [] };

        const { name, surname, phoneNumber, email, employment, auth } = createFormValues;
        let newName = '';
        let newSurname = '';
        let newEmployment = '';
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
                    newSurname = surname.toLocaleUpperCase()
                    setSurnameValid({ status: 'is-valid', message: null })
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
                    //setEmailValid({ status: 'is-invalid', message: 'Email adresi girilmesi zorunludur' })
                    //error = { ...error, status: true, message: [...error.message, 'Email adresi girilmesi zorunludur'] }
                }
                if (!auth.auths.companyAuths.filter(x => x.company === selectedId).length > 0) {
                    setYetkiValid({ status: 'is-invalid', message: 'Yetki seçimi zorunludur' })
                    error = { ...error, status: true, message: [...error.message, 'Yetki seçimi zorunludur'] }
                }
                else if (!auth.auths.companyAuths.find(x => x.company === selectedId).roles.length > 0) {
                    setYetkiValid({ status: 'is-invalid', message: 'Yetki seçimi zorunludur' })
                    error = { ...error, status: true, message: [...error.message, 'Yetki seçimi zorunludur'] }
                }
                else {
                    setYetkiValid({ status: 'is-valid', message: null })
                }
                if (!employment) {
                    setEmploymentValid({ status: 'is-invalid', message: 'Görev girilmesi zorunludur' })
                    error = { ...error, status: true, message: [...error.message, 'Görev girilmesi zorunludur'] }
                }
                else {
                    let employmentReplace = employment.trim().replace(/(\s)+/g, "$1");
                    const arr = employmentReplace.split(" ");
                    arr.forEach(
                        (i, index) =>
                            newEmployment = newEmployment + ' ' + (i[0].toLocaleUpperCase() + i.slice(1).toLocaleLowerCase())
                    )
                    setEmploymentValid({ status: 'is-valid', message: null })
                }
                if (phoneNumber) {
                    if (phoneNumber.includes("_")) {
                        setPhoneNumberValid({ status: 'is-invalid', message: 'Telefon numarasını kontrol edin' })
                        error = { ...error, status: true, message: [...error.message, 'Telefon numarasını kontrol edin'] }
                    }
                    else if (users.filter(x => x.phoneNumber === phoneNumber).length > 0) {
                        setPhoneNumberValid({ status: 'is-invalid', message: 'Kullanıcı zaten kayıtlı' })
                        error = { ...error, status: true, message: [...error.message, 'Kullanıcı zaten kayıtlı'] }
                    }
                    else {
                        setPhoneNumberValid({ status: 'is-valid', message: null })
                    }
                }
                else {
                    setPhoneNumberValid({ status: 'is-invalid', message: 'Telefon numarası girilmesi zorunludur' })
                    error = { ...error, status: true, message: [...error.message, 'Telefon Numarası girilmesi zorunludur'] }
                }
                resolve(error);
            })


            validateForm.then((error) => {
                if (error.status === false) {
                    addCompanyUser({ variables: { data: { name: newName.trim(), surname: newSurname.trim(), employment: newEmployment.trim(), phoneNumber: phoneNumber.replace("(", "").replace(")", "").replaceAll(" ", ""), email, auth } } })

                }
                else {
                    userLoading(false)
                    for (let mes of error.message) {
                        toastr.warning(mes, 'UYARI')
                    }
                }
            })

        } catch (err) {
            toastr.error(error.message, 'HATA')
        }
    }


    const ValidationReset = () => {
        setNameValid({ status: null, message: null });
        setSurnameValid({ status: null, message: null });
        setEmailValid({ status: null, message: null });
        setPhoneNumberValid({ status: null, message: null });
        setEmploymentValid({ status: null, message: null });
        setYetkiValid({ status: null, message: null });
    }

    return (
        <Fragment>
            <button type='button' className='btn ' onClick={toggle} disabled={`${selectedId ? '' : 'disabled'}`} ><MdLibraryAdd style={{ height: '1.28em', width: '1.28em' }} /><span>Yetkili Ekle</span></button>

            <Modal
                isOpen={ModalOpen}
                centered={true}
                toggle={toggle}
                className='modal-dialog modal-lg'
            >
                <ModalHeader toggle={toggle} ><span>Yetkili Kaydet</span></ModalHeader>
                <ModalBody>
                    {getUserLoading && <Spinner color='primary' />}
                    <Form id='YetkiliKaydet' autoComplete='off' onSubmit={onCreateContactSubmit}>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label htmlFor="email" >Email : </Label>
                                    <div className='input' style={{ position: 'relative' }}>
                                        <input className={`form-control  ${emailValid.status}`} id="email"
                                            disabled={formInputs}
                                            autoComplete='off'
                                            value={createFormValues.email}
                                            onChange={(e) => setCreateFormValues({ ...createFormValues, email: e.target.value })}
                                        />
                                        <div className="invalid-feedback mt-0" style={{ position: 'absolute' }}>
                                            {emailValid.message}
                                        </div>
                                    </div>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label htmlFor="phoneNumber" >Telefon : </Label>
                                    <div style={{ display: 'flex' }}>
                                        <div className='input' style={{ position: 'relative', marginRight: '3px' }}>

                                            <input className={`form-control ${phoneNumberValid.status}`} id="phoneNumber"
                                                disabled={!formInputs}
                                                autoComplete='off'
                                                value={createFormValues.phoneNumber}
                                                onChange={(e) => setCreateFormValues({ ...createFormValues, phoneNumber: e.target.value })}
                                                onFocus={(e) => MaskPhone.mask(e.target)}
                                            />
                                            <div className="invalid-feedback mt-0" style={{ position: 'absolute' }}>
                                                {phoneNumberValid.message}
                                            </div>
                                        </div>
                                        <button type='button' className='btn' style={{ whiteSpace: 'nowrap', border: '1px solid #c4cbd1' }} onClick={getUser}>Kontrol Et</button>
                                    </div>

                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label htmlFor="name" >Adı : </Label>
                                    <div className='input' style={{ position: 'relative' }}>
                                        <input className={`form-control  ${nameValid.status}`} id="name"
                                            disabled={formInputs}
                                            autoComplete='off'
                                            value={createFormValues.name}
                                            onChange={(e) => setCreateFormValues({ ...createFormValues, name: e.target.value })}
                                        />
                                        <div className="invalid-feedback mt-0" style={{ position: 'absolute' }}>
                                            {nameValid.message}
                                        </div>
                                    </div>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label htmlFor="surname" >Soyadı : </Label>
                                    <div className='input' style={{ position: 'relative' }}>
                                        <input
                                            className={`form-control  ${surnameValid.status}`}
                                            disabled={formInputs}
                                            autoComplete='off'
                                            id='surname'
                                            value={createFormValues.surname}
                                            onChange={(e) => setCreateFormValues({ ...createFormValues, surname: e.target.value })}
                                        />
                                        <div className="invalid-feedback mt-0" style={{ position: 'absolute' }}>
                                            {surnameValid.message}
                                        </div>
                                    </div>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="8">
                                <FormGroup>
                                    <Label htmlFor="employment" >Görevi : </Label>
                                    <div className='input' style={{ position: 'relative' }}>
                                        <input className={`form-control  ${employmentValid.status}`} id="employment"
                                            disabled={formInputs}
                                            autoComplete='off'
                                            value={createFormValues.employment}
                                            onChange={(e) => setCreateFormValues({ ...createFormValues, employment: e.target.value })}
                                        />
                                        <div className="invalid-feedback mt-0" style={{ position: 'absolute' }}>
                                            {employmentValid.message}
                                        </div>
                                    </div>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <FormGroup>
                                <Label htmlFor="yetki" >Yetki</Label>
                                <div className={`input  ${YetkiValid.status}`} style={{ position: 'relative' }}>
                                    <div className='form-check'>
                                        <input type="checkbox" className="form-check-input" style={{ marginTop: '1px', cursor: 'pointer' }} id="Admin" onClick={yetkicheck} checked={createFormValues.auth.auths.companyAuths.filter(x => x.company === selectedId && x.roles.some((role) => role === "Admin")).length > 0 ? true : false} />
                                        <label className="form-check-label pl-0" style={{ cursor: 'pointer' }} htmlFor="Admin" >Admin</label>
                                    </div>
                                    <div className='form-check'>
                                        <input type="checkbox" className="form-check-input" style={{ marginTop: '1px', cursor: 'pointer' }} id="Personal" onClick={yetkicheck} checked={createFormValues.auth.auths.companyAuths.filter(x => x.company === selectedId && x.roles.some((role) => role === "Personal")).length > 0 ? true : false} />
                                        <label className="form-check-label pl-0" style={{ cursor: 'pointer' }} htmlFor="Personal">Personel/Özlük</label>
                                    </div>
                                    <div className='form-check'>
                                        <input type="checkbox" className="form-check-input" style={{ marginTop: '1px', cursor: 'pointer' }} id="Finance" onClick={yetkicheck} checked={createFormValues.auth.auths.companyAuths.filter(x => x.company === selectedId && x.roles.some((role) => role === "Finance")).length > 0 ? true : false} />
                                        <label className="form-check-label pl-0" style={{ cursor: 'pointer' }} htmlFor="Finance">Muhasebe</label>
                                    </div>

                                </div>
                                <div className="invalid-feedback mt-0">
                                    {YetkiValid.message}
                                </div>
                            </FormGroup>
                        </Row>

                        <div className='form-footer'>
                            <button type='submit' form='YetkiliKaydet' className='btn'>Kaydet</button>
                        </div>
                    </Form>
                </ModalBody>
            </Modal>
        </Fragment >
    )
}

export default AddContact;