import React, { useState, useEffect, useContext } from 'react';
import InsuranceList from './insuranceList';
import { InsurancesContext } from '../../../../context/insurancesContext';
import './insurancePage.scss';

const InsurancePage = ({ _getInsurances, getInsurancesLoading }) => {
    const { insuranceState: { insurances } } = useContext(InsurancesContext);
    const [selects, setSelects] = useState([]);
    const [insuranceListCheckbox, setInsuranceListCheckbox] = useState(true);
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        setTableData(insurances)
    }, [insurances])

    useEffect(() => {
        if (!insurances.length > 0) { _getInsurances() }
        else { setTableData(insurances) }
        return () => {
        }
    }, [])


    return (
        <div className='insurance-container'>
            <div className='list-alt insuranceTable'>
                <InsuranceList select={{ selects, setSelects }} datas={{ tableData }} getInsurancesLoading={getInsurancesLoading} checkBox={{ insuranceListCheckbox, setInsuranceListCheckbox }} />
            </div>

        </div>
    );
}

export default InsurancePage;