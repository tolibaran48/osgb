import React, { Fragment, useEffect, useContext } from 'react';
import './insuranceUpload.scss'
import { GiCardExchange } from "react-icons/gi";
import * as XLSX from 'xlsx';
import { CompaniesContext } from '../../../../context/companiesContext';
import toastr from 'toastr';

const OldSystem = ({ rows }) => {
    const { companyState: { companies } } = useContext(CompaniesContext);

    const createFile = async e => {
        e.preventDefault();
        try {
            const _rows = [];

            const Ekle = (insurance, atama) => {
                _rows.push({
                    'Firma Ünvanı': insurance.original.companyName,
                    'Hizmet Alan Kurum': insurance.original.isgKatipName,
                    'SGK Sicil No': insurance.original.insuranceNumber,
                    'Vergi Numarası': companies.find((company) => company._id === insurance.original.company).vergi.vergiNumarasi,
                    'Tehlike Sınıfı': insurance.original.tehlikeSinifi,
                    'Atama ID': atama.assignmentId,
                    'Personel Kategori': atama.category,
                    'Adı Soyadı': atama.nameSurname,
                    'Çalışma Durumu': atama.approvalStatus === 'Sözleşme İptal' ? 'Ayrıldı' : atama.approvalStatus === 'Onaylandı' ? 'Onaylandı' : 'Onay Bekliyor',
                    'Grv. Başlama Trh.': atama.startDate ?? '',
                    'Grv. Ayrılış Trh.': atama.endDate ?? '',
                    'Ayl. Çlş. Süresi (Dk.)': atama.assignmentTime,
                    'Toplam Ç.S.': insurance.original.employeeCount,
                })

            }

            const bosEkle = (insurance) => {
                _rows.push({
                    'Firma Ünvanı': insurance.original.companyName,
                    'Hizmet Alan Kurum': insurance.original.isgKatipName,
                    'SGK Sicil No': insurance.original.insuranceNumber,
                    'Vergi Numarası': companies.find((company) => company._id === insurance.original.company).vergi.vergiNumarasi,
                    'Tehlike Sınıfı': '',
                    'Atama ID': '',
                    'Personel Kategori': '',
                    'Adı Soyadı': '',
                    'Çalışma Durumu': '',
                    'Grv. Başlama Trh.': '',
                    'Grv. Ayrılış Trh.': '',
                    'Ayl. Çlş. Süresi (Dk.)': '',
                    'Toplam Ç.S.': insurance.original.employeeCount,
                })

            }
            rows.map((insurance) => {
                if (insurance.original.assignmentStatus.uzmanStatus.approvalAssignments.length == 0 && insurance.original.assignmentStatus.hekimStatus.approvalAssignments.length == 0 && insurance.original.assignmentStatus.dspStatus.approvalAssignments.length == 0) {
                    bosEkle(insurance)
                }
                else {
                    insurance.original.assignmentStatus.uzmanStatus.approvalAssignments.length > 0 &&
                        insurance.original.assignmentStatus.uzmanStatus.approvalAssignments.map(atama => {
                            Ekle(insurance, atama)
                        })
                    insurance.original.assignmentStatus.hekimStatus.approvalAssignments.length > 0 &&
                        insurance.original.assignmentStatus.hekimStatus.approvalAssignments.map(atama => {
                            Ekle(insurance, atama)
                        })
                    insurance.original.assignmentStatus.dspStatus.approvalAssignments.length > 0 &&
                        insurance.original.assignmentStatus.dspStatus.approvalAssignments.map(atama => {
                            Ekle(insurance, atama)
                        })
                }

            })

            /* generate worksheet and workbook */
            const worksheet = XLSX.utils.json_to_sheet(_rows);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Atamalar");

            /* create an XLSX file and try to save to Presidents.xlsx */
            XLSX.writeFile(workbook, "İsg Katip Atamaları.xlsx", { compression: true });
        }
        catch (err) {
            toastr.error(err.message, 'HATA')
        }
    }

    return (
        <Fragment>
            <div className='header-buttons' style={{ display: 'flex' }}>
                <button type="button" onClick={createFile} className='btn' style={{ lineHeight: '1.4' }}>
                    <GiCardExchange style={{ height: '1.28em', width: '1.28em' }} />
                    <span>Eski Sistem Şablon Oluştur</span>
                </button>
            </div>
        </Fragment>
    );
}

export default OldSystem;