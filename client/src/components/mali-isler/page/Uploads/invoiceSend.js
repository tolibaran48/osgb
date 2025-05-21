import React, { useState, Fragment, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { UPLOAD_INVOICE } from '../../../../GraphQL/Mutations/invoice/invoice'
import { AiFillFileAdd, AiFillFile } from "react-icons/ai";
import { AuthContext } from '../../../../context/authContext';
import { CompaniesContext } from '../../../../context/companiesContext';

import * as XLSX from 'xlsx';
import _ from 'lodash';
import dayjs from 'dayjs';
import 'dayjs/locale/tr';
import XMLParser from 'react-xml-parser';



const InvoiceSendPage = () => {
    const navigate = useNavigate();
    const { signOut } = useContext(AuthContext);
    const [invoiceSendList, setInvoiceSendList] = useState();
    const { resetSelectCompany, companyState: { selectedId, companies } } = useContext(CompaniesContext);

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

    const readInvoiceSendFile = async (e) => {
        e.preventDefault();
        if (e.target.files.length > 0) {
            setInvoiceSendList(e.target.files)

        }
        else {
            setInvoiceSendList()
        }
    };

    const createFile = async _companies => {
        try {
            const _rows = [];
            const Ekle = (company) => {
                _rows.push({
                    'Firma Ünvanı': company.name,
                    'Vergi Numarası': company.vergiNumarasi,
                    'debt': new Intl.NumberFormat('tr-TR', {
                        style: 'currency',
                        currency: 'TRY',
                    }).format(company.debt)
                    ,
                    'Fatura Numarası': company.processNumber
                    ,
                    'Fatura Tarihi': dayjs(company.processDate).format("DD/MM/YYYY")
                })

            }

            _companies.map((company) => {
                Ekle(company)
            })


            /* generate worksheet and workbook */
            const worksheet = XLSX.utils.json_to_sheet(_rows);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Faturalar");

            /* create an XLSX file and try to save to Presidents.xlsx */
            XLSX.writeFile(workbook, "Firma Faturaları.xlsx", { compression: true });
        }
        catch (error) {
            console.log(error)
        }
    }


    const onInvoiceSendSubmit = e => {
        e.preventDefault();

        let faturalar = []
        let invoices = []

        for (let invoice of invoiceSendList) {

            let filePromise = new Promise(resolve => {
                let reader = new FileReader()
                reader.readAsText(invoice)
                reader.onload = () => {
                    var result = new XMLParser().parseFromString(reader.result);
                    resolve(result);
                }
            });

            faturalar.push(filePromise)
        }

        Promise.all(faturalar).then(fileContents => {
            for (let invoice of fileContents) {
                let getInvoices = new Promise(resolve => {
                    resolve({
                        'vergiNumarasi': invoice.getElementsByTagName('cac:AccountingCustomerParty')[0].getElementsByTagName('cac:Party')[0].getElementsByTagName('cac:PartyIdentification')[0].getElementsByTagName('cbc:ID')[0].value,
                        'debt': invoice.getElementsByTagName('cac:LegalMonetaryTotal')[0].getElementsByTagName('cbc:PayableAmount')[0].value,
                        'processDate': dayjs(invoice.getElementsByTagName('cbc:IssueDate')[0].value).format(),
                        'processNumber': invoice.getElementsByTagName('cbc:ID')[0].value,
                        'process': 'Fatura'
                    })
                })
                invoices.push(getInvoices)
            }

            Promise.all(invoices).then(invoices => {
                let _companies = invoices.map((item) => {
                    let company = companies.find(x => x.vergi.vergiNumarasi === item.vergiNumarasi)
                    if (company) {
                        return {
                            name: company.name,
                            vergiNumarasi: item.vergiNumarasi,
                            debt: item.debt,
                            processDate: item.processDate,
                            processNumber: item.processNumber,
                            process: item.process
                        }
                    }
                    else {
                        console.log({ hata: item })
                    }
                })
                console.log(_companies)
                createFile(_companies)
            })

        });
    }


    return (
        <Fragment>
            <div>Fatura Gönder</div>
            <form onSubmit={onInvoiceSendSubmit} id='invoiceSendForm'>
                <div className='rows row'>
                    <div md="12">
                        <fieldset>
                            <label htmlFor='invoicefile' className='mb-0 font-weight-bold text-secondary'>Mesaj Dosyası</label>
                            <input type="file" name="invoicesendfile" id="invoicesendfile" className="inputfile" multiple onChange={readInvoiceSendFile} />
                            <label htmlFor="invoicesendfile" name="invoicesendfile" id="invoicesendfile" type="button" className='btn' style={{ lineHeight: '1.4' }}>
                                {!invoiceSendList ? <AiFillFileAdd style={{ height: '1.28em', width: '1.28em', color: 'red' }} /> : <AiFillFile style={{ height: '1.28em', width: '1.28em' }} />}
                                <span>{!invoiceSendList ? 'Bir dosya seç...' : invoiceSendList.name}</span>
                            </label>
                        </fieldset>
                    </div>
                </div>
                <button type="submit" id="invoiceForm" className='btn' form='invoiceSendForm' style={{ lineHeight: '1.4' }} disabled={!invoiceSendList ? 'disabled' : ''}>
                    <span>Oluşturs</span>
                </button>
            </form>
        </Fragment>
    );
}

export default InvoiceSendPage;