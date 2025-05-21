
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
import { UPDATE_MANY_INSURANCES } from '../../../../GraphQL/Mutations/insurance/insurance';
import { useMutation } from '@apollo/client';
import _ from 'lodash';
import { CREATE_COMPANY_USER } from '../../../../GraphQL/Mutations/user/user';
import toastr from 'toastr';

const ContactUpload = () => {
    const navigate = useNavigate();
    const { signOut } = useContext(AuthContext);
    const [fileAtama, setFileAtama] = useState();
    const { getInsurances, insuranceState: { isLoading } } = useContext(InsurancesContext);
    const { resetSelectCompany, companyState: { selectedId, companies } } = useContext(CompaniesContext);

    const [addCompanyUser, { loading }] = useMutation(CREATE_COMPANY_USER, {
        update(cache, { data: { createUser: values } }) {
            cache.modify({
                fields: {
                    users: (previous, { toReference }) => (
                        [...previous, toReference(values)]
                    )
                }
            });
            return (values)
        },
        onError({ graphQLErrors }) {
            const err = graphQLErrors[0].extensions;
            console.log(err)
            if (err.status && err.status === 401) {
                signOut()
                navigate('/portal-giris')
            }
        }
    });


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
                    let company = companies.find(x => x.vergi.vergiNumarasi === item["Vergi Numarası"])
                    /*let mail = item["Mail"]
                    if (mail === 0) {
                        mail = undefined
                    }*/
                    let phoneNumber = item["Telefon"].toString()

                    const isim = (_name) => {
                        let name = ""
                        let nameLength = _name.split(" ").length
                        for (let i = 0; i < nameLength - 1; i++) {
                            name = name + _name.split(" ")[i] + " "
                        }
                        return name.trim()
                    }

                    let surname = item["Firma Ünvanı"].split(" ")[item["Firma Ünvanı"].split(" ").length - 1]
                    if (company) {
                        return {
                            name: isim(item["Firma Ünvanı"]),
                            surname: surname,
                            //email: mail,
                            phoneNumber: phoneNumber,
                            employment: 'Yetkili',
                            auth: {
                                type: 'Customer',
                                auths: {
                                    companyAuths: [{ company: companies.find(x => x.vergi.vergiNumarasi === item["Vergi Numarası"])._id, roles: ["Admin"] }],
                                    insuranceAuths: [],
                                }
                            }
                        }
                    }
                    else {
                        console.log(item["Firma Ünvanı"])
                    }

                })
            })

            console.log(arrays)

            const saves = [];
            for (const contact of arrays) {
                console.log(contact)
                saves.push(new Promise(async (resolve, reject) => {

                    let cont = await addCompanyUser({ variables: { data: contact } })
                    console.log(cont)
                    resolve(cont)
                }))
            }

            const results = await Promise.all(saves)
            // const list = _(arrays).groupBy(x => x.insuranceControlNumber)
            //  .map((value, key) => ({ insuranceControlNumber: key, assignments: value })).value()
            // UpdateManyInsurances({ variables: { data: { insuranceAss: list } } })

            console.log(results)

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
                    <span>Atama Aktar</span>
                </button>

                <Modal
                    isOpen={ModalOpen}
                    centered={true}
                    toggle={toggle}
                    backdrop={false}
                    keyboard={false}
                >

                    <ModalHeader toggle={toggle}>EXCEL TOPLU YETKİLİ Aktar</ModalHeader>
                    {manyLoading && <Spinner />}
                    <ModalBody>
                        <form onSubmit={onFormSubmit} id='contactForm'>
                            <div className='rows row'>
                                <div md="12">
                                    <fieldset>
                                        <label htmlFor='contact' className='mb-0 font-weight-bold text-secondary'>Yetkili Dosyası</label>
                                        <input type="file" name="file" id="file" className="inputfile" onChange={readFile} />
                                        <label htmlFor="file" name="contact" id="contact" type="button" className='btn' style={{ lineHeight: '1.4' }}>
                                            {!fileAtama ? <AiFillFileAdd style={{ height: '1.28em', width: '1.28em', color: 'red' }} /> : <AiFillFile style={{ height: '1.28em', width: '1.28em' }} />}
                                            <span>{!fileAtama ? 'Bir dosya seç...' : fileAtama.name}</span>
                                        </label>
                                    </fieldset>
                                </div>
                            </div>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <button type="submit" id="contactFormButton" className='btn' form='contactForm' style={{ lineHeight: '1.4' }} disabled={!fileAtama ? 'disabled' : ''}>
                            <span>Kaydet</span>
                        </button>
                    </ModalFooter>
                </Modal>
            </div>
        </Fragment>
    );
}

export default ContactUpload;