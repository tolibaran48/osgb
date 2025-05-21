import { useTable, useSortBy, useFilters, useGlobalFilter, usePagination, useRowSelect } from "react-table";
import React, { useEffect, useState } from "react";
import { TbArrowDown, TbArrowsDownUp, TbArrowUp } from "react-icons/tb";
import { FaEdit } from "react-icons/fa";

export default function Table({ columns, Data, checkBox, select }) {
  const [prof, setSelect] = useState({ uzman: null, hekim: null, dsp: null });
  const data = React.useMemo(() => Data, [Data])
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    gotoPage,
    pageCount,
    selectedFlatRows,
    allColumns,
    state,
    prepareRow,
    toggleAllRowsSelected

  } = useTable(
    {
      columns,
      data,
      autoResetPage: false,
      autoResetFilters: false,
      initialState: { pageSize: 50, hiddenColumns: ["selection", "pass"] },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    hooks => {
      hooks.visibleColumns.push(columns => [
        // Let's make a column for selection
        {
          id: 'selection',
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: ({ getToggleAllPageRowsSelectedProps }) => (
            <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps({ title: "" })} />
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <IndeterminateCheckbox {...row.getToggleRowSelectedProps({ title: "" })} />
          )
        },
        ...columns,
      ])
    }
  );

  const { pageIndex } = state;

  useEffect(() => {
    reset()
    if (checkBox.insuranceListCheckbox === true) {
      toggleAllRowsSelected(false)
    }
    else {
      //sendGetRequest();  
      //dispatch(getAssignmentsProf())
    }
  }, [checkBox.insuranceListCheckbox])

  // useEffect(()=>{  
  //let selectedrows=selectedFlatRows.map(assignment=>{return assignment.values})
  //   select.setSelects(selectedFlatRows)
  //   console.log("select")
  // },[selectedFlatRows])

  const reset = () => {
    allColumns.find(x => x.id === 'selection').toggleHidden(checkBox.insuranceListCheckbox)
    toggleAllRowsSelected(checkBox.insuranceListCheckbox)
    setSelect({ uzman: null, hekim: null, dsp: null })
  }

  return (
    <>
      <div className='table-container' style={{ height: '100%', position: 'relative' }} {...getTableProps()}>
        <div className='header'>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 200px 2px 0px' }}>


          </div>

          <ul>
            {headerGroups.map((headerGroup, k) => (
              <li key={k}>
                <ul>
                  <li>
                    <ul key={k} className='header-container'  {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column, l) => (
                        <li key={l} id={column.id}  {...column.getHeaderProps()}>
                          <div>
                            <div className="header-btn" {...column.getSortByToggleProps()} >
                              <div>
                                <span>
                                  {column.canSort &&
                                    (column.isSorted ? (column.isSortedDesc ? <TbArrowUp style={{ height: '1.15em', width: '1.15em' }} /> : <TbArrowDown style={{ height: '1.15em', width: '1.15em' }} />) : <TbArrowsDownUp style={{ height: '1.15em', width: '1.15em' }} />)
                                  }
                                </span>
                              </div>
                              <div style={{
                                paddingLeft: '3px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace:
                                  'nowrap'
                              }}>{column.render('Header')}</div>
                            </div>
                          </div>
                        </li>
                      ))}
                      <li key={8} id='head8' ></li>
                    </ul>

                  </li>
                  <li>
                    <ul key={k} className='header-container' {...headerGroup.getHeaderGroupProps()}>

                      {allColumns.find(x => x.id === 'selection').isVisible && <li style={{ width: '27px' }} key={555} id='head1' ></li>}

                      {headerGroup.headers.map((column, l) => (
                        <li key={l} id={column.id}  {...column.getHeaderProps()}>
                          <div style={{ width: '100%' }}>
                            {column.canFilter && column.render('Filter')}
                          </div>
                        </li>
                      ))}
                      <li key={8} id='head8' ></li>
                    </ul>
                  </li>
                </ul>
              </li>
            ))}
          </ul>

        </div>
        <div className='list' {...getTableBodyProps()}>
          {page.map((row, j) => {
            prepareRow(row)
            return (
              <ul key={j} style={{ cursor: 'default', width: '100%' }} className='ul-container' {...row.getRowProps()}>
                <li className='g-content'>
                  <ul id='top-ust'>
                    {row.cells.map((cell, i) => (
                      <li key={i} className='top-alt'>{cell.render('Cell')}</li>
                    ))}
                    <li className='top-alt'>
                      <div>
                        <button type='button' className='btn ' >
                          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <FaEdit style={{ height: '14.77px', width: '16.63px' }} />
                          </div>
                        </button>
                        <button type='button' className='btn ' >
                          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 14" width="1em" xmlns="http://www.w3.org/2000/svg" style={{ height: '14.77px', width: 'auto' }}>
                              <path d="M13.81 3H9.828a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 6.172 1H2.5a2 2 0 0 0-2 2l.04.87a1.99 1.99 0 0 0-.342 1.311l.637 7A2 2 0 0 0 2.826 14h10.348a2 2 0 0 0 1.991-1.819l.637-7A2 2 0 0 0 13.81 3zM2.19 3c-.24 0-.47.042-.683.12L1.5 2.98a1 1 0 0 1 1-.98h3.672a1 1 0 0 1 .707.293L7.586 3H2.19zm9.608 5.271-3.182 1.97c-.27.166-.616-.036-.616-.372V9.1s-2.571-.3-4 2.4c.571-4.8 3.143-4.8 4-4.8v-.769c0-.336.346-.538.616-.371l3.182 1.969c.27.166.27.576 0 .742z"></path>
                            </svg>
                          </div>
                        </button>
                      </div>
                    </li>
                  </ul>
                </li>
              </ul>
            )
          })}
        </div>
      </div>
    </>
  );
}


const IndeterminateCheckbox = React.forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = React.useRef()
  const resolvedRef = ref || defaultRef

  React.useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate
  }, [resolvedRef, indeterminate])

  return (
    <input type='checkbox' className="checkboxx" style={{ margin: '0.3rem 0px 0px 0px !important', position: 'relative !important' }} ref={resolvedRef} {...rest} />
  )

})