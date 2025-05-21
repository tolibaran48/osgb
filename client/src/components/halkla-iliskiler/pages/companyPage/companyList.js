import React, { Fragment, useContext,memo } from 'react';
import { CompaniesContext } from '../../../../context/companiesContext';
import Table from './companyTable'


const CompanyList = ({ setCompanyActive, getCompaniesLoading }) => {
  const { companies} = useContext(CompaniesContext).companyState;
  

  return (
    <Fragment>
      <div className='list-alt companyTable' style={{ height: '100%', position: 'relative', boxShadow: 'rgb(6 22 33 / 30%) 0px 4px 10px -4px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Table data={companies} setCompanyActive={setCompanyActive} getCompaniesLoading={getCompaniesLoading} />
      </div>
    </Fragment>
  );

}

export default memo(CompanyList);