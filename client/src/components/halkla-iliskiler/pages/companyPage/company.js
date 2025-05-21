import React, { useState, useContext, memo } from 'react';
import { CompaniesContext } from '../../../../context/companiesContext';



function Company({ row }) {
    const { selectCompany, companyState } = useContext(CompaniesContext);
    const [hoverId, setHover] = useState(null);

    return (
        <tr key={row.id} {...row.getRowProps()}
            className={`${hoverId === row.original._id ? 'hover' : ''} ${companyState.selectedId === row.original._id ? 'active' : ''}`}
            onMouseLeave={(e) => setHover(null)}
            onMouseEnter={(e) => setHover(row.original._id)}
            onClick={(e) => selectCompany(row.original._id)}>
            {row.cells.map((cell, j) => {
                return <td key={j} {...cell.getCellProps()} className={cell.column.id}>{cell.render("Cell")}</td>;
            })}
        </tr>
    );

}


export default memo(Company);