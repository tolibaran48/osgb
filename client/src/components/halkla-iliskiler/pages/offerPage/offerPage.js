import React, { useEffect, Fragment, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { UsersContext } from '../../../../context/usersContext';
import { AuthContext } from '../../../../context/authContext';
import { MdLibraryAdd } from "react-icons/md";
import TanstackTable from '../../../../functions/tanstack/tanstackTable';
import MyEditor from '../../../../functions/draft/editor';
import ColumnHelper from '../../../../functions/tanstack/columnHelper';
import './offerPage.scss'
import HeaderHelper from '../../../../functions/tanstack/headerHelper';

const OfferPage = () => {
  const navigate = useNavigate();
  const contextUser = useContext(UsersContext);
  const { signOut } = useContext(AuthContext);
  const [ModalOpen, setModalOpen] = useState(false);
  const [tables, setTables] = useState([]);
  const [table, setTable] = useState({ tableName: '', columnLength: 1 });
  const [columns, setColumns] = useState([]);

  const toggle = () => {
    setModalOpen(!ModalOpen)
    setTable({ tableName: '', columnLength: 1 })
  }

  const createTable = (e) => {
    e.preventDefault();
    let { tableName, columnLength } = table;
    let _table = {
      tableName,
      columnLength,
      emptyColumns: {},
      columnSizing: {},
      columnSizingLock: {},
      headers: {},
      isBlockHeaders: false,
      columns: [],
      data: [{}],
      hiddenCells: [],
      cellStyles: [],
      headerFlat: 0,
      headerGroups: [{ flat: 1, headers: [] }]
    }

    if (columnLength > 0) {
      for (let i = 0; i < columnLength; i++) {
        //_table.headers.push(`header-${i}`)
        // _table.cellStyles.push({rowIndex:0,columnId:`column-${i}`,cellStyle:{style:{height:'1px'}}})
        _table.headers[`column-${i}`] = `header-${i}`
        _table.columnSizing[`column-${i}`] = Number((186 / columnLength).toFixed(4));
        _table.columnSizingLock[`column-${i}`] = false
        _table.headerGroups = _table.headerGroups.map(x => x.flat === 1 ? { ...x, headers: [...x.headers, { name: `column-${i}`,id:`column-${i}` }] } : x)
      }
      // _table.data.push({"column-0":"","column-1":"","column-2":""})
      let columns = ColumnHelper(_table)
      _table.columns = columns;
      setTables([...tables, _table])
      toggle()
    }

  }

  const addColumn = (table) => {
    let __table = table
    if (__table.isBlockHeaders === false) {
      let ln = Object.keys(table.headers).length
      __table = {
        ...table, headers: { ...table.headers, [`column-${ln}`]: `header-${ln}` },
        columnSizingLock: { ...table.columnSizingLock, [`column-${ln}`]: false },
        headerGroups: [...table.headerGroups.map(x => x.flat === 1 ? { ...x, headers: [...x.headers, { name: `column-${ln}`,id:`column-${ln}` }] } : x)]
      }
      __table.columns = ColumnHelper(__table);
      __table.columnLength = __table.columnLength + 1
      return __table
    }
    else {
      let ln = Object.keys(table.headers).length
      __table.columnLength = __table.columnLength + 1

      let headerGroups = table.headerGroups
      let topHeaderRow = headerGroups.find(x => x.flat === headerGroups.length - 1)
      let topRowLength = topHeaderRow.headers.length
      let newHeaderRow = { ...topHeaderRow, headers: [...topHeaderRow.headers, { name: `Başlık-${topRowLength}`, id:`${headerGroups.length - 1}-header-${topRowLength}`, subHeaders: [`column-${ln}`] }] }

      __table = {
        ...table, headers: { ...table.headers, [`column-${ln}`]: `header-${ln}` },
        columnSizingLock: { ...table.columnSizingLock, [`column-${ln}`]: false },
        headerGroups: [...table.headerGroups.map(x => x.flat === __table.headerGroups.length ? { ...x, headers: [...x.headers, { name: `column-${ln}`,id:`column-${ln}` }] } : x.flat === __table.headerGroups.length - 1 ? newHeaderRow : x)]
      }

      if (headerGroups.length > 2) {
        for (let i = headerGroups.length - 2; i > 0; i -= 1) {
          let headerRow = headerGroups.find(x => x.flat === i)
          let rowLength = headerRow.headers.length
          newHeaderRow = { ...headerRow, headers: [...headerRow.headers, { name: `Başlık-${rowLength}`, id:`${i}-header-${rowLength}`, subHeaders: [`column-${ln}`], subHeaders: [[`Başlık-${topRowLength}`]] }] }
          console.log(newHeaderRow)
          topRowLength = rowLength
          __table = {
            ...__table,
            headerGroups: [...__table.headerGroups.map(x => x.flat === i ? newHeaderRow : x)]
          }
          console.log({ __table: table, new: newHeaderRow })
        }
      }


      __table.columns = HeaderHelper(__table);

      return __table
    }

  }

  const addTopHeader = (table) => {
    let headerGroups = table.headerGroups

    //headerGroups = [...headerGroups.map(x => ({ ...x, flat: x.flat + 1,headers:[...x.headers.map(y=>(x.flat!==headerGroups.length?{...y,id:`${parseInt(y.id.split("-")[0])+1}-header-${y.id.split("-")[2]}`}:y))] }))]
    headerGroups = [...headerGroups.map(x => ({ ...x, flat: x.flat + 1}))]
    headerGroups.push({ flat: 1, headers: [] })

    let topHeaderRow = headerGroups.find(x => x.flat === 2)
    let headerRowLength = table.headerGroups.length

    for (let i = headerRowLength - 1; i > 0; i -= 1) {
      let yeniSatir = {}
      let row = headerGroups.find(x => x.flat === i)
      let subRow

      for (let i = 0; i > row.headers.length; i++) {
        let _newColumn = {}
        _newColumn = { header: header.id, columns: [] }
        let header = row.headers[i]
        for (let i = 0; i > header.subHeaders.length; i++) {
          _newColumn.columns.push(subRow[header.subHeaders[i]])
        }
        yeniSatir[_newColumn.header] = _newColumn.columns
      }

    }

    for (let i = 0; i < topHeaderRow.headers.length; i++) {
      headerGroups = headerGroups.map(x => x.flat === 1 ? { ...x, headers: [...x.headers, { name: `Başlık-${i}`,id:`${headerGroups.length-1}-header-${i}`, subHeaders: [topHeaderRow.headers[i].id] }] } : x)
    }
    //console.log(headerGroups)
    let _table = { ...table, headerGroups: headerGroups, isBlockHeaders: true }
    _table.columns = HeaderHelper(_table);
    setTables([...tables.map(x => x.name === table.name ? _table : x)])
    return _table
  }

  const updateHelper = (table) => {
    let __table = table
    __table.columns = ColumnHelper(table);
    setTables([...tables.map((tab) => tab.tableName === __table.tableName ? {
      ...__table
    } : tab)])
    return __table
  }

  useEffect(() => {
    console.log(tables)
  }, [tables])

  return (
    <div className='offerPage'>
      <div className='page'>
        <button type='button' className='btn ' onClick={toggle} ><MdLibraryAdd style={{ height: '1.28em', width: '1.28em' }} /><span>Tablo Ekle</span></button>
        <div style={{ margin: '0 0 10pt 10pt' }}>
          <span style={{ fontSize: '27pt', color: 'coral', lineHeight: '0.9' }}>bodrum</span>
          <span style={{ fontSize: '27pt', color: '#232530', lineHeight: '0.9' }}>İSG</span>
          <p style={{ fontSize: '9pt', color: 'black', paddingLeft: '1px', letterSpacing: '0.05pt' }}>İş Sağlığı ve Güvenliği Hizmetleri</p>

        </div>
        {
          tables.map((table, index) => {
            return (
              <Fragment key={index}>
                {//<MyEditor />
                }
                <h4>{table.tableName}</h4>
                <TanstackTable _table={table} setTables={setTables} tables={tables} addColumn={addColumn} updateHelper={updateHelper} addTopHeader={addTopHeader} key={index} />
              </Fragment>
            );
          })
        }

        <Modal
          isOpen={ModalOpen}
          centered={true}
          toggle={toggle}
          className='modal-dialog modal-lg'
        >
          <ModalHeader toggle={toggle} ><span>İşyeri Kaydet</span></ModalHeader>
          <ModalBody>
            <form id='createTable' onSubmit={createTable}>
              <fieldset>
                <div className='label' >
                  <label htmlFor="unvani" >Ünvanı : </label>
                </div>
                <div className='input' style={{ position: 'relative' }}>
                  <input className='form-control' id="unvani"
                    onChange={(e) => setTable({ ...table, tableName: e.target.value })}
                  />
                </div>
              </fieldset>
              <div className='form-footer'>
                <button type='submit' form='createTable' className='btn'  >Oluştur</button>
              </div>
            </form>
          </ModalBody>
        </Modal>
      </div>
    </div>
  );
}

export default OfferPage;