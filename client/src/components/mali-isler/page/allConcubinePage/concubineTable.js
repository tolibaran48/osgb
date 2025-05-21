import React, { Fragment, useEffect, useState, useContext } from 'react';
import { ConcubinesContext } from '../../../../context/concubinesContext';
import { useTable, useSortBy, useFilters, useGlobalFilter, usePagination, useAsyncDebounce, useRowSelect } from "react-table";
import { Spinner } from 'reactstrap';
import { ImNext2 } from "react-icons/im";
import { ImLast } from "react-icons/im";
import { ImPrevious2 } from "react-icons/im";
import { ImFirst } from "react-icons/im";
import Concubine from './concubine';
import ConcubineExcel from './concubineExcel';
import './concubineTable.scss'

export default function Table({ columns, getCompanyConcubineLoading, select }) {
  const { concubineState: { concubines } } = useContext(ConcubinesContext);
  const [total, setToplam] = useState(0);

  useEffect(() => {
    setToplam(concubines.reduce(function (a, b) {
      if (b.toplam < 0) {
        return a
      }
      return a + b.toplam
    }, 0))
  }, [concubines])

  const data = concubines;
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
    autoResetPage: false,
    autoResetFilters: false,
    initialState: { pageSize: 20, hiddenColumns: ["selection", "pass"] },
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
        <div style={{ marginLeft: "auto" }}>
          <fieldset style={{ marginBottom: "0", width: "auto", color: "red" }}>
            {new Intl.NumberFormat('tr-TR', {
              style: 'currency',
              currency: 'TRY',
            }).format(total)}
          </fieldset>
        </div>
        <ConcubineExcel rows={rows} />
      </div>
      <div style={{ flexGrow: '1' }}>

        {getCompanyConcubineLoading && <Spinner />}
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
                  <Concubine row={row} key={i} />
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
              <ImFirst />
            </button>{' '}
            <button type='button' onClick={() => previousPage()} disabled={!canPreviousPage}>
              <ImPrevious2 />
            </button>{' '}
            <button type='button' onClick={() => nextPage()} disabled={!canNextPage}>
              <ImNext2 />
            </button>{' '}
            <button type='button' onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
              <ImLast />
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