import React, { Fragment } from 'react';
import { useTable, useSortBy, useFilters, useGlobalFilter, usePagination, useAsyncDebounce, useRowSelect } from "react-table";
import {Spinner} from 'reactstrap';
import { ImNext2 } from "react-icons/im";
import { ImLast } from "react-icons/im";
import { ImPrevious2 } from "react-icons/im";
import { ImFirst } from "react-icons/im";
import Insurance from './insurance';
import InsuranceUpload from './insuranceUpload';
import OldSystem from './oldSystem';
import './insuranceTable.scss'

export default function Table({ columns, Data, checkBox, select, getInsurancesLoading}) {
    
  const data=Data;
    // Use the state and functions returned from useTable to build your UI
    const { 
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        state,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        page,
        rows,
        selectedFlatRows,
        allColumns,
    } = useTable({
      columns,
      data,
      autoResetPage:false,
      autoResetFilters: false,
      initialState: {pageSize:12,hiddenColumns:["selection","pass"]},
    },
      useFilters,
      useGlobalFilter,
      useSortBy,
      usePagination,
      useRowSelect,
    );
  
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
           <InsuranceUpload />
           <OldSystem rows={rows} />
        </div>
        <div style={{ flexGrow: '1' }}>
          
        {getInsurancesLoading && <Spinner/>}
          <table {...getTableProps()} className='table-static' border="1" style={{ display: 'flex', flexDirection: 'column' }}>
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
                return (
                  <Insurance row={row} key={i} />
                );
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