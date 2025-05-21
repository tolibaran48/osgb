import React, { Fragment} from 'react';
import Table from './concubineTable'
import turkishToEnglish from '../../../../functions/turkishToEnglish';
import SelectInput from '../../../../functions/selectInput';
import { BsKeyFill } from "react-icons/bs";
import { Link} from 'react-router-dom';
import { TbListDetails } from "react-icons/tb";
import dayjs from 'dayjs';


const ConcubineList = ({ select, checkBox, getCompanyConcubineLoading}) => { 

  const columns = React.useMemo(
    () => [
      {
        id: "pass",
        Header: " ",
        Cell: <BsKeyFill style={{ height: '1.15em', width: '1.15em' }} />
      },
      {
        id: "companyName",
        Header: "Firma Ünvanı",
        accessor: "companyName",
        Cell: props => {
          return (
            <div className='double'>
              <p>{props.cell.row.original.companyName.name}</p>
              <p>{props.cell.row.original.companyName.isgKatipName}</p>
            </div>)
        },
        sortType: (a, b) => {
          const c = turkishToEnglish((a.values.companyName.name).toString()).toLowerCase()
          const d = turkishToEnglish((b.values.companyName.name).toString()).toLowerCase()

          if (c > d)
            return 1

          if (d > c)
            return -1

          return 0
        },
        filter: (rows, id, filterValue) => {
          return rows.filter(row => {
            const rowValue = {
              'companyName': row.original.companyName.name,
              'isgKatipName': row.original.companyName.isgKatipName ?? ""
            };
            let value = turkishToEnglish(filterValue).toLowerCase();
            return rowValue !== undefined
              ? turkishToEnglish(rowValue.companyName).toLowerCase().includes(value) || turkishToEnglish(rowValue.isgKatipName).toLowerCase().includes(value)
              : true;
          });
        },
        Filter: ({ column }) => {
          const { filterValue, setFilter, Header, id } = column;

          return (
            <fieldset >
              <div className='label' >
                <label htmlFor={id} >{Header}</label>
              </div>
              <div className='input' style={{ position: 'relative' }}>
                <input className='form-control' id={id}
                  placeholder='Firma Ünvanı...'

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
        id: "sonOdeme",
        Header: "Son Tahsilat",
        accessor: "sonOdeme",
        Cell: props => {
          return (
            props.cell.value ?
              <div className='double'>
                <p>{dayjs(props.cell.value.processDate).format("DD/MM/YYYY")}</p>
                <p style={{ color: "#13aa52" }}>{new Intl.NumberFormat('tr-TR', {
                  style: 'currency',
                  currency: 'TRY',
                }).format(props.cell.value.receive)}</p>
              </div>
              :
              <div className='double'>
              </div>
          )
        },
        sortType: (a, b) => {
          let c = "";
          let d = "";
          a.values.sonOdeme ?
            c = a.values.sonOdeme.processDate
            : c = ""

          b.values.sonOdeme ?
            d = b.values.sonOdeme.processDate
            : d = ""


          if (c > d)
            return 1

          if (d > c)
            return -1

          return 0
        }
      },
      {
        id: "sonFatura",
        Header: "Son Fatura",
        accessor: "sonFatura",
        Cell: props => {
          return (
            props.cell.value ?
              <div className='double'>
                <p>{dayjs(props.cell.value.processDate).format("DD/MM/YYYY")}</p>
                <p style={{ color: "red" }}>{new Intl.NumberFormat('tr-TR', {
                  style: 'currency',
                  currency: 'TRY',
                }).format(props.cell.value.debt)}</p>
              </div>
              :
              <div className='double'>
              </div>
          )
        },
        sortType: (a, b) => {
          let c = "";
          let d = "";
          a.values.sonFatura ?
            c = a.values.sonFatura.processDate
            : c = ""

          b.values.sonFatura ?
            d = b.values.sonFatura.processDate
            : d = ""


          if (c > d)
            return 1

          if (d > c)
            return -1

          return 0
        }
      },
      {
        id: "toplam",
        Header: "Toplam Borç",
        accessor: "toplam",
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
      {
        id: "workingStatus",
        Header: "Çalışma Durumu",
        accessor: "workingStatus",
        Cell: props => {
          return (props.cell.value)
        },
        filter: (rows, id, filterValue) => {
          return rows.filter(row => {
            const rowValue = row.values[id];
            return filterValue === undefined || filterValue === 'All'
              ? true
              : rowValue === filterValue;
          });
        },
        Filter: ({ column }) => {
          const { filterValue, setFilter, Header, id } = column;

          return (
            <fieldset>
              <div className='label'>
                <label  >{Header} </label>
              </div>
              <div className='input' style={{ position: 'relative' }}>
                <SelectInput defValue={''} className='form-control' alignment='left'
                  onChange={(e) => { setFilter(e) }}
                  value={filterValue ? filterValue : 'All'}
                  items={[
                    { value: "Hepsi", id: "All" },
                    { value: "Aktif", id: "Aktif" },
                    { value: "Fesih", id: "Fesih" }
                  ]} />
              </div>
            </fieldset>

          )
        }
      },
      {
        Header: "İşlemler",
        Cell: props => {
          return (
            <div>
              <Link to='/mali-isler/cari-dokum/detay' state={{prop:props.row.original._id}}>
                <div>
                  <TbListDetails />
                </div>
              </Link>
{//<button onClick={(e) => navigate("/mali-isler/cari-dokum/detay", { state: props.row.original })}>Tıkla</button>
        }
            </div>
          )
        },
        disableFilters: true
      },
    ], []
  )


  return (
    <Fragment>
      <Table columns={columns} select={select} checkBox={checkBox} getCompanyConcubineLoading={getCompanyConcubineLoading}  />
    </Fragment>
  );

}

export default ConcubineList;

