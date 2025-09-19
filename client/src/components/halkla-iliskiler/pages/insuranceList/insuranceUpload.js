import './insuranceUpload.scss'
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { AiFillFileAdd, AiFillFile } from "react-icons/ai";
import { GiCardExchange } from "react-icons/gi";
import { Fragment, useState, useContext } from 'react';
import { InsurancesContext } from '../../../../context/insurancesContext';
import { AuthContext } from '../../../../context/authContext';
import * as XLSX from 'xlsx';
import { Modal, ModalHeader, ModalBody, ModalFooter, Spinner } from 'reactstrap';
import { UPDATE_MANY_INSURANCES } from '../../../../GraphQL/Mutations/insurance/insurance';
import { useMutation } from '@apollo/client';
import _ from 'lodash';
import toastr from 'toastr';

const InsuranceUpload = () => {
    const navigate = useNavigate();
    const { signOut } = useContext(AuthContext);
    const [fileAtama, setFileAtama] = useState();
    const { getInsurances, insuranceState: { isLoading } } = useContext(InsurancesContext);

    const readFile = (e) => {
        e.preventDefault();
        if (e.target.files.length > 0) {
            setFileAtama(e.target.files[0])
        }
        else {
            setFileAtama()
        }
    };

    const [UpdateManyInsurances, { loading: manyLoading }] = useMutation(UPDATE_MANY_INSURANCES, {
        onCompleted: (data) => {
            getInsurances(data.updateManyInsurance)
            toastr.success('Kayıtlar başarıyla güncelleştirilmiştir.', 'BAŞARILI')
            toggle()
        },
        onError({ graphQLErrors }) {
            const err = graphQLErrors[0].extensions;
            if (err.status && err.status == 401) {
                signOut()
                navigate('/portal-giris')
            }
        }
    })



    const [ModalOpen, setModalOpen] = useState(false);

    const toggle = () => {
        setModalOpen(!ModalOpen);
        setFileAtama()
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

        if (fileAtama) {

            // dispatch(setItemsLoading());
            const promise = new Promise(function (resolve, reject) {
                const fileReader = new FileReader();
                fileReader.readAsArrayBuffer(fileAtama);

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

            const arrays = await promise.then((sonuc) => {
                return sonuc.map((item) => {
                    return {
                        'assignmentId': item["Sözleşme ID"].toString(),
                        'startDate': ExcelDate(item["Sözleşme Başlangıç Tarihi"]),
                        'identificationDate': ExcelDate(item["Sözleşme Tanımlanma Tarihi"]),
                        'endDate': ExcelDate(item["Sözleşme Bitiş Tarihi"]),
                        //'profApprovalStatus': item["Görevlendirilen Kişi Onay Statüsü"].toString(),---
                        //'companyApprovalStatus': item["Hizmet Alan İşyeri Onay Statüsü"].toString(),---
                        'identityId': item["Görevlendirilen Kişi TC Kimlik No"].toString(),
                        'nameSurname': item["Görevlendirilen Kişi Ad Soyad"].toString(),
                        'category': item["Görevlendirilen Kişi Sertifika Tipi"].toString(),
                        'workingStatus': item["Sözleşme Statüsü"].toString(),
                        'workingApproveStatus': item["Sözleşme Onay Durumu"].toString(),
                        'assignmentTime': parseInt(item["Çalışma Süresi"]),
                        'certificateNumber': item["Görevlendirilen Kişi Sertifika No"].toString(),

                        'isgKatipName': item["Hizmet Alan İşyeri Unvanı"].toString(),
                        'tehlikeSinifi': item["Hizmet Alan İşyeri Tehlike Sınıfı"].toString(),
                        'insuranceControlNumber': item["Hizmet Alan İşyeri SGK/DETSİS No"].toString(),
                        'employeeCount': parseInt(item["Hizmet Alan İşyeri Çalışan Sayısı"]),
                    }
                })
            })

            const list = _(arrays).groupBy(x => x.insuranceControlNumber)
                .map((value, key) => ({ insuranceControlNumber: key, assignments: value })).value()
            UpdateManyInsurances({ variables: { data: { insuranceAss: list } } })

        }
        else {
            // dispatch(setItemsNotLoading());
            toastr.error('Yüklenecek dosyayı seçin...', 'HATA')
        }


    }


    return (
        <Fragment>
            <div className='header-buttons' style={{ display: 'flex' }}>
                <button type="button" onClick={toggle} className='btn' style={{ lineHeight: '1.4' }} disabled={isLoading ? 'disabled' : ''}>
                    <GiCardExchange style={{ height: '1.28em', width: '1.28em' }} />
                    <span>Atama Aktar</span>
                </button>

                <Modal
                    isOpen={ModalOpen}
                    centered={true}
                    toggle={toggle}
                    backdrop={false}
                    keyboard={false}
                >

                    <ModalHeader toggle={toggle}>Atama Aktar</ModalHeader>
                    {manyLoading && <Spinner />}
                    <ModalBody>
                        <form onSubmit={onFormSubmit} id='atamaForm'>
                            <div className='rows row'>
                                <div md="12">
                                    <fieldset>
                                        <label htmlFor='atama' className='mb-0 font-weight-bold text-secondary'>Atama Dosyası</label>
                                        <input type="file" name="file" id="file" className="inputfile" onChange={readFile} />
                                        <label htmlFor="file" name="atama" id="atama" type="button" className='btn' style={{ lineHeight: '1.4' }}>
                                            {!fileAtama ? <AiFillFileAdd style={{ height: '1.28em', width: '1.28em', color: 'red' }} /> : <AiFillFile style={{ height: '1.28em', width: '1.28em' }} />}
                                            <span>{!fileAtama ? 'Bir dosya seç...' : fileAtama.name}</span>
                                        </label>
                                    </fieldset>
                                </div>
                            </div>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <button type="submit" id="atamaFormButton" className='btn' form='atamaForm' style={{ lineHeight: '1.4' }} disabled={!fileAtama ? 'disabled' : ''}>
                            <span>Kaydet</span>
                        </button>
                    </ModalFooter>
                </Modal>
            </div>
        </Fragment>
    );
}

export default InsuranceUpload;