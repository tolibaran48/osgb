import React, { Fragment, useEffect, useContext } from 'react';
import { Spinner } from 'reactstrap';
import { CompaniesContext } from '../../../../context/companiesContext';
import SelectInput from '../../../../downshift/selectInput';
import turkishToEnglish from '../../../../functions/turkishToEnglish';
import Company from './company';
import './companyTable.scss'
import { ImNext2 } from "react-icons/im";
import { ImLast } from "react-icons/im";
import { ImPrevious2 } from "react-icons/im";
import { ImFirst } from "react-icons/im";
//import Company from './publicRelation.component.company';

import { useTable, useSortBy, useFilters, useGlobalFilter, usePagination, useAsyncDebounce, useRowSelect } from "react-table";


function Table({ data, getCompaniesLoading }) {
  const { resetSelectCompany, companyState } = useContext(CompaniesContext);

  const columns = React.useMemo(
    () => [
      {
        id: "companyName",
        Header: "ÜNVANI",
        accessor: "name",
        filter: (rows, id, filterValue) => {

          return rows.filter(row => {
            const rowValue = row.values.companyName;
            let value = turkishToEnglish(filterValue).toLowerCase();
            return rowValue !== ''
              ? turkishToEnglish(rowValue).toLowerCase().includes(value)
              : true;
          });
        },
        Filter: ({ column }) => {
          const { filterValue, setFilter } = column;

          return (
            <fieldset >
              <div className='label' >
                <label htmlFor="unvani" >Ünvanı : </label>
              </div>
              <div className='input' style={{ position: 'relative' }}>
                <input className='form-control' id="unvani" autoComplete="off"
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
        Header: "ÇALIŞMA DURUMU",
        accessor: "workingStatus",
        Cell: StatusPill,
        filter: (rows, id, filterValue) => {
          return (rows.filter(row => {
            const rowValue = row.values[id];
            return filterValue === undefined || filterValue === 'All'
              ? true
              : rowValue === filterValue;
          })
          )
        },
        Filter: ({ column }) => {
          const { filterValue, setFilter } = column;
          return (
            <fieldset>
              <div className='label'>
                <label  >Çalışma Durumu : </label>
              </div>
              <div className='input' style={{ position: 'relative' }}>
                <SelectInput defValue={''} className='form-control' alignment='left'
                  onChange={(e) => { setFilter(e || "") }}
                  value={filterValue || "All"}
                  items={[
                    { value: "Hepsi", id: "All" },
                    { value: "Aktif", id: "Aktif" },
                    { value: "Fesih", id: "Fesih" }
                  ]} />
              </div>
            </fieldset>
          );
        }
      }
    ],
    []
  );
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
    autoResetPage: false,
    initialState: { pageSize: 25 }
  },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  useEffect(() => {
    if (!rows.filter((item) => item.original._id.includes(companyState.selectedId)).length > 0) {
      resetSelectCompany();
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
        {getCompaniesLoading && <Spinner />}
        <table {...getTableProps()} className='table-static' border="1" style={{ display: 'flex', flexDirection: 'column' }}>
          <thead>
            {headerGroups.map((headerGroup, i) => (
              <tr key={i} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, j) => (
                  <th key={j} {...column.getHeaderProps(column.getSortByToggleProps())} className={column.id}>
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
                  <Company row={row} key={i} />
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

export function StatusPill({ value }) {
  const status = value ? value.toUpperCase() : "unknown";

  return (
    <span style={{ padding: '3px 20px', textAlign: 'center', textDecoration: 'none', display: 'inlineBlock', borderRadius: '16px' }}
      className={`${status.startsWith("AKTIF") ? 'yellow' : 'red'}`}
    >
      {status}
    </span>
  );
}


export default Table;