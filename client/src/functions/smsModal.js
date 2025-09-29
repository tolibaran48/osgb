import React, { Fragment, useState, useContext, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

const SendSMS = () => {

    const [ModalOpen, setModalOpen] = useState(false);
    const [smsMessageValid, setSmsMessageValid] = useState({ status: null, message: null });

    const initial = {
        message: '',
    }

    const [createFormValues, setCreateFormValues] = useState(initial)

    const onCreateCompanySubmit = async e => {
        e.preventDefault();
        let error = { status: false, message: [] };

        const { message } = createFormValues;
        let newName = '';
        try {
            const validateForm = new Promise((resolve, reject) => {

                if (!message) {
                    setSmsMessageValid({ status: 'is-invalid', message: 'Mesaj metni girilmesi zorunludur' })
                    error = { ...error, status: true, message: [...error.message, 'Mesaj metni girilmesi zorunludur'] }
                }
                else {
                    let adressReplace = adress.trim().replace(/(\s)+/g, "$1");
                    const arr = adressReplace.split(" ");
                    arr.forEach(
                        (i, index) =>
                            newAdress = newAdress + ' ' + (i[0].toLocaleUpperCase() + i.slice(1).toLocaleLowerCase())
                    )
                    setCompanyAdressValid({ status: 'is-valid', message: null })
                }

                resolve(error);
            })


            validateForm.then((error) => {
                if (error.status === false) {
                    sendSms({ variables: { data: { message: message.replace(/\r?\n/g, "\\n") } } })
                }
                else {
                    for (let mes of error.message) {
                        toastr.warning(mes, 'UYARI')
                    }
                }
            })

        } catch (err) {
            toastr.error(error.message, 'HATA')
        }
    }

    const toggle = () => {
        setModalOpen(!ModalOpen)
    }

    return (
        <Fragment>
            <button type="button" className='btn button-bg-green' onClick={toggle} style={{ lineHeight: '1.4', height: '100%', display: 'flex', flexDirection: 'column' }}  >
                <div style={{ alignSelf: 'center' }}>
                    <MdLibraryAdd style={{ height: '1.5em', width: '1.5em' }} />
                </div>
                <div>
                    <span>SMS Gönder</span>
                </div>
            </button>

            <Modal
                isOpen={ModalOpen}
                centered={true}
                toggle={toggle}
                className='modal-dialog modal-lg'
            >
                <ModalHeader toggle={toggle} ><span>SMS Gönder</span></ModalHeader>
                <ModalBody>
                    <form id='SendSMS' onSubmit={onSendSmsSubmit}>
                        <fieldset >
                            <div className='label'>
                                <label htmlFor="message" >Mesaj : </label>
                            </div>
                            <div className='input' style={{ position: 'relative' }}>
                                <textarea
                                    className={`form-control  ${smsMessageValid.status}`}
                                    type='textarea'
                                    autoComplete="off"
                                    id='message'
                                    value={createFormValues.message}
                                    onChange={(e) => setCreateFormValues({ ...createFormValues, message: e.target.value.replace(/\r?\n/g, "\\n") })}
                                />
                                <div className="invalid-feedback mt-0" style={{ position: 'absolute' }}>
                                    {smsMessageValid.message}
                                </div>
                            </div>
                        </fieldset>

                        <div className='form-footer'>
                            <button type='submit' form='SendSMS' className='btn' >Gönder</button>
                        </div>
                    </form>
                </ModalBody>
            </Modal>
        </Fragment>
    )

}

export default SendSMS;