
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { AiFillFileAdd, AiFillFile } from "react-icons/ai";
import { GiCardExchange } from "react-icons/gi";
import { Fragment, useState, useContext } from 'react';
import { CompaniesContext } from '../../../../context/companiesContext';
import { InsurancesContext } from '../../../../context/insurancesContext';
import { AuthContext } from '../../../../context/authContext';
import * as XLSX from 'xlsx';
import { Modal, ModalHeader, ModalBody, ModalFooter, Spinner } from 'reactstrap';
import { SEND_INVOICE_WİTH_EXCEL } from '../../../../GraphQL/Mutations/invoice/invoice';
import { useMutation } from '@apollo/client';
import _ from 'lodash';
import toastr from 'toastr';

const SendInvoiceExcel = () => {
    const navigate = useNavigate();
    const { signOut } = useContext(AuthContext);
    const [fileFatura, setExcelFileFatura] = useState();
    const { getInsurances, insuranceState: { isLoading } } = useContext(InsurancesContext);
    const { resetSelectCompany, companyState: { selectedId, companies } } = useContext(CompaniesContext);




    const readInvoiceFile = (e) => {
        e.preventDefault();
        if (e.target.files.length > 0) {
            setExcelFileFatura(e.target.files[0])
        }
        else {
            setExcelFileFatura()
        }
    };

    const [SendInovices, { loading: manyLoading }] = useMutation(SEND_INVOICE_WİTH_EXCEL, {
        onCompleted: (data) => {
            toggle()
        },
        onError({ graphQLErrors }) {
            const err = graphQLErrors[0].extensions;
            console.log(err)
            if (err.status && err.status == 401) {
                signOut()
                navigate('/portal-giris')
            }
        }
    })



    const [ModalOpen, setModalOpen] = useState(false);

    const toggle = () => {
        setModalOpen(!ModalOpen);
        setExcelFileFatura()
    }

    function ExcelDate(serial) {
        if (serial == null || serial == '') { return null }
        else if (dayjs(serial, 'DD/MM/YYYY').isValid()) { return dayjs(serial).format('DD/MM/YYYY') }
        else {
            var utc_days = Math.floor(serial - 25569);
            var utc_value = utc_days * 86400;
            var date_info = new Date(utc_value * 1000);
            return dayjs(new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate())).format('DD/MM/YYYY');
        }
    }

    const onFormSubmit = async e => {
        e.preventDefault();

        if (fileFatura) {

            // dispatch(setItemsLoading());
            const promise = new Promise(function (resolve, reject) {
                const fileReader = new FileReader();
                fileReader.readAsArrayBuffer(fileFatura);

                fileReader.onload = (e) => {
                    const bufferArray = e.target.result;
                    const wb = XLSX.read(bufferArray, { type: 'buffer' });
                    const wsName = wb.SheetNames[0];
                    const ws = wb.Sheets[wsName];

                    const data = XLSX.utils.sheet_to_json(ws);
                    const veri = data;
                    //const veri=data.slice(0,10);
                    resolve(veri);
                };

                fileReader.onerror = (error) => {
                    toastr(error, 'HATA');
                }
            });

            await promise.then(async (faturalar) => {
                for (const fatura of faturalar) {
                    let cont = await SendInovices({ variables: { data: { company: fatura.company, to: `90${fatura.to}`, invoiceAmount: fatura.invoiceAmount, fileName: fatura.fileName, invoiceDate: fatura.invoiceDate, type: "faturalar" } } })
                    console.log({ cont, fatura })
                }
            })

        }
        else {
            // dispatch(setItemsNotLoading());
            //toastr.error('Yüklenecek dosyayı seçin...','HATA')
        }
    }


    return (
        <Fragment>
            <div className='header-buttons' style={{ display: 'flex' }}>
                <button type="button" onClick={toggle} className='btn' style={{ lineHeight: '1.4' }} disabled={isLoading ? 'disabled' : ''}>
                    <GiCardExchange style={{ height: '1.28em', width: '1.28em' }} />
                    <span>Fatura Gönder</span>
                </button>

                <Modal
                    isOpen={ModalOpen}
                    centered={true}
                    toggle={toggle}
                    backdrop={false}
                    keyboard={false}
                >

                    <ModalHeader toggle={toggle}>EXCEL TOPLU Fatura Aktar</ModalHeader>
                    {manyLoading && <Spinner />}
                    <ModalBody>
                        <form onSubmit={onFormSubmit} id='faturaForm'>
                            <div className='rows row'>
                                <div md="12">
                                    <fieldset>
                                        <label htmlFor='contact' className='mb-0 font-weight-bold text-secondary'>Yetkili Dosyası</label>
                                        <input type="file" name="file" id="file" className="inputfile" onChange={readInvoiceFile} />
                                        <label htmlFor="file" name="contact" id="contact" type="button" className='btn' style={{ lineHeight: '1.4' }}>
                                            {!fileFatura ? <AiFillFileAdd style={{ height: '1.28em', width: '1.28em', color: 'red' }} /> : <AiFillFile style={{ height: '1.28em', width: '1.28em' }} />}
                                            <span>{!fileFatura ? 'Bir dosya seç...' : fileFatura.name}</span>
                                        </label>
                                    </fieldset>
                                </div>
                            </div>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <button type="submit" id="contactFormButton" className='btn' form='faturaForm' style={{ lineHeight: '1.4' }} disabled={!fileFatura ? 'disabled' : ''}>
                            <span>Kaydet</span>
                        </button>
                    </ModalFooter>
                </Modal>
            </div>
        </Fragment>
    );
}

export default SendInvoiceExcel;