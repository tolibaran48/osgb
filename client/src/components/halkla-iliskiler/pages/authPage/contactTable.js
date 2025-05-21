import React, { Fragment, useEffect, useState, useContext,memo } from 'react';
import {Spinner} from 'reactstrap';
import {UsersContext } from '../../../../context/usersContext';
import Contact from './contact';
import '../companyPage/companyTable.scss'
import { ImNext2 } from "react-icons/im";
import { ImLast } from "react-icons/im";
import { ImPrevious2 } from "react-icons/im";
import { ImFirst } from "react-icons/im";

import { useTable, useSortBy, useFilters, useGlobalFilter, usePagination, useAsyncDebounce, useRowSelect } from "react-table";


function Table({ data, columns}) {
  const { resetSelectUser, selectUser, userState,getcompaniesLoading } = useContext(UsersContext);

  
  // Use the state and functions returned from useTable to build your UI
  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, state, preGlobalFilteredRows, setGlobalFilter,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    page,
    rows
  } = useTable({
    columns,
    data,
    autoResetFilters: false,
    initialState: { pageSize: 22 }
  },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  useEffect(() => {

    if (!rows.filter((item) => item.original._id.includes(userState.selectedId)).length > 0) {
      resetSelectUser();
    }
  }, [rows])

  // Render the UI for your table
  return (
    <Fragment>
      <div className='search'>
        {headerGroups.map((headerGroup) =>
          headerGroup.headers.map((column) =>
            column.Filter ? (
              <div key={column.id}>
                {column.render("Filter")}
              </div>
            ) : null
          )
        )}
      </div>
      <div style={{ flexGrow: '1' }}>
        {getcompaniesLoading && <Spinner/>}
        <table {...getTableProps()} border="1" style={{ display: 'flex', flexDirection: 'column' }}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())} className={column.id}>
                    {column.render('Header')}
                    {/* Add a sort direction indicator */}
                    <span>
                      {column.canSort ?
                        column.isSorted
                          ? column.isSortedDesc
                            ? ' ▼'
                            : ' ▲'
                          : ''
                        : ''}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} style={{ flexGrow: '1', height: '0px !important' }}>
            {
              page.map((row, i) => {
                prepareRow(row);
                return(
                  <Contact row={row} key={i} />
                )                
              })
            }
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <div className='pageNumber'>
          <span>
            Sayfa{' '} {state.pageIndex + 1} / {pageOptions.length}
          </span>
        </div>
        <div>
          <nav >
            <button type='button' onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            <ImFirst/>
            </button>{' '}
            <button type='button' onClick={() => previousPage()} disabled={!canPreviousPage}>
            <ImPrevious2/>
            </button>{' '}
            <button type='button' onClick={() => nextPage()} disabled={!canNextPage}>
            <ImNext2 />
            </button>{' '}
            <button type='button' onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
            <ImLast/>
            </button>{' '}

          </nav>
        </div>

        {/*<div>
                        <code>{JSON.stringify(state, null, 2)}</code>                        
                    </div>*/}
      </div>
    </Fragment >
  );
}


export default memo(Table);