import React, { useState, useEffect } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  createColumnHelper
} from "@tanstack/react-table";
import EditCell from './editCell';
import { FooterCell } from './footerCell';
import deleteSelectedRows from './deleteSelectedRows';
import './table.scss'
import { BsFillWrenchAdjustableCircleFill } from "react-icons/bs"
import { TiLockClosed, TiLockOpen } from "react-icons/ti";
import pdfPrint from './pdfPrint';
import { set } from 'mongoose';
import HeaderHelper from './headerHelper';

const TanstackTable = ({ _table, setTables, tables, addColumn, updateHelper, addTopHeader }) => {
  const [data, setData] = useState(() => _table.data);
  const { data: originalData } = _table;
  const [columns, setColumns] = useState(() => _table.columns);
  const [columnLength, setColumnLength] = useState(() => _table.columnLength);
  const [headerFlat, setHeaderFlat] = useState(() => _table.headerFlat);
  const [editedRows, setEditedRows] = useState({});
  const [editHeaders, setEditHeaders] = useState([]);
  const [editSize, setEditSize] = useState(false);
  const [headers, setHeaders] = useState(() => _table.headers);
  const [groupHeaders, setGroupHeaders] = useState(() => _table.headerGroups);
  const [isBlockHeaders, setIsBlockHeaders] = useState(() => false);
  const [columnSizing, setColumnSizing] = useState(() => _table.columnSizing);
  const [columnSizingLock, setColumnSizingLock] = useState(() => _table.columnSizingLock);

  const table = useReactTable({
    data,
    columns,
    columnResizeMode: 'onChange',
    setColumnSizing,
    originalData,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    initialState: { columnSizing: columnSizing },
    meta: {
      editedRows,
      setEditedRows,
      editHeaders,
      headers,
      setHeaders,
      groupHeaders,
      setColumns,
      revertData: (rowIndex) => {
        setData((old) =>
          old.map((row, index) =>
            index === rowIndex ? originalData[rowIndex] : row
          )
        );
      },
      updateRow: (rowIndex) => {
        setTables([...tables.map((tab) => tab.tableName === _table.tableName ? { ...tab, data: [...tab.data.map((row, index) => (index === rowIndex ? data[rowIndex] : row))] } : tab)])
      },
      addRow: () => {
        setTables([...tables.map((tab) => tab.tableName === _table.tableName ? { ...tab, data: [...tab.data, _table.emptyColumns] } : tab)])
        setData([...data, _table.emptyColumns])
      },
      removeRow: (rowIndex) => {
        let data = _table.data
        let cellHiddens = _table.hiddenCells
        let cellStyles = _table.cellStyles
        let otherHiddens = _table.hiddenCells.filter((x) => x.rowIndex === rowIndex && x.from.rowIndex < rowIndex)
        let rowSpans = _table.cellStyles.filter(x => x.rowIndex === rowIndex && x.row === true && x.col === false)
        let colSpans = _table.cellStyles.filter(x => x.rowIndex === rowIndex && x.col === true && x.row === false)
        let twiceSpans = _table.cellStyles.filter(x => x.rowIndex === rowIndex && x.col === true && x.row === true)
        let hiddensUnique = []
        for (let i = 0; i < otherHiddens.length; i++) {
          let isUnique = hiddensUnique.find(x => x.from.rowIndex === otherHiddens[i].from.rowIndex && x.from.columnId === otherHiddens[i].from.columnId)
          if (!isUnique) {
            hiddensUnique.push(otherHiddens[i])
          }
        }
        for (let i = 0; i < rowSpans.length; i++) {
          let cellStyle = rowSpans[i]
          let rowSpanLength = cellStyle.cellStyle.rowSpan
          if (cellStyle.cellStyle.rowSpan > 2) {
            cellStyles = cellStyles.map((x) => x.rowIndex === cellStyle.rowIndex && x.columnId === cellStyle.columnId ? { ...x, rowIndex: cellStyle.rowIndex + 1, cellStyle: { ...x.cellStyle, rowSpan: rowSpanLength - 1 } } : x)
            cellHiddens = cellHiddens.filter(x => x.rowIndex !== cellStyle.rowIndex + rowSpanLength - 1 || x.columnId !== cellStyle.columnId)
            cellHiddens = cellHiddens.map(x => x.from.rowIndex === cellStyle.rowIndex && x.from.columnId === cellStyle.columnId ? { ...x, rowIndex: x.rowIndex + 1, from: { ...x.from, rowIndex: x.from.rowIndex + 1 } } : x)
          }
          else {
            cellStyles = cellStyles.filter(x => x.rowIndex !== cellStyle.rowIndex || x.columnId !== cellStyle.columnId)
            cellHiddens = cellHiddens.filter(x => x.from.rowIndex !== cellStyle.rowIndex || x.from.columnId !== cellStyle.columnId)
          }
        }
        for (let i = 0; i < colSpans.length; i++) {
          let cellStyle = colSpans[i]
          cellStyles = cellStyles.filter((x) => x.rowIndex !== cellStyle.rowIndex || x.columnId !== cellStyle.columnId)
          cellHiddens = cellHiddens.filter((x) => x.from.rowIndex !== cellStyle.rowIndex || x.from.columnId !== cellStyle.columnId)
        }
        for (let i = 0; i < twiceSpans.length; i++) {
          let cellStyle = twiceSpans[i]
          let rowSpanLength = cellStyle.cellStyle.rowSpan
          let colSpanLength = cellStyle.cellStyle.colSpan
          let columnNumber = parseInt(cellStyle.columnId.slice(7))
          let columnList = []
          for (let i = 0; i < colSpanLength; i++) {
            columnList.push(`column-${columnNumber + i}`)
          }
          if (cellStyle.cellStyle.rowSpan > 2) {
            cellStyles = cellStyles.map((x) => x.rowIndex === cellStyle.rowIndex && x.columnId === cellStyle.columnId ? { ...x, rowIndex: cellStyle.rowIndex + 1, cellStyle: { ...x.cellStyle, rowSpan: rowSpanLength - 1 } } : x)
            cellHiddens = cellHiddens.filter(x => x.rowIndex !== cellStyle.rowIndex + rowSpanLength - 1 || !columnList.includes(x.columnId))
            cellHiddens = cellHiddens.map(x => x.from.rowIndex === cellStyle.rowIndex && x.from.columnId === cellStyle.columnId ? { ...x, rowIndex: x.rowIndex + 1, from: { ...x.from, rowIndex: x.from.rowIndex + 1 } } : x)
          }
          else {
            cellStyles = cellStyles.map((x) => x.rowIndex === cellStyle.rowIndex && x.columnId === cellStyle.columnId ? { ...x, rowIndex: x.rowIndex + 1, row: false, col: true, cellStyle: { colSpan: colSpanLength, style: { height: '1px', position: 'relative' } } } : x)
            cellHiddens = cellHiddens.filter(x => x.rowIndex !== cellStyle.rowIndex + rowSpanLength - 1 || !columnList.includes(x.columnId))
            cellHiddens = cellHiddens.map(x => x.from.rowIndex === cellStyle.rowIndex && x.from.columnId === cellStyle.columnId ? { ...x, rowIndex: x.rowIndex + 1, from: { ...x.from, rowIndex: x.from.rowIndex + 1 } } : x)
          }
        }
        for (let i = 0; i < otherHiddens.length; i++) {

        }
        for (let i = 0; i < hiddensUnique.length; i++) {
          let cellHidden = hiddensUnique[i]
          let from = cellStyles.find((x) => x.rowIndex === cellHidden.from.rowIndex && x.columnId === cellHidden.from.columnId)
          let rowSpanLength = from.cellStyle.rowSpan
          let columnNumber = parseInt(from.columnId.slice(7))
          let columnList = []

          if (from.cellStyle.rowSpan > 2) {
            cellStyles = cellStyles.map((x) => x.rowIndex === from.rowIndex && x.columnId === from.columnId ? { ...x, cellStyle: { ...x.cellStyle, rowSpan: from.cellStyle.rowSpan - 1 } } : x)
            if (from.col) {
              for (let i = 0; i < from.cellStyle.colSpan; i++) {
                columnList.push(`column-${columnNumber + i}`)
              }
              cellHiddens = cellHiddens.filter(x => x.rowIndex !== from.rowIndex + rowSpanLength - 1 || !columnList.includes(x.columnId))
            }
            else {
              cellHiddens = cellHiddens.filter(x => x.rowIndex !== from.rowIndex + rowSpanLength - 1 || x.columnId !== from.columnId)
              cellHiddens = cellHiddens.map(x => x.rowIndex > cellHidden.rowIndex && x.columnId === from.columnId ? { ...x, rowIndex: x.rowIndex + 1, from: { ...x.from, rowIndex: x.from.rowIndex + 1 } } : x)
            }
          }
          else {
            if (from.col) {
              for (let i = 0; i < from.cellStyle.colSpan; i++) {
                columnList.push(`column-${columnNumber + i}`)
              }
              cellStyles = cellStyles.map((x) => x.rowIndex === from.rowIndex && x.columnId === from.columnId ? { ...x, row: false, cellStyle: { colSpan: from.cellStyle.colSpan, style: { height: '1px', position: 'relative' } } } : x)
              cellHiddens = cellHiddens.filter(x => x.rowIndex !== from.rowIndex + rowSpanLength - 1 || !columnList.includes(x.columnId))
            }
            else {
              cellStyles = cellStyles.filter((x) => x.rowIndex !== from.rowIndex || x.columnId !== from.columnId)
              cellHiddens = cellHiddens.filter(x => x.from.rowIndex !== from.rowIndex || x.from.columnId !== from.columnId)
            }
          }
        }
        cellHiddens = cellHiddens.map((x) => x.rowIndex > rowIndex ? { ...x, rowIndex: x.rowIndex - 1, from: { ...x.from, rowIndex: x.from.rowIndex - 1 } } : x)
        cellStyles = cellStyles.map((x) => x.rowIndex > rowIndex ? { ...x, rowIndex: x.rowIndex - 1 } : x)

        setData([...data.filter((x, i) => i !== rowIndex)])
        setTables([...tables.map((tab) => tab.tableName === _table.tableName ? {
          ...tab,
          data: [...tab.data.filter((x, i) => i !== rowIndex)],
          cellStyles: [...cellStyles],
          hiddenCells: [...cellHiddens],
        } : tab)])
      },
      removeSelectedRows: (selectedRows) => {
        let { data, cellHiddens, cellStyles } = deleteSelectedRows(selectedRows, _table);
        setData([...data])
        setTables([...tables.map((tab) => tab.tableName === _table.tableName ? {
          ...tab,
          data: [...data],
          cellStyles: [...cellStyles],
          hiddenCells: [...cellHiddens],
        } : tab)])
      },
      _addColumn: () => {
        let __table = addColumn(_table)
        setColumns(__table.columns)
        setHeaders(__table.headers)
        let cols = Object.keys(__table.headers)
        let colSize = {}
        for (let i = 0; i < cols.length; i++) {
          colSize[cols[i]] = Number((186 / cols.length).toFixed(4));
        }
        setGroupHeaders(__table.headerGroups)
        setTables([...tables.map((tab) => tab.tableName === _table.tableName ? { ...tab, headers: __table.headers, columnLength: __table.columnLength, columnSizingLock: __table.columnSizingLock, columns: __table.columns, columnSizing: colSize, headerGroups: __table.headerGroups } : tab)])
        table.setColumnSizing(colSize)
        setColumnSizing(colSize)
      },
      updateData: (rowIndex, columnId, value) => {
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value,
              };
            }
            return row;
          })
        );
      },
      _addTopHeader: () => {
        let __table = addTopHeader(_table)
        setIsBlockHeaders(true)
        setGroupHeaders(__table.headerGroups)
        setColumns(__table.columns)
      },
      updateHeader: (depth, columnId, value) => {
        console.log(columnId)
        if (isBlockHeaders && table.getHeaderGroups().length !== depth) {
          let _groupHeaders = [...groupHeaders.map(x => x.flat === depth ? { ...x, headers: [...x.headers.map((y,index )=> y.id === columnId ? {...y, name: value } : y)] } : x)]
          setGroupHeaders(_groupHeaders)
        }
        else {
          setHeaders({ ...headers, [columnId]: value })
          let _groupHeaders = [...groupHeaders.map(x => x.flat === depth ? { ...x, headers: [...x.headers.map((y,index )=> y.id === columnId ? {...y, name: value } : y)] } : x)]
          setGroupHeaders(_groupHeaders)
        }
      },
      revertHeader: (depth) => {
        if (isBlockHeaders && table.getHeaderGroups().length !== depth) {
          setGroupHeaders(tables.find((tab) => tab.tableName === _table.tableName).groupHeaders)
        }
        else {
          setHeaders(tables.find((tab) => tab.tableName === _table.tableName).headers)
        }
      },
      updateHeaders: (e, depth) => {
        let __table = { ..._table, headers: headers, headerGroups: groupHeaders }
        if (isBlockHeaders) {
          let columns = HeaderHelper(__table)
          setTables([...tables.map((tab) => tab.tableName === _table.tableName ?{...tab,columns:columns,headers:headers,headerGroups:groupHeaders} : tab)])
          setColumns(columns)
        }
        else {
          __table = updateHelper(__table)
          setTables([...tables.map((tab) => tab.tableName === _table.tableName ? __table : tab)])
          setColumns(__table.columns)
        }
      },
      _setEditHeaders: (e, depth) => {
        const elName = e.currentTarget.name;
        if (elName !== "edit") {
          setEditHeaders([...editHeaders.filter(x => x !== depth)])
          elName === "cancel" ? table.options.meta?.revertHeader(depth) : table.options.meta?.updateHeaders()
        }
        else {
          setEditHeaders([...editHeaders, depth])
        }
      },
      setSizeLock: (columnId) => {
        let columnSize
        if (!columnSizingLock[columnId]) {
          let keys = Object.keys(columnSizing)
          let close = [columnId]
          let closeLength = columnSizing[columnId]
          for (let i = 0; i < keys.length; i++) {
            if (columnSizingLock[keys[i]]) {
              close.push(keys[i])
              closeLength += columnSizing[keys[i]]
            }
          }
          if (_table.columnLength - close.length > 0) {
            let newLength = Number((186 - closeLength) / (_table.columnLength - close.length).toFixed(4));
            let newColumnSizes = keys.map((x) => close.includes(x) ? { [x]: columnSizing[x] } : { [x]: newLength })
            columnSize = Object.assign({}, ...newColumnSizes)
          }
        }

        if (columnSize) {
          setTables([...tables.map((tab) => tab.tableName === _table.tableName ? {
            ...tab,
            columnSizing: columnSize,
            columnSizingLock: { ...tab.columnSizingLock, [columnId]: !columnSizingLock[columnId] }
          } : tab)])
          table.setColumnSizing(columnSize)
          setColumnSizing(columnSize)
          setColumnSizingLock({ ...columnSizingLock, [columnId]: !columnSizingLock[columnId] })
        }
        else {
          setColumnSizingLock({ ...columnSizingLock, [columnId]: !columnSizingLock[columnId] })
          setTables([...tables.map((tab) => tab.tableName === _table.tableName ? { ...tab, columnSizingLock: { ...tab.columnSizingLock, [columnId]: !columnSizingLock[columnId] } } : tab)])
        }
      },
      setRowSpan: (rowIndex, columnId) => {
        let data = _table.data
        let cellStyles = _table.cellStyles
        let cellHiddens = _table.hiddenCells
        let cellStyle = _table.cellStyles.find(x => x.rowIndex === rowIndex && x.columnId === columnId)
        let nextCellStyle;

        if (cellStyle) {
          if (cellStyle.row) {
            //RowSpan Tanımlıysa
            let cellRowSpanCount = cellStyle.cellStyle.rowSpan
            nextCellStyle = cellStyles.find((x) => x.rowIndex === rowIndex + cellRowSpanCount && x.columnId === columnId)
            //ColSpan Tanımlıysa yapılmadı..
            if (cellStyle.col) {
              if (nextCellStyle) {
                let cellColSpanCount = cellStyle.cellStyle.colSpan
                if (nextCellStyle.col) {
                  let nextCellColSpanCount = nextCellStyle.cellStyle.colSpan
                  if (nextCellColSpanCount == cellColSpanCount) {
                    cellHiddens = cellHiddens.map(x => x.from.rowIndex === rowIndex + cellRowSpanCount && x.from.columnId === columnId ? { ...x, from: { ...x.from, rowIndex: rowIndex, columnId: columnId } } : x)
                    cellHiddens.push({ rowIndex: rowIndex + cellRowSpanCount, columnId: columnId, from: { rowIndex: rowIndex, columnId: columnId } })
                    cellStyles = cellStyles.filter((x) => x.rowIndex !== rowIndex + cellRowSpanCount || x.columnId !== columnId)
                    delete data[rowIndex + cellRowSpanCount][columnId]
                    if (nextCellStyle.row) {
                      cellStyles = cellStyles.map((x) => x.rowIndex === rowIndex && x.columnId === columnId ? { ...x, row: true, col: true, cellStyle: { ...x.cellStyle, rowSpan: cellRowSpanCount + nextCellStyle.cellStyle.rowSpan, style: { height: '1px', position: 'relative' } } } : x)
                    }
                    else {
                      cellStyles = cellStyles.map((x) => x.rowIndex === rowIndex && x.columnId === columnId ? { ...x, row: true, cellStyle: { ...x.cellStyle, rowSpan: cellRowSpanCount + 1, style: { height: '1px', position: 'relative' } } } : x)
                    }
                  }
                  else {
                    alert('Satır veya sütün boyutları eşit olmalı!')
                  }
                }
                else {
                  alert('Satır veya sütün boyutları eşit olmalı!')
                }
              }
              else {
                alert('Satır veya sütün boyutları eşit olmalı!')
              }
            }
            //ColSpan Tanımlı değilse
            else {
              if (nextCellStyle) {
                if (nextCellStyle.col) {
                  alert('Satır veya sütün boyutları eşit olmalı!')
                }
                if (nextCellStyle.row) {
                  cellHiddens = cellHiddens.map(x => x.from.rowIndex === rowIndex + cellRowSpanCount && x.from.columnId === columnId ? { ...x, from: { ...x.from, rowIndex: rowIndex, columnId: columnId } } : x)
                  cellHiddens.push({ rowIndex: rowIndex + cellRowSpanCount, columnId: columnId, from: { rowIndex: rowIndex, columnId: columnId } })
                  cellStyles = cellStyles.filter((x) => x.rowIndex !== rowIndex + cellRowSpanCount || x.columnId !== columnId)
                  cellStyles = cellStyles.map((x) => x.rowIndex === rowIndex && x.columnId === columnId ? { ...x, row: true, cellStyle: { ...x.cellStyle, rowSpan: cellStyle.cellStyle.rowSpan + nextCellStyle.cellStyle.rowSpan, style: { height: '1px', position: 'relative' } } } : x)
                  let _data = data[rowIndex + cellRowSpanCount]
                  if (_data) {
                    delete data[rowIndex + cellRowSpanCount][columnId]
                  }
                }
              }
              else {
                cellHiddens.push({ rowIndex: rowIndex + cellRowSpanCount, columnId: columnId, from: { rowIndex: rowIndex, columnId: columnId } })
                cellStyles = cellStyles.map((x) => x.rowIndex === rowIndex && x.columnId === columnId ? { ...x, row: true, cellStyle: { ...x.cellStyle, rowSpan: cellStyle.cellStyle.rowSpan + 1, style: { height: '1px', position: 'relative' } } } : x)
                let _data = data[rowIndex + cellRowSpanCount]
                if (_data) {
                  delete data[rowIndex + cellRowSpanCount][columnId]
                }
              }
            }    //-------

          }
          //RowSPan tanımlı degil........
          else {
            if (cellStyle.col) {
              let cellColSpanCount = cellStyle.cellStyle.colSpan
              nextCellStyle = cellStyles.find((x) => x.rowIndex === rowIndex + 1 && x.columnId === columnId)
              if (nextCellStyle) {
                if (nextCellStyle.col) {
                  if (nextCellStyle.cellStyle.colSpan === cellColSpanCount) {
                    cellHiddens = cellHiddens.map(x => x.from.rowIndex === rowIndex + 1 && x.from.columnId === columnId ? { ...x, from: { ...x.from, rowIndex: rowIndex, columnId: columnId } } : x)
                    cellHiddens.push({ rowIndex: rowIndex + 1, columnId: columnId, from: { rowIndex: rowIndex, columnId: columnId } })
                    cellStyles = cellStyles.filter((x) => x.rowIndex !== rowIndex + 1 || x.columnId !== columnId)
                    delete data[rowIndex + 1][columnId]
                    if (nextCellStyle.row) {
                      cellStyles = cellStyles.map((x) => x.rowIndex === rowIndex && x.columnId === columnId ? { ...x, row: true, cellStyle: { ...x.cellStyle, colSpan: cellColSpanCount, rowSpan: nextCellStyle.cellStyle.rowSpan + 1, style: { height: '1px', position: 'relative' } } } : x)
                    }
                    else {
                      cellStyles = cellStyles.map((x) => x.rowIndex === rowIndex && x.columnId === columnId ? { ...x, row: true, cellStyle: { ...x.cellStyle, rowSpan: 2, colSpan: cellColSpanCount, style: { height: '1px', position: 'relative' } } } : x)
                    }
                  }
                  else {
                    alert('Satır veya sütün boyutları eşit olmalı!')
                  }
                }
                else {
                  alert('Satır veya sütün boyutları eşit olmalı!')
                }
              }
              else {
                alert('Satır veya sütün boyutları eşit olmalı!')
              }
            }
            else {
              let nextCellHidden = _table.hiddenCells.find(x => x.rowIndex === rowIndex + 1 && x.columnId === columnId)
              let nextCellStyle = _table.cellStyles.find(x => x.rowIndex === rowIndex + 1 && x.columnId === columnId)
              if (nextCellHidden) {
                alert('Satır veya sütün boyutları eşit olmalı!')
              }
              else {
                if (nextCellStyle) {
                  alert(nextCellStyle.row)
                  if (nextCellStyle.row) {
                    let nextSpanCount = nextCellStyle.cellStyle.rowSpan
                    cellHiddens = cellHiddens.map(x => x.from.rowIndex === rowIndex + 1 && x.from.columnId === columnId ? { ...x, from: { ...x.from, rowIndex: rowIndex, columnId: columnId } } : x)
                    cellHiddens.push({ rowIndex: rowIndex + 1, columnId: columnId, from: { rowIndex: rowIndex, columnId: columnId } })
                    cellStyles = cellStyles.filter((x) => x.rowIndex !== rowIndex + 1 || x.columnId !== columnId)
                    cellStyles.push({ rowIndex: rowIndex, columnId: columnId, row: true, col: false, cellStyle: { rowSpan: nextSpanCount + 1, style: { height: '1px', position: 'relative' } } })
                    delete data[rowIndex + 1][columnId]
                  }
                  else {
                    alert('Satır veya sütün boyutları eşit olmalı!')
                  }
                }
                else {
                  cellHiddens.push({ rowIndex: rowIndex + 1, columnId: columnId, from: { rowIndex: rowIndex, columnId: columnId } })
                  delete data[rowIndex + 1][columnId]
                  if (nextCellStyle) {
                    cellStyles = cellStyles.map(x => x.rowIndex === rowIndex && x.columnId === columnId ? { ...x, row: true, cellStyle: { ...x.cellStyle, rowSpan: 2 } } : x)
                  }
                  else {
                    cellStyles.push({ rowIndex: rowIndex, columnId: columnId, row: true, col: false, cellStyle: { rowSpan: 2, style: { height: '1px', position: 'relative' } } })
                  }
                }
              }
            }
          }
        }
        //Style tanımlı degil........
        else {
          let nextCellHidden = cellHiddens.find(x => x.rowIndex === rowIndex + 1 && x.columnId === columnId)
          if (!nextCellHidden) {
            let nextCellStyle = _table.cellStyles.find(x => x.rowIndex === rowIndex + 1 && x.columnId === columnId)
            if (nextCellStyle) {
              if (nextCellStyle.col) {
                alert('Satır veya sütün boyutları eşit olmalı!')
              }
              else if (nextCellStyle.row) {
                let nextSpanCount = nextCellStyle.cellStyle.rowSpan
                cellHiddens = cellHiddens.map(x => x.from.rowIndex === rowIndex + 1 && x.from.columnId === columnId ? { ...x, from: { ...x.from, rowIndex: rowIndex, columnId: columnId } } : x)
                cellHiddens.push({ rowIndex: rowIndex + 1, columnId: columnId, from: { rowIndex: rowIndex, columnId: columnId } })
                cellStyles = cellStyles.filter((x) => x.rowIndex !== rowIndex + 1 || x.columnId !== columnId)
                cellStyles.push({ rowIndex: rowIndex, columnId: columnId, row: true, col: false, cellStyle: { rowSpan: nextSpanCount + 1, style: { height: '1px', position: 'relative' } } })
                let _data = data[rowIndex + 1]
                if (_data) {
                  delete data[rowIndex + 1][columnId]
                }

              }
              else {
                alert('Satır veya sütün boyutları eşit olmalı!')
              }
            }
            else {
              cellHiddens.push({ rowIndex: rowIndex + 1, columnId: columnId, from: { rowIndex: rowIndex, columnId: columnId } })
              cellStyles = cellStyles.filter((x) => x.rowIndex !== rowIndex + 1 || x.columnId !== columnId)
              cellStyles.push({ rowIndex: rowIndex, columnId: columnId, row: true, col: false, cellStyle: { rowSpan: 2, style: { height: '1px', position: 'relative' } } })
              let _data = data[rowIndex + 1]
              if (_data) {
                delete data[rowIndex + 1][columnId]
              }
            }
          }
          else {
            alert('Satır veya sütün boyutları eşit olmalı!')
          }
        }

        setData([...data]);
        setTables([...tables.map((tab) => tab.tableName === _table.tableName ? {
          ...tab,
          data: [...data],
          hiddenCells: [...cellHiddens],
          cellStyles: [...cellStyles]
        } : tab)])

      },
      setColSpan: (rowIndex, columnId) => {
        let data = _table.data
        let cellStyles = _table.cellStyles
        let cellHiddens = _table.hiddenCells
        let columnNumber = parseInt(columnId.slice(7))
        let cellStyle = _table.cellStyles.find(x => x.rowIndex === rowIndex && x.columnId === columnId)
        let nextCellStyle;

        if (cellStyle) {
          if (cellStyle.cellStyle.colSpan + columnNumber + 1 > parseInt(_table.columnLength)) {
            alert('Sütun sayısını aşamazsınız!')
            return false
          }
          if (cellStyle.col) {
            let cellColSpanCount = cellStyle.cellStyle.colSpan
            nextCellStyle = cellStyles.find((x) => x.rowIndex === rowIndex && x.columnId === `column-${columnNumber + cellColSpanCount}`)
            if (cellStyle.row) {
              if (nextCellStyle) {
                let cellRowSpanCount = cellStyle.cellStyle.rowSpan
                if (nextCellStyle.row) {
                  let nextCellRowSpanCount = nextCellStyle.cellStyle.rowSpan
                  if (nextCellRowSpanCount == cellRowSpanCount) {
                    cellHiddens = cellHiddens.map(x => x.from.rowIndex === rowIndex && x.from.columnId === `${nextCellStyle.columnId}` ? { ...x, from: { ...x.from, rowIndex: rowIndex, columnId: columnId } } : x)
                    cellHiddens.push({ rowIndex: rowIndex, columnId: nextCellStyle.columnId, from: { rowIndex: rowIndex, columnId: columnId } })
                    cellStyles = cellStyles.filter((x) => x.rowIndex !== rowIndex || x.columnId !== nextCellStyle.columnId)
                    delete data[rowIndex][`column-${columnNumber + cellColSpanCount}`]
                    if (nextCellStyle.col) {
                      cellStyles = cellStyles.map((x) => x.rowIndex === rowIndex && x.columnId === columnId ? { ...x, col: true, cellStyle: { ...x.cellStyle, colSpan: cellColSpanCount + nextCellStyle.cellStyle.colSpan, style: { height: '1px', position: 'relative' } } } : x)
                    }
                    else {
                      cellStyles = cellStyles.map((x) => x.rowIndex === rowIndex && x.columnId === columnId ? { ...x, col: true, cellStyle: { ...x.cellStyle, colSpan: cellColSpanCount + 1, style: { height: '1px', position: 'relative' } } } : x)
                    }
                  }
                  else {
                    alert('Satır veya sütün boyutları eşit olmalı!')
                  }
                }
                else {
                  alert('Satır veya sütün boyutları eşit olmalı!')
                }
              }
              else {
                alert('Satır veya sütün boyutları eşit olmalı!')
              }
            }
            else {
              if (nextCellStyle) {
                if (nextCellStyle.row) {
                  alert('Satır veya sütün boyutları eşit olmalı!')
                }
                if (nextCellStyle.col) {
                  cellHiddens = cellHiddens.map(x => x.from.rowIndex === rowIndex && x.from.columnId === `${nextCellStyle.columnId}` ? { ...x, from: { ...x.from, rowIndex: rowIndex, columnId: columnId } } : x)
                  cellHiddens.push({ rowIndex: rowIndex, columnId: nextCellStyle.columnId, from: { rowIndex: rowIndex, columnId: columnId } })
                  cellStyles = cellStyles.filter((x) => x.rowIndex !== rowIndex || x.columnId !== nextCellStyle.columnId)
                  cellStyles = cellStyles.map((x) => x.rowIndex === rowIndex && x.columnId === columnId ? { ...x, col: true, cellStyle: { ...x.cellStyle, colSpan: cellStyle.cellStyle.colSpan + nextCellStyle.cellStyle.colSpan, style: { height: '1px', position: 'relative' } } } : x)
                  delete data[rowIndex][`column-${columnNumber + cellColSpanCount}`]
                }
              }
              else {
                cellHiddens.push({ rowIndex: rowIndex, columnId: `column-${columnNumber + cellColSpanCount}`, from: { rowIndex: rowIndex, columnId: columnId } })
                cellStyles = cellStyles.map((x) => x.rowIndex === rowIndex && x.columnId === columnId ? { ...x, col: true, cellStyle: { ...x.cellStyle, colSpan: cellStyle.cellStyle.colSpan + 1, style: { height: '1px', position: 'relative' } } } : x)
                delete data[rowIndex][`column-${columnNumber + cellColSpanCount}`]
              }
            }
          }
          //ColSPan tanımlı degil........
          else {
            if (cellStyle.row) {
              let cellRowSpanCount = cellStyle.cellStyle.rowSpan
              nextCellStyle = cellStyles.find((x) => x.rowIndex === rowIndex && x.columnId === `column-${columnNumber + 1}`)
              if (nextCellStyle) {
                if (nextCellStyle.row) {
                  if (nextCellStyle.cellStyle.rowSpan === cellRowSpanCount) {
                    cellHiddens = cellHiddens.map(x => x.from.rowIndex === rowIndex && x.from.columnId === `${nextCellStyle.columnId}` ? { ...x, from: { ...x.from, rowIndex: rowIndex, columnId: columnId } } : x)
                    cellHiddens.push({ rowIndex: rowIndex, columnId: nextCellStyle.columnId, from: { rowIndex: rowIndex, columnId: columnId } })
                    cellStyles = cellStyles.filter((x) => x.rowIndex !== rowIndex || x.columnId !== nextCellStyle.columnId)
                    delete data[rowIndex][`column-${columnNumber + 1}`]
                    if (nextCellStyle.col) {
                      cellStyles = cellStyles.map((x) => x.rowIndex === rowIndex && x.columnId === columnId ? { ...x, col: true, cellStyle: { ...x.cellStyle, colSpan: nextCellStyle.cellStyle.colSpan + 1, style: { height: '1px', position: 'relative' } } } : x)
                    }
                    else {
                      cellStyles = cellStyles.map((x) => x.rowIndex === rowIndex && x.columnId === columnId ? { ...x, col: true, cellStyle: { ...x.cellStyle, colSpan: 2, style: { height: '1px', position: 'relative' } } } : x)
                    }
                  }
                  else {
                    alert('Satır veya sütün boyutları eşit olmalı!')
                  }
                }
                else {
                  alert('Satır veya sütün boyutları eşit olmalı!')
                }
              }
              else {
                alert('Satır veya sütün boyutları eşit olmalı!')
              }
            }
            else {
              let nextCellHidden = _table.hiddenCells.find(x => x.rowIndex === rowIndex && x.columnId === `column-${columnNumber + 1}`)
              let nextCellStyle = _table.cellStyles.find(x => x.rowIndex === rowIndex && x.columnId === `column-${columnNumber + 1}`)
              if (nextCellHidden) {
                alert('Satır veya sütün boyutları eşit olmalı!')
              }
              else {
                if (nextCellStyle) {
                  if (nextCellStyle.col) {
                    let nextSpanCount = nextCellStyle.cellStyle.colSpan
                    cellHiddens = cellHiddens.map(x => x.from.rowIndex === rowIndex && x.from.columnId === nextCellStyle.columnId ? { ...x, from: { ...x.from, rowIndex: rowIndex, columnId: columnId } } : x)
                    cellHiddens.push({ rowIndex: rowIndex, columnId: nextCellStyle.columnId, from: { rowIndex: rowIndex, columnId: columnId } })
                    cellStyles = cellStyles.filter((x) => x.rowIndex !== rowIndex || x.columnId !== nextCellStyle.columnId)
                    cellStyles.push({ rowIndex: rowIndex, columnId: columnId, row: false, col: true, cellStyle: { colSpan: nextSpanCount + 1, style: { height: '1px', position: 'relative' } } })
                    delete data[rowIndex][`column-${columnNumber + 1}`]
                  }
                  else {
                    alert('Satır veya sütün boyutları eşit olmalı!')
                  }
                }
                else {
                  cellHiddens.push({ rowIndex: rowIndex, columnId: `column-${columnNumber + 1}`, from: { rowIndex: rowIndex, columnId: columnId } })
                  delete data[rowIndex][`column-${columnNumber + 1}`]
                  if (nextCellStyle) {
                    cellStyles = cellStyles.map(x => x.rowIndex === rowIndex && x.columnId === columnId ? { ...x, col: true, cellStyle: { ...x.cellStyle, colSpan: 2 } } : x)
                  }
                  else {
                    cellStyles.push({ rowIndex: rowIndex, columnId: columnId, row: false, col: true, cellStyle: { colSpan: 2, style: { height: '1px', position: 'relative' } } })
                  }
                }
              }
            }
          }
        }
        //Style Tanımlı Değil
        else {
          if (columnNumber + 2 > parseInt(_table.columnLength)) {
            alert('Sütun sayısını aşamazsınız!')
            return false
          }
          let nextCellHidden = _table.hiddenCells.find(x => x.rowIndex === rowIndex && x.columnId === `column-${columnNumber + 1}`)
          nextCellStyle = _table.cellStyles.find(x => x.rowIndex === rowIndex && x.columnId === `column-${columnNumber + 1}`)
          if (nextCellHidden) {
            alert('Satır veya sütün boyutları eşit olmalı!')
          }
          else {
            if (nextCellStyle) {
              if (nextCellStyle.row) {
                alert('Satır veya sütün boyutları eşit olmalı!')
              }
              if (nextCellStyle.col) {
                let nextSpanCount = nextCellStyle.cellStyle.colSpan
                cellHiddens = cellHiddens.map(x => x.from.rowIndex === rowIndex && x.from.columnId === nextCellStyle.columnId ? { ...x, from: { ...x.from, rowIndex: rowIndex, columnId: columnId } } : x)
                cellHiddens.push({ rowIndex: rowIndex, columnId: nextCellStyle.columnId, from: { rowIndex: rowIndex, columnId: columnId } })
                cellStyles = cellStyles.filter((x) => x.rowIndex !== rowIndex || x.columnId !== nextCellStyle.columnId)
                cellStyles.push({ rowIndex: rowIndex, columnId: columnId, row: false, col: true, cellStyle: { colSpan: nextSpanCount + 1, style: { height: '1px', position: 'relative' } } })
                delete data[rowIndex][`column-${columnNumber + 1}`]
              }
            }
            else {
              cellHiddens.push({ rowIndex: rowIndex, columnId: `column-${columnNumber + 1}`, from: { rowIndex: rowIndex, columnId: columnId } })
              delete data[rowIndex][`column-${columnNumber + 1}`]
              if (nextCellStyle) {
                cellStyles = cellStyles.map(x => x.rowIndex === rowIndex && x.columnId === columnId ? { ...x, col: true, cellStyle: { ...x.cellStyle, colSpan: 2 } } : x)
              }
              else {
                cellStyles.push({ rowIndex: rowIndex, columnId: columnId, row: false, col: true, cellStyle: { colSpan: 2, style: { height: '1px', position: 'relative' } } })
              }
            }
          }
        }

        setData([...data]);
        setTables([...tables.map((tab) => tab.tableName === _table.tableName ? {
          ...tab,
          data: [...data],
          hiddenCells: [...cellHiddens],
          cellStyles: [...cellStyles]
        } : tab)])
      },
      _adjustColumnSize: (e) => {
        setEditSize(!editSize)
      },
      _pdfPrint: () => {
        let tableBody = document.querySelector(`#${_table.tableName} tbody`);
        let tableRows = tableBody.getElementsByTagName(`tr`);
        let heights = [40 * 0.69]
        let rowLength = data.length
        for (let i = 0; i < rowLength; i++) {
          heights.push(tableRows[i].offsetHeight * 0.69)
        }
        pdfPrint(_table, heights)
      },
    },
  });


  return (
    <>
      <table className='teklif' id={`${_table.tableName}`} style={{ width: 'calc(186mm + 21.6958333333mm)' }}>
        <thead>
          {table.getHeaderGroups().map((headerGroup, groupIndex) => (
            <tr key={groupIndex}>
              {headerGroup.headers.map((header, index, all) => {
                // console.log({ column: header, header: header.column.id, index: index, depth: header.depth, subheaders: header.subHeaders.map(x => x.column.id), headerid: header.id })
                if (index + 1 === all.length) {
                  return (
                    <th {...{
                      key: header.id,
                      colSpan: header.colSpan,
                      style: {
                        width: 21.6958333333 + 'mm',
                        maxWidth: 21.6958333333 + 'mm',
                        padding: '0.1rem 0.3 rem'
                      },
                    }}>
                      <div className="edit-cell-container">
                        {editHeaders.includes(header.depth) ? (
                          <div className="edit-cell" style={{ display: 'flex', gap: '5px' }}>
                            <button onClick={(e) => table.options.meta?._setEditHeaders(e, header.depth)} name="cancel">
                              ⚊
                            </button>
                            <button onClick={(e) => table.options.meta?._setEditHeaders(e, header.depth)} name="done">
                              ✔
                            </button>
                          </div>
                        ) : (
                          <div className="edit-cell" style={{ display: 'flex', gap: '5px' }}>
                            <button onClick={(e) => table.options.meta?._setEditHeaders(e, header.depth)} name="edit">
                              ✐
                            </button>
                            <button onClick={table.options.meta?._addTopHeader} name="">
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </th>
                  )
                }
                else {
                  return (
                    <th {...{
                      key: header.id,
                      colSpan: header.colSpan,
                      style: {
                        position: 'relative',
                        width: header.getSize() + 'mm',
                        maxWidth: header.getSize() + 'mm',
                        fontWeight: 'bold'
                      },
                    }}>
                      <>
                        {
                          columnSizingLock[header.id] ?
                            <TiLockClosed onClick={(e) => table.options.meta?.setSizeLock(header.id)} name={header.id} style={{ position: 'absolute', right: '1px', top: '1px', width: '17px', height: '17px', color: '#f50', cursor: 'pointer', display: `${editSize ? 'flex' : 'none'}` }} />
                            :
                            <TiLockOpen onClick={(e) => table.options.meta?.setSizeLock(header.id)} name={header.id} style={{ position: 'absolute', right: '1px', top: '1px', width: '17px', height: '17px', color: '#f50', cursor: 'pointer', display: `${editSize ? 'flex' : 'none'}` }} />
                        }
                        {
                          editHeaders.includes(header.depth)? (
                            <input
                              style={{ width: '100%', border: 'none', fontWeight: 'bold', backgroundColor: '#f9e8d9', letterSpacing: '0.03rem', paddingLeft: '0' }}
                              value={isBlockHeaders && table.getHeaderGroups().length !== header.depth ?groupHeaders.find(x => x.flat === header.depth).headers[index]?.name : headers[header.id] }
                              onChange={e => isBlockHeaders && table.getHeaderGroups().length !== header.depth ? table.options.meta?.updateHeader(header.depth, header.column.columnDef.header, e.target.value) : table.options.meta?.updateHeader(header.depth, header.id, e.target.value)}
                            />
                          )
                            :                            
                            header.isPlaceholder
                              ? null
                              : flexRender(
                                isBlockHeaders && table.getHeaderGroups().length !== header.depth?groupHeaders.find(x => x.flat === header.depth).headers.find(x=>x.id===header.column.columnDef.header).name
                                :header.column.columnDef.header,
                                header.getContext()
                              )
                        }
                        {
                        //console.log(header.getContext())
                        }
                        <div style={{ flexDirection: 'row', justifyContent: 'space-between', position: 'absolute', width: '100%', bottom: '-2px', left: '0', display: `${editSize && !columnSizingLock[header.id] ? 'flex' : 'none'}` }}>
                          <input type="range" min="0" max={header.getSize()} className='range-input' value={columnSizing[header.id]} onChange={(e) => setColumnSizing({ ...columnSizing, [header.id]: parseFloat(e.target.value) })} />
                        </div>
                      </>
                    </th>
                  )
                }
              })

              }

            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => {
                let visibilty = _table.hiddenCells.find(x => x.rowIndex == row.index && x.columnId == cell.column.id)
                if (!visibilty) {
                  let Style = _table.cellStyles.find(x => x.rowIndex == row.index && x.columnId == cell.column.id)
                  return (
                    // <td key={cell.id} {...cell.getContext().cell.column.columnDef.meta?.getCellContext(cell.getContext())}>
                    <td key={cell.id} {...Style ? Style.cellStyle : { style: { height: '1px', position: 'relative', maxWidth: cell.column.getSize() + 'mm', wordWrap: 'break-word' } }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  )
                }
              }
              )}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th colSpan={table.getCenterLeafColumns().length} align="right">
              <FooterCell table={table} />
            </th>
          </tr>
        </tfoot>
      </table >
      {

        <div>
          <pre>{JSON.stringify(table, null, "\t")}</pre>
          <pre>{JSON.stringify(data, null, "\t")}</pre>
        </div>
      }
    </>
  );
};

export default TanstackTable;
