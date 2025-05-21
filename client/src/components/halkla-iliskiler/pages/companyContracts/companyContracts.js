import React, { useEffect, Fragment, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useLazyQuery } from '@apollo/client';
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
import { CompaniesContext } from '../../../../context/companiesContext';
import { UsersContext } from '../../../../context/usersContext';
import { AuthContext } from '../../../../context/authContext';
import { GET_COMPANIES } from '../../../../GraphQL/Queries/company/company';
import SelectInput from '../../../../downshift/selectInput';
import SearchInput from '../../../../downshift/searchInput';

const ContractPage = () => {

    const navigate = useNavigate();
    const { signOut } = useContext(AuthContext);
    const { getCompanies, companyLoading, resetSelectCompany, selectCompany, companyState: { companies, selectedCompany } } = useContext(CompaniesContext);

    const initial = {
        company: null,
        contractStartDate: '',
        contractEndDate: '',
        contractPaymentType: '',
        monthlyContractType: '',
        paymentAmount: '',
        file: null,
        optionContractConditions: [
            {
                name: "Tolunay",
                id: 1
            }
        ]
        //processDate: dayjs().format('YYYY-MM-DD')
    }
    const initialCondition = {
        type: '',
        option: '',
        count1: 0,
        count2: 0,
        KDV: '',
        price: 0
    }


    const [contract, setContract] = useState(initial);
    const [newCondition, setNewCondition] = useState(initialCondition);
    const [newForm, setForm] = useState(false);


    const [_getCompanies, { loading }] = useLazyQuery(GET_COMPANIES, {
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

    useEffect(() => {
        !companies.length > 0 && _getCompanies()
        return () => {
            resetSelectCompany();
        }
    }, [])

    const handleCondition = () => {
        setForm(!newForm)
    }


    return (
        <Fragment>
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ maxWidth: '750px', width: '90%', background: 'white' }}>
                    <ModalHeader>Sözleşme</ModalHeader>
                    <ModalBody>
                        <Form id='sendForm'>
                            {loading ? <Spinner color='primary' /> : null}
                            <Row>
                                <FormGroup>
                                    <Label htmlFor="workingStatus" className='mb-0 font-weight-bold text-secondary' >Firma</Label>
                                    <div className='input' style={{ position: 'relative' }}>
                                        <SearchInput alignment={'left'} className='form-control'
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
                                        <Label for='startDate' className='mb-0 font-weight-bold text-secondary'>Başlangıç Tarihi</Label>
                                        <Input
                                            className='mb-2 form-control'
                                            type='date'
                                            autoComplete="off"
                                            name='startDate'
                                            id='startDate'
                                            placeholder='İşlem Tarihi'
                                        // onChange={(e) => setEmployee({ ...employee, processDate: e.target.value })}
                                        // value={employee.processDate}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for='endDate' className='mb-0 font-weight-bold text-secondary'>Bitiş Tarihi</Label>
                                        <Input
                                            className='mb-2 form-control'
                                            type='date'
                                            autoComplete="off"
                                            name='endDate'
                                            id='endDate'
                                            placeholder='İşlem Tarihi'
                                        //onChange={(e) => setEmployee({ ...employee, processDate: e.target.value })}
                                        // value={employee.processDate}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for='contractPaymentType' className='mb-0 font-weight-bold text-secondary'>Ödeme Tipi</Label>
                                        <SelectInput defValue={''} className='form-control' alignment='left'
                                            //validation={companyWorkingStatusValid} 
                                            disabled={loading}
                                            onChange={(e) => { setContract({ ...contract, contractPaymentType: e, paymentAmount: '', monthlyContractType: '' }) }}
                                            value={contract.contractPaymentType}
                                            items={[
                                                { value: "Yıllık", id: "Yillik" },
                                                { value: "Aylık", id: "Aylik" }
                                            ]} />
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    {contract.contractPaymentType === "Aylik" ?
                                        <FormGroup>
                                            <Label for='monthlyContractType' className='mb-0 font-weight-bold text-secondary'>Faturalandırma</Label>
                                            <SelectInput defValue={''} className='form-control' alignment='left'
                                                //validation={companyWorkingStatusValid} 
                                                disabled={loading}
                                                onChange={(e) => { setContract({ ...contract, monthlyContractType: e }) }}
                                                value={contract.monthlyContractType}
                                                items={[
                                                    { value: "Fix", id: "Fix" },
                                                    { value: "Kişi başı", id: "Kisi basi" },
                                                    { value: "Opsiyonlu", id: "Opsiyonlu" }
                                                ]} />
                                        </FormGroup> :
                                        <FormGroup>
                                            <Label for='paymentAmount' className='mb-0 font-weight-bold text-secondary'>Tutar</Label>
                                            <Input
                                                className='mb-2 form-control'
                                                type='text'
                                                autoComplete="off"
                                                name='paymentAmount'
                                                id='paymentAmount'
                                                placeholder='Tutar'
                                                onChange={(e) => setContract({ ...contract, paymentAmount: e.target.value })}
                                                value={contract.paymentAmount}
                                            />
                                        </FormGroup>
                                    }
                                </Col>
                            </Row>
                            <Row>
                                {contract.monthlyContractType === "Fix" || contract.monthlyContractType === "Kisi basi" ?
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for='paymentAmount' className='mb-0 font-weight-bold text-secondary'>Tutar</Label>
                                            <Input
                                                className='mb-2 form-control'
                                                type='text'
                                                autoComplete="off"
                                                name='paymentAmount'
                                                id='paymentAmount'
                                                placeholder='Tutar'
                                                onChange={(e) => setContract({ ...contract, paymentAmount: e.target.value })}
                                                value={contract.paymentAmount}
                                            />
                                        </FormGroup>
                                    </Col> :
                                    contract.monthlyContractType === "Opsiyonlu" ?
                                        <Fragment>
                                            {contract.optionContractConditions.map((item) => (
                                                <li key={item.id}>{item.name}</li>
                                            ))}
                                            <Button type='button' color='dark' block onClick={handleCondition} > Ekle</Button>
                                        </Fragment>
                                        : null

                                }

                            </Row>
                            <Row>
                                {newForm &&
                                    <Col Col md={12}>
                                        <FormGroup>
                                            <SelectInput defValue={''} className='form-control' alignment='left'
                                                //validation={companyWorkingStatusValid} 
                                                disabled={loading}
                                                onChange={(e) => { setNewCondition({ ...newCondition, type: e }) }}
                                                value={newCondition.type}
                                                items={[
                                                    { value: "Çalışan sayısı .... kişiden küçükse ve/veya eşitse", id: "küçükse ve/veya eşitse" },
                                                    { value: "Çalışan sayısı .... kişi ile .... kişi arasında ise", id: "arasında" },
                                                    { value: "Çalışan sayısı .... kişiden çoksa", id: "büyükse" }
                                                ]} />
                                        </FormGroup>
                                    </Col>
                                }
                            </Row>
                            <Row>
                                {newForm &&
                                    <Col Col md={12}>
                                        <FormGroup style={{ textWrap: 'nowrap', display: 'flex' }}>
                                            <p style={{ alignContent: 'end' }}>Çalışan kişi sayısı </p>
                                            <Input
                                                className='form-control'
                                                type='text'
                                                autoComplete="off"
                                                name='paymentAmount'
                                                id='paymentAmount'
                                                placeholder='Tutar'
                                                style={{ width: 'auto', lineHeight: '0', maxWidth: '50px', padding: '.75rem .50rem 0 .50rem', border: 'none', borderRadius: '0', borderBottom: '1px solid #ced4da' }}
                                                onChange={(e) => setContract({ ...contract, paymentAmount: e.target.value })}
                                                value={contract.paymentAmount}
                                            />
                                            <div style={{ alignContent: 'end' }}>kişiden küçükse ve/veya eşitse KDV </div>
                                            <SelectInput defValue={''} className='form-control' alignment='left' style={{ width: '100px' }}
                                                //validation={companyWorkingStatusValid} 
                                                disabled={loading}
                                                onChange={(e) => { setNewCondition({ ...newCondition, type: e }) }}
                                                value={newCondition.type}
                                                items={[
                                                    { value: "dahil", id: "küçükse ve/veya eşitse" },
                                                    { value: "hariç", id: "arasında" }
                                                ]} />

                                            <Input
                                                className='form-control'
                                                type='text'
                                                autoComplete="off"
                                                name='paymentAmount'
                                                id='paymentAmount'
                                                placeholder='Tutar'
                                                style={{ width: 'auto', lineHeight: '0', maxWidth: '120px', padding: '.75rem .50rem 0 .50rem', border: 'none', borderRadius: '0', borderBottom: '1px solid #ced4da' }}
                                                onChange={(e) => setContract({ ...contract, paymentAmount: e.target.value })}
                                                value={contract.paymentAmount}
                                            />
                                            <div style={{ alignContent: 'end' }}>TL</div>

                                        </FormGroup>
                                    </Col>
                                }
                            </Row>
                            <ModalFooter>
                                <Button type='submit' color='dark' block form='sendForm' >Kaydet</Button>
                            </ModalFooter>
                        </Form>
                    </ModalBody>
                </div>
            </div>
        </Fragment >
    );
}

export default ContractPage;