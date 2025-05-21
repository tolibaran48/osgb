import React, { useState, useContext, memo } from 'react';
import { InsurancesContext } from '../../../../context/insurancesContext';

const Insurance = ({ row }) => {
  const { selectInsurance, insuranceState } = useContext(InsurancesContext);
  const [hoverId, setHover] = useState(null);


  return (
    <tr {...row.getRowProps()}
    className={`${hoverId === row.original._id ? 'hover' : ''} ${insuranceState.selectedId === row.original._id ? 'active' : ''}`}             
    onMouseLeave={(e) => setHover(null)}
    onMouseEnter={(e) => setHover(row.original._id)}
    onClick={(e) => selectInsurance(row.original._id)}>
      {row.cells.map((cell, j) => {
        return <td {...cell.getCellProps()} className={cell.column.id}>{cell.render("Cell")}</td>;
      })}
    </tr>
  )
}

export default memo(Insurance);