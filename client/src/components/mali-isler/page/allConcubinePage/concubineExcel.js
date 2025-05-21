
import { GiCardExchange } from "react-icons/gi";
import { Fragment } from 'react';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';

const ConcubineExcel = ({ rows }) => {

    const createFile = async e => {
        e.preventDefault();
        try {
            const _rows = [];
            const Ekle = (company) => {
                _rows.push({
                    'Firma Ünvanı': company.values.companyName.name,
                    'Vergi Dairesi': company.values.vergiDairesi,
                    'Vergi Numarası': company.values.vergiNumarasi,
                    'Son Tahsilat': company.values.sonOdeme !== null ? `${dayjs(company.values.sonOdeme.processDate).format("DD/MM/YYYY")} \n ${new Intl.NumberFormat('tr-TR', {
                        style: 'currency',
                        currency: 'TRY',
                    }).format(company.values.sonOdeme.receive)} ` : ''
                    ,
                    'Son Fatura': company.values.sonFatura !== null ? `${dayjs(company.values.sonFatura.processDate).format("DD/MM/YYYY")} \n ${new Intl.NumberFormat('tr-TR', {
                        style: 'currency',
                        currency: 'TRY',
                    }).format(company.values.sonFatura.debt)} ` : ''
                    ,
                    'Toplam Borç': new Intl.NumberFormat('tr-TR', {
                        style: 'currency',
                        currency: 'TRY',
                    }).format(company.values.toplam),
                    'Çalışma Durumu': company.values.workingStatus,
                })

            }
            
            rows.map((company) => {
                Ekle(company)
            })


            /* generate worksheet and workbook */
            const worksheet = XLSX.utils.json_to_sheet(_rows);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Atamalar");

            /* create an XLSX file and try to save to Presidents.xlsx */
            XLSX.writeFile(workbook, "Firma Carileri.xlsx", { compression: true });
        }
        catch (error) {
            console.log(error)
        }
    }

    return (
        <Fragment>
            <div className='header-buttons' style={{ display: 'flex' }}>
                <button type="button" onClick={createFile} className='btn' style={{ lineHeight: '1.4' }}>
                    <GiCardExchange style={{ height: '1.28em', width: '1.28em' }} />
                    <span>Excele Yaz</span>
                </button>
            </div>
        </Fragment>
    );
}

export default ConcubineExcel;