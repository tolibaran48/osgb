import React, { Fragment } from 'react';
import Table from './insuranceTable'
import turkishToEnglish from '../../../../functions/turkishToEnglish';
import SelectInput from '../../../../functions/selectInput';
import { BsKeyFill } from "react-icons/bs";
import { MdCheckCircle, MdError, MdCircle } from "react-icons/md";
import { RiIndeterminateCircleFill } from "react-icons/ri";

const InsuranceList = ({ select, checkBox, datas, getInsurancesLoading }) => {

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
              <p>{props.cell.row.original.companyName}</p>
              <p>{props.cell.row.original.isgKatipName}</p>
            </div>)
        },
        sortType: (a, b) => {
          const c = turkishToEnglish((a.values.companyName).toString()).toLowerCase()
          const d = turkishToEnglish((b.values.companyName).toString()).toLowerCase()

          if (c > d)
            return 1

          if (d > c)
            return -1

          return 0
        },
        filter: (rows, id, filterValue) => {
          return rows.filter(row => {
            const rowValue = {
              'companyName': row.original.companyName,
              'isgKatipName': row.original.isgKatipName ?? ""
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
        id: "adress",
        Header: "Lokasyon",
        accessor: "adress",
        Cell: props => {
          return (
            props.cell.value.ilce.name
          )
        },
        Filter: SelectColumnFilter,
        filter: (rows, id, filterValue) => {
          return rows.filter(row => {
            const rowValue = row.values.adress.ilce.name;
            return rowValue !== undefined
              ? rowValue.includes(filterValue)
              : true;
          });
        },
        // disableFilters:true  
      },
      {
        id: "insuranceControlNumber",
        Header: "Sicil Numarası",
        accessor: "insuranceControlNumber",
        Cell: props => {
          return (
            <div className='double'>
              <p>{props.cell.row.original.descriptiveName}</p>
              <p>{props.cell.row.original.insuranceControlNumber}</p>
            </div>)
        },
        sortType: (a, b) => {
          const c = a.values.insuranceControlNumber
          const d = b.values.insuranceControlNumber

          if (c > d)
            return 1

          if (d > c)
            return -1

          return 0
        },
        filter: (rows, id, filterValue) => {
          return rows.filter(row => {
            const rowValue = {
              'descriptiveName': row.original.descriptiveName,
              'insuranceControlNumber': row.original.insuranceControlNumber
            };
            let value = turkishToEnglish(filterValue).toLowerCase();
            return rowValue !== undefined
              ? turkishToEnglish(rowValue.descriptiveName).toLowerCase().includes(value) || rowValue.insuranceControlNumber.includes(filterValue)
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
                  placeholder='Sicil Numarası...'
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
        id: "dangerClass",
        Header: "Sınıfı",
        accessor: "tehlikeSinifi",
        Cell: props => {
          return (
            props.cell.value === 'Az Tehlikeli' ?
              <MdCircle style={{ height: '1.28em', width: '1.28em', color: '#007bff' }} />
              : props.cell.value === 'Tehlikeli' ?
                <MdCircle style={{ height: '1.28em', width: '1.28em', color: '#ff8100' }} />
                : props.cell.value === 'Çok Tehlikeli' ?
                  <MdCircle style={{ height: '1.28em', width: '1.28em', color: 'red' }} />
                  : null
          )
        },
        filter: (rows, id, filterValue) => {
          if (filterValue === 'Az Tehlikeli' || filterValue === 'Tehlikeli' || filterValue === 'Çok Tehlikeli') {
            return rows.filter(row => {
              return row.values.dangerClass === filterValue
                ? true
                : false;
            });
          }
          else {
            return rows.filter(row => {
              return true
            });
          }
        },
        Filter: ({ column }) => {
          const { filterValue, setFilter, Header } = column;
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
                    { value: <div style={{ height: '15px', width: '15px', borderRadius: '50px', backgroundImage: 'linear-gradient(to right,#007bff,#ff8100, red)' }} />, id: "All" },
                    { value: <div style={{ height: '15px', width: '15px', borderRadius: '50px', backgroundColor: '#007bff' }} />, id: "Az Tehlikeli" },
                    { value: <div style={{ height: '15px', width: '15px', borderRadius: '50px', backgroundColor: '#ff8100' }} />, id: "Tehlikeli" },
                    { value: <div style={{ height: '15px', width: '15px', borderRadius: '50px', backgroundColor: 'red' }} />, id: "Çok Tehlikeli" },
                  ]} />
              </div>
            </fieldset>
          )
        }
      },
      {
        id: 'prs',
        Header: "Prs.",
        accessor: "employeeCount",
        Cell: props => {
          return (props.cell.value)
        },
        filter: (rows, id, filterValue, preFilteredRows) => {
          if (filterValue === '0') {
            return rows.filter(row => {
              return row.values.prs === 0
                ? true
                : false;
            });
          }
          else if (filterValue === '0+') {
            return rows.filter(row => {
              return row.values.prs > 0
                ? true
                : false;
            });
          }
          else {
            return rows.filter(row => {
              return true
            });
          }
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
                    { value: `Hepsi`, id: "All" },
                    { value: `0`, id: "0" },
                    { value: `0+`, id: "0+" },
                  ]} />
              </div>
            </fieldset>
          )
        },
      },
      {
        Header: "Atamalar",
        accessor: "assignmentStatus",
        Cell: props => {
          return (<Component insurance={props.cell.value} />)
        },
        filter: (rows, id, filterValue) => {
          if (filterValue === 'Fazla') {
            return rows.filter(row => {
              let assignment = row.values.assignmentStatus;
              let uzmanApproval = assignment.uzmanStatus.approvalAssignments;
              let hekimApproval = assignment.hekimStatus.approvalAssignments;
              let dspApproval = assignment.dspStatus.approvalAssignments;

              let uLength = uzmanApproval.length;
              let hLength = hekimApproval.length;
              let dLength = dspApproval.length;
              let _uLength = uzmanApproval.filter(x => x.approvalStatus === 'Sözleşme İptal').length;
              let _hLength = hekimApproval.filter(x => x.approvalStatus === 'Sözleşme İptal').length;
              let _dLength = dspApproval.filter(x => x.approvalStatus === 'Sözleşme İptal').length;

              if (row.values.workingStatus !== 'Aktif') {
                if (uLength - _uLength > 0 || hLength - _hLength > 0 || dLength - _dLength > 0) { return true }
              }
              else if (row.values.prs === 0 && row.values.workingStatus === 'Aktif') {
                if (uLength - _uLength > 0 || hLength - _hLength > 0 || dLength - _dLength > 0) { return true }
              }
              else if (
                uLength - _uLength > 1 ||
                hLength - _hLength > 1 ||
                (row.values.dangerClass === "Çok Tehlikeli" && row.values.prs < 10 && dLength - _dLength > 0) ||
                (row.values.dangerClass !== "Çok Tehlikeli" && dLength - _dLength > 0)
              ) {
                return true
              }
            });
          }
          else if (filterValue === 'Atamasiz') {
            return rows.filter(row => {
              let assignment = row.values.assignmentStatus;
              let uzmanApproval = assignment.uzmanStatus.approvalAssignments;
              let hekimApproval = assignment.hekimStatus.approvalAssignments;
              let dspApproval = assignment.dspStatus.approvalAssignments;

              let uLength = uzmanApproval.length;
              let hLength = hekimApproval.length;
              let dLength = dspApproval.length;
              let _uLength = uzmanApproval.filter(x => x.approvalStatus === 'Sözleşme İptal').length;
              let _hLength = hekimApproval.filter(x => x.approvalStatus === 'Sözleşme İptal').length;
              let _dLength = dspApproval.filter(x => x.approvalStatus === 'Sözleşme İptal').length;
              if (row.values.prs > 0 && row.values.workingStatus === 'Aktif') {
                if (uLength - _uLength === 0 || hLength - _hLength === 0 || (row.values.dangerClass === 'Çok Tehlikeli' && row.values.prs >= 10 && dLength - _dLength === 0)) {
                  return true
                }
              }
            });
          }
          else if (filterValue === 'AtananOnaysiz') {
            return rows.filter(row => {
              let assignment = row.values.assignmentStatus;
              let uzmanApproval = assignment.uzmanStatus.approvalAssignments;
              let hekimApproval = assignment.hekimStatus.approvalAssignments;
              let dspApproval = assignment.dspStatus.approvalAssignments;
              if (row.values.prs > 0 && row.values.workingStatus === 'Aktif') {
                if (uzmanApproval.filter(x => x.approvalStatus === 'Profosyonel Onay Bekliyor').length > 0
                  || hekimApproval.filter(x => x.approvalStatus === 'Profosyonel Onay Bekliyor').length > 0
                  || dspApproval.filter(x => x.approvalStatus === 'Profosyonel Onay Bekliyor').length > 0
                ) {
                  return true
                }
              }
            });
          }
          else if (filterValue === 'FirmaOnaysiz') {
            return rows.filter(row => {
              let assignment = row.values.assignmentStatus;
              let uzmanApproval = assignment.uzmanStatus.approvalAssignments;
              let hekimApproval = assignment.hekimStatus.approvalAssignments;
              let dspApproval = assignment.dspStatus.approvalAssignments;
              if (row.values.prs > 0 && row.values.workingStatus === 'Aktif') {
                if (uzmanApproval.filter(x => x.approvalStatus === 'Firma Onay Bekliyor').length > 0
                  || hekimApproval.filter(x => x.approvalStatus === 'Firma Onay Bekliyor').length > 0
                  || dspApproval.filter(x => x.approvalStatus === 'Firma Onay Bekliyor').length > 0
                ) {
                  return true
                }
              }
            });
          }
          else {
            return rows
          }
        }
        ,
        Filter: ({ column, rows }) => {
          const { filterValue, setFilter, Header } = column;
          return (
            <fieldset>
              <div className='label'>
                <label  >{Header} </label>
              </div>
              <div className='input' style={{ position: 'relative' }}>
                <SelectInput defValue={''} className='form-control' alignment='left'
                  onChange={(e) => setFilter(e)}
                  value={filterValue ? filterValue : 'All'}
                  items={[
                    { value: `Hepsi`, id: 'All' },
                    { value: `Atamasız`, count: null, id: "Atamasiz" },
                    { value: `Fazla Atamalı`, count: null, id: "Fazla" },
                    { value: `Atanan Onaysız`, count: null, id: "AtananOnaysiz" },
                    { value: `Firma Onaysız`, count: null, id: "FirmaOnaysiz" }
                  ]} />
              </div>
            </fieldset>
          )
        },
        disableSortBy: true,
        disableFilters: false
      },
      {
        id: "workingStatus",
        Header: "Çalışma Durumu",
        accessor: "workingStatus",
        Cell: props => {
          return (props.cell.value)
        }
        ,
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
                    { value: "Askıya Alındı", id: "Askıya Alındı" },
                    { value: "Kapandı", id: "Kapandı" }
                  ]} />
              </div>
            </fieldset>

          )
        }
      },
    ], []
  )


  return (
    <Fragment>
      <Table columns={columns} Data={datas.tableData} select={select} checkBox={checkBox} getInsurancesLoading={getInsurancesLoading} />
    </Fragment>
  );

}

