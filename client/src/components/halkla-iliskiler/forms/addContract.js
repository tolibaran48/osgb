import React, { useState, useEffect, Fragment, useContext, useRef } from 'react';
import { CompaniesContext } from '../../../context/companiesContext';
import './addCompany.scss'
import dayjs from "dayjs";
import SelectInput from '../../../downshift/selectInput';
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

const AddContract = () => {
    const [ModalOpen, setModalOpen] = useState(false);
    const { companies, companyState: { selectedCompany } } = useContext(CompaniesContext)

    const initial = {
        company: null,
        contractDate: dayjs().format('YYYY-MM-DD'),
        contractType: '',
        contractStatus: '',
        monthlyContractType: '',
        KDV: '',
        annuityPaymentDueDate: dayjs().format('YYYY-MM-DD'),
        annuityPaymentAmount: ''
    }

    const [createFormValues, setCreateFormValues] = useState(initial)

    useEffect(() => {
        setCreateFormValues({ ...createFormValues, company: selectedCompany })
    }, [selectedCompany])



    useEffect(() => {
        setCreateFormValues(initial)
    }, [ModalOpen])



    const toggle = () => {
        setModalOpen(!ModalOpen)
    }

    return (
        <Fragment>
            <button disabled={!selectedCompany} type="button" className='btn button-bg-green' onClick={toggle} style={{ lineHeight: '1.4', height: '100%', display: 'flex', flexDirection: 'column' }}  >
                <div style={{ alignSelf: 'center' }}>
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
                <ModalHeader>Personel Ekle</ModalHeader>
                <ModalBody>
                    <Form id='sendForm'>
                        {//loading ? <Spinner color='primary' /> : null
                        }
                        <Row>
                            <FormGroup>
                                <Label htmlFor="workingStatus" className='mb-0 font-weight-bold text-secondary' >Firma</Label>
                                <div className='input' style={{ position: 'relative' }}>
                                    <Input alignment={'left'} className='form-control' disabled
                                        value={selectedCompany?.name}
                                    />
                                </div>
                            </FormGroup>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for='identityId' className='mb-0 font-weight-bold text-secondary'>Sözleşme Tarihi</Label>
                                    <Input
                                        className='mb-2 form-control'
                                        type='date'
                                        autoComplete="off"
                                        name='identityId'
                                        id='identityId'
                                        placeholder='Sözleşme Tarihi'
                                        onChange={(e) => setCreateFormValues({ ...createFormValues, contractDate: e.target.value })}
                                        value={createFormValues.contractDate}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for='identityId' className='mb-0 font-weight-bold text-secondary'>Ödeme Tipi</Label>
                                    <SelectInput defValue={''} className='form-control' alignment='left' onChange={(e) => { setCreateFormValues({ ...createFormValues, contractType: e }) }} value={createFormValues.contractType}
                                        items={[
                                            { value: "Yıllık", id: "Yillik" },
                                            { value: "Aylık", id: "Aylik" }
                                        ]} />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for='identityId' className='mb-0 font-weight-bold text-secondary'>Son Ödeme Tarihi</Label>
                                    <Input
                                        className='mb-2 form-control'
                                        type='date'
                                        autoComplete="off"
                                        name='identityId'
                                        id='identityId'
                                        placeholder='Son Ödeme Tarihi'
                                        onChange={(e) => setCreateFormValues({ ...createFormValues, annuityPaymentDueDate: e.target.value })}
                                        value={createFormValues.annuityPaymentDueDate}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label htmlFor="workingStatus" className='mb-0 font-weight-bold text-secondary' >Sözleşme Tutarı</Label>
                                    <div className='input' style={{ position: 'relative' }}>
                                        <Input alignment={'left'} className='form-control'
                                            onChange={(e) => setCreateFormValues({ ...createFormValues, annuityPaymentAmount: e.target.value })}
                                            value={createFormValues.annuityPaymentAmount}
                                        />
                                    </div>
                                </FormGroup>
                            </Col>
                        </Row>
                        <ModalFooter>
                            <Button type='submit' color='dark' block form='sendForm' >Kaydet</Button>
                        </ModalFooter>
                    </Form>
                </ModalBody>

            </Modal>
        </Fragment>
    )
}

export default AddContract;