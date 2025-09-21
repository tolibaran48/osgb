import React, { useState, useEffect, Fragment, useContext, useRef, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../../context/authContext';
import { useLazyQuery } from '@apollo/client';
import { useMutation } from '@apollo/client';
import SelectInput from '../../../../downshift/searchInput';
import { CompaniesContext } from '../../../../context/companiesContext';
import { EmployeesContext } from '../../../../context/employeesContext';
import { FaFileDownload } from "react-icons/fa";
import { AiFillFile } from "react-icons/ai";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/tr';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import toastr from 'toastr';
import PersonListTableColumns from './whatsAppPersonPage/personListTableColumns';

import {
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
import { GET_COMPANIES } from '../../../../GraphQL/Queries/company/company';
import { GET_COMPANY_EMPLOYEES } from '../../../../GraphQL/Queries/employees/employees';
import { UPLOAD_WHATSAPP_EMPLOYEE_DOCUMENT } from '../../../../GraphQL/Mutations/employee/person';



const WhatsAppPersonPage = () => {
    dayjs.extend(utc)
    dayjs.extend(timezone)
    dayjs.extend(customParseFormat)
    dayjs.locale('tr')

    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const { signOut } = useContext(AuthContext);
    const { getEmployees, employeeLoading, addEmployee, employeeState: { employees, isLoading } } = useContext(EmployeesContext);
    const { getCompanies, companyLoading, resetSelectCompany, selectCompany, companyState: { companies, selectedCompany } } = useContext(CompaniesContext);

    const company = useRef()

    const [uploadWhatsAppDocument, { loading }] = useMutation(UPLOAD_WHATSAPP_EMPLOYEE_DOCUMENT, {
        onCompleted: (data) => {
            toastr.success('Kayıt başarıyla gerçekleştirilmiştir.', 'BAŞARILI')
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            addEmployee(data.uploadWhatsAppDocument)
            resetSelectCompany()
            setEmployee(initial);
        },
        onError({ graphQLErrors }) {
            const err = graphQLErrors[0].extensions;
            if (err.status && err.status == 401) {
                signOut()
                navigate('/portal-giris')
            }
        }
    });

    const initial = {
        company: null,
        identityId: '',
        name: '',
        surname: '',
        file: null,
        processTime: null
    }
    const [employee, setEmployee] = useState(initial);



    const [_getCompanies, { loading: getCompaniesLoading }] = useLazyQuery(GET_COMPANIES, {
        fetchPolicy: 'network-only',
        onCompleted: (data) => {
            getCompanies(data.companies)
        },
        onError({ graphQLErrors }) {
            companyLoading(false);
            const err = graphQLErrors[0].extensions;
            if (err.status && err.status == 401) {
                signOut()
                navigate('/portal-giris')
            }
        }
    });

    const [_getEmployees, { loading: getContactsLoading }] = useLazyQuery(GET_COMPANY_EMPLOYEES, {
        fetchPolicy: 'network-only',
        onCompleted: (data) => {
            getEmployees(data.company.employees)
            employeeLoading(false)
        },
        onError({ graphQLErrors }) {
            //employeeLoading(false);
            const err = graphQLErrors[0].extensions;
            if (err.status && err.status == 401) {
                signOut()
                navigate('/portal-giris')
            }
        }
    });

    useEffect(() => {
        !companies.length > 0 && _getCompanies()
        return () => {
            resetSelectCompany();
            getEmployees([])
        }
    }, [])

    useEffect(() => {
        if (selectedCompany) {
            employeeLoading(true)
            _getEmployees({ variables: { "vergiNumarasi": selectedCompany.vergi.vergiNumarasi } })
        }
    }, [selectedCompany])

    const handleUpload = async (e) => {
        e.preventDefault();
        try {

            await uploadWhatsAppDocument({
                variables: { data: { identityId: employee.identityId, name: employee.name, surname: employee.surname, company: selectedCompany._id, companyVergi: selectedCompany.vergi.vergiNumarasi, file: employee.file, processTime: dayjs(employee.processDate) } },
                context: {
                    headers: {
                        "Apollo-Require-Preflight": "true"
                    }
                },
            });

        } catch (err) {
            toastr.error(err.message, 'HATA')
        }
    };


    return (
        <Fragment>
            <div style={{ display: 'flex', flexDirection: 'row', height: '100%', padding: '10px 0 10px 0' }}>
                <div style={{ width: '50%', height: '100%', display: 'flex', alignItems: 'start', justifyContent: 'center' }}>
                    <div style={{ maxWidth: '750px', width: '90%', background: 'white' }}>
                        <ModalHeader>Personel Ekle</ModalHeader>
                        <ModalBody>
                            <Form onSubmit={handleUpload} id='sendForm'>
                                {loading ? <Spinner color='primary' /> : null}
                                <Row>
                                    <FormGroup>
                                        <Label htmlFor="workingStatus" className='mb-0 font-weight-bold text-secondary' >Firma</Label>
                                        <div className='input' style={{ position: 'relative' }}>
                                            <SelectInput alignment={'left'} className='form-control'
                                                disabled={!companies.length > 0}
                                                onChange={(e) => selectCompany(e.id)}
                                                value={selectedCompany?._id}
                                                items={companies.map(({ name, _id }) => { return { value: name, id: _id, key: _id } })}
                                            />
                                        </div>
                                    </FormGroup>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for='identityId' className='mb-0 font-weight-bold text-secondary'>TC Numarası</Label>
                                            <Input
                                                className='mb-2 form-control'
                                                type='text'
                                                autoComplete="off"
                                                name='identityId'
                                                id='identityId'
                                                placeholder='TC Numarası'
                                                onChange={(e) => setEmployee({ ...employee, identityId: e.target.value })}
                                                value={employee.identityId}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for='identityId' className='mb-0 font-weight-bold text-secondary'>İşlem Tarihi</Label>
                                            <Input
                                                className='mb-2 form-control'
                                                type='date'
                                                autoComplete="off"
                                                name='identityId'
                                                id='identityId'
                                                placeholder='İşlem Tarihi'
                                                onChange={(e) => setEmployee({ ...employee, processDate: e.target.value })}
                                                value={employee.processDate}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row >
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for='name' className='mb-0 font-weight-bold text-secondary'>Adı</Label>
                                            <Input
                                                className='mb-2 form-control'
                                                type='text'
                                                autoComplete="off"
                                                name='name'
                                                id='name'
                                                placeholder='Adı'
                                                onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
                                                value={employee.name}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for='surname' className='mb-0 font-weight-bold text-secondary'>Soyadı</Label>
                                            <Input
                                                className='mb-2 form-control'
                                                type='text'
                                                autoComplete="off"
                                                name='surname'
                                                id='surname'
                                                placeholder='Soyadı'
                                                onChange={(e) => setEmployee({ ...employee, surname: e.target.value })}
                                                value={employee.surname}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12} lg={12}>
                                        <FormGroup>
                                            <Label htmlFor='employeefile' className='mb-0 font-weight-bold text-secondary' >Personel Dosyası</Label>
                                            <input
                                                ref={fileInputRef}
                                                className="inputfile"
                                                type="file" name="employeefile" id="employeefile"
                                                autoComplete="off"
                                                onChange={(e) => setEmployee({ ...employee, file: e.target.files[0] })}
                                            />
                                            <label htmlFor="employeefile" name="employeefile" id="employeefile" type="button" className='form-control btn' style={{ textAlign: `${!employee.file ? 'center' : 'left'}`, border: '1px solid #ced4da' }}>
                                                {!employee.file ? <FaFileDownload style={{ height: '1.28em', width: '1.28em', color: '#0d6efd' }} /> : <AiFillFile style={{ height: '1.28em', width: '1.28em', color: '#0d6efd' }} />}
                                                <span>{!employee.file ? 'Bir dosya seç...' : employee.file.name}</span>
                                            </label>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <ModalFooter>
                                    <Button type='submit' color='dark' block form='sendForm' disabled={loading}>Kaydet</Button>
                                </ModalFooter>
                            </Form>
                        </ModalBody>

                    </div>
                </div>
                <div style={{ width: '50%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <PersonListTableColumns employees={employees} />
                </div>
            </div>
        </Fragment>
    );
}

export default memo(WhatsAppPersonPage);