function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id, Header },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set()
    preFilteredRows.forEach(row => {
      options.add(row.values.adress.ilce.name)
    })
    return [...options.values()]
  }, [id, preFilteredRows])

  // Render a multi-select box

  return (
    <fieldset>
      <div className='label'>
        <label  >{Header} </label>
      </div>
      <div className='input' style={{ position: 'relative' }}>
        <SelectInput defValue={''} className='form-control' alignment='left'
          onChange={(e) => { e === 'All' ? setFilter('') : setFilter(e) }
          }
          value={filterValue ? filterValue : 'All'}
          items={
            [{ value: 'Hepsi', id: 'All' }].concat(options.map((e) => { return { 'value': e, 'id': e } }))
          } />
      </div>
    </fieldset>

  )
}
const Component = ({ insurance }) => {

  return (
    <Fragment>
      <div>
        <fieldset >
          <div className='label' >
            <div>Uzman</div>
          </div>
          <div className='input' style={{ position: 'relative' }}>
            <ul className='ust' >
              <li className='alt'>
                {insurance.uzmanStatus.approvalAssignments.filter(x => x.approvalStatus !== 'Sözleşme İptal').length > 0 ?
                  insurance.uzmanStatus.approvalAssignments.map((status) => (status.approvalStatus === 'Onaylandı' ?
                    <MdCheckCircle key={status.assignmentId} style={{ height: '1.15em', width: '1.15em', color: '#13aa52' }} />
                    : status.approvalStatus === 'Profosyonel Onay Bekliyor' || status.approvalStatus === 'Firma Onay Bekliyor' ?
                      <MdError key={status.assignmentId} style={{ height: '1.15em', width: '1.15em', color: '#2e9fff' }} />
                      : null))
                  :
                  <RiIndeterminateCircleFill key={0} style={{ height: '1.15em', width: '1.15em', color: 'red' }} />
                }
              </li>
              <li className='alt'>
                {insurance.uzmanStatus.assignmentTotal}
              </li>
            </ul>
          </div>
        </fieldset>
      </div>
      <div>
        <fieldset >
          <div className='label' >
            <div>Hekim</div>
          </div>
          <div className='input' style={{ position: 'relative' }}>
            <ul className='ust' >
              <li className='alt'>
                {insurance.hekimStatus.approvalAssignments.filter(x => x.approvalStatus !== 'Sözleşme İptal').length > 0 ?
                  insurance.hekimStatus.approvalAssignments.map((status) => (status.approvalStatus === 'Onaylandı' ?
                    <MdCheckCircle key={status.assignmentId} style={{ height: '1.15em', width: '1.15em', color: '#13aa52' }} />
                    : status.approvalStatus === 'Profosyonel Onay Bekliyor' || status.approvalStatus === 'Firma Onay Bekliyor' ?
                      <MdError key={status.assignmentId} style={{ height: '1.15em', width: '1.15em', color: '#2e9fff' }} />
                      : null))
                  :
                  <RiIndeterminateCircleFill key={0} style={{ height: '1.15em', width: '1.15em', color: 'red' }} />
                }
              </li>
              <li className='alt'>
                {insurance.hekimStatus.assignmentTotal}
              </li>
            </ul>
          </div>
        </fieldset>
      </div>
      <div>
        <fieldset >
          <div className='label' >
            <div >DSP</div>
          </div>
          <div className='input' style={{ position: 'relative' }}>
            <ul className='ust' >
              <li className='alt'>
                {insurance.dspStatus.approvalAssignments.filter(x => x.approvalStatus !== 'Sözleşme İptal').length > 0 ?
                  insurance.dspStatus.approvalAssignments.map((status) => (status.approvalStatus === 'Onaylandı' ?
                    <MdCheckCircle key={status.assignmentId} style={{ height: '1.15em', width: '1.15em', color: '#13aa52' }} />
                    : status.approvalStatus === 'Profosyonel Onay Bekliyor' || status.approvalStatus === 'Firma Onay Bekliyor' ?
                      <MdError key={status.assignmentId} style={{ height: '1.15em', width: '1.15em', color: '#2e9fff' }} />
                      : null))
                  :
                  <RiIndeterminateCircleFill key={0} style={{ height: '1.15em', width: '1.15em', color: 'red' }} />
                }
              </li>
              <li className='alt'>
                {insurance.dspStatus.assignmentTotal}
              </li>
            </ul>
          </div>
        </fieldset>
      </div>
    </Fragment>
  )
}


export default InsuranceList;