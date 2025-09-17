import React, { useState, useContext, memo } from 'react';
import { CompaniesContext } from '../../../../../context/companiesContext';



function Person({ row }) {
    const [hoverId, setHover] = useState(null);
    return (
        <tr key={row.id} {...row.getRowProps()}
            className={`${hoverId === row.original._id ? 'hover' : ''}`}
            onMouseLeave={(e) => setHover(null)}
            onMouseEnter={(e) => setHover(row.original._id)}
        // onClick={(e) => selectCompany(row.original._id)}
        >
            {row.cells.map((cell, j) => {
                return <td {...cell.getCellProps()} className={cell.column.id}>{cell.render("Cell")}</td>;
            })}
        </tr>
    );

}


export default memo(Person);