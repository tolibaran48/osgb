import React, { useState, useContext, memo } from 'react';

const Concubine = ({ row }) => {
 const [hoverId, setHover] = useState(null);


  return (
    <tr {...row.getRowProps()}
    className={`${hoverId === row.original._id ? 'hover' : ''}`}             
    onMouseLeave={(e) => setHover(null)}
    onMouseEnter={(e) => setHover(row.original._id)}>
      {row.cells.map((cell, j) => {
        return <td {...cell.getCellProps()} className={cell.column.id}>{cell.render("Cell")}</td>;
      })}
    </tr>
  )
}

export default memo(Concubine);