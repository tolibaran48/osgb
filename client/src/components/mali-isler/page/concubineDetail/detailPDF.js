import { GiCardExchange } from "react-icons/gi";
import { Fragment, useContext } from 'react';
import { CompaniesContext } from '../../../../context/companiesContext';
import dayjs from 'dayjs';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const DetailPDF = ({ rows }) => {
    const context = useContext(CompaniesContext);
    const { selectedId, selectedCompany } = context.companyState;

    const createPDF = (values) => {

        const docDefinition = {
            defaultStyle: {
                fontSize: 9.75
            },
            pageMargins: [40, 65, 40, 30],
            header: {
                margin: [40, 20, 40, 20],
                stack: [
                    {
                        columns: [
                            {
                                width: 'auto',
                                text: [
                                    { text: 'bodrum', fontSize: 22, color: 'coral', bold: true, lineHeight: 0.9 },
                                    {
                                        text: [{ text: 'İSG\n', fontSize: 22, color: '#232530', bold: true, lineHeight: 0.9 },
                                        { text: 'İş Sağlığı ve Güvenliği Hizmetleri', fontSize: 7, color: 'black', characterSpacing: 0.34 }]
                                    },
                                ]
                            },
                            { text: `${dayjs().format("DD/MM/YYYY HH:mm")}`, alignment: 'right', fontSize: 11, width: '*' }
                        ]
                    },
                ],
            },

            content: [
                //{
                //    canvas: [
                //        { type: 'line', x1: 0, y1: 8, x2: 515, y2: 8, lineWidth: 0.5, lineColor: 'coral' },
                //        { type: 'line', x1: 0, y1: 11, x2: 515, y2: 11, lineWidth: 1.5, lineColor: 'coral' },
                //    ]
                //},
                //{ text: 'Tablo İçeriği', margin: [0, 20, 0, 0]},
                {
                    columns: [
                        {
                            width: 'auto',
                            text: [
                                { text: `${values[0].companyName}\n`, fontSize: 9.75 },
                                { text: `${values[0].vergiDairesi}\n`, fontSize: 9.75 },
                                { text: `${values[0].vergiNumarasi}`, fontSize: 9.75 },
                            ]
                        }
                    ]
                },
                {
                    layout: 'lightHorizontalLines',
                    margin: [0, 20],
                    table: {
                        fontSize: 9.75,
                        headerRows: 1,
                        widths: ['*', '*', '*', '*', '*'],
                        body:
                            [['İşlem Türü', 'İşlem Tarihi', 'Tahsilat Tutarı', 'Fatura Tutarı', 'Bakiye']].concat(values.map(value =>
                                [
                                    { text: `${value.process}`, borderColor: ['coral', 'coral', 'coral', 'coral'] },
                                    { text: `${dayjs(value.processDate).format("DD/MM/YYYY")}`, borderColor: ['coral', 'coral', 'coral', 'coral'] },
                                    {
                                        text: `${value.receive ? new Intl.NumberFormat('tr-TR', {
                                            style: 'currency',
                                            currency: 'TRY',
                                        }).format(value.receive) : ''}`, borderColor: ['coral', 'coral', 'coral', 'coral'], color: 'green'
                                    },
                                    {
                                        text: `${value.debt ? new Intl.NumberFormat('tr-TR', {
                                            style: 'currency',
                                            currency: 'TRY',
                                        }).format(value.debt) : ''}`, borderColor: ['coral', 'coral', 'coral', 'coral'], color: 'red'
                                    },
                                    {
                                        text: `${new Intl.NumberFormat('tr-TR', {
                                            style: 'currency',
                                            currency: 'TRY',
                                        }).format(value.subTotal)}`, borderColor: ['coral', 'coral', 'coral', 'coral']
                                    },
                                ]
                            ))
                    }
                }
            ]
        };

        pdfMake.createPdf(docDefinition).open({}, window.open());
    }
    const createFile = (e) => {
        e.preventDefault();
        try {
            const _rows = [];
            const Ekle = (concubine) => {
                _rows.push({
                    'companyName': concubine.original.companyName.isgKatipName ?? concubine.original.companyName.name,
                    'vergiDairesi': concubine.original.vergiDairesi,
                    'vergiNumarasi': concubine.original.vergiNumarasi,
                    'process': concubine.original.process,
                    'processDate': concubine.original.processDate,
                    'receive': concubine.original.receive,
                    'debt': concubine.original.debt,
                    'subTotal': concubine.original.subTotal,
                })
            }

            rows.map((concubine) => {
                Ekle(concubine)
            })

            createPDF(_rows);
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
                    <span>Pdf Oluştur</span>
                </button>
            </div>
        </Fragment>
    );
}

export default DetailPDF;