import React, { useState, Fragment, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { UPLOAD_INVOICE } from '../../../../GraphQL/Mutations/invoice/invoice'
import { AiFillFileAdd, AiFillFile } from "react-icons/ai";
import { AuthContext } from '../../../../context/authContext';
import InvoiceSend from './invoiceSend';
import ContactUpload from './contact';
import SendInvoiceExcel from './SendInvoiceWithExcel';

import * as XLSX from 'xlsx';
import _ from 'lodash';
import dayjs from 'dayjs';
import 'dayjs/locale/tr';
import XMLParser from 'react-xml-parser';



const InvoiceUploadPage = () => {
    const navigate = useNavigate();
    const { signOut } = useContext(AuthContext);
    const [invoiceList, setInvoiceList] = useState();

    const [uploadInvoice, { loadingUploadInvoice, errorUploadInvoice }] = useMutation(UPLOAD_INVOICE, {
        onCompleted(data) {
            console.log(data)
        },
        onError(graphQLErrors) {
            console.log(graphQLErrors)
            const err = graphQLErrors[0].extensions;
            console.log(err)
            if (err.status && err.status == 401) {
                signOut()
                navigate('/portal-giris')
            }
        }
    });

    const readInvoiceFile = async (e) => {
        e.preventDefault();
        if (e.target.files.length > 0) {
            setInvoiceList(e.target.files)

        }
        else {
            setInvoiceList()
        }
    };

    const onInvoiceFormSubmit = e => {
        e.preventDefault();

        let faturalar = []
        let invoices = []

        for (let invoice of invoiceList) {
            let fileName;
            let filePromise = new Promise(resolve => {
                let reader = new FileReader()
                fileName = invoice.name.split(".xml")[0]
                reader.readAsText(invoice)
                reader.onload = () => {
                    var result = new XMLParser().parseFromString(reader.result);
                    resolve({ result, fileName });
                }
            });

            faturalar.push(filePromise)
        }

        Promise.all(faturalar).then(fileContents => {

            for (let invoice of fileContents) {
                let getInvoices = new Promise(resolve => {
                    resolve({
                        'vergiNumarasi': invoice.result.getElementsByTagName('cac:AccountingCustomerParty')[0].getElementsByTagName('cac:Party')[0].getElementsByTagName('cac:PartyIdentification')[0].getElementsByTagName('cbc:ID')[0].value,
                        'debt': invoice.result.getElementsByTagName('cac:LegalMonetaryTotal')[0].getElementsByTagName('cbc:PayableAmount')[0].value,
                        'processDate': dayjs(invoice.result.getElementsByTagName('cbc:IssueDate')[0].value).format(),
                        'processNumber': invoice.fileName,
                        'process': 'Fatura'
                    })
                })
                invoices.push(getInvoices)
            }

            Promise.all(invoices).then(invoices => {
                uploadInvoice({ variables: { data: { invoices } } })
            })

        });
    }


    return (
        <Fragment>
            <div>Fatura Kaydet</div>
            <form onSubmit={onInvoiceFormSubmit} id='invoiceForm'>
                <div className='rows row'>
                    <div md="12">
                        <fieldset>
                            <label htmlFor='invoicefile' className='mb-0 font-weight-bold text-secondary'>Mesaj Dosyası</label>
                            <input type="file" name="invoicefile" id="invoicefile" className="inputfile" multiple onChange={readInvoiceFile} />
                            <label htmlFor="invoicefile" name="invoicefile" id="invoicefile" type="button" className='btn' style={{ lineHeight: '1.4' }}>
                                {!invoiceList ? <AiFillFileAdd style={{ height: '1.28em', width: '1.28em', color: 'red' }} /> : <AiFillFile style={{ height: '1.28em', width: '1.28em' }} />}
                                <span>{!invoiceList ? 'Bir dosya seç...' : invoiceList[0].name}</span>
                            </label>
                        </fieldset>
                    </div>
                </div>

                <button type="submit" id="invoiceForm" className='btn' form='invoiceForm' style={{ lineHeight: '1.4' }} disabled={!invoiceList ? 'disabled' : ''}>
                    <span>Oluştur</span>
                </button>
            </form>
            <ContactUpload />
            <SendInvoiceExcel />
            <InvoiceSend />
        </Fragment>
    );
}

export default InvoiceUploadPage;