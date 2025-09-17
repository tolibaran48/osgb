import React, { useState, useEffect, Fragment, useContext, useRef, memo } from 'react';


import { EmployeesContext } from '../../../../../context/employeesContext';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/tr';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import Person from './person';
import { ImNext2 } from "react-icons/im";
import { ImLast } from "react-icons/im";
import { ImPrevious2 } from "react-icons/im";
import { ImFirst } from "react-icons/im";

import './personTable.scss'

import {
    Spinner
} from 'reactstrap';
import { useTable, useSortBy, useFilters, useGlobalFilter, usePagination, useAsyncDebounce, useRowSelect } from "react-table";



const PersonListTable = ({ data, columns }) => {
    dayjs.extend(utc)
    dayjs.extend(timezone)
    dayjs.extend(customParseFormat)
    dayjs.locale('tr')



    const { employeeState } = useContext(EmployeesContext);





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


    return (
        <div className='list-alt personTable' style={{ height: '100%', width: '90%', position: 'relative', boxShadow: 'rgb(6 22 33 / 30%) 0px 4px 10px -4px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div className='search'>
                {
                    headerGroups.map((headerGroup) =>
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

                {employeeState.isLoading && <Spinner />}
                <table {...getTableProps()} border="1" style={{ display: 'flex', flexDirection: 'column' }} className='table-static'>
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
                            !employeeState.isLoading &&
                            page.map((row, i) => {
                                prepareRow(row);
                                return (
                                    <Person row={row} key={i} />
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
            </div>
        </div>

    );
}

export default memo(PersonListTable);