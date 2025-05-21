import React, { Fragment, useEffect, useContext, memo } from 'react';
import { UsersContext } from '../../../../context/usersContext';
import Table from './contactTable';
import turkishToEnglish from '../../../../functions/turkishToEnglish';


const ContactList = ({ getusersLoading }) => {
  const { users } = useContext(UsersContext).userState;

  const columns = React.useMemo(
    () => [
      {
        id: "name",
        Header: "Adı Soyadı",
        accessor: "name",
        Cell: props => {
          return (`${props.cell.row.original.name} ${props.cell.row.original.surname}`)
        },
        filter: (rows, id, filterValue) => {
          return rows.filter(row => {
            const rowValue = {
              'name': row.original.name,
              'surname': row.original.surname
            };
            let value = turkishToEnglish(filterValue).toLowerCase();
            return rowValue !== undefined
              ? turkishToEnglish(`${rowValue.name} ${rowValue.surname}`).toLowerCase().includes(value) || turkishToEnglish(`${row.original.email}`).toLowerCase().includes(value) || row.original.phoneNumber.includes(value)
              : true;
          });
        },
        Filter: ({ column }) => {
          const { filterValue, setFilter, Header, id } = column;

          return (
            <fieldset >
              <div className='input' style={{ position: 'relative' }}>
                <input className='form-control' id={id}
                  placeholder='Ara...'

                  value={filterValue || ''}
                  onChange={event => { setFilter(event.target.value) }}
                />
                <div className="invalid-feedback mt-0" style={{ position: 'absolute' }}>
                </div>
              </div>
            </fieldset>
          )
        },
      },
      {
        id: "email",
        Header: "Email",
        accessor: "email",
      },
      {
        id: "phoneNumber",
        Header: "Telefon",
        accessor: "phoneNumber",
      },
    ], []
  )

  return (
    <Fragment>
      <div className='list-alt companyTable' style={{ height: '100%', position: 'relative', boxShadow: 'rgb(6 22 33 / 30%) 0px 4px 10px -4px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Table data={users} columns={columns} getusersLoading={getusersLoading} />
      </div>
    </Fragment>
  );

}

export default memo(ContactList);