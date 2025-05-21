import React, { useState, useEffect, Fragment, useContext } from 'react';
import { CompaniesContext } from '../../../../context/companiesContext';
import { InsurancesContext } from '../../../../context/insurancesContext';
import CompanyList from './companyList';
import CompanyButtons from './companyButtons';
import CompanyInformation from './companyInformation';
import InsuranceInformation from './insuranceInformation';
import ContactInformation from './contactInformation';
import './companyPage.scss';

const CompanyPage = ({ _getCompanies, getCompaniesLoading, _getInsurances, getInsurancesLoading }) => {
  const { insuranceState: { insurances } } = useContext(InsurancesContext);
  const { resetSelectCompany, companyState: { selectedId, companies } } = useContext(CompaniesContext);
  const [companyActive, setCompanyActive] = useState(false);

  useEffect(() => {

    !companies.length > 0 && _getCompanies()
    !insurances.length > 0 && _getInsurances()
    return () => {
      resetSelectCompany();
    }
  }, [])

  return (
    <Fragment>
      <div className='companyPage part-header-container'>
        <div className='buttons' style={{ height: '100%' }}>
          <CompanyButtons />
        </div>
      </div>
      <div className='company-container'>
        <div className='list-container'>
          <CompanyList setCompanyActive={setCompanyActive} getCompaniesLoading={getCompaniesLoading} />
        </div>
        <div className='content'>
          <CompanyInformation companyActive={companyActive} setCompanyActive={setCompanyActive} />
          <InsuranceInformation selectedId={selectedId} insurancesLoading={getInsurancesLoading} />
          <ContactInformation selectedId={selectedId} />
        </div>
      </div>
    </Fragment>
  );
}

export default CompanyPage;