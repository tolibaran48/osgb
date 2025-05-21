import React, { useState, useContext, memo } from 'react';
import { UsersContext } from '../../../../context/usersContext';



function Contact({ row }) {
    const { selectUser, userState } = useContext(UsersContext);
    const [hoverId, setHover] = useState(null);
    return (
        <tr {...row.getRowProps()}
        className={`${hoverId === row.original._id ? 'hover' : ''} ${userState.selectedId === row.original._id ? 'active' : ''}`}            
        onMouseLeave={(e) => setHover(null)}
        onMouseEnter={(e) => setHover(row.original._id)}
        onClick={(e) => selectUser(row.original._id)}>
        {row.cells.map((cell, j) => {
            return <td {...cell.getCellProps()} className={cell.column.id}>{cell.render("Cell")}</td>;
        })}
    </tr>
    );

}


export default memo(Contact);