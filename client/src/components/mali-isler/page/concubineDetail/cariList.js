import React, { Fragment, useEffect, useContext } from 'react';
import Table from './cariTable'
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import _ from 'lodash';
import { ConcubinesContext } from '../../../../context/concubinesContext';


const CariList = () => {
  const { concubineState: { concubines } } = useContext(ConcubinesContext);
  const { state } = useLocation()
  const _cariler = [];
  let data = concubines.find(x => x._id == state.prop)
  _.sortBy(data.cariler, ['processDate']).map((cari, index, arr) => {
    let subTotal = 0;
    index === 0 ?
      subTotal = cari.process === 'Fatura' ? cari.debt : -cari.receive
      :
      subTotal = cari.process === 'Fatura' ? _cariler[index - 1].subTotal + cari.debt : _cariler[index - 1].subTotal - cari.receive

    _cariler.push({
      ...cari,
      companyName: data.companyName,
      vergiDairesi: data.vergiDairesi,
      vergiNumarasi: data.vergiNumarasi,
      subTotal: subTotal
    })
  })

  useEffect(() => {
    console.log(concubines)
  }, [concubines])

  const columns = React.useMemo(
    () => [
      {
        id: "companyName",
        Header: "Firma Ünvanı",
        accessor: "companyName",
        Cell: props => {
          return (
            <div className='double'>
              <p>{props.cell.value.name}</p>
              <p style={{ height: '15px' }}>{props.cell.value.isgKatipName !== null ? props.cell.value.isgKatipName : ' '}</p>
            </div>)
        },
        disableFilters: true
      },
      {
        id: "vergiDairesi",
        Header: "Vergi Dairesi",
        accessor: "vergiDairesi",
        Cell: props => {
          return (
            props.cell.value
          )
        },
        disableFilters: true
      },
      {
        id: "vergiNumarasi",
        Header: "Vergi Numarası",
        accessor: "vergiNumarasi",
        Cell: props => {
          return (
            props.cell.value
          )
        },
        disableFilters: true
      },
      {
        id: "process",
        Header: "İşlem Türü",
        accessor: "process",
        Cell: props => {
          return (
            <p style={{ color: `${props.cell.value === 'Fatura' ? 'red' : 'green'}` }}>{props.cell.value}</p>
          )
        },
        disableFilters: true
      },
      {
        id: "processDate",
        Header: "İşlem Tarihi",
        accessor: "processDate",
        Cell: props => {
          return (
            dayjs(props.cell.value).format("DD/MM/YYYY")
          )
        },
        Filter: DateRangeColumnFilter,
        filter: dateBetweenFilterFn
      },
      {
        id: "receive",
        Header: "Tahsilat Tutarı",
        accessor: "receive",
        Cell: props => {
          return (
            props.row.original.process === 'Tahsilat' ?
              <p style={{ color: "green", marginBottom: "0" }}>{new Intl.NumberFormat('tr-TR', {
                style: 'currency',
                currency: 'TRY',
              }).format(props.cell.value)}</p>
              : null
          )
        },
        disableFilters: true
      },
      {
        id: "debt",
        Header: "Fatura Tutarı",
        accessor: "debt",
        Cell: props => {
          return (
            props.row.original.process === 'Fatura' ?
              <p style={{ color: "red", marginBottom: "0" }}>{new Intl.NumberFormat('tr-TR', {
                style: 'currency',
                currency: 'TRY',
              }).format(props.cell.value)}</p>
              : null
          )
        },
        disableFilters: true
      },
      {
        id: "subTotal",
        Header: "Bakiye",
        accessor: "subTotal",
        Cell: props => {
          return (
            <p style={{ color: "red", marginBottom: "0" }}>{new Intl.NumberFormat('tr-TR', {
              style: 'currency',
              currency: 'TRY',
            }).format(props.cell.value)}</p>
          )
        },
        disableFilters: true
      },
    ], []
  )

  return (
    <Fragment>
      <Table columns={columns} data={_cariler} company={{ id: data._id, name: data.companyName }} />
    </Fragment>
  );

}

export default CariList;

function DateRangeColumnFilter({
  column: {
    filterValue = [],
    preFilteredRows,
    setFilter,
    id
  } }) {
  const [min, max] = React.useMemo(() => {
    let min = preFilteredRows.length ? new Date(preFilteredRows[0].values[id]) : new Date(0)
    let max = preFilteredRows.length ? new Date(preFilteredRows[0].values[id]) : new Date(0)

    preFilteredRows.forEach(row => {
      const rowDate = new Date(row.values[id])

      min = rowDate <= min ? rowDate : min
      max = rowDate >= max ? rowDate : max
    })

    return [min, max]
  }, [id, preFilteredRows])

  return (
    <div>
      <input
        min={min.toISOString().slice(0, 10)}
        onChange={e => {
          const val = e.target.value
          setFilter((old = []) => [val ? val : undefined, old[1]])
        }}
        type="date"
        value={filterValue[0] || ''}
      />
      {' to '}
      <input
        max={max.toISOString().slice(0, 10)}
        onChange={e => {
          const val = e.target.value
          setFilter((old = []) => [old[0], val ? val.concat('T23:59:59.999Z') : undefined])
        }}
        type="date"
        value={filterValue[1]?.slice(0, 10) || ''}
      />
      <button>Filtrele</button>
    </div>
  )
}

function dateBetweenFilterFn(rows, id, filterValues) {
  const sd = filterValues[0] ? new Date(filterValues[0]) : undefined
  const ed = filterValues[1] ? new Date(filterValues[1]) : undefined

  if (ed || sd) {
    return rows.filter(r => {
      const cellDate = new Date(r.values[id])

      if (ed && sd) {
        return cellDate >= sd && cellDate <= ed
      } else if (sd) {
        return cellDate >= sd
      } else if (ed) {
        return cellDate <= ed
      }
    })
  } else {
    return rows
  }
}