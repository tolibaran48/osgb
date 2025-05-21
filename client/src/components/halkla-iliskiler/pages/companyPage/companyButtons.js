import './companyButtons.scss'
import { MdLibraryAdd } from "react-icons/md";
import { Fragment } from 'react';
import AddCompany from '../../forms/addCompany';
import AddContract from '../../forms/addContract';

const CompanyButtons = ({ }) => {
    return (
        <Fragment>

            <div className='header-buttons' style={{ height: '100%' }}>
                <AddCompany />
            </div>
            <div className='header-buttons' style={{ height: '100%' }}>
                <AddContract />
            </div>
            <div className='header-buttons' style={{ height: '100%' }}>
                <button type="button" className='btn button-bg-brown' style={{ lineHeight: '1.4', height: '100%', display: 'flex', flexDirection: 'column' }}  >
                    <div style={{ alignSelf: 'center' }}>
                        <MdLibraryAdd style={{ height: '1.5em', width: '1.5em' }} />
                    </div>
                    <div>
                        <span>Firma Ekle</span>
                    </div>
                </button>
            </div>
        </Fragment>
    );
}

export default CompanyButtons;