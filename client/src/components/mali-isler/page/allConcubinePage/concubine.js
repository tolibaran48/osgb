import React, { useState, useContext, memo } from 'react';
import { CompaniesContext } from '../../../../context/companiesContext';

const Concubine = ({ row }) => {
  const { selectCompany, companyState:{selectedId} } = useContext(CompaniesContext);
  const [hoverId, setHover] = useState(null);

  
  return (
    <tr {...row.getRowProps()}
    className={`${hoverId === row.original._id ? 'hover' : ''} ${selectedId === row.original._id ? 'active' : ''}`}             
    onMouseLeave={(e) => setHover(null)}
    onMouseEnter={(e) => setHover(row.original._id)}
    onClick={(e) => selectCompany(row.original._id)}>
      {row.cells.map((cell, j) => {
        return <td {...cell.getCellProps()} className={cell.column.id}>{cell.render("Cell")}</td>;
      })}
    </tr>
  )
}

export default memo(Concubine);